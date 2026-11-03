#!/usr/bin/env node
/* Comprobación de enlaces de la web, sin abrir nunca Stripe ni Tally.
 *
 *   node scripts/enlaces.js                         Sin red: enlaces internos (el archivo existe y se publica, y el ancla existe)
 *                                                  y enlaces de pago/formulario contra data/servicios.json.
 *   node scripts/enlaces.js --base=http://localhost:8080
 *                                                  Además pide cada recurso interno al servidor local y exige 200.
 *   node scripts/enlaces.js --externos             Además comprueba con una petición HEAD/GET los demás enlaces externos.
 *
 * Por qué no se abren buy.stripe.com ni tally.so: cada apertura de un enlace de pago crea una sesión de Checkout y cada
 * visita a un formulario cuenta en la analítica de Tally. Estos enlaces solo se validan por su texto (href), comparándolo
 * con data/servicios.json. Toda petición de red pasa por peticion(), que se niega a tocar Stripe o Tally.
 *
 * Lo que valida sobre los enlaces de pago y de formulario:
 *  - Ningún enlace de Stripe fuera de confirmar/, y cada confirmar/<servicio>/ lleva solo el de su servicio.
 *  - Todos los enlaces de Stripe publicados están en data/servicios.json.
 *  - Los formularios de Tally (tally.so/r/ID, tally.so/embed/ID, data-contratar-form) son los de servicios.json o el de contacto,
 *    y cada página de producto solo lleva los de sus servicios, con su página data-contratar-confirmar correcta.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'servicios.json'), 'utf8'));
const SITIO = 'https://sellpix.es';
const FORMULARIO_CONTACTO = 'aOOWGy'; // contacto/ (no es un servicio, así que no está en servicios.json)

const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith('--base=')) || '').slice(7).replace(/\/$/, '');
const EXTERNOS = args.includes('--externos');

/* ---------- Exclusión de servicios cuyo uso ensucia datos o crea sesiones ---------- */
const EXCLUIDOS = [/(^|\.)stripe\.com$/i, /(^|\.)tally\.so$/i];
const esExcluido = (host) => EXCLUIDOS.some((r) => r.test(host));

async function peticion(url, opciones) {
  const host = new URL(url).hostname;
  if (esExcluido(host)) throw new Error('Petición a ' + host + ' bloqueada por diseño (Stripe y Tally no se abren)');
  return fetch(url, opciones);
}

/* ---------- Utilidades ---------- */
const errores = [];
const avisos = [];
const error = (f, m) => { const e = f + ': ' + m; if (!errores.includes(e)) errores.push(e); };

function git(cmd) { return execSync('git ' + cmd, { cwd: ROOT, encoding: 'utf8' }); }
const archivos = new Set(git('ls-files --cached --others --exclude-standard').split(/\r?\n/).filter(Boolean));
const paginas = [...archivos].filter((f) => f.endsWith('.html') && !f.startsWith('dossier/')).sort();

