
const API_URL = "https://6b049df0db01cf463607720c.mockapi.io/productos";

const contenedorProductos = document.querySelector(".contenedor-productos");
const botonesFiltros = document.querySelectorAll(".filtro");
const tituloProductos = document.querySelector(".productos h2");

let productos = [];

// 1. Obtener los productos desde MockAPI

async function cargarProductos() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("Error al obtener los productos");
    }

    productos = await respuesta.json();

    // Obtener la categoría seleccionada desde Home
    const parametros = new URLSearchParams(window.location.search);
    const categoria = parametros.get("categoria") || "Todos";

    filtrarProductos(categoria);

  } catch (error) {
    console.error(error);
    contenedorProductos.textContent =
      "No se pudieron cargar los productos.";
  }
}

// 2. Generar las tarjetas dinámicamente

function mostrarProductos(listaProductos) {
  contenedorProductos.innerHTML = "";

  listaProductos.forEach((producto) => {
    const tarjeta = document.createElement("article");

    tarjeta.classList.add("producto");

    tarjeta.innerHTML = `
      <img
        src="${producto.imagen}"
        alt="${producto.nombre}"
        class="producto-imagen"
      />

      <h3>${producto.nombre}</h3>
      <p>Categoría: ${producto.categoria}</p>
      <p>Precio: $${producto.precio.toLocaleString("es-AR")}</p>

      <button class="btn-agregar" data-id="${producto.id}">
        Agregar al carrito
      </button>
    `;

    contenedorProductos.appendChild(tarjeta);
  });

  activarBotonesCarrito();
}

// 3. Filtrar productos por categoría

function filtrarProductos(categoria) {
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

      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      carrito.push(productoSeleccionado);

      localStorage.setItem("carrito", JSON.stringify(carrito));

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
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const contador = document.getElementById("contador-carrito");

  contador.textContent = carrito.length;
}

actualizarContadorCarrito();