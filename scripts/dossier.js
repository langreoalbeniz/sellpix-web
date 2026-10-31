/*
 * Dossier comercial: dossier/dossier.md + data/servicios.json + dossier/plantilla.html → HTML → PDF (Playwright).
 *
 * Uso:
 *   npm run dossier                       (= node scripts/dossier.js) genera descargas/sellpix-dossier.pdf
 *   node scripts/dossier.js --check       falla si el PDF publicado no corresponde al .md, los datos y la plantilla
 *                                         actuales (compara con dossier/huella.json; no necesita navegador)
 *
 * La primera vez: npm install (instala Playwright; usa el Chrome del sistema, sin descargar navegadores).
 * Las marcas del .md están documentadas al principio de dossier/dossier.md.
 * No se publica: _config.yml excluye dossier/, data/ y scripts/. Solo se publica el PDF de descargas/.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { valor, ficha, euros } = require('./precios.js');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'dossier');
const PDF = path.join(ROOT, 'descargas/sellpix-dossier.pdf');
const HUELLA = path.join(DIR, 'huella.json');

/* ── Texto en línea: datos, escape, enlaces y negrita ─────────────────────────────── */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inl(t) {
  t = t.replace(/\{\{([^}]+)\}\}/g, (m, ruta) => valor(ruta.trim()));
  t = esc(t);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return t;
}
const arriba = (n) => (n ? ` style="margin-top: var(--space-${n});"` : '');
function imagen(linea) {
  const m = linea.match(/!\[([^\]]*)\]\(([^)\s]+)\s+"(\d+)×(\d+)"\)/);
  if (!m) throw new Error(`imagen mal escrita: ${linea}`);
  return { alt: esc(m[1]), src: m[2], w: m[3], h: m[4] };
}
const img = (i, extra = '') => `<img src="${i.src}" alt="${i.alt}" width="${i.w}" height="${i.h}"${extra}>`;
function escalera() {
  let out = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
    const h = c + 1; const lleno = r >= 6 - h; const cima = r === 6 - h && c === 5;
    out += `<span class="${!lleno ? 'hid' : cima ? 'on' : ''}"></span>`;
  }
  return `<div class="stair" aria-hidden="true">${out}</div>`;
}

/* ── Bloques de datos ─────────────────────────────────────────────────────────────── */
function paquetes(ids) {
  const cards = ids.map((id) => {
    const f = ficha(id); const d = f.dossier;
    const plazo = d.mostrarAlcance === false ? `Entrega en ${f.dias} días hábiles` : `${valor(`${id}.alcance|mayuscula`)} · entrega en ${f.dias} días hábiles`;
    return `    <div class="card">
      <span class="tag${d.destacado ? ' tag--lime' : ''}">${esc(d.etiqueta)}</span>
      <p class="price">${euros(f.precio)}<small>IVA incluido</small></p>
      <p class="small muted">${esc(plazo)}</p>
      <ul class="check small" style="margin-top: var(--space-3);">
${d.incluye.map((x) => `        <li>${esc(x)}</li>`).join('\n')}
      </ul>
    </div>`;
  });
  return `  <div class="grid-3">\n${cards.join('\n')}\n  </div>`;
}
function mantenimientos(ids) {
  const cards = ids.map((id) => {
    const f = ficha(id); const d = f.dossier;
    return `    <div class="card">
      <span class="tag">${esc(d.etiqueta)}</span>
      <p class="price">${euros(f.precio)}<small>/${f.unidad}</small></p>
      <p class="small">${esc(d.resumen)}</p>
    </div>`;
  });
  return `  <div class="plans">\n${cards.join('\n')}\n  </div>`;
}

