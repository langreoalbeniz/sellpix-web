/*
 * Pix, la mascota de SellPix (BRAND.md, «Mascota: Pix»): fotogramas renderizados en 3D (img/pix3d/, 256 × 256 px, con la
 * luz y la sombra ya pintadas). Cada Pix de una página es una <img> con la pose en data-pose; js/pix.js cambia la pose
 * cambiando el src entre fotogramas precargados y hace los saltos con transform. El CSS está en css/site.css.
 *
 * Uso:
 *   node scripts/pix.js           reescribe todos los Pix de las páginas
 *   node scripts/pix.js --check   falla si algún Pix de una página no coincide con este marcado
 *
 * En una página, cada Pix va entre dos marcas, con la pose y las clases extra en la primera:
 *   <!-- pix pose="celebra" clase="pix--sm" extra="data-quiz-pix" -->…<!-- /pix -->
 * Poses: normal · mira · piensa · contento · duda · celebra · confundido (parpadea es el parpadeo, solo desde js/pix.js).
 * El src inicial es el fotograma de la pose FINAL (celebra arranca en contento): sin JavaScript o con movimiento
 * reducido Pix se ve ya en su estado final. La ruta a img/pix3d/ sale de la profundidad del archivo (404.html está en la raíz).
 * No se publica: _config.yml excluye scripts/.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');

/* Fotograma inicial de cada pose (el de su estado final) */
const FOTOGRAMA = { normal: 'pix-mira-3', mira: 'pix-mira-3', piensa: 'pix-piensa', contento: 'pix-contento', duda: 'pix-duda', celebra: 'pix-contento', confundido: 'pix-confundido' };

function pix(pose = 'normal', clase = '', extra = '', rel = '') {
  if (!FOTOGRAMA[pose]) throw new Error(`pix: pose desconocida «${pose}»`);
  return `<img class="pix${clase ? ' ' + clase : ''}" data-pose="${pose}"${extra ? ' ' + extra : ''} src="${rel}img/pix3d/${FOTOGRAMA[pose]}.webp" width="256" height="256" alt="" aria-hidden="true" decoding="async">`;
}

const MARCA = /<!-- pix((?: \w+="[^"]*")*) -->[\s\S]*?<!-- \/pix -->/g;
const attr = (s, n) => (s.match(new RegExp(` ${n}="([^"]*)"`)) || [])[1] || '';
/* rel: ruta desde la página hasta la raíz de la web ('' en la raíz, '../' en carpeta/index.html) */
function procesar(html, rel) {
  return html.replace(MARCA, (m, a) => `<!-- pix${a} -->${pix(attr(a, 'pose') || 'normal', attr(a, 'clase'), attr(a, 'extra'), rel)}<!-- /pix -->`);
}
function relDe(archivo) { return '../'.repeat(archivo.split('/').length - 1); }

if (require.main === module) {
  const check = process.argv.includes('--check');
  const files = execSync('git ls-files --cached --others --exclude-standard -- "*.html" ":!dossier"', { cwd: ROOT, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
  let n = 0; const mal = [];
  for (const f of files) {
    const p = path.join(ROOT, f); const html = fs.readFileSync(p, 'utf8');
    if (!/<!-- pix/.test(html)) continue;
    n++; const out = procesar(html, relDe(f));
    if (out !== html) { if (check) mal.push(f); else fs.writeFileSync(p, out); }
  }
  console.log(`pix: ${n} páginas con Pix · ${check ? (mal.length ? 'desactualizadas: ' + mal.join(', ') : 'al día') : 'actualizadas'}`);
  if (mal.length) process.exit(1);
}
module.exports = { pix, FOTOGRAMA };
