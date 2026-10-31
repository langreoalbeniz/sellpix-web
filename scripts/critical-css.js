/*
 * CSS crítico: incrusta en el <head> de cada página brand/tokens.css completo y las reglas de css/site.css que se usan
 * en la primera pantalla, y carga css/site.css completo sin bloquear el renderizado.
 *
 * Uso:
 *   node scripts/critical-css.js           regenera el bloque en todas las páginas
 *   node scripts/critical-css.js --check   falla (código 1) si alguna página no está al día
 *
 * Desde un generador de páginas:  require('<repo>/scripts/critical-css.js').bloque(rel)
 *
 * Cuándo ejecutarlo: siempre que cambien brand/tokens.css o css/site.css, y al crear una página.
 * Si añades una clase que aparece en la primera pantalla de alguna página, añádela a PRIMERA_PANTALLA:
 * sin ella, esa regla solo llega con site.css (unos milisegundos después) y puede verse un parpadeo.
 * La lista se obtuvo el 31/10/2026 recorriendo todas las páginas a 375, 412 y 1440 px.
 *
 * No se publica: _config.yml excluye scripts/.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const INICIO = '<!-- css-critico: lo genera scripts/critical-css.js a partir de brand/tokens.css y css/site.css; no lo edites a mano -->';
const FIN = '<!-- /css-critico -->';

/* Clases, etiquetas e ids que aparecen en la primera pantalla de alguna página */
const PRIMERA_PANTALLA = {
  clases: `actions breadcrumb buy-guarantees buy-note checklist checklist--muted contact-detail contact-details contact-intro
    contact-jump contact-layout cta-actions cta-secondary detail-dot dot expect-list eyebrow-block eyebrow-block--tight
    faq-figure featured footer-legal footer-links footer-logo footer-place ghost guide guide-card guide-grid guide-hero
    guide-layout guide-lead guide-meta guide-toc header-actions header-cta hero how-hero js-year legal legal-data legal-hero
    lit mobile-menu nav-toggle needs not-found on on-dark on-light open page-hero photo pixel-stair price price-from
    price-tax price-unit product-buy buy-scope product-cols product-hero product-price product-section proof section-head
    service-card service-tag services-grid site-header site-logo site-nav skip sp-body sp-btn sp-btn--ghost
    sp-btn--primary sp-btn--secondary sp-card sp-container sp-display sp-eyebrow sp-h1 sp-h2 sp-h3 sp-h4 sp-lead sp-pixel
    sp-pixel-field sp-section sp-small sp-stat sp-tally tag tally-alt tally-slot tally-fallback u-mt-6 u-mt-7 u-muted
    u-nowrap u-sr-only`.split(/\s+/),
  etiquetas: 'html body a article br button code dd div dl dt footer h1 h2 h3 header iframe img li main nav ol p picture rect section small source span strong svg time title ul'.split(' '),
  ids: 'formulario main mobile-menu'.split(' '),
};

/* ── Analizador mínimo de CSS: reglas, @media/@supports anidados y at-rules con bloque ───────────── */
function parse(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  let i = 0;
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;
    const open = css.indexOf('{', i);
    const semi = css.indexOf(';', i);
    if (css[i] === '@' && semi !== -1 && (open === -1 || semi < open)) { out.push({ raw: css.slice(i, semi + 1).trim() }); i = semi + 1; continue; }
    if (open === -1) break;
    const prelude = css.slice(i, open).trim();
    let depth = 1; let j = open + 1; let q = null;
    for (; j < css.length && depth; j++) {
      const ch = css[j];
      if (q) { if (ch === q && css[j - 1] !== '\\') q = null; continue; }
      if (ch === '"' || ch === "'") q = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
    const body = css.slice(open + 1, j - 1);
    if (/^@(media|supports|layer)\b/.test(prelude)) out.push({ prelude, children: parse(body) });
    else out.push({ prelude, body });
    i = j;
  }
  return out;
}