/* ── Páginas ──────────────────────────────────────────────────────────────────────── */
const CLASE = { portada: 'page page--inverse', cierre: 'page page--inverse', normal: 'page', alterna: 'page page--alt' };
/* Cuerpo HTML (lista de bloques) a partir de las líneas del .md */
function bloques(lineas, tipo, num) {
  const out = [];
  let lista = null;
  const cerrarLista = () => { if (lista) { out.push(`<ul class="check">\n${lista.map((x) => `  <li>${x}</li>`).join('\n')}\n</ul>`); lista = null; } };
  for (let i = 0; i < lineas.length; i++) {
    let l = lineas[i];
    if (!l.trim()) continue;
    if (l.startsWith('- ')) { (lista = lista || []).push(inl(l.slice(2))); continue; }
    cerrarLista();
    let m;
    if ((m = l.match(/^:::([a-zá-ú-]+)(?:\^(\d+))?$/))) {
      const [, bloque, sep] = m;
      const cuerpo = []; let prof = 1;
      for (i++; i < lineas.length; i++) {
        if (/^:::(columnas|tarjeta|tarjetas|pasos|tabla|fotos|capturas|preguntas|pie-portada|pie-cierre)\b/.test(lineas[i])) prof++;
        if (lineas[i] === ':::fin' && --prof === 0) break;
        cuerpo.push(lineas[i]);
      }
      out.push(bloqueHTML(bloque, sep, cuerpo, tipo, num));
      continue;
    }
    if (l === '[logo]') { out.push('<img class="logo" src="../brand/logos/svg/sellpix-lockup-reversed.svg" alt="SellPix">'); continue; }
    if (l === '[espacio]') { out.push('<div class="spacer"></div>'); continue; }
    if ((m = l.match(/^\[\[(paquetes|mantenimientos):\s*([^\]]+)\]\]$/))) { const ids = m[2].split(',').map((x) => x.trim()); out.push(m[1] === 'paquetes' ? paquetes(ids) : mantenimientos(ids)); continue; }
    if ((m = l.match(/^\[foto panorámica\]\s+(.*)$/))) { const im = imagen(m[1]); out.push(`<div class="shot" style="margin-bottom: var(--space-5);">${img(im, ' style="aspect-ratio: 16 / 7; object-fit: cover;"')}</div>`); continue; }
    if ((m = l.match(/^\[(antetítulo|entradilla|nota|cita)\](?:\^(\d+))?\s+(.*)$/))) {
      const cls = { antetítulo: 'eyebrow', entradilla: 'lead', nota: 'small muted', cita: 'quote' }[m[1]];
      out.push(`<p class="${cls}"${arriba(m[2])}>${inl(m[3])}</p>`); continue;
    }
    if ((m = l.match(/^(#{1,3})\s+(.*)$/))) {
      let t = m[2]; const partes = [];
      while (t.endsWith(' \\')) { partes.push(inl(t.slice(0, -2))); t = lineas[++i]; }
      partes.push(inl(t));
      out.push(`<h${m[1].length}>${partes.join('<br>')}</h${m[1].length}>`); continue;
    }
    out.push(`<p>${inl(l)}</p>`);
  }
  cerrarLista();
  return out;
}
function pagina(tipo, num, lineas) {
  const out = bloques(lineas, tipo, num);
  const pie = CLASE[tipo].includes('inverse')
    ? `<div class="footer"><span>Engineered to sell.</span><span>${num}</span></div>`
    : `<div class="footer"><span><span class="pixel"></span>SellPix · sellpix.es</span><span>${num}</span></div>`;
  return `<!-- ${num} -->\n<section class="${CLASE[tipo]}">\n${out.map((x) => '  ' + x.replace(/\n/g, '\n  ')).join('\n')}\n  ${pie}\n</section>`;
}

function columnas(cuerpo, tipo, num) {
  const cols = [[]];
  let prof = 0;
  for (const l of cuerpo) {
    if (/^:::(columnas|tarjeta|tarjetas|pasos|tabla|fotos|capturas|preguntas)\b/.test(l)) prof++;
    if (l === ':::fin') prof--;
    if (l === ':::otra' && prof === 0) { cols.push([]); continue; }
    cols[cols.length - 1].push(l);
  }
  return cols.map((c) => interior(c, tipo, num));
}
/* Contenido de una columna o tarjeta: mismas marcas que la página, sin pie */
function interior(lineas, tipo, num) {
  return bloques(lineas, tipo, num).join('\n');
}
function pares(cuerpo) {
  const out = []; let actual = null;
  for (const l of cuerpo) { if (!l.trim()) continue; if (l.startsWith('### ')) { actual = { t: inl(l.slice(4)), p: [] }; out.push(actual); } else actual.p.push(inl(l)); }
  return out;
}
const sangrar = (s, n = 2) => s.split('\n').map((x) => ' '.repeat(n) + x).join('\n');

function bloqueHTML(bloque, sep, cuerpo, tipo, num) {
  switch (bloque) {
    case 'columnas': return `<div class="grid-2"${arriba(sep)}>\n${columnas(cuerpo, tipo, num).map((c) => `  <div>\n${sangrar(c, 4)}\n  </div>`).join('\n')}\n</div>`;
    case 'tarjeta': return `<div class="card">\n${sangrar(interior(cuerpo, tipo, num))}\n</div>`;
    case 'tarjetas': return `<div class="grid-2"${arriba(sep)}>\n${pares(cuerpo).map((x) => `  <div class="card"><h3>${x.t}</h3><p>${x.p.join(' ')}</p></div>`).join('\n')}\n</div>`;
    case 'pasos': return `<ol class="steps">\n${cuerpo.filter((l) => l.trim()).map((l) => { const m = l.match(/^(\d+)\.\s+([^|]+?)\s+\|\s+(.*)$/); return `  <li><span class="n">${m[1]}</span><h3>${inl(m[2])}</h3><p class="small muted">${inl(m[3])}</p></li>`; }).join('\n')}\n</ol>`;
    case 'tabla': {
      const filas = cuerpo.filter((l) => l.trim()).map((l) => l.split(' | ').map((c) => inl(c.trim())));
      const [cab, ...resto] = filas;
      const thS = ['text-align:left; padding: 6px 8px 6px 0;', 'text-align:left; padding: 6px 8px;', 'text-align:left; padding: 6px 0 6px 8px;'].map((s) => `${s} border-bottom: 1px solid var(--color-line-strong);`);
      const tdPad = ['padding: 8px 8px 8px 0;', 'padding: 8px;', 'padding: 8px 0 8px 8px;'];
      const thead = `  <thead><tr>${cab.map((c, k) => `<th style="${thS[k]}">${c}</th>`).join('')}</tr></thead>`;
      const tbody = resto.map((f, r) => `    <tr>${f.map((c, k) => `<td style="${tdPad[k]}${r < resto.length - 1 ? ' border-bottom: 1px solid var(--color-line);' : ''} vertical-align: top;">${c}</td>`).join('')}</tr>`).join('\n');
      return `<table class="legal-table" style="width:100%; border-collapse: collapse; margin-top: var(--space-4); font-size: 9.5pt; line-height: 1.4;">\n${thead}\n  <tbody>\n${tbody}\n  </tbody>\n</table>`;
    }
    case 'fotos': return `<div class="grid-2"${arriba(sep)}>\n${cuerpo.filter((l) => l.trim()).map((l) => `  <div class="shot">${img(imagen(l))}</div>`).join('\n')}\n</div>`;
    case 'capturas': return `<div class="shots">\n${cuerpo.filter((l) => l.trim()).map((l) => `  <div class="shot">${img(imagen(l))}</div>`).join('\n')}\n</div>`;
    case 'preguntas': return `<div class="faq grid-2"${arriba(sep)}>\n${columnas(cuerpo, tipo, num).map((c, k, all) => `  <div>\n${pares(cuerpo.slice(...rango(cuerpo, k))).map((x) => `    <h3>${x.t}</h3>\n    <p>${x.p.join(' ')}</p>`).join('\n')}\n  </div>`).join('\n')}\n</div>`;
    case 'pie-portada': return `<div class="cover-bottom">\n  <div>\n    <p class="small" style="margin:0;">${cuerpo.filter((l) => l.trim()).map(inl).join('<br>')}</p>\n  </div>\n  ${escalera()}\n</div>`;
    case 'pie-cierre': return `<div class="cover-bottom">\n  <dl class="data">\n${cuerpo.filter((l) => l.trim()).map((l) => { const k = l.indexOf(': '); return `    <dt>${inl(l.slice(0, k))}</dt><dd>${inl(l.slice(k + 2))}</dd>`; }).join('\n')}\n  </dl>\n  ${escalera()}\n</div>`;
    default: throw new Error(`bloque desconocido: :::${bloque}`);
  }
}
/* Líneas de la columna k de un bloque con :::otra (para :::preguntas) */
function rango(cuerpo, k) { const cortes = [-1, ...cuerpo.map((l, i) => (l === ':::otra' ? i : -2)).filter((i) => i >= 0), cuerpo.length]; return [cortes[k] + 1, cortes[k + 1]]; }

function html() {
  const md = fs.readFileSync(path.join(DIR, 'dossier.md'), 'utf8').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
  const trozos = md.split(/^=== Página (\d+) · (portada|normal|alterna|cierre) ===$/m);
  const paginas = [];
  for (let i = 1; i < trozos.length; i += 3) paginas.push(pagina(trozos[i + 1], Number(trozos[i]), trozos[i + 2].split('\n')));
  const plantilla = fs.readFileSync(path.join(DIR, 'plantilla.html'), 'utf8');
  return plantilla.replace('{{PAGINAS}}', paginas.join('\n\n'));
}

/* ── Huella: qué entradas produjeron el PDF publicado ─────────────────────────────── */
function entradas() {
  const md = fs.readFileSync(path.join(DIR, 'dossier.md'), 'utf8');
  const imgs = [...md.matchAll(/\]\(([^)\s]+\.(?:png|jpg|webp))\s/g)].map((m) => path.join(DIR, m[1]));
  const fuentes = fs.readdirSync(path.join(ROOT, 'brand/fonts')).filter((f) => f.endsWith('.woff2')).map((f) => path.join(ROOT, 'brand/fonts', f));
  return [path.join(DIR, 'dossier.md'), path.join(DIR, 'plantilla.html'), path.join(ROOT, 'data/servicios.json'), path.join(ROOT, 'brand/tokens.css'),
    path.join(ROOT, 'brand/logos/svg/sellpix-lockup-reversed.svg'), path.join(ROOT, 'scripts/dossier.js'), ...imgs, ...fuentes];
}
function huellaEntrada() {
  const h = crypto.createHash('sha256');
  for (const f of entradas()) {
    let buf = fs.readFileSync(f);
    if (/\.(md|html|json|css|js|svg)$/.test(f)) buf = Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'));
    h.update(path.relative(ROOT, f).replace(/\\/g, '/')).update('\0').update(buf).update('\0');
  }
  return h.digest('hex');
}
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const etiquetaMB = (bytes) => (Math.round((bytes / 1048576) * 10) / 10).toFixed(1).replace('.', ',');

function comprobar() {
  const problemas = [];
  const h = fs.existsSync(HUELLA) ? JSON.parse(fs.readFileSync(HUELLA, 'utf8')) : null;
  if (!h) problemas.push('falta dossier/huella.json: ejecuta npm run dossier');
  else {
    if (h.entrada !== huellaEntrada()) problemas.push('el .md, los datos, la plantilla o las imágenes han cambiado desde el último PDF: ejecuta npm run dossier');
    if (h.pdf !== sha(PDF)) problemas.push('descargas/sellpix-dossier.pdf no es el que generó npm run dossier');
  }
  const servicios = fs.readFileSync(path.join(ROOT, 'servicios/index.html'), 'utf8');
  const m = servicios.match(/Descargar dossier \(PDF, ([\d,]+) MB\)/);
  const real = etiquetaMB(fs.statSync(PDF).size);
  if (!m) problemas.push('no encuentro el botón «Descargar dossier (PDF, … MB)» en servicios/index.html');
  else if (m[1] !== real) problemas.push(`el botón de Servicios dice ${m[1]} MB y el PDF pesa ${real} MB`);
  return problemas;
}

async function generar() {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.error('Falta Playwright: ejecuta npm install y vuelve a probar.'); process.exit(1); }
  const salidaHtml = path.join(DIR, 'dossier.html');
  fs.writeFileSync(salidaHtml, html());
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1000, height: 1400 }, deviceScaleFactor: 2 });
  const fallos = [];
  p.on('requestfailed', (r) => fallos.push(r.url()));
  await p.goto('file:///' + salidaHtml.replace(/\\/g, '/'), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.emulateMedia({ media: 'print' });
  const info = await p.evaluate(() => ({ n: document.querySelectorAll('section.page').length, desborda: [...document.querySelectorAll('section.page')].map((pg, i) => ({ pagina: i + 1, px: pg.scrollHeight - pg.clientHeight })).filter((x) => x.px > 0) }));
  if (fallos.length || info.n !== 8 || info.desborda.length) { console.error('No se genera el PDF:', JSON.stringify({ fallos, paginas: info.n, desborda: info.desborda })); await b.close(); process.exit(1); }
  await p.pdf({ path: PDF, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await b.close();
  fs.writeFileSync(HUELLA, JSON.stringify({ _nota: 'La escribe scripts/dossier.js al generar el PDF. El flujo de calidad comprueba con --check que el PDF corresponde a estas entradas.', entrada: huellaEntrada(), pdf: sha(PDF), bytes: fs.statSync(PDF).size }, null, 2) + '\n');
  console.log(`dossier: ${info.n} páginas, sin desbordes → descargas/sellpix-dossier.pdf (${fs.statSync(PDF).size} bytes, ${etiquetaMB(fs.statSync(PDF).size)} MB)`);
  const p2 = comprobar(); if (p2.length) { p2.forEach((x) => console.log('  aviso: ' + x)); }
}

if (require.main === module) {
  if (process.argv.includes('--check')) {
    const problemas = comprobar();
    if (problemas.length) { problemas.forEach((x) => console.log('  ' + x)); process.exit(1); }
    console.log('dossier: el PDF publicado corresponde a dossier/dossier.md, data/servicios.json y la plantilla');
  } else if (process.argv.includes('--html')) {
    fs.writeFileSync(path.join(DIR, 'dossier.html'), html()); console.log('dossier: dossier/dossier.html escrito');
  } else generar();
}
module.exports = { html };
