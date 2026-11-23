const API_URL = "https://6b049df0db01cf463607720c.mockapi.io/productos";

const contenedorProductos = document.querySelector(".contenedor-productos");

async function cargarProductos() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error("Error al obtener los productos");
    }

    const productos = await respuesta.json();

    productos.forEach((producto) => {
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

    const botonesAgregar = document.querySelectorAll(".btn-agregar");

    botonesAgregar.forEach((boton) => {
      boton.addEventListener("click", () => {
        const idProducto = boton.dataset.id;

        const productoSeleccionado = productos.find(
          (producto) => producto.id === idProducto,
        );

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        carrito.push(productoSeleccionado);

        localStorage.setItem("carrito", JSON.stringify(carrito));

        alert(`${productoSeleccionado.nombre} agregado al carrito`);
      });
    });
  } catch (error) {
    console.error(error);
    contenedorProductos.textContent = "No se pudieron cargar los productos.";
  }
}

cargarProductos();
