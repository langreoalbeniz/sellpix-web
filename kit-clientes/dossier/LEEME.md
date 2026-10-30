# Dossier de SellPix

`sellpix-dossier.pdf` es el dossier comercial (8 páginas A4) para enviar a clientes: portada, quién soy, servicios y precios, proceso, dos proyectos de demostración (Brumas y Meridiano, marcados como concepto), la web de SellPix con preguntas frecuentes y cierre con contacto.

- `index.html` es la fuente. Usa `brand/tokens.css` y las tipografías de `brand/fonts/`; cada `<section class="page">` es una página A4.
- `img/` son capturas reales de sellpix.es (escritorio 1440 × 900 y móvil 390 × 844, a 2×), tomadas con Playwright sin la barra de demostración.
- Para regenerar el PDF tras cambiar textos o precios: abre `index.html` en Chrome e imprime a PDF (A4, sin márgenes, con gráficos de fondo), o usa Playwright: `page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })`.
- Los precios y lo que incluye cada servicio están copiados de `servicios/` y `condiciones/`. Si cambian allí, cambian aquí.

No se publica: `kit-clientes/` está excluido en `_config.yml` y fuera del flujo de calidad.
