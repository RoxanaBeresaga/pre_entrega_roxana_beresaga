// Validación y registro de suscripciones al newsletter.
const formularioNewsletter = document.getElementById("formulario-newsletter");

if (formularioNewsletter) {
  const campoCorreo = document.getElementById("email-newsletter");
  const mensajeNewsletter = document.getElementById("newsletter-mensaje");
  const claveNewsletter = "talentoLabNewsletter";
  const validadorCorreo = document.createElement("input");
  validadorCorreo.type = "email";
  validadorCorreo.required = true;

  // Normalizar el correo electrónico.
  function normalizarCorreo(correo) {
    return correo.trim().toLowerCase();
  }

  // Validar el formato del correo electrónico.
  function esCorreoValido(correo) {
    if (typeof correo !== "string" || /\s/.test(correo)) return false;
    validadorCorreo.value = correo;
    return validadorCorreo.checkValidity();
  }

  // Mostrar los mensajes del formulario.
  function mostrarMensaje(texto) {
    mensajeNewsletter.textContent = texto;
  }

  // Recuperar y validar las suscripciones guardadas.
  function obtenerSuscripciones() {
    const guardado = localStorage.getItem(claveNewsletter);
    if (guardado === null) return [];

    const datos = JSON.parse(guardado);
    if (
      !Array.isArray(datos) ||
      datos.some(
        (correo) =>
          typeof correo !== "string" ||
          !esCorreoValido(normalizarCorreo(correo)),
      )
    ) {
      throw new Error("Los datos del Newsletter no son válidos.");
    }
    return [...new Set(datos.map(normalizarCorreo))];
  }

  // Restablecer la validación al modificar el correo.
  campoCorreo.addEventListener("input", () => {
    campoCorreo.setCustomValidity("");
    campoCorreo.removeAttribute("aria-invalid");
    mostrarMensaje("");
  });

  // Mostrar los mensajes de validación.
  campoCorreo.addEventListener("invalid", () => {
    campoCorreo.setAttribute("aria-invalid", "true");
    mostrarMensaje(
      campoCorreo.validity.valueMissing
        ? "Ingresá tu correo electrónico."
        : "Ingresá un correo electrónico válido, sin espacios internos.",
    );
  });

  // Gestionar el envío del formulario.
  formularioNewsletter.addEventListener("submit", (evento) => {
    evento.preventDefault();
    campoCorreo.setCustomValidity("");
    campoCorreo.value = normalizarCorreo(campoCorreo.value);

    if (!esCorreoValido(campoCorreo.value)) {
      campoCorreo.setCustomValidity(
        "Ingresá un correo electrónico válido, sin espacios internos.",
      );
    }
    if (!campoCorreo.reportValidity()) return;
    campoCorreo.removeAttribute("aria-invalid");

    let suscripciones;
    try {
      suscripciones = obtenerSuscripciones();
    } catch (error) {
      mostrarMensaje(
        "No se pudieron leer los registros del Newsletter. No se modificaron los datos guardados.",
      );
      return;
    }

    // Evitar suscripciones duplicadas.
    if (suscripciones.includes(campoCorreo.value)) {
      mostrarMensaje("Este correo ya está registrado en este navegador.");
      return;
    }

    // Guardar la suscripción en localStorage.
    try {
      localStorage.setItem(
        claveNewsletter,
        JSON.stringify([...suscripciones, campoCorreo.value]),
      );
    } catch (error) {
      mostrarMensaje("No se pudo guardar la suscripción. Intentá nuevamente.");
      return;
    }

    campoCorreo.value = "";
    mostrarMensaje(
      "¡Suscripción simulada registrada con éxito! No se enviarán correos reales.",
    );
  });
}
