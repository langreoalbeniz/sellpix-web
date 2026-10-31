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
3. **Bordes, no sombras.** Las superficies se separan con líneas finas o con un cambio de fondo. Las sombras solo aparecen en menús y modales. Excepción: Pix y el símbolo 3D llevan su propia luz y sombra renderizadas.
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

- **Escalera:** una rejilla N×N con columnas que crecen de izquierda a derecha, los píxeles apagados al 9 % de opacidad y el más alto encendido en `lime`. Es el recurso principal para héroes, portadas, tarjetas y posts. En la web: mientras se monta la escalera, el píxel lima la sube saltando de la cima de una columna a la siguiente (nivel entrada, una sola vez, solo `transform`) y, al llegar arriba, se queda respirando (nivel ambiente: opacidad 1 → 0,35 → 1 en bucle, sin brillo ni sombra). Con movimiento reducido o en pausa, el píxel aparece ya arriba y quieto.
- **Campo de píxeles:** cuadrados de 3 px cada 24 px en `line-strong` al 35 %, como fondo de sección (clase `.sp-pixel-field`). En la web, algunos puntos se iluminan y se apagan despacio, nunca en `lime`.
- **Píxel suelto:** un cuadrado `lime` tras la palabra clave de un titular (clase `.sp-pixel`). Como máximo uno por bloque.

## Mascota: Pix

Pix es el píxel lima con ojos, en 3D. No sustituye al logotipo: es un personaje de apoyo que acompaña al visitante por la web y, desde el lote 13B, le ayuda: pregunta qué necesita con botones, responde preguntas frecuentes y le lleva a lo que busca. Habla poco y va al grano, y nunca dice nada que no esté ya publicado en la web.

**Forma (no se cambia).** Un cubo lima (`lime`) con los bordes redondeados, dos ojos cuadrados `ink` y una luz y una sombra propias. Es 3D renderizado, no 3D en tiempo real: Blender genera fotogramas WebP desde el modelo aprobado, con la misma luz y la misma cámara, y la web solo cambia de fotograma. Los píxeles acompañantes (los de piensa, celebra y la interrogación) son grises, nunca lima. Las imágenes no se regeneran ni se reencuadran a mano.

**Fotogramas** (`img/pix3d/`, 256 × 256 px cada uno, 76 KB en total). Todos comparten encuadre: el cuerpo mide el 42 % del ancho del fotograma, está centrado en horizontal y apoya en el 74 % de la altura. Para que Pix mida X px, el fotograma mide X / 0,42.

| Fotograma | Qué es |
| --- | --- |
| `pix-mira-0` … `pix-mira-6` | Pix girando de −35° a +35° (0 = izquierda, 3 = de frente, 6 = derecha). Para mirar hacia donde va el visitante |
| `pix-parpadea` | Ojos cerrados; se alterna con la pose actual unos 160 ms |
| `pix-contento` | Ojos en «^» |
| `pix-celebra` | Contento con chispas grises alrededor; dura 1,1 s y vuelve a contento |
| `pix-piensa` | Ojos arriba y tres píxeles grises de pensar |
| `pix-duda` | Ojo derecho entrecerrado |
| `pix-confundido` | Ojos desiguales e interrogación gris |

**Sombras nunca cortadas.** En cada fotograma la transparencia es 0 en los cuatro bordes y el flujo de calidad falla si alguna imagen de `img/pix3d/` tiene transparencia mayor que 1 en cualquier píxel de sus bordes (`node scripts/pix3d-bordes.js`). En la web, el CSS deja en el flujo solo la caja del cuerpo y la sombra desborda alrededor, así que ningún contenedor de Pix lleva `overflow: hidden` y el acompañante se coloca con el fotograma entero dentro de la pantalla.

**Logotipo (opción A).** La cabecera, el pie y el favicon siguen con el SVG plano. El símbolo 3D (`simbolo-3d-claro-*.webp` y `simbolo-3d-oscuro-*.webp`, 440 y 880 px, 1:1, mismo encuadre), con Pix en la cima de la escalera de cubos, va solo en el héroe de la portada: la versión clara con cubos negros y la oscura con cubos en blanco roto, una sola descarga según el tema.

