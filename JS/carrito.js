const listaCarrito = document.getElementById("lista-carrito");

const cantidadCarrito = document.getElementById("cantidad-carrito");

const totalCarrito = document.getElementById("total-carrito");

const contadorCarrito = document.getElementById("contador-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// 1. Mostrar los productos del carrito

function mostrarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.textContent = "Tu carrito está vacío.";
    return;
  }

  carrito.forEach((producto) => {
    const tarjeta = document.createElement("article");
    const subtotal = producto.precio * producto.cantidad;
    tarjeta.classList.add("producto-carrito");

    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />

      <div class="producto-carrito-info">
        <h3>${producto.nombre}</h3>
        <p>${producto.categoria}</p>
        <p>$${producto.precio.toLocaleString("es-AR")}</p>
        <div class="selector-cantidad">
        <button class="btn-restar" data-id="${producto.id}"
            aria-label="Disminuir cantidad de ${producto.nombre}">
            −
        </button>

        <span>${producto.cantidad}</span>

        <button class="btn-sumar" data-id="${producto.id}"
            aria-label="Aumentar cantidad de ${producto.nombre}">
            +
        </button>
        </div>
      </div>
      <div class="producto-carrito-subtotal">
        <p>Subtotal</p>
        <strong>$${subtotal.toLocaleString("es-AR")}</strong>

        <button class="btn-eliminar" data-id="${producto.id}"
            aria-label="Eliminar ${producto.nombre} del carrito">
            <i class="fa fa-trash-o" aria-hidden="true"></i>
            Eliminar
        </button>
     </div>
    `;

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

  cantidadCarrito.textContent = cantidadTotal;

  totalCarrito.textContent = importeTotal.toLocaleString("es-AR");

  contadorCarrito.textContent = cantidadTotal;
}

// 3. Modificar la cantidad de los productos

function cambiarCantidad(id, cambio) {
  const producto = carrito.find(
    (producto) => producto.id === id
  );

  if (!producto) return;

  if (producto.cantidad + cambio < 1) return;

  producto.cantidad += cambio;

  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarCarrito();
  actualizarResumen();
}

// 4. Detectar clics en los botones de cantidad

listaCarrito.addEventListener("click", (evento) => {
  const boton = evento.target;

  if (boton.classList.contains("btn-sumar")) {
    cambiarCantidad(boton.dataset.id, 1);
  }

  if (boton.classList.contains("btn-restar")) {
    cambiarCantidad(boton.dataset.id, -1);
  }
});

mostrarCarrito();
actualizarResumen();