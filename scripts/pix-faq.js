/*
 * Preguntas frecuentes del asistente Pix (lote 13B): genera js/pix-faq.data.json (publicado, minificado) desde
 * data/pix-faq.json y data/servicios.json.
 *
 * Uso:
 *   node scripts/pix-faq.js           reescribe js/pix-faq.data.json
 *   node scripts/pix-faq.js --check   falla (código 1) si:
 *     - una línea de una respuesta no aparece literalmente (normalizando espacios y comillas) en el HTML de su url;
 *     - un importe está escrito a mano en data/pix-faq.json o no coincide con data/servicios.json;
 *     - el archivo publicado contiene un enlace de Stripe o a confirmar/;
 *     - el archivo publicado no está al día.
 *
 * Regla de oro: Pix no dice nada que no esté ya publicado en la web. Por eso cada respuesta es texto literal de una
 * página y los importes se resuelven con {{id.campo}} (scripts/precios.js). No se publica: _config.yml excluye scripts/.
 */
const fs = require('fs');
const path = require('path');
const { DATOS, valor } = require('./precios.js');

const ROOT = path.resolve(__dirname, '..');
const FUENTE = path.join(ROOT, 'data/pix-faq.json');
const SALIDA = path.join(ROOT, 'js/pix-faq.data.json');

const fuente = JSON.parse(fs.readFileSync(FUENTE, 'utf8'));
const MARCA = /\{\{([^}]+)\}\}/g;
const resolver = (s) => s.replace(MARCA, (m, ruta) => valor(ruta.trim()));

/* Texto normalizado: sin etiquetas ni entidades, espacios y comillas uniformes */
function normalizar(s) {
  return s
    .replace(/&nbsp;| /g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/[«»“”"]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').replace(/\s+([.,;:!?)])/g, '$1').trim();
}
/* Las etiquetas en línea (enlaces, span de precios, negritas…) desaparecen sin dejar hueco; las de bloque dejan un espacio.
   Y nunca hay espacio antes de un signo de puntuación (un enlace seguido de punto deja «es .» al quitar la etiqueta). */
function textoDe(html) {
  return normalizar(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<\/?(a|span|strong|em|b|i|code|abbr|time|small|sup|sub|mark)[^>]*>/g, '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+([.,;:!?)])/g, '$1');
}

function generar() {
  const preguntas = fuente.preguntas.map((p) => ({ i: p.id, q: p.pregunta, r: resolver(p.respuesta), u: p.url, t: p.temas, g: p.paginas }));
  return JSON.stringify({ v: 1, generado: 'scripts/pix-faq.js', p: preguntas });
}

function comprobar() {
  const errores = [];
  const ids = new Set();
  const importes = new Set();
  for (const s of Object.values(DATOS.servicios)) ['precio', 'base', 'iva'].forEach((k) => { if (s[k] != null) importes.add(String(s[k]).replace('.', ',')); });
  for (const e of Object.values(DATOS.extras || {})) if (e && e.precio != null) importes.add(String(e.precio));
  const htmlCache = {};
  for (const p of fuente.preguntas) {
    if (ids.has(p.id)) errores.push(`id repetido: ${p.id}`); ids.add(p.id);
    if (/\d\s?€/.test(p.respuesta) || /\d\s?€/.test(p.pregunta)) errores.push(`${p.id}: importe escrito a mano; usa {{id.campo}}`);
    let r; try { r = resolver(p.respuesta); } catch (err) { errores.push(`${p.id}: ${err.message}`); continue; }
    for (const m of r.matchAll(/(\d+(?:,\d+)?)\s?€/g)) if (!importes.has(m[1])) errores.push(`${p.id}: el importe ${m[1]} € no está en data/servicios.json`);
    const pagina = p.url.replace(/#.*$/, '');
    const archivo = path.join(ROOT, pagina.endsWith('/') || pagina === '' ? pagina + 'index.html' : pagina);
    if (!fs.existsSync(archivo)) { errores.push(`${p.id}: no existe la página ${archivo}`); continue; }
    if (!htmlCache[archivo]) htmlCache[archivo] = { html: fs.readFileSync(archivo, 'utf8') };
    const h = htmlCache[archivo]; if (!h.texto) h.texto = textoDe(h.html);
    const ancla = (p.url.match(/#(.+)$/) || [])[1];
    if (ancla && !new RegExp(`id="${ancla}"`).test(h.html)) errores.push(`${p.id}: la página ${pagina} no tiene el ancla #${ancla}`);
    for (const linea of r.split('\n')) if (!h.texto.includes(normalizar(linea))) errores.push(`${p.id}: no aparece literalmente en ${pagina}: «${linea.slice(0, 70)}…»`);
    if (!p.temas || !p.temas.length) errores.push(`${p.id}: sin temas`);
    for (const t of p.temas || []) if (/[áéíóúüñÁÉÍÓÚÜÑ]/.test(t) || t !== t.toLowerCase()) errores.push(`${p.id}: el tema «${t}» lleva tildes o mayúsculas`);
  }
  const salida = generar();
  if (/buy\.stripe\.com|stripe\.com\/|confirmar\//.test(salida)) errores.push('el archivo publicado contiene un enlace de Stripe o a confirmar/');
  const actual = fs.existsSync(SALIDA) ? fs.readFileSync(SALIDA, 'utf8') : '';
  if (actual !== salida) errores.push('js/pix-faq.data.json no está al día: ejecuta npm run pix-faq');
  return errores;
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const errores = comprobar();
  if (!check) {
    fs.writeFileSync(SALIDA, generar());
    const sinActualizar = errores.filter((e) => !/no está al día/.test(e));
    console.log(`pix-faq: ${fuente.preguntas.length} preguntas → js/pix-faq.data.json (${fs.statSync(SALIDA).size} bytes)${sinActualizar.length ? '\n' + sinActualizar.join('\n') : ''}`);
    process.exit(sinActualizar.length ? 1 : 0);
  }
  if (errores.length) { console.log('pix-faq: ' + errores.length + ' problema(s)\n' + errores.join('\n')); process.exit(1); }
  console.log(`pix-faq: ${fuente.preguntas.length} preguntas, todas literales y al día`);
}
module.exports = { generar, comprobar };