**Dónde aparece.**
- **Portada:** el símbolo 3D del héroe, con Pix en la cima. Es el LCP en escritorio (precargado); en móvil queda bajo el primer pantallazo.
- **Acompañante** (`js/pix-acompanante.js`): botón fijo abajo a la derecha (Pix de 56 px en móvil y 72 en escritorio, área táctil de 48 px como mínimo, nombre accesible «Opciones de Pix»). Aparece con un salto de 600 ms cuando no hay otro Pix a la vista y se aparta en el pie, cuando se ve el formulario de contacto o la sección «Conoce a Pix», y con el menú móvil abierto. Mira hacia el ratón en escritorio y gira un fotograma con el scroll en móvil, parpadea cada 5–7 s, se pone contento con un precio a la vista y celebra con un saltito al pulsar «Contratar» o «Suscribirme». Su menú lleva al cuestionario, abre las preguntas frecuentes y el visor, y permite «Ocultar a Pix» (preferencia en el navegador; en el pie queda «Mostrar a Pix»). No se carga en `confirmar/`, las páginas legales, `condiciones/`, `creditos/`, `que-web-necesitas/`, `gracias/` ni la 404.
- **Asistente** (`js/pix-asistente.js`, paso 1 sin IA): el acompañante saluda con un bocadillo y abre un panel de preguntas frecuentes. **Bocadillo:** una vez por visita (`sessionStorage`, `sellpix_pix_saludo`), a los 8 s de llegar o al 40 % de desplazamiento, lo que ocurra antes (en las guías, solo al final del artículo); pequeño, junto a Pix, con botón de cerrar de 48 px y Esc; nunca tapa el botón lima ni el contenido principal: si se solapara con un CTA o un formulario, no sale (se comprueba con `getBoundingClientRect`). No sale nunca solo en `confirmar/`, los textos legales, `condiciones/`, `creditos/`, `gracias/`, la 404 ni sobre el formulario de contacto. Textos y botones fijados por página (portada, Servicios, fichas, guías, contacto y resto) en `js/pix-asistente.js`. **Panel:** `role="dialog"` con las preguntas sugeridas de la página, un buscador local («Busca en las preguntas frecuentes», sin tildes ni mayúsculas, nada sale del navegador) y «Ver en la web» en cada respuesta; sin coincidencia, Pix duda y «Esto mejor te lo contestamos por email» lleva a `contacto/#formulario`. Pix piensa 300 ms antes de responder y se pone contento al encontrar. **Pix asistente: paso 1 sin IA con `data/pix-faq.json`; paso 2 con IA en el lote 14.**
- **Cuestionario** (`que-web-necesitas/`): sentado en la cima de una escalera de tres columnas. Salta al empezar (600 ms), mira las opciones, da un saltito con cada respuesta (300 ms), duda con «Todavía no lo sé» y «Otra o no lo sé», piensa 700 ms antes del resultado y celebra (1,1 s) y se queda contento.
- **`gracias/`:** celebra una vez al cargar, junto al titular, y se queda contento.
- **404:** confundido junto al titular (el fotograma trae la interrogación); solo parpadea.
- **«Conoce a Pix»** (`estudio/#pix`): Pix de frente a buen tamaño, la bio y la ficha de abajo, literales, y el botón fantasma «Ver a Pix en tu espacio».

**Realidad aumentada.** «Ver a Pix en tu espacio» abre un `<dialog>` con `<model-viewer>` (`modelos/pix.glb` y `modelos/pix.usdz`, 30 cm de lado): se puede girar y, en móvil, ponerlo en la mesa (WebXR, Scene Viewer o Vista rápida). El visor se importa solo al pulsar, nunca al cargar la página, y se sirve desde la propia web (`js/vendor/`, licencia Apache 2.0 en `creditos/`). En escritorio sin AR aparece «Desde el móvil puedes ponerlo en tu mesa.».

**Bio (aprobada el 31/10, texto literal).**

