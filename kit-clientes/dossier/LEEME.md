# Dossier de SellPix

`sellpix-dossier.pdf` es el dossier comercial (8 páginas A4) para enviar a clientes: portada, el estudio, servicios y precios, proceso, la web como comercial 24/7, el recorrido en cinco etapas, la web de SellPix con preguntas frecuentes y cierre con contacto. En voz de empresa.

- `index.html` es la fuente. Usa `brand/tokens.css` y las tipografías de `brand/fonts/`; cada `<section class="page">` es una página A4.
- `img/` son capturas reales de sellpix.es (escritorio 1440 × 900 y móvil 390 × 844, a 2×), tomadas con Playwright. Las fotos de las páginas 5 y 6 son las de `img/proyectos/` (Unsplash, con crédito).
- Para regenerar el PDF tras cambiar textos o precios: abre `index.html` en Chrome e imprime a PDF (A4, sin márgenes, con gráficos de fondo), o usa Playwright: `page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })`.
- Los precios y lo que incluye cada servicio están copiados de `servicios/` y `condiciones/`. Si cambian allí, cambian aquí.

No se publica: `kit-clientes/` está excluido en `_config.yml` y fuera del flujo de calidad.
