# SellPix — instrucciones de marca para Claude Code

Este proyecto pertenece a **SellPix**, estudio de diseño web y branding de Alberto Domínguez Barreiro.
Eslogan: **Engineered to sell.** · Línea en español: **Diseño web con criterio comercial.**
Concepto: **el píxel encendido**. Cada píxel trabaja para vender, y el píxel lima es el que vende.

El manual completo de marca está aquí y debes seguirlo en todo lo que diseñes o programes:
@brand/BRAND.md

## Reglas obligatorias

1. **Colores, tipografías, espaciados, radios y sombras salen SIEMPRE de `brand/tokens.css`** (`--color-*`, `--font-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-*`). Nunca escribas un hex, un tamaño de fuente o un margen sueltos. Si falta un valor, añádelo primero a `brand/tokens.json` y `brand/tokens.css` y avisa.
2. Carga `brand/tokens.css` en todas las páginas: define Bricolage Grotesque, Inter y Pixelify Sans con `@font-face` desde `brand/fonts/` y sus fuentes de reserva ajustadas. **Las fuentes nunca se vuelven a cargar desde Google Fonts** (ni `@import`, ni `<link>` a fonts.googleapis.com o fonts.gstatic.com). Cada página precarga en su `<head>` solo `bricolage-grotesque-latin.woff2` e `inter-latin.woff2`, con `crossorigin`. Con Tailwind, usa `brand/tailwind.preset.js` como preset.
3. **`--color-ink` y `--color-paper` son colores de marca fijos, solo para rellenos** (logotipo, bloques, píxeles). Nunca como color de texto ni fondo de página: para eso están `--color-text`, `--color-text-inverse`, `--color-surface` y `--color-surface-inverse`, que cambian con el tema.
4. **El lima (`--color-lime`) es el píxel encendido y solo se usa como relleno**: CTA principal, píxeles de marca, etiquetas destacadas. Nunca como color de texto ni de icono sobre fondo claro. Texto sobre lima: `--color-on-lime`. Como máximo **un** botón principal lima por pantalla.
5. **Tipografía:** titulares y cifras en `--font-display` (Bricolage Grotesque); texto en `--font-sans` (Inter); antetítulos y etiquetas en `--font-pixel` (Pixelify Sans) en MAYÚSCULAS. **Pixelify Sans nunca con números** (su 5 parece una S). Usa las clases `.sp-display`, `.sp-h1`… `.sp-eyebrow`, `.sp-stat`.
6. **Recursos de píxel:** escalera de píxeles con el más alto en lima, campo de píxeles (`.sp-pixel-field`) y píxel suelto tras una palabra clave (`.sp-pixel`). Uno por bloque como máximo. Nada de degradados, emojis ni fotos de banco.
7. Bordes antes que sombras. Tarjetas: `.sp-card` (fondo `surface-alt`, borde `line`, radio 12 px).
8. Rejilla de 4 px: todo margen y padding es un token `--space-*`. Contenedor `.sp-container` (máx. 1200 px) y secciones `.sp-section`.
9. Accesibilidad: contraste AA, foco visible con `--color-focus-ring`, objetivos táctiles de 48 px, `prefers-reduced-motion`, `alt` en las imágenes y sin scroll horizontal en móvil.
10. Tema oscuro: ya está resuelto en `tokens.css` (automático o con `data-theme="dark"`). El logotipo cambia a su versión `-reversed` en oscuro; sobre `surface-inverse` también hay que invertirlo.
11. Logotipo: usa los archivos de `brand/logos/` tal cual. No lo redibujes, no recolores los píxeles y no muevas el píxel lima.
12. Nombre siempre **SellPix** (una palabra, S y P mayúsculas). **Voz de empresa:** la web habla como «SellPix» o en «nosotros», nunca en primera persona del singular ni con el nombre de Alberto (solo en las páginas legales, donde la ley exige al titular). Tampoco se sugiere un equipo que no existe: nada de «nuestro equipo de diseñadores», cargos, número de personas ni nombres. **Contacto:** primer contacto y propuesta por email, reuniones por videollamada (Teams, Google Meet o similar) y teléfono una vez contratado; nunca reuniones presenciales. Textos de tú, frases cortas, sin superlativos ni cifras sin medir. No se publican casos de clientes ni demostraciones; el método se explica en `proyectos/`.

## Repositorio y publicación (GitHub + GitHub Pages)

Tienes conectores y herramientas para GitHub (`git` y `gh`). Encárgate tú de esta parte, sin pedirle a Alberto que lo haga a mano:

1. **Si el proyecto aún no es un repositorio**, inicialízalo (`git init`, rama `main`) y crea un `.gitignore` para web estática (`.DS_Store`, `node_modules/`, `.env*`, `dist/` si no se publica desde ahí).
2. **Si no existe el repositorio en GitHub**, créalo en la cuenta de Alberto con el nombre `sellpix-web` y súbele todo el contenido en un primer commit («Identidad SellPix y punto de partida de la web»). Debe ser **público**: GitHub Pages gratuito solo funciona con repositorios públicos en el plan Free. Por eso, nunca subas datos privados, credenciales ni archivos `.env`.
3. **Publica la web con GitHub Pages** desde la rama `main` (carpeta raíz, o `/docs` si la web acaba ahí). Comprueba que la URL pública carga bien, incluidos `brand/tokens.css`, las fuentes y los logos, y dale la URL a Alberto.
4. **Mantenla publicada:** al terminar cada cambio importante, haz commit con un mensaje claro en español y súbelo, para que la web publicada esté al día.
5. **Rutas relativas siempre** (`brand/…`, no `/brand/…`): GitHub Pages sirve el sitio desde `https://<usuario>.github.io/sellpix-web/`, y una ruta absoluta se rompería.
6. **Dominio propio:** la web se publica en **https://sellpix.es/** (archivo `CNAME`, HTTPS forzado en Pages, certificado de Let's Encrypt que GitHub renueva solo). `www.sellpix.es` y la URL de github.io redirigen al dominio. No borres el `CNAME`. Los DNS están en Hostinger: 4 registros A a GitHub Pages y `www` como CNAME de `langreoalbeniz.github.io`.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | Portada (punto de partida de la web) |
| `servicios/` · `proyectos/` · `estudio/` · `contacto/` | Una carpeta por página, con su `index.html` (URLs limpias con barra final). `sobre-mi/` solo redirige a `estudio/` (meta refresh, canonical y `noindex`) |
| `aviso-legal/` · `privacidad/` · `cookies/` | Páginas legales (LSSI-CE, RGPD/LOPDGDD y cookies). Si se añade un servicio de terceros, analítica o cookies, actualízalas antes de publicar |
| `servicios/landing-page/` · `web-corporativa/` · `tienda-online-shopify/` · `mantenimiento-web/` | Páginas de producto: botón → cuestionario de Tally en ventana emergente → `confirmar/<servicio>/` (ver «Recorrido de contratación»). No llevan enlaces de Stripe |
| `confirmar/landing-page/` · `web-corporativa/` · `tienda-online-shopify/` · `mantenimiento-web/` | Resumen del pedido antes de pagar (`noindex`, fuera del sitemap y de llms.txt): precio con IVA, qué incluye y qué no, plazo, extras, qué pasa después y UN botón lima «Pagar … con Stripe». **Son el único sitio con enlaces de Stripe.** `js/confirmar.js` añade `?prefilled_email=` al botón si el cuestionario dejó el email en `sessionStorage` (`sellpix_email`). Copian lo publicado en producto y Condiciones: si cambia algo allí, cambia aquí |
| `proyectos/` | «Cómo creamos tu proyecto»: la web como comercial 24/7 y el recorrido en cinco etapas (qué aporta el cliente y qué aporta SellPix). No hay casos de clientes ni demos. Usa las fotos de `img/proyectos/` (Unsplash, blanco y negro, en .webp y .jpg a 800 y 1600 px, crédito en `img/proyectos/CREDITOS.txt` y en el pie de la página): es la única excepción a «sin fotos de banco» |
| `guias/` | Índice de guías y una carpeta por artículo (`guias/<slug>/`), generadas con el mismo encabezado y pie que el resto. Cada guía lleva `Article` + `BreadcrumbList`, autor enlazado a `sobre-mi/`, fecha, índice con anclas, imagen OG propia en `img/og-guia-<slug>.jpg` (1200×630) y entra en el sitemap. Sin cifras ni estadísticas sin fuente oficial enlazada |
| `diseno-web-asturias/` | Página local (Oviedo, Gijón, Avilés y resto de Asturias): enlazada desde «Oviedo, Asturias» del pie de todas las páginas y desde `sobre-mi/`. Lleva `ProfessionalService` con `areaServed`, `FAQPage` y `BreadcrumbList`. Misma regla que el resto: sin cifras ni clientes inventados |
| `js/contratar.js` · `js/confirmar.js` | Scripts del recorrido de contratación: el primero se carga con `defer` en las páginas de producto; el segundo, en las de `confirmar/` |
| `condiciones/` | Condiciones de contratación: servicios (copiados de Servicios), precios con IVA, pagos con Stripe, mantenimiento y desistimiento. Si cambian precios, plazos o enlaces de pago, actualízala a la vez que Servicios |
| `gracias/` | Página de destino tras pagar en Stripe (`noindex`, fuera del sitemap); borra de la barra el parámetro `?pedido` |
| `404.html` | Página de error; fija su raíz con `<base>` porque GitHub Pages la sirve en cualquier ruta |
| `robots.txt` · `sitemap.xml` · `llms.txt` | Rastreo e índice de URLs para buscadores; `llms.txt` resume el sitio para asistentes de IA (servicios con precios, guías, proyectos, legal). `robots.txt` no bloquea ningún rastreador, tampoco los de IA; si se añade o cambia una página, se ejecuta `node scripts/sitemap.js`, que regenera `sitemap.xml` con todas las páginas indexables y su `lastmod` (fecha del último commit de cada archivo; hoy si tiene cambios sin confirmar), y, si es relevante, se añade a `llms.txt` |
| `img/` | Fotos de contenido (no de marca) en .webp y .jpg, a 480 y 800 px de ancho, servidas con `<picture>` y `srcset` |
| `descargas/` | Archivos públicos para descargar: `sellpix-dossier.pdf`, el dossier comercial (enlazado desde Servicios y llms.txt, fuera del sitemap). Es una **copia**: la fuente del dossier y el resto del kit de clientes viven en el repositorio privado `langreoalbeniz/sellpix-starter` (ver abajo) |
| *Kit de clientes* | **No está en este repositorio.** Vive en `kit-clientes/` del repositorio privado `langreoalbeniz/sellpix-starter`: bienvenida, reunión inicial, checklist de entrega, plantilla de presupuesto, perfiles de plataformas (Contra, Malt, Workana, Fiverr), dossier comercial (HTML autocontenido + PDF) y firma de email. Si cambian precios, plazos o servicios, el dossier **se regenera allí** y el PDF se copia a `descargas/sellpix-dossier.pdf` aquí (actualiza también el tamaño que indica el botón de Servicios). Nunca vuelvas a traer el kit a este repositorio público |
| `_config.yml` | Archivos del repositorio que GitHub Pages no publica: toda la documentación `.md`, `tokens.json`, `tailwind.preset.js` y la configuración de herramientas. Si añades un archivo que no forma parte de la web, exclúyelo aquí |
| `scripts/sitemap.js` | Genera `sitemap.xml` (no se publica: `_config.yml` excluye `scripts/`). Ejecútalo antes del commit que publica una página nueva o cambiada |
| `css/site.css` | Estilos compartidos (cabecera, pie, componentes, utilidades) |
| `brand/BRAND.md` | Manual de marca completo |
| `brand/tokens.json` · `brand/tokens.css` · `brand/tailwind.preset.js` | Valores de marca |
| `brand/logos/` | Logotipos SVG y PNG, avatar, favicon (`favicon.svg`, y `favicon.ico` de 32 px en la raíz, generado desde él) e icono de Apple |
| `brand/fonts/` | Tipografías woff2 (subconjunto latino) y sus licencias OFL. Única fuente de las tipografías: nunca Google Fonts |