> **Pix**
> Pix es el píxel que vende. Vivía en lo alto de la escalera de SellPix, encendido y quieto, hasta que un día abrió los ojos y bajó a ver la web. Desde entonces te acompaña mientras navegas: mira por dónde vas, se alegra cuando llegas a lo que buscas y lo celebra contigo cuando das el paso. Habla poco y va al grano: te pregunta qué necesitas y te lleva a lo que buscas.
>
> - **Qué es:** un píxel lima, cuadrado, con los bordes redondeados.
> - **Dónde vive:** en la cima de la escalera de SellPix.
> - **Qué hace:** te pregunta qué necesitas, responde a tus dudas y te ayuda a elegir.
> - **Le gusta:** las webs que se entienden a la primera, los precios cerrados y subir escaleras.
> - **No le gusta:** las ventanas que no se cierran.
>
> Botón: «Ver a Pix en tu espacio».

**Reglas.**
- Nunca en el logotipo, ni en la cabecera o el pie (salvo el botón «Mostrar a Pix»).
- Un solo Pix a la vista, de 24 px como mínimo; el acompañante se esconde cuando se ve otro.
- El lima, por debajo del 5 % de la pantalla.
- Fotogramas renderizados y `<img>`: cambiar de pose es cambiar el src entre fotogramas precargados; los saltos, con `transform` y `opacity`. Entradas con la curva de marca; ambiente parado fuera de pantalla. Nada de GIF ni vídeo.
- Las sombras nunca se cortan (transparencia 0 en los bordes).
- Quieto en su pose final con movimiento reducido o en pausa: aparece sin salto, no mira, no parpadea ni reacciona; el menú y el visor siguen funcionando.
- Realidad aumentada solo al pulsar.
- Pix no dice nada que no esté ya publicado en la web: nada de precios, plazos, garantías ni compromisos nuevos (`data/pix-faq.json` lleva texto literal y el flujo de calidad lo comprueba). No usa IA en el paso 1, no tiene red y no guarda lo que se escribe en su buscador.
- `aria-hidden="true"` y `alt=""` en los Pix decorativos (acompañante, cuestionario, gracias, 404); el de «Conoce a Pix» lleva `alt`.
- El marcado de los Pix de página sale de `scripts/pix.js` (`npm run pix`); los fotogramas y los saltos, de `js/pix.js`; el acompañante y el visor, de `js/pix-acompanante.js`; el asistente, de `js/pix-asistente.js` con `js/pix-faq.data.json` (`npm run pix-faq`); el CSS, de `css/site.css`.

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

- **Escalera que se enciende (entrada):** toda escalera se enciende columna a columna, de izquierda a derecha, y el píxel lima la sube después saltando de la cima de una columna a la siguiente (120 ms por salto, 20 ms de pausa, curva de marca) hasta quedar arriba a la derecha. Cada píxel tarda 250 ms y hay 110 ms entre columnas; en total, 1 s (1,6 s como máximo). Una sola vez: al cargar si está en el primer pantallazo y, si no, al entrar en pantalla. Después, el píxel lima respira (ambiente).
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
- **Cabeceras:** las fotos de cabecera solo se cargan a partir de 768 px; en móvil la cabecera usa `surface-inverse` con el campo de píxeles.
- **Movimiento:** zoom ambiente de 1 a 1,06 en unos 20 s (solo `transform`).
- **Asignación:** cierre, carretera A73 (Markus Spiske); Servicios, subpíxeles (Gyula Jónás); Asturias, Oviedo de noche (Vitalii Kyktov); mantenimientos, ciudad de noche (Kevin Bosc). Se sirven desde `img/fondos/`.
- **Formato:** .webp y .jpg a 800 y 1600 px, con `<img>` (`loading="lazy"` en el bloque de cierre; en las cabeceras, `fetchpriority="high"` y precarga), nunca `background-image`. Fuente interna de los datos en `img/CREDITOS.txt` (no se publica).
- **«Cómo creamos tu proyecto»:** la página `proyectos/` usa fotografías propias de su tema en blanco y negro, abstractas y sin poses: escritorios, manos trabajando, bocetos, una conversación de trabajo vista de lejos. Nada de modelos mirando a cámara ni escenas de oficina genéricas. Se sirven desde `img/proyectos/` en .webp y .jpg, a 800 y 1600 px, y su crédito está solo en `creditos/`.
- **Créditos:** todos en una sola página, `creditos/`, enlazada desde el pie de todas las páginas junto a los enlaces legales. Es el único sitio donde se ven: ni en el pie de cada página ni en `proyectos/`. Recoge fotos (autor, enlace a Unsplash y página donde se usa) y tipografías (OFL).
