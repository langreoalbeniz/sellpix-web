# sellpix-web

[![Calidad](https://github.com/langreoalbeniz/sellpix-web/actions/workflows/calidad.yml/badge.svg)](https://github.com/langreoalbeniz/sellpix-web/actions/workflows/calidad.yml)

Web de **SellPix** — *Engineered to sell.* · Diseño web con criterio comercial.

- `index.html`: portada.
- `servicios/` (y una página por producto), `proyectos/` (con las demos `cafeteria/` y `fisioterapia/`), `guias/`, `diseno-web-asturias/`, `sobre-mi/`, `contacto/`, `condiciones/`, `gracias/` y las páginas legales: una carpeta por página, con su `index.html`.
- `404.html`, `robots.txt`, `sitemap.xml`: página de error y archivos para buscadores.
- `css/site.css`: estilos compartidos.
- `brand/`: identidad de marca. Manual (`BRAND.md`), tokens (`tokens.css`, `tokens.json`, `tailwind.preset.js`) y logotipos.
- `CLAUDE.md`: reglas de marca y de publicación para Claude Code.

Sitio estático publicado con GitHub Pages en **https://sellpix.es/**. Para verlo en local, sírvelo con `python -m http.server 8080` y abre `http://localhost:8080/` (abrir los archivos con doble clic no sigue los enlaces a carpetas).

## Verificación automática (GitHub Actions)

El flujo [`.github/workflows/calidad.yml`](.github/workflows/calidad.yml) se ejecuta en cada push a `main` (y a mano desde la pestaña Actions) y falla si algo baja de los umbrales de `CLAUDE.md`:

| Comprobación | Umbral | Cómo |
| --- | --- | --- |
| Marcador «PENDIENTE» | ninguno en archivos publicados | `git grep -nI "PENDIENTE"` en todo lo que se publica (los `.md` y `.github` quedan fuera de GitHub Pages, así que no cuentan) |
| html-validate | 0 errores en todas las páginas | `npx html-validate` con `.htmlvalidate.json` |
| pa11y (WCAG 2 AA) | 0 errores en todas las páginas | sirve la web con `python3 -m http.server` y recorre cada URL |
| Lighthouse móvil | 90 o más en rendimiento, accesibilidad, buenas prácticas y SEO | `@lhci/cli` con [`.github/lighthouserc.json`](.github/lighthouserc.json); una pasada por página |

Las páginas con `noindex` (`404.html`, `gracias/` y las demos de `proyectos/`) no se evalúan en SEO, porque su puntuación baja a propósito. Los informes HTML de Lighthouse quedan como artefacto `lighthouse` del flujo durante 14 días. En local, Lighthouse da 96 en buenas prácticas porque el beacon de Cloudflare no responde a `localhost`; en sellpix.es da 100.

El flujo es una red de seguridad: la verificación manual de `CLAUDE.md` (capturas en 375 y 1440 px en claro y oscuro, Lighthouse ×3 sobre el dominio) sigue haciéndose antes de cada commit.

## Repositorios relacionados

- [`sellpix-starter`](https://github.com/langreoalbeniz/sellpix-starter) (privado, plantilla): punto de partida para la web de un cliente, con tokens vacíos, páginas legales con huecos `[DATO_CLIENTE]`, CLAUDE.md genérico y el mismo flujo de calidad. Se usa con «Use this template».
