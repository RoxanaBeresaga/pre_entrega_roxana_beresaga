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

// Suscripciones educativas locales, independientes del carrito.
const formularioNewsletter = document.getElementById("formulario-newsletter");

if (formularioNewsletter) {
  const campoCorreo = document.getElementById("email-newsletter");
  const mensajeNewsletter = document.getElementById("newsletter-mensaje");
  const claveNewsletter = "talentoLabNewsletter";
  const validadorCorreo = document.createElement("input");
  validadorCorreo.type = "email";
  validadorCorreo.required = true;

  function normalizarCorreo(correo) {
    return correo.trim().toLowerCase();
  }

  function esCorreoValido(correo) {
    if (typeof correo !== "string" || /\s/.test(correo)) return false;
    validadorCorreo.value = correo;
    return validadorCorreo.checkValidity();
  }

  function mostrarMensaje(texto) {
    mensajeNewsletter.textContent = texto;
  }

  function obtenerSuscripciones() {
    const guardado = localStorage.getItem(claveNewsletter);
    if (guardado === null) return [];

    const datos = JSON.parse(guardado);
    if (!Array.isArray(datos) || datos.some((correo) =>
      typeof correo !== "string" || !esCorreoValido(normalizarCorreo(correo)))) {
      throw new Error("Los datos del Newsletter no son válidos.");
    }
    return [...new Set(datos.map(normalizarCorreo))];
  }

  campoCorreo.addEventListener("input", () => {
    campoCorreo.setCustomValidity("");
    campoCorreo.removeAttribute("aria-invalid");
    mostrarMensaje("");
  });

  campoCorreo.addEventListener("invalid", () => {
    campoCorreo.setAttribute("aria-invalid", "true");
    mostrarMensaje(campoCorreo.validity.valueMissing
      ? "Ingresá tu correo electrónico."
      : "Ingresá un correo electrónico válido, sin espacios internos.");
  });

  formularioNewsletter.addEventListener("submit", (evento) => {
    evento.preventDefault();
    campoCorreo.setCustomValidity("");
    campoCorreo.value = normalizarCorreo(campoCorreo.value);

    if (!esCorreoValido(campoCorreo.value)) {
      campoCorreo.setCustomValidity("Ingresá un correo electrónico válido, sin espacios internos.");
    }
    if (!campoCorreo.reportValidity()) return;
    campoCorreo.removeAttribute("aria-invalid");

    let suscripciones;
    try {
      suscripciones = obtenerSuscripciones();
    } catch (error) {
      mostrarMensaje("No se pudieron leer los registros del Newsletter. No se modificaron los datos guardados.");
      return;
    }

    if (suscripciones.includes(campoCorreo.value)) {
      mostrarMensaje("Este correo ya está registrado en este navegador.");
      return;
    }

    try {
      localStorage.setItem(claveNewsletter, JSON.stringify([...suscripciones, campoCorreo.value]));
    } catch (error) {
      mostrarMensaje("No se pudo guardar la suscripción. Intentá nuevamente.");
      return;
    }

    campoCorreo.value = "";
    mostrarMensaje("¡Suscripción simulada registrada con éxito! No se enviarán correos reales.");
  });
}
