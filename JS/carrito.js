const listaCarrito = document.getElementById("lista-carrito");

const cantidadCarrito = document.getElementById("cantidad-carrito");

const totalCarrito = document.getElementById("total-carrito");

const finalizarCompra = document.getElementById("finalizar-compra");

const confirmacionCompra = document.getElementById("confirmacion-compra");
const cerrarConfirmacion = confirmacionCompra.querySelector(".modal-compra-cerrar");
const seguirComprando = document.querySelector(".carrito-productos .seguir-comprando");

cerrarConfirmacion.addEventListener("click", () => {
  confirmacionCompra.close();
});

// Escape también dispara close mediante el comportamiento nativo del dialog.
confirmacionCompra.addEventListener("close", () => {
  seguirComprando.focus();
});

// Comprobar los datos necesarios para mostrar y calcular un producto.
function esProductoValido(producto) {
  return producto !== null &&
    typeof producto === "object" &&
    ((typeof producto.id === "string" && producto.id.trim() !== "") ||
      (typeof producto.id === "number" && Number.isSafeInteger(producto.id))) &&
    ["nombre", "categoria", "imagen"].every(
      (campo) => typeof producto[campo] === "string" && producto[campo].trim() !== ""
    ) &&
    typeof producto.precio === "number" &&
    Number.isFinite(producto.precio) &&
    producto.precio >= 0 &&
    ["Celulares", "Audio", "Electrónica", "Tecnología", "Moda"].includes(producto.categoria) &&
    /^\.\.\/img\/productos\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(producto.imagen);
}

// Mantener el mismo formato de identificador y cantidad en ambas páginas.
function normalizarProducto(producto) {
  return {
    ...producto,
    id: String(producto.id).trim(),
    cantidad: Number.isSafeInteger(producto.cantidad) && producto.cantidad > 0
      ? producto.cantidad
      : 1
  };
}

// Recuperar y validar los productos almacenados.
function obtenerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem("carrito"));

    if (datos === null) return [];
    if (!Array.isArray(datos)) {
      throw new Error("El carrito almacenado no es un array.");
    }

    const productosValidos = datos
      .filter(esProductoValido)
      .map(normalizarProducto)
      .filter((producto) => Number.isFinite(producto.precio * producto.cantidad));

    // Agrupar registros antiguos con el mismo identificador.
    const agrupados = [];
    productosValidos.forEach((producto) => {
      const existente = agrupados.find((item) => item.id === producto.id);
      if (existente) {
        const cantidad = existente.cantidad + producto.cantidad;
        if (!Number.isSafeInteger(cantidad) ||
            !Number.isFinite(existente.precio * cantidad)) {
          throw new Error("La cantidad agrupada supera el límite permitido.");
        }
        existente.cantidad = cantidad;
      } else {
        agrupados.push(producto);
      }
    });
    return agrupados;
  } catch (error) {
    console.error("Error al recuperar el carrito:", error);
    return null;
  }
}

// Comprobar también que la suma de varios productos sea válida.
function tieneTotalesValidos(lista) {
  const cantidadTotal = lista.reduce((total, producto) => total + producto.cantidad, 0);
  const importeTotal = lista.reduce(
    (total, producto) => total + producto.precio * producto.cantidad, 0
  );
  return Number.isSafeInteger(cantidadTotal) && Number.isFinite(importeTotal);
}

// Actualizar la interfaz solo cuando el guardado se haya completado.
function guardarCarrito(lista) {
  try {
    localStorage.setItem("carrito", JSON.stringify(lista));
    return true;
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
    alert("No se pudo guardar el carrito. El cambio no se realizó.");
    return false;
  }
}

let carrito = obtenerCarrito();
let errorRecuperacion = carrito === null;
carrito = carrito || [];
const errorCarrito = document.getElementById("error-carrito");

// Los datos normalizados se guardan al realizar un cambio.

// 1. Mostrar los productos del carrito

function mostrarCarrito() {
  const activo = document.activeElement;
  const controles = [...listaCarrito.querySelectorAll("button[data-id]")];
  const restaurar = controles.includes(activo);
  const clase = restaurar ? activo.className : "";
  const id = restaurar ? activo.dataset.id : null;
  const ids = [...new Set(controles.map((boton) => boton.dataset.id))];

  renderizarCarrito();

  if (restaurar) {
    const nuevos = [...listaCarrito.querySelectorAll("button[data-id]")];
    // Si desapareció el producto, priorizar el siguiente y luego el anterior.
    const indice = ids.indexOf(id);
    const candidatos = [id, ...ids.slice(indice + 1), ...ids.slice(0, indice).reverse()];
    let destino;
    for (const candidato of candidatos) {
      destino = nuevos.find((boton) => boton.dataset.id === candidato &&
        boton.className === clase);
      if (destino) break;
    }
    (destino || seguirComprando).focus({ preventScroll: true });
  }
}