const SET = { c: new Set(PRIMERA_PANTALLA.clases), t: new Set(PRIMERA_PANTALLA.etiquetas), i: new Set(PRIMERA_PANTALLA.ids) };
function selectorCritico(sel) {
  const s = sel
    .replace(/::?[a-zA-Z-]+\((?:[^()]|\([^()]*\))*\)/g, '') // :not(...), :is(...), :nth-child(...)
    .replace(/::?[a-zA-Z-]+/g, '')                         // :hover, ::before…
    .replace(/\[[^\]]*\]/g, '');                            // [aria-current="page"]…
  for (const m of s.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) if (!SET.c.has(m[1])) return false;
  for (const m of s.matchAll(/#(-?[_a-zA-Z][\w-]*)/g)) if (!SET.i.has(m[1])) return false;
  for (const m of s.matchAll(/(?:^|[\s>+~(,])([a-zA-Z][\w-]*)/g)) if (!SET.t.has(m[1].toLowerCase())) return false;
  return true;
}
function filtrar(nodes) {
  const out = [];
  for (const n of nodes) {
    if (n.raw) continue;
    if (n.children) { const kids = filtrar(n.children); if (kids.length) out.push({ prelude: n.prelude, children: kids }); continue; }
    if (n.prelude.startsWith('@')) { out.push(n); continue; } // @keyframes, @font-face
    const sels = n.prelude.split(/,(?![^()]*\))/).map((x) => x.trim()).filter(selectorCritico);
    if (sels.length) out.push({ prelude: sels.join(','), body: n.body });
  }
  return out;
}
const serializar = (nodes) => nodes.map((n) => (n.children ? `${n.prelude}{${serializar(n.children)}}` : `${n.prelude}{${n.body}}`)).join('');
const minificar = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};])\s*/g, '$1').replace(/;}/g, '}').trim();

function cssCritico(rel) {
  const tokens = fs.readFileSync(path.join(ROOT, 'brand/tokens.css'), 'utf8').replace(/url\((["']?)fonts\//g, `url($1${rel}brand/fonts/`);
  const site = serializar(filtrar(parse(fs.readFileSync(path.join(ROOT, 'css/site.css'), 'utf8'))));
  return minificar(tokens) + minificar(site);
}

/* Bloque del <head>: estilos críticos en línea y site.css completo sin bloquear (con respaldo sin JavaScript) */
function bloque(rel) {
  return `${INICIO}
<style id="css-critico">${cssCritico(rel)}</style>
<link rel="preload" href="${rel}css/site.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${rel}css/site.css"></noscript>
${FIN}`;
}

function paginas() {
  return execSync('git ls-files --cached --others --exclude-standard -- "*.html"', { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/).filter(Boolean);
}
function relDe(f) { return f === '404.html' ? '' : '../'.repeat(f.split('/').length - 1); } // la 404 fija <base href="/">

function actualizar(f, check) {
  const full = path.join(ROOT, f);
  const s = fs.readFileSync(full, 'utf8');
  const rel = relDe(f);
  const nuevo = bloque(rel);
  let out;
  const a = s.indexOf(INICIO); const b = s.indexOf(FIN);
  if (a !== -1 && b !== -1) out = s.slice(0, a) + nuevo + s.slice(b + FIN.length);
  else {
    const dos = `<link rel="stylesheet" href="${rel}brand/tokens.css">\n<link rel="stylesheet" href="${rel}css/site.css">`;
    const uno = `<link rel="stylesheet" href="${rel}brand/tokens.css">`;
    if (s.includes(dos)) out = s.replace(dos, nuevo);
    else if (s.includes(uno)) out = s.replace(uno, nuevo);
    else return { f, estado: 'sin-hojas' };
  }
  if (out === s) return { f, estado: 'al-dia' };
  if (!check) fs.writeFileSync(full, out);
  return { f, estado: check ? 'desactualizada' : 'actualizada' };
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const res = paginas().map((f) => actualizar(f, check));
  const por = (e) => res.filter((r) => r.estado === e).map((r) => r.f);
  const kb = (cssCritico('').length / 1024).toFixed(1);
  console.log(`CSS crítico: ${kb} KB por página (tokens.css completo + reglas de primera pantalla de site.css)`);
  for (const e of ['actualizada', 'al-dia', 'desactualizada', 'sin-hojas']) if (por(e).length) console.log(`  ${e}: ${por(e).length}${e === 'al-dia' ? '' : ' → ' + por(e).join(', ')}`);
  if (por('sin-hojas').length || (check && por('desactualizada').length)) process.exit(1);
}

module.exports = { bloque, cssCritico, PRIMERA_PANTALLA };
