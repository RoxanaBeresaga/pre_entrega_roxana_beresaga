# Talento Lab Ecommerce — Proyecto Final Front-End

Ecommerce educativo desarrollado por **Roxana Andrea Beresaga** para **Talento Tech 2026**. Permite explorar un catálogo, filtrar productos y simular una compra desde el navegador.

## Índice

- [Descripción](#descripción)
- [Demo online](#demo-online)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Páginas del sitio](#páginas-del-sitio)
- [Estructura del proyecto](#estructura-del-proyecto)
- [API REST](#api-rest)
- [Almacenamiento local](#almacenamiento-local)
- [Diseño responsive](#diseño-responsive)
- [Accesibilidad y SEO](#accesibilidad-y-seo)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Alcance y limitaciones](#alcance-y-limitaciones)
- [Posibles mejoras futuras](#posibles-mejoras-futuras)
- [Autora](#autora)

## Descripción

Talento Lab Ecommerce reúne productos de tecnología, electrónica, audio y moda. Su propósito es aplicar estructura semántica, diseño responsive, interacción mediante JavaScript, consumo de una API REST y persistencia local.

La pre-entrega se centró en HTML y CSS. La versión final incorpora catálogo dinámico, carrito editable, confirmación de compra simulada, Newsletter local y mejoras de accesibilidad y SEO. El proyecto no procesa pedidos ni pagos reales.

## Demo online

- [Visitar Talento Lab Ecommerce en GitHub Pages](https://roxanaberesaga.github.io/pre_entrega_roxana_beresaga/).
- [Consultar el repositorio en GitHub](https://github.com/RoxanaBeresaga/pre_entrega_roxana_beresaga).

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|---|---|
| HTML5 | Estructura semántica, formularios y diálogo nativo de confirmación. |
| CSS3 | Colores, tipografía, componentes, estados visuales y transiciones. |
| JavaScript vanilla | Eventos, validaciones, manipulación del DOM y lógica del carrito. |
| Flexbox | Distribución de tarjetas de productos, navegación y formularios. |
| CSS Grid | Testimonios, categorías, footer y distribución del carrito. |
| Media Queries | Adaptación de la interfaz a distintos anchos de pantalla. |
| MockAPI | API REST pública que proporciona los productos del catálogo. |
| Formspree | Recepción de consultas enviadas desde el formulario de contacto. |
| localStorage | Persistencia del carrito y de las suscripciones simuladas. |
| Google Fonts | Carga de Roboto, con alternativas tipográficas locales. |
| Font Awesome | Iconos de navegación, redes, carrito y confirmación. |
| Git y GitHub | Control de versiones y alojamiento del repositorio. |
| GitHub Pages | Publicación del sitio estático. |

No se utilizan frameworks ni procesos de compilación.

## Funcionalidades implementadas

### Catálogo y navegación

- Navegación entre Home, Tienda, Carrito, Blog, Acerca de y Contacto.
- Carga de productos desde MockAPI mediante `fetch`.
- Filtros por categoría y enlaces desde Home con selección mediante parámetros de URL.
- Tarjetas dinámicas con imagen, nombre, categoría, precio y botón para agregar al carrito.
- Renderizado seguro: los textos externos se asignan con `textContent`; las imágenes utilizan rutas locales validadas. Las plantillas HTML son estáticas.
- Estados visibles y accesibles de carga, error, catálogo vacío y resultados de filtros.

### Carrito y compra simulada

- Incorporación de productos y contador dinámico de unidades, visible únicamente en Tienda.
- Edición de cantidades, con mínimo de una unidad, y eliminación de productos.
- Actualización de subtotales, cantidad de unidades y total.
- Persistencia local, validación de registros, normalización de identificadores y cantidades, y agrupación de productos repetidos.
- Sincronización mediante `storage` entre pestañas del mismo origen y actualización al volver a la página mediante `pageshow`.
- Gestión de errores de lectura y escritura, sin completar operaciones cuando el almacenamiento falla.
- Finalización simulada: vacía el carrito y muestra un modal personalizado basado en `<dialog>` y `showModal()`.
- Cierre mediante X o Escape, retorno del foco a «Seguir comprando» y enlace a Tienda desde el modal.

### Formularios y presentación

- Contacto con nombre, correo y mensaje, validación HTML5 y envío mediante Formspree.
- Newsletter simulado con normalización del correo, validación, detección de duplicados y mensajes de resultado. Limpia el campo únicamente después de guardar correctamente.
- Footer unificado con enlaces a Carrito y Contacto, redes generales y aclaración educativa.
- Diseño responsive y mejoras de accesibilidad y SEO.

## Páginas del sitio

| Página | Contenido |
|---|---|
| [Home](index.html) | Presentación, promociones, categorías, testimonios ilustrativos y Newsletter. |
| [Tienda](pages/tienda.html) | Catálogo de la API, filtros, incorporación al carrito y contador. |
| [Carrito](pages/carrito.html) | Productos seleccionados, cantidades, subtotales, total y compra simulada. |
| [Blog](pages/blog.html) | Artículos sobre tecnología, moda y audio. |
| [Acerca de](pages/acerca-de.html) | Contexto educativo, propósito, misión, visión y valores. |
| [Contacto](pages/contacto.html) | Formulario de consultas integrado con Formspree. |

## Estructura del proyecto

```text
pre_entrega_roxana_beresaga/
├── CSS/
│   └── styles.css
├── JS/
│   ├── script.js
│   ├── tienda.js
│   └── carrito.js
├── img/
│   ├── banner/
│   │   └── banner.jpg
│   ├── pay/
│   │   ├── app_store.jpg
│   │   ├── google_play.jpg
│   │   └── payment.png
│   ├── productos/
│   │   ├── auriculares.jpg
│   │   ├── bermuda-gris.jpg
│   │   ├── camisa-bicolor.jpg
│   │   ├── pantalon-estampado.jpg
│   │   ├── proyector.jpg
│   │   ├── smart-tv.jpg
│   │   ├── smartphone.jpg
│   │   └── tablet.jpg
│   ├── testimonios/
│   │   ├── carlos.png
│   │   ├── laura.png
│   │   └── valentino.png
│   └── banner_promocional.png
├── pages/
│   ├── acerca-de.html
│   ├── blog.html
│   ├── carrito.html
│   ├── contacto.html
│   └── tienda.html
├── index.html
└── README.md
```

| Archivo | Responsabilidad |
|---|---|
| `CSS/styles.css` | Estilos compartidos, componentes, foco visible y adaptaciones responsive. |
| `JS/script.js` | Newsletter de Home. Conserva un pequeño arreglo de productos de ejemplo que se imprime en consola; no alimenta el catálogo. |
| `JS/tienda.js` | Consulta a MockAPI, validación y renderizado de productos, filtros, incorporación al carrito, contador y notificaciones. |
| `JS/carrito.js` | Lectura y validación del carrito, cantidades, eliminación, cálculos, sincronización, gestión del foco y modal. |

## API REST

El catálogo utiliza una solicitud **GET** al endpoint público:

```text
https://6b049df0db01cf463607720c.mockapi.io/productos
```

La respuesta esperada es un arreglo JSON. Ejemplo ilustrativo de la estructura aceptada, no una copia garantizada de los datos actuales del servicio:

```json
[
  {
    "id": "1",
    "nombre": "Smartphone",
    "categoria": "Celulares",
    "precio": 350,
    "imagen": "../img/productos/smartphone.jpg"
  }
]
```

| Campo | Validación principal |
|---|---|
| `id` | Texto no vacío o número entero seguro; se normaliza a texto. |
| `nombre` | Texto no vacío. |
| `categoria` | Celulares, Audio, Electrónica, Tecnología o Moda. |
| `precio` | Número finito mayor o igual a cero. |
| `imagen` | Ruta restringida a `../img/productos/`, con nombre y extensión permitidos: jpg, jpeg, png o webp. |

`cargarProductos()` verifica el estado HTTP y que el JSON sea un arreglo. Filtra registros inválidos, normaliza los válidos y conserva el primero de cada identificador. Luego aplica la categoría solicitada y construye las tarjetas mediante el DOM. Las categorías sin resultados y los errores tienen mensajes específicos.

La cantidad de compra se administra localmente mediante el campo `cantidad`. El sitio no crea pedidos ni modifica los productos de MockAPI.

## Almacenamiento local

| Clave | Contenido y comportamiento |
|---|---|
| `carrito` | Arreglo JSON de productos con `cantidad`. Se actualiza al agregar, editar o eliminar; la clave se elimina al finalizar una compra simulada. |
| `talentoLabNewsletter` | Arreglo JSON de correos normalizados mediante `trim()` y conversión a minúsculas. Se rechazan correos inválidos y duplicados. |

El carrito valida registros y límites numéricos, descarta entradas de producto inválidas y agrupa identificadores repetidos. Si el JSON no puede leerse, su estructura no es válida o falla el acceso al almacenamiento, muestra un error y bloquea las operaciones afectadas. Los datos dañados no se sobrescriben como consecuencia de ese fallo. La lectura puede recuperarse cuando el almacenamiento vuelve a ser válido; no existe reparación automática del JSON corrupto.

El Newsletter valida el arreglo y cada correo recuperado. Ante datos dañados o un error de escritura, conserva la información almacenada y muestra un mensaje; no anuncia éxito ni limpia el campo.

Los datos pertenecen al navegador y origen usados. No se sincronizan entre dispositivos y pueden perderse al borrar los datos del sitio. Las operaciones simultáneas entre pestañas no constituyen transacciones atómicas.

## Diseño responsive

- **Productos:** Flexbox con tarjetas distribuidas en cuatro, dos o una columna según el ancho.
- **Testimonios:** CSS Grid con tres columnas que pasa a una en pantallas pequeñas.
- **Categorías, Blog y Acerca de:** grillas adaptables a distintos dispositivos.
- **Carrito:** resumen y productos en columnas en escritorio; disposición vertical y reorganización de tarjetas en móvil.
- **Contacto:** campos de ancho completo y media queries que ajustan espacios y tipografía.
- **Navegación y Newsletter:** Flexbox con redistribución y controles de ancho completo cuando corresponde.
- **Footer:** tres columnas que pasan a una en pantallas pequeñas.
- **Hero:** composición de escritorio con imagen de fondo y presentación móvil con imagen separada del texto.

El CSS incluye puntos de adaptación de 1024, 768, 600 y 480 píxeles según la sección.

## Accesibilidad y SEO

- HTML semántico, idioma español, viewport y un encabezado principal por página.
- Títulos y meta descriptions específicas para las seis páginas.
- Textos alternativos en imágenes informativas; imágenes decorativas con alternativa vacía e iconos decorativos con `aria-hidden`.
- Etiquetas asociadas a los campos y validación nativa de formularios.
- Enlaces y botones nativos operables mediante teclado, con indicadores de foco en los componentes principales.
- Restauración del foco en el carrito al cambiar cantidades. Al eliminar, se prioriza el producto siguiente, el anterior o «Seguir comprando», evitando desplazamientos al restaurarlo.
- Nombre accesible del enlace al carrito con la cantidad de unidades en Tienda.
- Regiones de estado para catálogo, errores de recuperación, notificaciones y Newsletter.
- Modal nativo con `aria-labelledby`, `aria-describedby`, foco inicial, cierre por teclado y retorno del foco. `showModal()` impide interactuar con el contenido de fondo.
- Color de textos secundarios de testimonios ajustado a `#596680`: contraste calculado de **5,77:1 sobre blanco** y **5,48:1 sobre `#faf9f6`**.

Estas medidas no implican una certificación WCAG ni un resultado aprobado de WAVE, Axe o Lighthouse. Quedan por completar verificaciones integrales en navegador y con lectores de pantalla, además de mediciones del sitio publicado.

## Instalación y ejecución local

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/RoxanaBeresaga/pre_entrega_roxana_beresaga.git
   cd pre_entrega_roxana_beresaga
   ```

2. Abrir la carpeta en Visual Studio Code, desde **Archivo → Abrir carpeta** o con `code .` si el comando está disponible.
3. Usar la extensión **Live Server** de Visual Studio Code. Abrir `index.html` y seleccionar **Open with Live Server**, o pulsar **Go Live**.
4. Navegar desde el menú a Tienda, agregar productos y abrir Carrito para probar la compra simulada. El Newsletter se encuentra en Home.

El proyecto **no requiere npm, Node.js, frameworks ni compilación**. Live Server sirve los archivos estáticos mediante HTTP; conviene mantener el mismo origen y puerto para conservar los datos locales entre pruebas.

Se necesita conexión a Internet para MockAPI, Formspree, Google Fonts y Font Awesome. El formulario de contacto sí utiliza un servicio de envío: las pruebas de compra y Newsletter no envían correos ni pedidos.

## Alcance y limitaciones

- Es un proyecto educativo y de presentación de conocimientos de Front-End.
- Las compras son simuladas: no existen pagos reales, checkout de pago ni procesamiento de pedidos.
- El Newsletter no envía correos reales; guarda registros únicamente en el navegador.
- Los testimonios son ilustrativos.
- No hay autenticación real, cuentas de usuario, favoritos ni seguimiento de pedidos. Las opciones no implementadas del footer son texto informativo.
- Las imágenes de tiendas de aplicaciones y medios de pago son referencias visuales, no integraciones disponibles.
- Los datos locales dependen del navegador, su configuración y el origen del sitio.
- El catálogo depende de la disponibilidad y respuesta de MockAPI. El contacto depende de Formspree.
- Validar el formato de un correo no confirma que la dirección exista ni que pertenezca a quien la ingresa.
- La aplicación no ofrece un backend propio ni controles transaccionales para un comercio real.

## Posibles mejoras futuras

Las siguientes mejoras son opcionales y **todavía no están implementadas**:

- Optimización de imágenes y banners.
- Carrusel accesible de banners promocionales.
- Buscador de productos.
- Ordenamiento por precio.
- Paginación del catálogo.
- Inicio de sesión con una arquitectura de autenticación adecuada.
- Lista de favoritos.

## Autora

**Roxana Andrea Beresaga**

Proyecto Final Front-End — Talento Tech 2026.

[Perfil de GitHub de RoxanaBeresaga](https://github.com/RoxanaBeresaga)
