# SellPix — manual de marca

SellPix es el estudio de diseño web y branding de Alberto Domínguez Barreiro. Hace webs corporativas, landing pages, tiendas Shopify e identidad de marca para pequeños negocios, siempre con criterio comercial: que la web venda.

- **Nombre:** SellPix. Una sola palabra, con S y P mayúsculas. Nunca «Sell Pix», «SELLPIX» ni «Sellpix».
- **Eslogan:** Engineered to sell.
- **Línea en español:** Diseño web con criterio comercial.

## Concepto: el píxel encendido

Una web es una pantalla de píxeles. En SellPix, cada píxel trabaja para vender, y el píxel lima es el que vende. El nombre lo dice (*sell* + *pix*), el símbolo lo dibuja (una escalera de píxeles que sube, como un gráfico de ventas, con el píxel más alto encendido) y la palabra lo repite (el punto de la «i» es un píxel lima).

## Principios visuales

1. **Negro, blanco roto y un píxel lima.** El lima es la única nota de color y siempre es el píxel que destaca: el CTA, el píxel del logotipo, un dato clave.
2. **Rejilla de píxeles.** Todo se apoya en una rejilla de 4 px. Los recursos gráficos son cuadrados redondeados alineados: escaleras, campos de puntos y bloques.
3. **Bordes, no sombras.** Las superficies se separan con líneas finas o con un cambio de fondo. Las sombras solo aparecen en menús y modales.
4. **Aire y contundencia.** Titulares grandes y compactos, mucho espacio en blanco y pocos elementos por pantalla.
5. **Sin adornos.** Nada de degradados, emojis ni ilustraciones genéricas. Las fotos solo se usan según el apartado «Fotografía».

## Logotipo

| Versión | Archivo | Uso |
| --- | --- | --- |
| Horizontal | `sellpix-lockup.svg` / `-reversed` | Cabecera web, firmas, portadas apaisadas |
| Vertical | `sellpix-vertical.svg` / `-reversed` | Tarjetas, posts cuadrados, documentos |
| Símbolo | `sellpix-symbol.svg` / `-reversed` | Avatar, favicon, marca de agua, detalles |
| Palabra | `sellpix-wordmark.svg` / `-reversed` | Cuando el símbolo ya está cerca |

- **Colores:** en `ink` sobre fondos claros y en `paper` sobre fondos oscuros. Los dos píxeles (el del símbolo y el de la «i») son siempre `lime`.
- **Espacio de respeto:** a cada lado, como mínimo el ancho de dos píxeles del símbolo.
- **Tamaño mínimo:** 100 px de ancho la versión horizontal y 16 px el símbolo. Para tamaños menores, usa el favicon (el símbolo sobre un cuadrado negro).

**No hagas:**
- Cambiar el orden de la escalera ni mover el píxel lima.
- Recolorear los píxeles grises o negros.
- Estirar, girar o añadir sombras o contornos.
- Poner el logotipo sobre fotos sin una capa sólida detrás.
- Escribir el nombre separado o todo en mayúsculas.

## Color

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `ink` | #0A0A0A | #0A0A0A | Negro de marca. Solo relleno (logotipo, bloques), nunca texto |
| `paper` | #F2F2EF | #F2F2EF | Blanco roto de marca. Solo relleno, nunca texto |
| `lime` | #C6F432 | #C6F432 | El píxel encendido: CTA principal, píxeles de marca, etiquetas destacadas |
| `surface` | #FFFFFF | #0A0A0A | Fondo de página |
| `surface-alt` | #F2F2EF | #161616 | Secciones alternas y tarjetas |
| `text` | #0A0A0A | #F2F2EF | Texto principal |
| `text-muted` | #5A5A57 | #A3A3A0 | Texto secundario |
| `line` | #DCDCD8 | #2A2A2A | Separadores y campo de píxeles |
| `line-strong` | #8A8A86 | #77777A | Bordes de inputs y controles |

**Proporción orientativa por pantalla:** 60 % `surface` · 30 % `ink`/`text` · 10 % `surface-alt` · menos del 5 % `lime`.

