
const API_URL = "https://6b049df0db01cf463607720c.mockapi.io/productos";

const contenedorProductos = document.querySelector(".contenedor-productos");
const botonesFiltros = document.querySelectorAll(".filtro");
const tituloProductos = document.querySelector(".productos h2");

let productos = [];

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
    producto.precio >= 0;
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

    return datos
      .filter(esProductoValido)
      .map(normalizarProducto)
      .filter((producto) => Number.isFinite(producto.precio * producto.cantidad));
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
