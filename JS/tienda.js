
const API_URL = "https://6b049df0db01cf463607720c.mockapi.io/productos";

const contenedorProductos = document.querySelector(".contenedor-productos");
const botonesFiltros = document.querySelectorAll(".filtro");
const tituloProductos = document.querySelector(".productos h2");

let productos = [];
let estadoCatalogo = "cargando";

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

// 1. Obtener los productos desde MockAPI

async function cargarProductos() {
  estadoCatalogo = "cargando";
  contenedorProductos.textContent = "Cargando productos...";
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("Error al obtener los productos");
    }

    const datos = await respuesta.json();
    if (!Array.isArray(datos)) {
      throw new Error("La API no devolvió una lista de productos.");
    }
    productos = datos.filter(esProductoValido).map(normalizarProducto);
    // Conservar el primer producto válido de cada identificador.
    productos = productos.filter((producto, indice, lista) =>
      lista.findIndex((item) => item.id === producto.id) === indice
    );
    estadoCatalogo = "listo";

    // Obtener la categoría seleccionada desde Home
    const parametros = new URLSearchParams(window.location.search);
    const categoria = parametros.get("categoria") || "Todos";

    filtrarProductos(categoria);

  } catch (error) {
    estadoCatalogo = "error";
    productos = [];
    console.error(error);
    contenedorProductos.textContent =
      "No pudimos cargar los productos. Intentá nuevamente más tarde.";
  }
}

// 2. Generar las tarjetas dinámicamente

function mostrarProductos(listaProductos) {
  contenedorProductos.innerHTML = "";

  if (listaProductos.length === 0) {
    contenedorProductos.textContent = productos.length === 0
      ? "No hay productos disponibles."
      : "No hay productos disponibles en esta categoría.";
    return;
  }

  listaProductos.forEach((producto) => {
    const tarjeta = document.createElement("article");

    tarjeta.classList.add("producto");

    tarjeta.innerHTML = `
      <img
        alt=""
        class="producto-imagen"
      />

      <h3></h3>
      <p></p>
      <p></p>

      <button class="btn-agregar">
        Agregar al carrito
      </button>
    `;

    const imagen = tarjeta.querySelector("img");
    imagen.setAttribute("src", producto.imagen);
    imagen.setAttribute("alt", producto.nombre);
    tarjeta.querySelector("h3").textContent = producto.nombre;
    const textos = tarjeta.querySelectorAll("p");
    textos[0].textContent = `Categoría: ${producto.categoria}`;
    textos[1].textContent = `Precio: $${producto.precio.toLocaleString("es-AR")}`;
    tarjeta.querySelector("button").dataset.id = producto.id;

    contenedorProductos.appendChild(tarjeta);
  });

  activarBotonesCarrito();
}

// 3. Filtrar productos por categoría

function filtrarProductos(categoria) {
  if (estadoCatalogo !== "listo") return;

  if (categoria === "Todos") {
    mostrarProductos(productos);
    tituloProductos.textContent = "Todos los productos";
  } else {
    const productosFiltrados = productos.filter(
      (producto) => producto.categoria === categoria
    );

    mostrarProductos(productosFiltrados);
    tituloProductos.textContent = categoria;
  }

  // Actualizar el botón seleccionado

  botonesFiltros.forEach((boton) => {
    const seleccionado = boton.dataset.categoria === categoria;

    boton.classList.toggle("activo", seleccionado);
    boton.setAttribute("aria-pressed", seleccionado);
  });
}

// 4. Detectar clics en los filtros

botonesFiltros.forEach((boton) => {
  boton.addEventListener("click", () => {
    filtrarProductos(boton.dataset.categoria);
  });
});

// 5. Agregar productos al carrito

function activarBotonesCarrito() {
  const botonesAgregar = document.querySelectorAll(".btn-agregar");

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const idProducto = boton.dataset.id;

      const productoSeleccionado = productos.find(
        (producto) => producto.id === idProducto
      );

      if (!productoSeleccionado) return;

      const carrito = obtenerCarrito();
      if (carrito === null) {
        alert("No se pudo leer el carrito. Se conservaron los datos almacenados.");
        return;
      }

      const productoExistente = carrito.find(
        (producto) => producto.id === idProducto
      );

      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carrito.push({
          ...productoSeleccionado,
          cantidad: 1
        });
      }

      if (!tieneTotalesValidos(carrito)) {
        alert("La cantidad o el importe supera el límite permitido.");
        return;
      }
      if (!guardarCarrito(carrito)) return;

      actualizarContadorCarrito();

      mostrarNotificacion(productoSeleccionado.nombre);
    });
  });
}

// 6. Iniciar la carga de productos

cargarProductos();

let temporizadorNotificacion;

function mostrarNotificacion(nombreProducto) {
  const notificacion = document.getElementById("notificacion");

  notificacion.textContent = `✓ ${nombreProducto} agregado al carrito`;

  notificacion.classList.add("visible");

  clearTimeout(temporizadorNotificacion);

  temporizadorNotificacion = setTimeout(() => {
    notificacion.classList.remove("visible");
  }, 3000);
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito() || [];

  const contador = document.getElementById("contador-carrito");

  const cantidadTotal = carrito.reduce(
  (total, producto) => total + producto.cantidad,
  0
  );

  contador.textContent = Number.isSafeInteger(cantidadTotal)
    ? cantidadTotal : "Cantidad inválida";
}

actualizarContadorCarrito();

// Actualizar solo el contador al volver o recibir cambios de otra pestaña.
window.addEventListener("pageshow", actualizarContadorCarrito);

window.addEventListener("storage", (evento) => {
  if (evento.storageArea === localStorage &&
      (evento.key === "carrito" || evento.key === null)) {
    actualizarContadorCarrito();
  }
});
