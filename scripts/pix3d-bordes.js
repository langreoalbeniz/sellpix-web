/*
 * Sombras nunca cortadas (BRAND.md, «Mascota: Pix»): comprueba que ninguna imagen de img/pix3d/ tiene transparencia
 * mayor que 1 (de 255) en ningún píxel de sus cuatro bordes. Si la hay, la sombra o el cuerpo llegan al borde del
 * fotograma y se verían cortados en la web.
 *
 * Uso:  node scripts/pix3d-bordes.js        (falla con código 1 si alguna imagen no cumple; lo usa el flujo de calidad)
 *
 * Decodifica los WebP con el Chrome del sistema a través de Playwright (devDependency; channel "chrome", sin descargar
 * navegadores), porque Node no trae decodificador de imágenes. No se publica: _config.yml excluye scripts/.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'img/pix3d');
const UMBRAL = 1;

(async () => {
  const archivos = fs.readdirSync(DIR).filter((f) => f.endsWith('.webp')).sort();
  if (!archivos.length) { console.log('pix3d: no hay imágenes en img/pix3d/'); process.exit(1); }
  const navegador = await chromium.launch({ channel: 'chrome' });
  const pagina = await navegador.newPage();
  const mal = [];
  for (const f of archivos) {
    const data = 'data:image/webp;base64,' + fs.readFileSync(path.join(DIR, f)).toString('base64');
    const r = await pagina.evaluate(async (src) => {
      const im = new Image(); im.src = src; await im.decode();
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
      const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data; const W = c.width, H = c.height;
      const a = (px, py) => d[(py * W + px) * 4 + 3];
      let max = 0;
      for (let i = 0; i < W; i++) max = Math.max(max, a(i, 0), a(i, H - 1));
      for (let j = 0; j < H; j++) max = Math.max(max, a(0, j), a(W - 1, j));
      return { W, H, max };
    }, data);
    const ok = r.max <= UMBRAL;
    console.log(`${ok ? ' ok  ' : ' MAL  '}${f.padEnd(30)} ${r.W}×${r.H}  alfa máxima en los bordes: ${r.max}`);
    if (!ok) mal.push(f);
  }
  await navegador.close();
  if (mal.length) {
    console.log(`pix3d: ${mal.length} imagen(es) con la sombra cortada (alfa > ${UMBRAL} en algún borde): ${mal.join(', ')}`);
    process.exit(1);
  }
  console.log(`pix3d: ${archivos.length} imágenes, ninguna sombra cortada`);
})().catch((e) => { console.error('pix3d:', e.message); process.exit(1); });
