# sellpix-web

Web de **SellPix** — *Engineered to sell.* · Diseño web con criterio comercial.

- `index.html`: portada.
- `servicios/`, `proyectos/`, `sobre-mi/`, `contacto/`: una carpeta por página, con su `index.html`.
- `404.html`, `robots.txt`, `sitemap.xml`: página de error y archivos para buscadores.
- `css/site.css`: estilos compartidos.
- `brand/`: identidad de marca. Manual (`BRAND.md`), tokens (`tokens.css`, `tokens.json`, `tailwind.preset.js`) y logotipos.
- `CLAUDE.md`: reglas de marca y de publicación para Claude Code.

Sitio estático publicado con GitHub Pages. Para verlo en local, sírvelo con `python -m http.server 8080` y abre `http://localhost:8080/` (abrir los archivos con doble clic no sigue los enlaces a carpetas).