function renderizarCarrito() {
  listaCarrito.innerHTML = "";
  const mensaje = errorRecuperacion
    ? "No se pudo recuperar el carrito. Los datos guardados se conservaron. Volvé a intentarlo cuando el almacenamiento esté disponible o los datos sean válidos."
    : "";
  if (errorCarrito.textContent !== mensaje) errorCarrito.textContent = mensaje;
  if (errorRecuperacion) return;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
        <div class="carrito-vacio">
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        <h3>Tu carrito está vacío</h3>
        <p>Todavía no agregaste productos a tu carrito.</p>
        <p>¡Descubrí nuestros productos!</p>
        </div>
    `;

    return;
  }

  carrito.forEach((producto) => {
    const tarjeta = document.createElement("article");
    const subtotal = producto.precio * producto.cantidad;
    tarjeta.classList.add("producto-carrito");

    tarjeta.innerHTML = `
      <img alt="" />

      <div class="producto-carrito-info">
        <h3></h3>
        <p></p>
        <p></p>
        <div class="selector-cantidad">
        <button class="btn-restar">
            −
        </button>

        <span></span>

        <button class="btn-sumar">
            +
        </button>
        </div>
      </div>
      <div class="producto-carrito-subtotal">
        <p>Subtotal</p>
        <strong></strong>

        <button class="btn-eliminar">
            <i class="fa fa-trash-o" aria-hidden="true"></i>
            Eliminar
        </button>
     </div>
    `;

    const imagen = tarjeta.querySelector("img");
    imagen.setAttribute("src", producto.imagen);
    imagen.setAttribute("alt", producto.nombre);
    tarjeta.querySelector("h3").textContent = producto.nombre;
    const textos = tarjeta.querySelectorAll(".producto-carrito-info p");
    textos[0].textContent = producto.categoria;
    textos[1].textContent = `$${producto.precio.toLocaleString("es-AR")}`;
    tarjeta.querySelector(".selector-cantidad span").textContent = producto.cantidad;
    tarjeta.querySelector("strong").textContent = `$${subtotal.toLocaleString("es-AR")}`;

    const restar = tarjeta.querySelector(".btn-restar");
    restar.dataset.id = producto.id;
    restar.setAttribute("aria-label", `Disminuir cantidad de ${producto.nombre}`);
    const sumar = tarjeta.querySelector(".btn-sumar");
    sumar.dataset.id = producto.id;
    sumar.setAttribute("aria-label", `Aumentar cantidad de ${producto.nombre}`);
    const eliminar = tarjeta.querySelector(".btn-eliminar");
    eliminar.dataset.id = producto.id;
    eliminar.setAttribute("aria-label", `Eliminar ${producto.nombre} del carrito`);

    listaCarrito.appendChild(tarjeta);
  });
}

// 2. Actualizar el resumen de compra

function actualizarResumen() {
  const cantidadTotal = carrito.reduce(
    (acumulador, producto) => acumulador + producto.cantidad,
    0
  );

  const importeTotal = carrito.reduce(
    (acumulador, producto) =>
      acumulador + producto.precio * producto.cantidad,
    0
  );

  cantidadCarrito.textContent = Number.isSafeInteger(cantidadTotal)
    ? cantidadTotal : "Cantidad inválida";

  totalCarrito.textContent = Number.isFinite(importeTotal)
    ? importeTotal.toLocaleString("es-AR") : "Importe inválido";

  if (errorRecuperacion) {
    cantidadCarrito.textContent = "No disponible";
    totalCarrito.textContent = "No disponible";
  }

  // No permitir compras vacías ni cálculos fuera del rango numérico.
  finalizarCompra.disabled = errorRecuperacion || carrito.length === 0 || !tieneTotalesValidos(carrito);
}

// 3. Modificar la cantidad de los productos

function cambiarCantidad(id, cambio) {
  if (!sincronizarCarrito()) return;

  const producto = carrito.find(
    (producto) => producto.id === id
  );

  if (!producto) return;

  const nuevaCantidad = producto.cantidad + cambio;
  if (!Number.isSafeInteger(nuevaCantidad) || nuevaCantidad < 1) return;

  const nuevoCarrito = carrito.map((item) =>
    item === producto ? { ...item, cantidad: nuevaCantidad } : item
  );
  if (!tieneTotalesValidos(nuevoCarrito)) {
    alert("La cantidad o el importe supera el límite permitido.");
    return;
  }
  if (!guardarCarrito(nuevoCarrito)) return;
  carrito = nuevoCarrito;

  mostrarCarrito();
  actualizarResumen();
}

// Eliminar un producto del carrito

function eliminarProducto(id) {
  if (!sincronizarCarrito()) return;
  if (!carrito.some((producto) => producto.id === id)) return;

  const nuevoCarrito = carrito.filter(
    (producto) => producto.id !== id
  );

  if (!guardarCarrito(nuevoCarrito)) return;
  carrito = nuevoCarrito;

  mostrarCarrito();
  actualizarResumen();
}

// 4. Detectar clics en los botones del carrito

listaCarrito.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");

  if (!boton) return;

  if (boton.classList.contains("btn-sumar")) {
    cambiarCantidad(boton.dataset.id, 1);
  }

  if (boton.classList.contains("btn-restar")) {
    cambiarCantidad(boton.dataset.id, -1);
  }

  if (boton.classList.contains("btn-eliminar")) {
    eliminarProducto(boton.dataset.id);
  }
});

// 5. Finalizar la compra

finalizarCompra.addEventListener("click", () => {
  if (!sincronizarCarrito()) return;

  if (carrito.length === 0 || !tieneTotalesValidos(carrito)) return;

  try {
    localStorage.removeItem("carrito");
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    alert("No se pudo vaciar el carrito. La compra no se finalizó.");
    return;
  }

  carrito = [];

  mostrarCarrito();
  actualizarResumen();
  confirmacionCompra.showModal();
});

mostrarCarrito();
actualizarResumen();

// Leer los datos actuales sin escribir en localStorage.
function sincronizarCarrito() {
  const datos = obtenerCarrito();
  errorRecuperacion = datos === null;
  carrito = datos || [];
  mostrarCarrito();
  actualizarResumen();
  return datos !== null;
}

window.addEventListener("pageshow", sincronizarCarrito);

window.addEventListener("storage", (evento) => {
  if (evento.storageArea === localStorage &&
      (evento.key === "carrito" || evento.key === null)) {
    sincronizarCarrito();
  }
});
