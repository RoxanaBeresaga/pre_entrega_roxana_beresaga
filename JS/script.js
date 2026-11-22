const productos = [
  {
    id: 1,
    nombre: "Smartphone",
    precio: 350
  },
  {
    id: 2,
    nombre: "Auriculares",
    precio: 80
  },
  {
    id: 3,
    nombre: "Smart TV",
    precio: 799.99
  }
];

productos.forEach(function(producto) {
  console.log(producto.nombre + " - $" + producto.precio);
});