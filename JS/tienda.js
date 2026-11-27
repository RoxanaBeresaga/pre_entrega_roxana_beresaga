// URL de la API de productos.
const API_URL = "https://6b049df0db01cf463607720c.mockapi.io/productos";

const contenedorProductos = document.querySelector(".contenedor-productos");
const botonesFiltros = document.querySelectorAll(".filtro");
const tituloProductos = document.querySelector(".productos h2");
const mensajeCatalogo = document.getElementById("estado-catalogo");
const errorCarrito = document.getElementById("error-carrito");

// Mostrar los mensajes de estado del catálogo.
function anunciarCatalogo(mensaje) {
  if (mensajeCatalogo.textContent !== mensaje) mensajeCatalogo.textContent = mensaje;
}

let productos = [];
let estadoCatalogo = "cargando";

// Validar los datos del producto.
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

// Normalizar el identificador y la cantidad.
function normalizarProducto(producto) {
  return {
    ...producto,
    id: String(producto.id).trim(),
    cantidad: Number.isSafeInteger(producto.cantidad) && producto.cantidad > 0
      ? producto.cantidad
      : 1
  };
}

// Recuperar y validar el carrito.
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

    // Agrupar productos con el mismo identificador.
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

// Validar los totales del carrito.
function tieneTotalesValidos(lista) {
  const cantidadTotal = lista.reduce((total, producto) => total + producto.cantidad, 0);
  const importeTotal = lista.reduce(
    (total, producto) => total + producto.precio * producto.cantidad, 0
  );
  return Number.isSafeInteger(cantidadTotal) && Number.isFinite(importeTotal);
}

// Guardar el carrito en localStorage.
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

// Obtener los productos desde MockAPI.

async function cargarProductos() {
  estadoCatalogo = "cargando";
  contenedorProductos.textContent = "";
  anunciarCatalogo("Cargando productos...");
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

    // Evitar productos duplicados en el catálogo.
    productos = productos.filter((producto, indice, lista) =>
      lista.findIndex((item) => item.id === producto.id) === indice
    );
    estadoCatalogo = "listo";

    // Obtener la categoría seleccionada desde Home.
    const parametros = new URLSearchParams(window.location.search);
    const categoria = parametros.get("categoria") || "Todos";

    filtrarProductos(categoria);

  } catch (error) {
    estadoCatalogo = "error";
    productos = [];
    console.error(error);
    contenedorProductos.textContent = "";
    anunciarCatalogo("No pudimos cargar los productos. Intentá nuevamente más tarde.");
  }
}

// Generar las tarjetas de los productos.

function mostrarProductos(listaProductos) {
  contenedorProductos.innerHTML = "";

  if (listaProductos.length === 0) {
    anunciarCatalogo(productos.length === 0
      ? "No hay productos disponibles."
      : "No hay productos disponibles en esta categoría.");
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

// Filtrar productos por categoría.

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

  const cantidad = contenedorProductos.querySelectorAll(".producto").length;
  if (cantidad > 0) {
    anunciarCatalogo(`${categoria}: ${cantidad} ${cantidad === 1 ? "producto disponible" : "productos disponibles"}.`);
  }

  // Actualizar el estado del filtro seleccionado.

  botonesFiltros.forEach((boton) => {
    const seleccionado = boton.dataset.categoria === categoria;

    boton.classList.toggle("activo", seleccionado);
    boton.setAttribute("aria-pressed", seleccionado);
  });
}

// Gestionar los eventos de los filtros.

botonesFiltros.forEach((boton) => {
  boton.addEventListener("click", () => {
    filtrarProductos(boton.dataset.categoria);
  });
});

// Agregar productos al carrito.

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
        actualizarContadorCarrito();
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

// Iniciar la carga de productos.

cargarProductos();

let temporizadorNotificacion;
let temporizadorAnuncio;

// Mostrar la notificación al agregar un producto.
function mostrarNotificacion(nombreProducto) {
  const notificacion = document.getElementById("notificacion");

  notificacion.textContent = `✓ ${nombreProducto} agregado al carrito`;

  notificacion.classList.add("visible");

  const anuncio = document.getElementById("anuncio-carrito");
  clearTimeout(temporizadorAnuncio);
  anuncio.textContent = "";
  temporizadorAnuncio = setTimeout(() => {
    anuncio.textContent = `${nombreProducto} agregado al carrito. ${document.querySelector(".carrito-enlace").getAttribute("aria-label")}.`;
  }, 100);

  clearTimeout(temporizadorNotificacion);

  temporizadorNotificacion = setTimeout(() => {
    notificacion.classList.remove("visible");
  }, 3000);
}

// Actualizar el contador de productos del carrito.
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();

  const contador = document.getElementById("contador-carrito");
  const enlace = document.querySelector(".carrito-enlace");
  const mensaje = carrito === null
    ? "No se pudo recuperar el carrito. Se conservaron los datos guardados; no se agregarán productos hasta poder leerlos correctamente."
    : "";
  if (errorCarrito.textContent !== mensaje) errorCarrito.textContent = mensaje;
  if (carrito === null) {
    contador.textContent = "—";
    enlace.setAttribute("aria-label", "Bolsa de compras: cantidad no disponible");
    return;
  }

  const cantidadTotal = carrito.reduce(
  (total, producto) => total + producto.cantidad,
  0
  );

  contador.textContent = Number.isSafeInteger(cantidadTotal)
    ? cantidadTotal : "Cantidad inválida";
  enlace.setAttribute("aria-label", Number.isSafeInteger(cantidadTotal)
    ? `Bolsa de compras: ${cantidadTotal} ${cantidadTotal === 1 ? "producto" : "productos"}`
    : "Bolsa de compras: cantidad inválida");
}

actualizarContadorCarrito();

// Actualizar el contador al navegar o modificar el almacenamiento.
window.addEventListener("pageshow", actualizarContadorCarrito);

window.addEventListener("storage", (evento) => {
  if (evento.storageArea === localStorage &&
      (evento.key === "carrito" || evento.key === null)) {
    actualizarContadorCarrito();
  }
});