**Reglas de contraste (WCAG AA, comprobadas):**
- **`ink` y `paper`:** son fijos en los dos temas, así que no sirven como texto ni como fondo de página. Para eso están `text`, `text-inverse`, `surface` y `surface-inverse`.
- **`lime`:** nunca como texto ni icono sobre blanco (1,28:1). Sobre `lime`, el texto siempre es `on-lime` (#0A0A0A, 15,45:1). Sobre un relleno `paper` fijo en los dos temas (la caja del formulario de contacto), el texto es `on-paper` (#0A0A0A, 17,65:1).
- **`text`:** supera 17:1 sobre `surface`. **`text-muted`** supera 6:1 en los dos temas.
- **`line-strong`:** llega a 3,47:1 en claro y 4,43:1 en oscuro, suficiente para controles.

## Tipografía

Las tres familias tienen licencia SIL Open Font License y se sirven desde la propia web, en `brand/fonts/`: un archivo woff2 variable por familia, con el subconjunto latino (incluye á, é, í, ó, ú, ñ, ü, ¿, ¡, € y ·), junto a su licencia OFL. **Nunca se cargan desde Google Fonts**, para que ningún visitante envíe datos a terceros solo por ver la web. `tokens.css` define además fuentes de reserva ajustadas (`… Fallback`) para que el texto no cambie de línea mientras carga la fuente de marca.

| Familia | Uso | Pesos |
| --- | --- | --- |
| **Bricolage Grotesque** | Titulares, cifras, logotipo | 600, 700, 800 |
| **Inter** | Texto, botones, formularios | 400, 500, 600 |
| **Pixelify Sans** | Antetítulos y etiquetas, siempre en MAYÚSCULAS | 500, 600 |

**Regla importante:** Pixelify Sans solo se usa con letras. **Nunca con cifras**, porque su «5» se confunde con una «S» y su «€» con una «B». Precios, plazos y datos van en Bricolage Grotesque 800.

| Estilo | Escritorio | Móvil | Familia y peso |
| --- | --- | --- | --- |
| display | 80/80 | 46/48 | Bricolage 800, −0,035em |
| h1 | 56/60 | 38/42 | Bricolage 700, −0,03em |
| h2 | 40/46 | 30/36 | Bricolage 700, −0,025em |
| h3 | 26/32 | 22/28 | Bricolage 600, −0,015em |
| h4 | 20/28 | 18/26 | Inter 600 |
| lead | 20/32 | 18/28 | Inter 400 |
| body | 17/28 | 16/26 | Inter 400 |
| small | 15/24 | 14/22 | Inter 400 |
| caption | 13/18 | 12/16 | Inter 500 |
| eyebrow | 15/18 | 13/16 | Pixelify 500, MAYÚSCULAS, +0,08em |
| stat | 56/56 | 40/40 | Bricolage 800, −0,03em |
| button | 16/20 | 15/20 | Inter 600 |

Los valores son tamaño/interlineado en px. El cambio de escala de móvil a escritorio ocurre a partir de 1024 px.

## Recursos gráficos de píxel

- **Escalera:** una rejilla N×N con columnas que crecen de izquierda a derecha, los píxeles apagados al 9 % de opacidad y el más alto encendido en `lime`. Es el recurso principal para héroes, portadas, tarjetas y posts. En la web, el píxel `lime` respira tras encenderse: opacidad 1 → 0,35 → 1 en bucle, sin brillo ni sombra.
- **Campo de píxeles:** cuadrados de 3 px cada 24 px en `line-strong` al 35 %, como fondo de sección (clase `.sp-pixel-field`). En la web, algunos puntos se iluminan y se apagan despacio, nunca en `lime`.
- **Píxel suelto:** un cuadrado `lime` tras la palabra clave de un titular (clase `.sp-pixel`). Como máximo uno por bloque.

## Espaciado, radios y movimiento

- **Escala de espaciado:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px.
- **Contenedor:** 1200 px de ancho máximo, con 16 px de margen lateral en móvil y 24 px en escritorio.
- **Radios:** 4 · 8 · 12 · 20 px. Los píxeles de marca llevan un radio del 16 % de su lado.
- **Movimiento, en tres niveles:**
  - **Interfaz** (botones, hover, foco): 150–250 ms.
  - **Entrada** (escalera, bloques al hacer scroll): 500–900 ms, una sola vez. Token `--duration-reveal`.
  - **Ambiente** (pulso del píxel lima, campo de píxeles, zoom de fotos): 3–20 s, en bucle. Token `--duration-ambient`.
  - Curva cubic-bezier(0.2, 0.8, 0.2, 1) para interfaz y entrada; ease-in-out para ambiente. Solo `opacity` y `transform`.
  - Respeta siempre `prefers-reduced-motion`. Las animaciones de ambiente se paran fuera de pantalla y con el botón «Pausar animaciones» del pie (WCAG 2.2.2). Nunca se animan textos legales, precios ni botones al cargar.

### Animaciones de la web

El movimiento acompaña al píxel encendido y a la entrada de los bloques. Solo CSS y un IntersectionObserver mínimo, sin librerías.

- **Escalera que se enciende (entrada):** toda escalera se enciende columna a columna, de izquierda a derecha, y termina en el píxel lima. Cada píxel tarda 250 ms, hay 110 ms entre columnas y el lima entra el último; en total, 900 ms como máximo. Una sola vez: al cargar si está en el primer pantallazo y, si no, al entrar en pantalla. Después, el píxel lima respira (ambiente).
- **Píxel que se enciende (entrada):** el píxel lima de los titulares de sección de la portada, el del precio de cada ficha de producto y el de cada etapa de «Cómo trabajamos» se encienden una vez, con opacidad y escala, cuando entran en pantalla.
- **Bloques (entrada):** los titulares de sección y las tarjetas que entran en pantalla al hacer scroll aparecen con opacidad y un desplazamiento de 12 px en `--duration-reveal`, escalonados 80 ms. Lo que se ve en el primer pantallazo se muestra quieto desde el principio.
- **Ambiente:** respiración del píxel lima, puntos del campo de píxeles y zoom de las fotos. Se paran fuera de pantalla y con el botón «Pausar animaciones» del pie.
- **Hover y foco (interfaz):** botones, tarjetas enlazadas y enlaces de tarjeta cambian de color, borde o fondo en 150 ms. Nunca con sombras.
- **Nunca se anima:** párrafos, precios ni botones al cargar (afectaría al LCP), ni nada que mueva el diseño (CLS 0). Sin JavaScript todo se ve ya encendido y con `prefers-reduced-motion: reduce` no se anima nada. Quedan fuera los textos legales, el cuerpo de las guías y las páginas `confirmar/`.

## Componentes base

- **Botón principal:** fondo `lime`, texto `on-lime`, 48 px de alto mínimo. Solo uno por pantalla.
- **Botón secundario:** fondo `surface-inverse`, texto `text-inverse`.
- **Botón fantasma:** transparente, con borde `line-strong`.
- **Tarjeta:** fondo `surface-alt` (o `surface` sobre el campo de píxeles), borde `line`, radio de 12 px.
- **Etiqueta:** Pixelify Sans en mayúsculas, con fondo `lime` si destaca («LA MÁS PEDIDA») o con borde si informa («CONCEPTO»).
- **Foco de teclado:** 2 px en `focus-ring` (negro en claro, lima en oscuro), separado 2 px del elemento.

## Voz y tono

- **Tratamiento y estilo:** de tú, frases cortas, sin superlativos ni tecnicismos.
- **Enfoque:** se habla del negocio del cliente y de sus ventas, no de la tecnología.
- **Promesas:** nada de cifras ni resultados sin medir. No se publican casos de clientes ni demostraciones; el método se explica en «Cómo creamos tu proyecto».
- **Idioma:** español por defecto; el eslogan se mantiene siempre en inglés.
- **Uso de IA:** se dice abiertamente.

## Aplicaciones incluidas

- **Tarjeta de visita:** 85 × 55 mm, anverso y reverso, en PNG a 300 ppp y en PDF.
- **Portada de perfil 3:1:** para Contra, Malt y Workana.
- **Banner 4:1:** fondo oscuro.
- **Post de presentación 4:5.**
- **Firma de email.**
- **Avatar:** 800 × 800 px, en versión oscura y clara.
- **Favicon:** en SVG y como icono de Apple de 180 px.
- **Propuesta de portada web:** `index.html`, con tema claro y oscuro y adaptada a móvil.

Datos de contacto para las aplicaciones: hola@sellpix.es · sellpix.es.

## Fotografía

Las fotos solo se usan según este apartado. Son de Unsplash, **en blanco y negro, abstractas y sin personas posando**: carreteras de noche con larga exposición, macros de píxeles de pantalla, ciudades de noche. Nada de servidores, oficinas genéricas ni modelos.

- **Uso:** como fondo de sección, siempre bajo una capa sólida de `surface-inverse` al 70–80 %, con el texto en AA y en `text-inverse`. Máximo una foto por página más la del bloque de cierre, que es la misma en toda la web. Nunca en el primer pantallazo de la portada.
- **Movimiento:** zoom ambiente de 1 a 1,06 en unos 20 s (solo `transform`).
- **Asignación:** cierre, carretera A73 (Markus Spiske); Servicios, subpíxeles (Gyula Jónás); Asturias, Oviedo de noche (Vitalii Kyktov); mantenimientos, ciudad de noche (Kevin Bosc). Se sirven desde `img/fondos/`.
- **Formato:** .webp y .jpg a 800 y 1600 px, con `<img>` y `loading="lazy"`, nunca `background-image`. Fuente interna de los datos en `img/CREDITOS.txt` (no se publica).
- **«Cómo creamos tu proyecto»:** la página `proyectos/` usa fotografías propias de su tema en blanco y negro, abstractas y sin poses: escritorios, manos trabajando, bocetos, una conversación de trabajo vista de lejos. Nada de modelos mirando a cámara ni escenas de oficina genéricas. Se sirven desde `img/proyectos/` en .webp y .jpg, a 800 y 1600 px, y su crédito está solo en `creditos/`.
- **Créditos:** todos en una sola página, `creditos/`, enlazada desde el pie de todas las páginas junto a los enlaces legales. Es el único sitio donde se ven: ni en el pie de cada página ni en `proyectos/`. Recoge fotos (autor, enlace a Unsplash y página donde se usa) y tipografías (OFL).
