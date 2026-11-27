# Talento Lab Ecommerce — Proyecto Final Front-End

Proyecto desarrollado para el curso de Front-End de **Talento Tech 2026**.

## Índice

- [Descripción](#descripción)
- [Demo online](#demo-online)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Páginas del sitio](#páginas-del-sitio)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Consumo de API REST](#consumo-de-api-rest)
- [Almacenamiento local](#almacenamiento-local)
- [Diseño responsive](#diseño-responsive)
- [Accesibilidad y SEO](#accesibilidad-y-seo)
- [Ejecución local](#ejecución-local)
- [Alcance del proyecto](#alcance-del-proyecto)
- [Próximas mejoras](#próximas-mejoras)
- [Autora](#autora)

## Descripción

Talento Lab Ecommerce es una tienda online de productos de tecnología, electrónica, audio, celulares y moda.

El objetivo de este proyecto fue aplicar los conocimientos adquiridos durante el curso de Front-End, desde la estructura semántica con HTML y el diseño con CSS hasta la incorporación de funcionalidades dinámicas con JavaScript.

En la pre-entrega trabajé principalmente en la estructura y el diseño responsive del sitio. Para la entrega final incorporé el consumo de una API REST, filtros por categoría, un carrito de compras, almacenamiento local y nuevas páginas para completar la navegación.

También trabajé en aspectos de accesibilidad y SEO, dos temas relacionados con mi experiencia profesional en gestión de contenidos digitales.

El proyecto tiene fines educativos y permite simular una compra sin realizar pagos ni pedidos reales.

## Demo online

- [Visitar Talento Lab Ecommerce](https://roxanaberesaga.github.io/pre_entrega_roxana_beresaga/)
- [Repositorio en GitHub](https://github.com/RoxanaBeresaga/pre_entrega_roxana_beresaga)

## Tecnologías utilizadas

| Tecnología | Aplicación en el proyecto |
|---|---|
| HTML5 | Estructura semántica y formularios. |
| CSS3 | Diseño, estilos, transiciones y adaptación a diferentes dispositivos. |
| JavaScript vanilla | Eventos, manipulación del DOM, validaciones y lógica del carrito. |
| Flexbox | Distribución y alineación de elementos. |
| CSS Grid | Organización de secciones y componentes. |
| Media Queries | Diseño responsive. |
| MockAPI | Consumo de una API REST para obtener los productos. |
| localStorage | Persistencia del carrito y suscripciones al newsletter. |
| Formspree | Envío del formulario de contacto. |
| Google Fonts | Tipografía Roboto. |
| Font Awesome | Iconos del sitio. |
| Git y GitHub | Control de versiones. |
| GitHub Pages | Publicación del proyecto. |

El desarrollo se realizó con HTML, CSS y JavaScript, sin utilizar frameworks ni procesos de compilación.

## Funcionalidades

### Catálogo de productos

- Carga dinámica de 24 productos desde MockAPI mediante `fetch`.
- Filtros por categoría: Celulares, Audio, Electrónica, Tecnología y Moda.
- Acceso directo a las categorías desde Home.
- Generación de tarjetas de productos mediante la manipulación del DOM.
- Validación de los datos recibidos desde la API.
- Mensajes de carga, error y resultados del catálogo.
- Notificación al agregar un producto al carrito.

### Carrito de compras

- Incorporación y eliminación de productos.
- Agrupación de productos repetidos.
- Modificación de cantidades.
- Cálculo automático de subtotales y total de compra.
- Contador de productos en Tienda.
- Persistencia de los datos mediante `localStorage`.
- Sincronización del carrito entre pestañas del mismo sitio.
- Validación de los datos almacenados y gestión de errores.
- Modal de confirmación al finalizar una compra simulada.

### Formulario de contacto

- Campos de nombre, correo electrónico y mensaje.
- Validación mediante HTML5.
- Envío de consultas a través de Formspree.

### Newsletter

- Validación del correo electrónico.
- Normalización de los datos ingresados.
- Control de suscripciones duplicadas.
- Almacenamiento local de las suscripciones.
- Mensajes de confirmación y error.

La suscripción es simulada y no realiza envíos de correos electrónicos.

## Páginas del sitio

| Página | Descripción |
|---|---|
| [Home](index.html) | Presentación de la tienda, promociones, categorías, testimonios y newsletter. |
| [Tienda](pages/tienda.html) | Catálogo dinámico, filtros y selección de productos. |
| [Carrito](pages/carrito.html) | Productos seleccionados, cantidades, subtotales y finalización de compra. |
| [Blog](pages/blog.html) | Artículos relacionados con tecnología, audio y moda. |
| [Acerca de](pages/acerca-de.html) | Presentación, misión, visión y valores de la tienda. |
| [Contacto](pages/contacto.html) | Formulario para el envío de consultas. |

## Estructura del proyecto

```text
pre_entrega_roxana_beresaga/
│
├── CSS/
│   └── styles.css
│
├── JS/
│   ├── script.js
│   ├── tienda.js
│   └── carrito.js
│
├── img/
│   ├── banner/
│   ├── pay/
│   ├── productos/
│   ├── testimonios/
│   └── banner_promocional.png
│
├── pages/
│   ├── acerca-de.html
│   ├── blog.html
│   ├── carrito.html
│   ├── contacto.html
│   └── tienda.html
│
├── index.html
└── README.md
```

### Organización de JavaScript

Separé las funcionalidades en tres archivos para facilitar la lectura y el mantenimiento del código.

| Archivo | Funcionalidad |
|---|---|
| `script.js` | Validación y registro de suscripciones al newsletter. |
| `tienda.js` | Consumo de la API, generación de tarjetas, filtros, incorporación de productos al carrito y contador. |
| `carrito.js` | Gestión de productos seleccionados, cantidades, eliminación, cálculos y confirmación de compra. |

## Consumo de API REST

Para el catálogo utilicé MockAPI, lo que permite incorporar o actualizar productos sin modificar el código HTML de la tienda.

**Endpoint:**

```text
https://6b049df0db01cf463607720c.mockapi.io/productos
```

Los productos se obtienen mediante una solicitud GET utilizando `fetch`, `async` y `await`.

Ejemplo de la estructura de un producto:

```json
{
  "id": "1",
  "nombre": "Smartphone",
  "precio": 350000,
  "categoria": "Celulares",
  "imagen": "../img/productos/smartphone.jpg"
}
```

Antes de mostrar los productos, se valida la respuesta de la API, los datos de cada registro y las rutas de las imágenes. También se controla que no existan identificadores duplicados.

Las tarjetas se generan dinámicamente mediante JavaScript, utilizando métodos del DOM como `createElement()` y `textContent`.

Durante el desarrollo amplié el catálogo de 8 a 24 productos sin necesidad de modificar la lógica de JavaScript ni la estructura de las tarjetas.

## Almacenamiento local

Utilicé `localStorage` para conservar los datos del carrito y las suscripciones al newsletter, incluso después de actualizar la página.

| Clave | Datos almacenados |
|---|---|
| `carrito` | Productos seleccionados y sus respectivas cantidades. |
| `talentoLabNewsletter` | Correos electrónicos registrados. |

Los datos se almacenan en formato JSON mediante `JSON.stringify()` y se recuperan con `JSON.parse()`.

También incorporé validaciones para evitar cantidades incorrectas, errores de cálculo, registros duplicados y problemas al recuperar los datos almacenados.

Al finalizar una compra simulada, se elimina el contenido del carrito.

Los datos se conservan en el navegador utilizado y no se sincronizan entre diferentes dispositivos.

## Diseño responsive

El sitio está diseñado para adaptarse a computadoras, tablets y celulares.

Para la distribución de los elementos utilicé Flexbox, CSS Grid y Media Queries.

Algunos ejemplos de adaptación:

- El catálogo pasa de cuatro columnas en escritorio a dos o una en pantallas más pequeñas.
- Los testimonios, categorías y artículos del blog reorganizan su distribución según el dispositivo.
- El carrito muestra los productos y el resumen de compra en columnas en escritorio y de forma vertical en dispositivos móviles.
- Los formularios, la navegación y el footer se adaptan a diferentes tamaños de pantalla.
- El banner principal cuenta con una presentación específica para celulares.

Los puntos de adaptación utilizados en el CSS son 1024, 768, 600 y 480 píxeles, según las necesidades de cada sección.

## Accesibilidad y SEO

Durante el desarrollo tuve en cuenta buenas prácticas de accesibilidad web y SEO, aplicando también conocimientos relacionados con mi experiencia profesional en contenidos digitales.

### Accesibilidad

- Uso de etiquetas semánticas de HTML5.
- Jerarquía de encabezados y un H1 por página.
- Textos alternativos en imágenes informativas.
- Etiquetas asociadas a los campos de los formularios.
- Uso de atributos ARIA cuando corresponde.
- Navegación mediante teclado e indicadores de foco.
- Revisión del contraste de colores en distintos componentes.
- Mensajes de estado para el catálogo, carrito y newsletter.
- Gestión del foco al modificar o eliminar productos del carrito.
- Modal de confirmación mediante el elemento nativo `dialog`, con posibilidad de cierre mediante teclado.

### SEO

- Títulos específicos para cada página.
- Meta descriptions relacionadas con el contenido.
- Estructura semántica y jerarquía de encabezados.
- Enlaces internos entre las páginas del sitio.
- Definición del idioma y configuración del viewport.

Estas implementaciones buscan mejorar la accesibilidad y la estructura del sitio. No representan una certificación de cumplimiento de WCAG.

## Ejecución local

Para ejecutar el proyecto:

**1. Clonar el repositorio.**

```bash
git clone https://github.com/RoxanaBeresaga/pre_entrega_roxana_beresaga.git
```

**2. Ingresar a la carpeta del proyecto.**

```bash
cd pre_entrega_roxana_beresaga
```

**3. Abrir el proyecto en Visual Studio Code.**

```bash
code .
```

**4. Ejecutar con Live Server.**

Abrir el archivo `index.html` y seleccionar **Open with Live Server**.

No es necesario instalar dependencias, utilizar npm ni realizar una compilación.

Se requiere conexión a Internet para acceder a MockAPI, Formspree, Google Fonts y Font Awesome.

## Alcance del proyecto

El sitio fue desarrollado con fines educativos.

- Las compras son simuladas y no se procesan pagos ni pedidos reales.
- El newsletter almacena los correos localmente y no realiza envíos.
- Los testimonios son ilustrativos.
- No cuenta con autenticación ni gestión de usuarios.
- Los medios de pago y las tiendas de aplicaciones se muestran como referencias visuales.
- El formulario de contacto utiliza Formspree para el envío de consultas.
- El proyecto no cuenta con un backend propio.

## Próximas mejoras

Como parte de una futura evolución del proyecto, me gustaría incorporar:

- Optimización de imágenes y banners.
- Buscador de productos.
- Ordenamiento por precio.
- Paginación del catálogo.
- Carrusel de promociones.
- Lista de favoritos.
- Registro e inicio de sesión de usuarios.
- Desarrollo de un backend propio.

## Autora

**Roxana Andrea Beresaga**

Proyecto Final Front-End — Talento Tech 2026.

Cuento con formación en programación Java y experiencia profesional en gestión de contenidos digitales, CMS, SEO y accesibilidad web.

Este proyecto forma parte de mi formación en desarrollo de software y me permitió integrar conocimientos de programación con el diseño y la implementación de interfaces web.

[Mi perfil de GitHub](https://github.com/RoxanaBeresaga)