
const productos = [
  {
    id: 1,
    nombre: "Smartphone",
    precio: 350000,
    categoria: "Celulares"
  },
  {
    id: 2,
    nombre: "Auriculares",
    precio: 45000,
    categoria: "Audio"
  },
  {
    id: 3,
    nombre: "Pantalón estampado",
    precio: 38000,
    categoria: "Moda"
  }
];


const contenedorProductos = document.querySelector(".contenedor-productos");

productos.forEach((producto) => {
  const tarjeta = document.createElement("article");

  tarjeta.classList.add("producto");

  tarjeta.innerHTML = `
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
    const idProducto = Number(boton.dataset.id);

    const productoSeleccionado = productos.find(
      (producto) => producto.id === idProducto
    );

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito.push(productoSeleccionado);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert(`${productoSeleccionado.nombre} agregado al carrito`);
  });
});