// Lo que GitHub Pages no publica (_config.yml, «exclude»): comparamos por nombre, carpeta o extensión.
const excluidos = (() => {
  const t = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8');
  return [...t.matchAll(/^\s*-\s*"?([^"#\n]+?)"?\s*(?:#.*)?$/gm)].map((m) => m[1].trim()).filter(Boolean);
})();
function sePublica(rel) {
  for (const e of excluidos) {
    if (e.startsWith('**/*.')) { if (rel.endsWith(e.slice(4))) return false; continue; }
    if (e.startsWith('*.')) { if (rel.endsWith(e.slice(1))) return false; continue; }
    if (rel === e || rel.startsWith(e.replace(/\/$/, '') + '/')) return false;
  }
  return true;
}

const leer = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sinCodigo = (t) => t.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');

function referencias(html) {
  const limpio = sinCodigo(html);
  const refs = [];
  for (const m of limpio.matchAll(/<(?!base\b)[a-z][^>]*?\s(?:href|src|poster|data-contratar-confirmar)\s*=\s*"([^"]*)"/gi)) refs.push(m[1]);
  for (const m of limpio.matchAll(/\b(?:srcset|imagesrcset)\s*=\s*"([^"]*)"/gi)) {
    if (/^\s*data:/i.test(m[1])) continue;
    for (const parte of m[1].split(',')) { const u = parte.trim().split(/\s+/)[0]; if (u) refs.push(u); }
  }
  return refs.map((r) => r.replace(/&amp;/g, '&').trim()).filter(Boolean);
}

const ignorar = (r) => /^(#|mailto:|tel:|javascript:|data:|blob:)/i.test(r);

function aRuta(urlAbs) {
  // Ruta de archivo publicada para una URL de sellpix.es.
  const u = new URL(urlAbs);
  let p = decodeURIComponent(u.pathname).replace(/^\/+/, '');
  if (p === '' || p.endsWith('/')) p += 'index.html';
  else if (!archivos.has(p) && archivos.has(p + '/index.html')) p += '/index.html';
  return { ruta: p, ancla: u.hash.replace(/^#/, ''), consulta: u.search };
}

/* ---------- Enlaces internos y externos ---------- */
const internos = new Map(); // ruta -> páginas que la enlazan
const externos = new Map(); // url -> páginas
const idsPorPagina = new Map();
const idsDe = (ruta) => {
  if (!idsPorPagina.has(ruta)) {
    const t = leer(ruta);
    idsPorPagina.set(ruta, new Set([...t.matchAll(/\b(?:id|name)\s*=\s*"([^"]+)"/g)].map((m) => m[1])));
  }
  return idsPorPagina.get(ruta);
};

for (const f of paginas) {
  const html = leer(f);
  // 404.html fija su raíz con <base href="/">; el resto resuelve relativo a su carpeta.
  const dir = path.posix.dirname(f);
  const baseDir = f === '404.html' || dir === '.' ? SITIO + '/' : SITIO + '/' + dir + '/';
  for (const r of referencias(html)) {
    if (ignorar(r)) continue;
    let abs;
    try { abs = new URL(r, baseDir); } catch { error(f, 'enlace mal formado: ' + r); continue; }
    if (!/^https?:$/.test(abs.protocol)) continue;
    if (abs.hostname === 'sellpix.es' || abs.hostname === 'www.sellpix.es') {
      const { ruta, ancla } = aRuta(SITIO + abs.pathname + abs.search + abs.hash);
      if (!archivos.has(ruta)) { error(f, 'enlace interno roto: ' + r + ' → ' + ruta + ' no existe'); continue; }
      if (!sePublica(ruta)) { error(f, 'enlace a ' + ruta + ', que _config.yml excluye de GitHub Pages'); continue; }
      if (ancla && ruta.endsWith('.html') && !idsDe(ruta).has(ancla)) error(f, 'el ancla #' + ancla + ' no existe en ' + ruta + ' (enlace: ' + r + ')');
      if (!internos.has(ruta)) internos.set(ruta, new Set());
      internos.get(ruta).add(f);
    } else {
      const u = abs.origin + abs.pathname + abs.search;
      if (!externos.has(u)) externos.set(u, new Set());
      externos.get(u).add(f);
    }
  }
}

/* ---------- Enlaces de pago y de formulario contra servicios.json (sin red) ---------- */
const servicios = DATOS.servicios;
const stripeDe = new Map(Object.entries(servicios).map(([k, s]) => [s.stripe, k]));
const tallyDe = new Map(Object.entries(servicios).map(([k, s]) => [s.tally, k]));
for (const [k, e] of Object.entries(DATOS.extras || {})) if (e.stripe) stripeDe.set(e.stripe, 'extra:' + k);
const ultimo = (url) => new URL(url).pathname.split('/').filter(Boolean).pop();
// Página de producto y de confirmar/ de cada servicio (WooCommerce comparte página de producto con WordPress).
const paginaProducto = (k) => 'servicios/' + ultimo(servicios[k].url) + '/index.html';
const paginaConfirmar = (k) => 'confirmar/' + (k === 'mantenimiento-woocommerce' ? k : ultimo(servicios[k].url)) + '/index.html';

for (const f of paginas) {
  const t = leer(f);
  const scripts = t; // los enlaces de pago o de formulario también se buscan dentro de scripts y JSON-LD
  const stripes = [...new Set([...scripts.matchAll(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/g)].map((m) => m[0]))];
  for (const s of stripes) {
    const k = stripeDe.get(s);
    if (!k) { error(f, 'enlace de Stripe ' + s + ' que no está en data/servicios.json'); continue; }
    if (!f.startsWith('confirmar/')) { error(f, 'enlace de Stripe fuera de confirmar/ (' + s + ')'); continue; }
    if (k.startsWith('extra:') || paginaConfirmar(k) !== f) error(f, 'lleva el enlace de Stripe de «' + k + '», que corresponde a ' + (k.startsWith('extra:') ? 'un extra' : paginaConfirmar(k)));
  }
  if (f.startsWith('confirmar/') && f !== 'confirmar/index.html') {
    const esperado = Object.keys(servicios).find((k) => paginaConfirmar(k) === f);
    if (esperado && !stripes.includes(servicios[esperado].stripe)) error(f, 'falta el enlace de Stripe de «' + esperado + '» de data/servicios.json');
  }

  const ids = new Set();
  for (const m of t.matchAll(/tally\.so\/(?:r|embed|popup)\/([A-Za-z0-9]+)/g)) ids.add(m[1]);
  for (const m of t.matchAll(/data-contratar-form="([^"]+)"/g)) ids.add(m[1]);
  for (const id of ids) {
    if (id !== FORMULARIO_CONTACTO && !tallyDe.has(id)) error(f, 'formulario de Tally ' + id + ' que no está en data/servicios.json');
    if (id === FORMULARIO_CONTACTO && f !== 'contacto/index.html') error(f, 'el formulario de contacto (' + id + ') solo va en contacto/');
    const k = tallyDe.get(id);
    if (k && !paginas.includes(paginaProducto(k))) error(f, 'la página de producto de «' + k + '» no existe');
    if (k && f !== paginaProducto(k)) error(f, 'formulario de Tally de «' + k + '» (' + id + ') fuera de su página ' + paginaProducto(k));
  }
  // Cada botón de contratar apunta a su formulario y a su página de confirmación.
  for (const m of t.matchAll(/<a\b[^>]*data-contratar-form="([^"]+)"[^>]*>/g)) {
    const etiqueta = m[0];
    const id = m[1];
    const k = tallyDe.get(id);
    const href = (etiqueta.match(/\bhref="([^"]*)"/) || [])[1];
    const conf = (etiqueta.match(/data-contratar-confirmar="([^"]*)"/) || [])[1];
    if (k && href !== 'https://tally.so/r/' + id) error(f, 'el botón de «' + k + '» enlaza a ' + href + ' y debería enlazar a https://tally.so/r/' + id);
    if (k && conf) {
      const destino = path.posix.normalize(path.posix.join(path.posix.dirname(f), conf)).replace(/\/$/, '') + '/index.html';
      if (destino !== paginaConfirmar(k)) error(f, 'el botón de «' + k + '» confirma en ' + conf + ' (→ ' + destino + ') y debería ir a ' + paginaConfirmar(k));
    }
    if (k && !conf) error(f, 'el botón de «' + k + '» no tiene data-contratar-confirmar');
  }
}

/* ---------- Comprobación por HTTP (opcional) ---------- */
async function porHttp() {
  let hechos = 0;
  const lista = [...internos.keys()].sort();
  const cola = lista.slice();
  async function trabajador() {
    while (cola.length) {
      const ruta = cola.shift();
      const url = BASE + '/' + ruta.replace(/(^|\/)index\.html$/, '$1');
      try {
        let r = await peticion(url, { method: 'HEAD', redirect: 'follow' });
        if (r.status === 405 || r.status === 501) { r = await peticion(url, { redirect: 'follow' }); if (r.body) await r.body.cancel(); }
        if (r.status !== 200) error(ruta, 'responde ' + r.status + ' en ' + url + ' (la enlazan ' + [...internos.get(ruta)].slice(0, 3).join(', ') + ')');
      } catch (e) { error(ruta, 'no se pudo pedir ' + url + ': ' + e.message); }
      hechos++;
    }
  }
  await Promise.all(Array.from({ length: 8 }, trabajador));
  return hechos;
}

async function verExternos() {
  let hechos = 0;
  const cola = [...externos.keys()].filter((u) => !esExcluido(new URL(u).hostname));
  const saltados = externos.size - cola.length;
  async function trabajador() {
    while (cola.length) {
      const u = cola.shift();
      try {
        let r = await peticion(u, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
        if (r.status === 405 || r.status === 403) { r = await peticion(u, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(15000) }); if (r.body) await r.body.cancel(); }
        if (r.status >= 400) {
          const donde = [...externos.get(u)].slice(0, 2).join(', ');
          if (r.status === 403 || r.status === 429 || r.status === 999) avisos.push('externo ' + u + ' responde ' + r.status + ' (puede ser un bloqueo a robots; en ' + donde + ')');
          else error(donde, 'enlace externo roto: ' + u + ' → ' + r.status);
        }
      } catch (e) { avisos.push('externo ' + u + ': ' + e.message); }
      hechos++;
    }
  }
  await Promise.all(Array.from({ length: 6 }, trabajador));
  return { hechos, saltados };
}

(async () => {
  let http = null; let ext = null;
  if (BASE) http = await porHttp();
  if (EXTERNOS) ext = await verExternos();

  const bloqueados = [...externos.keys()].filter((u) => esExcluido(new URL(u).hostname)).length;
  console.log('Enlaces: ' + paginas.length + ' páginas; ' + internos.size + ' recursos internos distintos; ' + externos.size + ' enlaces externos distintos' +
    ' (' + bloqueados + ' de Stripe/Tally, solo validados por su texto, sin abrirlos).');
  if (http !== null) console.log('  HTTP local (' + BASE + '): ' + http + ' recursos pedidos.');
  if (ext) console.log('  Externos: ' + ext.hechos + ' comprobados; ' + ext.saltados + ' de Stripe/Tally omitidos.');
  else console.log('  Externos: no se piden (usa --externos para comprobarlos).');
  for (const a of avisos) console.log('  aviso: ' + a);
  if (errores.length) {
    console.error('Enlaces: ' + errores.length + ' problema(s):');
    for (const e of errores) console.error(' - ' + e);
    process.exit(1);
  }
  console.log('Enlaces: sin problemas.');
})();
