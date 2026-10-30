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
12. Nombre siempre **SellPix** (una palabra, S y P mayúsculas). Textos de tú, frases cortas, sin superlativos ni cifras sin medir; los proyectos de demostración llevan la etiqueta «CONCEPTO».

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
| `servicios/` · `proyectos/` · `sobre-mi/` · `contacto/` | Una carpeta por página, con su `index.html` (URLs limpias con barra final) |
| `aviso-legal/` · `privacidad/` · `cookies/` | Páginas legales (LSSI-CE, RGPD/LOPDGDD y cookies). Si se añade un servicio de terceros, analítica o cookies, actualízalas antes de publicar |
| `servicios/landing-page/` · `web-corporativa/` · `tienda-online-shopify/` · `mantenimiento-web/` | Páginas de producto. Son el único sitio con enlaces de pago: botón → cuestionario de Tally en ventana emergente → Stripe (ver «Recorrido de contratación») |
| `proyectos/cafeteria/` · `proyectos/fisioterapia/` | Demos de diseño con marcas ficticias (Brumas, Meridiano Fisioterapia). Cada una tiene su propia identidad en `estilo.css` y su tipografía en `fonts/`, carga `brand/tokens.css` solo para la barra fija de SellPix («Concepto · Demostración de diseño de SellPix», con enlace de vuelta a Proyectos), lleva `noindex` y queda fuera del sitemap. Los contactos (WhatsApp, formulario de cita) no son operativos y lo dicen |
| `guias/` | Índice de guías y una carpeta por artículo (`guias/<slug>/`), generadas con el mismo encabezado y pie que el resto. Cada guía lleva `Article` + `BreadcrumbList`, autor enlazado a `sobre-mi/`, fecha, índice con anclas, imagen OG propia en `img/og-guia-<slug>.jpg` (1200×630) y entra en el sitemap. Sin cifras ni estadísticas sin fuente oficial enlazada |
| `js/contratar.js` | Script compartido del recorrido de contratación; se carga con `defer` solo en las páginas de producto |
| `condiciones/` | Condiciones de contratación: servicios (copiados de Servicios), precios con IVA, pagos con Stripe, mantenimiento y desistimiento. Si cambian precios, plazos o enlaces de pago, actualízala a la vez que Servicios |
| `gracias/` | Página de destino tras pagar en Stripe (`noindex`, fuera del sitemap); borra de la barra el parámetro `?pedido` |
| `404.html` | Página de error; fija su raíz con `<base>` porque GitHub Pages la sirve en cualquier ruta |
| `robots.txt` · `sitemap.xml` | Rastreo e índice de URLs para buscadores |
| `img/` | Fotos de contenido (no de marca) en .webp y .jpg, a 480 y 800 px de ancho, servidas con `<picture>` y `srcset` |
| `_config.yml` | Archivos del repositorio que GitHub Pages no publica: toda la documentación `.md`, `tokens.json`, `tailwind.preset.js` y la configuración de herramientas. Si añades un archivo que no forma parte de la web, exclúyelo aquí |
| `css/site.css` | Estilos compartidos (cabecera, pie, componentes, utilidades) |
| `brand/BRAND.md` | Manual de marca completo |
| `brand/tokens.json` · `brand/tokens.css` · `brand/tailwind.preset.js` | Valores de marca |
| `brand/logos/` | Logotipos SVG y PNG, avatar, favicon e icono de Apple |
| `brand/fonts/` | Tipografías woff2 (subconjunto latino) y sus licencias OFL. Única fuente de las tipografías: nunca Google Fonts |

Antes de dar por terminada una página, compárala con `index.html` y con estas reglas.

**Menú:** Inicio · Servicios · Proyectos · Guías · Sobre mí · Contacto, en ese orden, en `.site-nav`, `.mobile-menu` y `.footer-links` de todas las páginas (no hay plantilla compartida: al añadir una entrada hay que tocar todos los `index.html`, salvo las demos).

**Páginas nuevas:** créalas como `carpeta/index.html`, con rutas `../brand/…`, `../css/…` y enlaces `../otra-pagina/`. Cada una lleva `<title>` único (máx. 60 caracteres), meta description única (máx. 155), `link rel="canonical"` a `https://sellpix.es/carpeta/`, Open Graph y un solo `h1`. Añádela a `sitemap.xml`.

**Recorrido de contratación:** los enlaces de pago de Stripe solo existen en las páginas de producto, nunca en tarjetas ni en otras páginas. El botón es `<a href="https://tally.so/r/<id>" data-contratar-form="<id>" data-contratar-pago="<enlace de Stripe>">`: sin JavaScript abre el cuestionario en tally.so (cuya página final enlaza al pago); con JavaScript, `js/contratar.js` carga `embed.js` de Tally solo al pulsar, abre `Tally.openPopup` en modal y, al enviar, redirige al enlace de Stripe con `?prefilled_email=` (el email del cuestionario). Formularios: landing `pee8yP`, web corporativa `M11oN8`, Shopify `J115pX`, mantenimiento `gbbKdJ`. Si cambia un precio, un plazo o lo que incluye un paquete, actualiza a la vez la página de producto, `servicios/`, la portada, `condiciones/` y el formulario de Tally.

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
   `npx -y html-validate@latest index.html 404.html */index.html servicios/*/index.html proyectos/*/index.html proyectos/*/*/index.html guias/*/index.html`
   La configuración está en `.htmlvalidate.json`. Si una regla es solo de estilo (estilos en línea, mayúsculas, comillas, cierre de etiquetas…) y el código funciona, se desactiva ahí en lugar de reescribir el código.

5. **Enlaces internos**: todos responden 200 (menú, pie, botones, CSS, logotipos).
6. **Ningún marcador «PENDIENTE» publicado.** Antes de cada push, busca la palabra en todos los archivos que se publican (HTML, CSS, JS, JSON, textos, también en comentarios y atributos `alt`):
   `git grep -nI "PENDIENTE" -- . ":(exclude)CLAUDE.md"`
   Si aparece algo, **no se publica**: completa el dato o quita el elemento. Este archivo no se publica en la web (`_config.yml` lo excluye), por eso puede nombrar la palabra.

La 404 lleva `noindex` a propósito: su SEO en Lighthouse sale bajo y no cuenta para el objetivo.

Los informes se guardan en `auditoria/`, que está en `.gitignore` y no se sube. Las herramientas se ejecutan con `npx`, sin instalación global. Para auditar en local, sirve la web con `python -m http.server 8080` y usa `http://localhost:8080/`.

Nunca guardes tokens, claves ni credenciales en el repositorio.