Antes de dar por terminada una página, compárala con `index.html` y con estas reglas.

**Menú:** Inicio · Servicios · Proyectos · Guías · El estudio · Contacto, en ese orden, en `.site-nav`, `.mobile-menu` y `.footer-links` de todas las páginas (no hay plantilla compartida: al añadir una entrada hay que tocar todos los `index.html`).

**Páginas nuevas:** créalas como `carpeta/index.html`, con rutas `../brand/…`, `../css/…` y enlaces `../otra-pagina/`. Cada una lleva `<title>` único (máx. 60 caracteres), meta description única (máx. 155), `link rel="canonical"` a `https://sellpix.es/carpeta/`, Open Graph, un solo `h1` y los dos iconos del `<head>` (`favicon.svg` y `favicon.ico`, con la ruta relativa que toque). Después ejecuta `node scripts/sitemap.js` para que entre en `sitemap.xml` con su `lastmod`.

**Recorrido de contratación:** producto → Tally → `confirmar/<servicio>/` → Stripe → `gracias/`. **Los enlaces de Stripe solo existen en `confirmar/`**, nunca en producto, tarjetas ni otras páginas. El botón de producto es `<a href="https://tally.so/r/<id>" data-contratar-form="<id>" data-contratar-confirmar="../../confirmar/<servicio>/">`: sin JavaScript abre el cuestionario en tally.so; con JavaScript, `js/contratar.js` carga `embed.js` de Tally solo al pulsar, abre `Tally.openPopup` en modal y, al enviar, guarda el email del cuestionario en `sessionStorage` (`sellpix_email`, con try/catch) y redirige a la página de confirmación, donde `js/confirmar.js` lo añade al botón de pago como `?prefilled_email=`. El email nunca va en la URL de sellpix.es. Formularios: landing `pee8yP`, web corporativa `M11oN8`, Shopify `J115pX`, mantenimiento `gbbKdJ`. Enlaces de Stripe: landing `buy.stripe.com/fZu3cnay4eKe9c963Z2Ry04`, web `buy.stripe.com/7sY28jay47hM9c99gb2Ry07`, tienda `buy.stripe.com/cNi5kv7lS0To4VT4ZV2Ry08`, mantenimiento `buy.stripe.com/14AaEP49G31w1JH2RN2Ry03`; todos redirigen a `gracias/`. Pago completo al contratar en todos los paquetes. Si cambia un precio, un plazo, un extra o lo que incluye un paquete, actualiza a la vez la página de producto, su `confirmar/`, `servicios/`, la portada, `condiciones/`, el dossier y el formulario de Tally.

