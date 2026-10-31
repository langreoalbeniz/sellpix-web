/*
 * Pix, la mascota de SellPix: el píxel lima con ojos (BRAND.md, «Mascota: Pix»). Un único SVG de 10 × 10 unidades con
 * todas las poses; la pose la elige el atributo data-pose y el CSS de css/site.css (nada de GIF, vídeo ni imágenes).
 *
 * Uso:
 *   node scripts/pix.js           reescribe todos los Pix de las páginas
 *   node scripts/pix.js --check   falla si algún Pix de una página no coincide con este marcado
 *
 * En una página, cada Pix va entre dos marcas, con la pose y las clases extra en la primera:
 *   <!-- pix pose="celebra" clase="pix--titular" extra="data-quiz-pix" -->…<!-- /pix -->
 * Poses: normal · parpadea (es el parpadeo de normal y de mira) · mira · piensa · contento · duda · celebra · confundido.
 * Las coordenadas están en unidades de la rejilla del SVG (10 × 10), no en píxeles de pantalla.
 * No se publica: _config.yml excluye scripts/.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');

const r = (x, y, w, h, rx, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"${extra}/>`;
const OJOS = r(2.2, 3, 1.8, 1.8, 0.3, ' class="ojo ojo-i"') + r(6, 3, 1.8, 1.8, 0.3, ' class="ojo ojo-d"');
const CONTENTO = [[2, 3.9], [2.7, 3.1], [3.4, 3.9], [5.8, 3.9], [6.5, 3.1], [7.2, 3.9]].map(([x, y]) => r(x, y, 0.8, 0.8, 0.16)).join('');
const PIENSA = [[10.6, 1.4], [12, 0], [13.6, -1.6]].map(([x, y], n) => r(x, y, 1, 1, 0.16, ` style="--n:${n}"`)).join('');
const CHISPAS = [[7, 0], [3.5, -6], [-3.5, -6], [-7, 0], [-3.5, 6], [3.5, 6]].map(([dx, dy]) => r(4.5, 4.5, 1, 1, 0.16, ` style="--dx:${dx}px;--dy:${dy}px"`)).join('');
const PREGUNTA = [[10.5, -6], [11.6, -6], [12.7, -4.9], [11.6, -3.8], [11.6, -1.6]].map(([x, y]) => r(x, y, 1, 1, 0.16)).join('');

function pix(pose = 'normal', clase = '', extra = '') {
  return `<span class="pix${clase ? ' ' + clase : ''}" data-pose="${pose}"${extra ? ' ' + extra : ''} aria-hidden="true">` +
    `<svg class="pix-svg" viewBox="0 0 10 10" focusable="false">` +
    `<g class="pix-ojos">${OJOS}</g><g class="pix-contento">${CONTENTO}</g><g class="pix-piensa">${PIENSA}</g>` +
    `<g class="pix-celebra">${CHISPAS}</g><g class="pix-pregunta">${PREGUNTA}</g></svg></span>`;
}

const MARCA = /<!-- pix((?: \w+="[^"]*")*) -->[\s\S]*?<!-- \/pix -->/g;
const attr = (s, n) => (s.match(new RegExp(` ${n}="([^"]*)"`)) || [])[1] || '';
function procesar(html) {
  return html.replace(MARCA, (m, a) => `<!-- pix${a} -->${pix(attr(a, 'pose') || 'normal', attr(a, 'clase'), attr(a, 'extra'))}<!-- /pix -->`)
;
}
if (require.main === module) {
  const check = process.argv.includes('--check');
  const files = execSync('git ls-files --cached --others --exclude-standard -- "*.html" ":!dossier"', { cwd: ROOT, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
  let n = 0; const mal = [];
  for (const f of files) {
    const p = path.join(ROOT, f); const html = fs.readFileSync(p, 'utf8');
    if (!/<!-- pix/.test(html)) continue;
    n++; const out = procesar(html);
    if (out !== html) { if (check) mal.push(f); else fs.writeFileSync(p, out); }
  }
  console.log(`pix: ${n} páginas con Pix · ${check ? (mal.length ? 'desactualizadas: ' + mal.join(', ') : 'al día') : 'actualizadas'}`);
  if (mal.length) process.exit(1);
}
module.exports = { pix };
