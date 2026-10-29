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
| `404.html` | Página de error; fija su raíz con `<base>` porque GitHub Pages la sirve en cualquier ruta |
| `robots.txt` · `sitemap.xml` | Rastreo e índice de URLs para buscadores |
| `css/site.css` | Estilos compartidos (cabecera, pie, componentes, utilidades) |
| `brand/BRAND.md` | Manual de marca completo |
| `brand/tokens.json` · `brand/tokens.css` · `brand/tailwind.preset.js` | Valores de marca |
| `brand/logos/` | Logotipos SVG y PNG, avatar, favicon e icono de Apple |
| `brand/fonts/` | Tipografías woff2 (subconjunto latino) y sus licencias OFL. Única fuente de las tipografías: nunca Google Fonts |

Antes de dar por terminada una página, compárala con `index.html` y con estas reglas.

**Páginas nuevas:** créalas como `carpeta/index.html`, con rutas `../brand/…`, `../css/…` y enlaces `../otra-pagina/`. Cada una lleva `<title>` único (máx. 60 caracteres), meta description única (máx. 155), `link rel="canonical"` a `https://sellpix.es/carpeta/`, Open Graph y un solo `h1`. Añádela a `sitemap.xml`.

## Verificación antes de publicar

Todo cambio importante pasa esta verificación **antes del commit**. Si algo no cumple, se corrige primero.

1. **Capturas con Playwright MCP** de cada página cambiada en **375 px** y **1440 px** de ancho, en **tema claro y oscuro** (cuatro capturas por página). Revisa que no haya scroll horizontal, que el logotipo cambie a `-reversed` en oscuro y que todo se lea.
2. **Lighthouse en móvil**: **90 o más** en rendimiento, accesibilidad, buenas prácticas y SEO.
   `npx -y lighthouse@latest <url> --form-factor=mobile --output=html --output=json --output-path=auditoria/lighthouse-movil --chrome-flags="--headless=new"`
3. **pa11y sin errores** (WCAG 2 AA) en cada página:
   `npx -y pa11y@latest --standard WCAG2AA <url>`
4. **html-validate sin errores**:
   `npx -y html-validate@latest index.html 404.html */index.html`
   La configuración está en `.htmlvalidate.json`. Si una regla es solo de estilo (estilos en línea, mayúsculas, comillas, cierre de etiquetas…) y el código funciona, se desactiva ahí en lugar de reescribir el código.

5. **Enlaces internos**: todos responden 200 (menú, pie, botones, CSS, logotipos).

La 404 lleva `noindex` a propósito: su SEO en Lighthouse sale bajo y no cuenta para el objetivo.

Los informes se guardan en `auditoria/`, que está en `.gitignore` y no se sube. Las herramientas se ejecutan con `npx`, sin instalación global. Para auditar en local, sirve la web con `python -m http.server 8080` y usa `http://localhost:8080/`.

Nunca guardes tokens, claves ni credenciales en el repositorio.