**Analítica en todas las páginas:** toda página publicada, también las nuevas, lleva justo antes de `</body>` este fragmento de Cloudflare Web Analytics, en una sola línea y tal cual. No hay plantilla compartida, así que no se añade solo.

```html
<!-- Cloudflare Web Analytics: se carga tras el evento load para no competir con el contenido --><script>window.addEventListener('load', function () { var s = document.createElement('script'); s.type = 'module'; s.src = 'https://static.cloudflareinsights.com/beacon.min.js'; s.setAttribute('data-cf-beacon', '{"token": "724c084d30e94710b4ae653efca91731"}'); document.body.appendChild(s); });</script><!-- End Cloudflare Web Analytics -->
```

Se carga después del evento `load` a propósito: insertado directamente, el beacon competía con el contenido principal y Lighthouse bajaba a 98-99 en algunas páginas. No vuelvas a la versión con `<script src>` directo. Si se cambia de herramienta de analítica, actualiza antes la privacidad y las cookies.

## Verificación antes de publicar

Todo cambio importante pasa esta verificación **antes del commit**. Si algo no cumple, se corrige primero.

1. **Capturas con Playwright MCP** de cada página cambiada en **375 px** y **1440 px** de ancho, en **tema claro y oscuro** (cuatro capturas por página). Revisa que no haya scroll horizontal, que el logotipo cambie a `-reversed` en oscuro y que todo se lea.
2. **Lighthouse en móvil**: **90 o más** en rendimiento, accesibilidad, buenas prácticas y SEO.
   `npx -y lighthouse@latest <url> --form-factor=mobile --output=html --output=json --output-path=auditoria/lighthouse-movil --chrome-flags="--headless=new"`
3. **pa11y sin errores** (WCAG 2 AA) en cada página:
   `npx -y pa11y@latest --standard WCAG2AA <url>`
4. **html-validate sin errores**:
   `npx -y html-validate@latest index.html 404.html */index.html servicios/*/index.html guias/*/index.html confirmar/*/index.html`
   La configuración está en `.htmlvalidate.json`. Si una regla es solo de estilo (estilos en línea, mayúsculas, comillas, cierre de etiquetas…) y el código funciona, se desactiva ahí en lugar de reescribir el código.

5. **Enlaces internos**: todos responden 200 (menú, pie, botones, CSS, logotipos).
6. **Ningún marcador «PENDIENTE» publicado.** Antes de cada push, busca la palabra en todos los archivos que se publican (HTML, CSS, JS, JSON, textos, también en comentarios y atributos `alt`):
   `git grep -nI "PENDIENTE" -- . ":(exclude)CLAUDE.md" ":(exclude)*.md" ":(exclude).github"`
   Si aparece algo, **no se publica**: completa el dato o quita el elemento. Ni este archivo, ni los demás `.md`, ni `.github` se publican (`_config.yml` los excluye), por eso pueden nombrar la palabra.

**Red de seguridad en GitHub Actions:** `.github/workflows/calidad.yml` repite en cada push a `main` los puntos 2, 3, 4 y 6 (Lighthouse móvil ≥ 90 con una pasada, pa11y, html-validate y PENDIENTE) sobre todas las páginas, servidas en local en el runner. Si falla, se corrige y se vuelve a subir; no sustituye a la verificación manual de arriba. Umbrales en `.github/lighthouserc.json`; las páginas con `noindex` (404, gracias y confirmar/) no se evalúan en SEO.

La 404 lleva `noindex` a propósito: su SEO en Lighthouse sale bajo y no cuenta para el objetivo.

Los informes se guardan en `auditoria/`, que está en `.gitignore` y no se sube. Las herramientas se ejecutan con `npx`, sin instalación global. Para auditar en local, sirve la web con `python -m http.server 8080` y usa `http://localhost:8080/`.

Nunca guardes tokens, claves ni credenciales en el repositorio.
