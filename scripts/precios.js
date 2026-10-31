/*
 * Precios de la web desde data/servicios.json (fuente única, también para el dossier).
 *
 * Uso:
 *   node scripts/precios.js           rellena en todas las páginas los elementos marcados con data-dato
 *   node scripts/precios.js --check   falla (código 1) si algún dato no coincide con data/servicios.json o si
 *                                     la web publica un importe o un enlace de Stripe que no está en él
 *
 * Marcas en el HTML (solo en elementos sin hijos):
 *   <span data-dato="web-corporativa.precio">449 €</span>          → texto del elemento
 *   <a data-dato-href="landing.stripe" href="…">                    → atributo href
 *   data-dato="web-corporativa.alcance|mayuscula"                   → primera letra en mayúscula
 *
 * Campos: precio («449 €»), precio-mes («29 €/mes»), base e iva («40,50 €»), dias («10»), plazo («10 días hábiles»),
 * alcance, nombre, url, tally, stripe. Los identificadores son las claves de «servicios» y «extras».
 *
 * Los textos libres (preguntas frecuentes, guías, meta descriptions, JSON-LD, llms.txt) no se reescriben: el --check
 * comprueba que cada importe en euros que aparece en lo publicado existe en data/servicios.json, así que si cambia un
 * precio señala todos los textos que hay que revisar a mano.
 *
 * No se publica: _config.yml excluye scripts/ y data/.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DATOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/servicios.json'), 'utf8'));

const euros = (n) => {
  const [ent, dec] = Number(n).toFixed(Number.isInteger(n) ? 0 : 2).split('.');
  return ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (dec ? ',' + dec : '') + ' €';
};
function ficha(id) {
  const f = DATOS.servicios[id] || DATOS.extras[id];
  if (!f) throw new Error(`data/servicios.json no tiene «${id}»`);
  return f;
}
/* Valor formateado de «id.campo[|filtro]» */
function valor(ruta) {
  const [base, filtro] = ruta.split('|');
  const i = base.indexOf('.');
  const id = base.slice(0, i); const campo = base.slice(i + 1);
  const f = ficha(id);
  let v;
  switch (campo) {
    case 'precio': v = f.precio == null ? f.texto : euros(f.precio); break;
    case 'precio-mes': v = `${euros(f.precio)}/${f.unidad}`; break;
    case 'base': case 'iva': if (f[campo] == null) throw new Error(`«${id}» no tiene ${campo}`); v = euros(f[campo]); break;
    case 'dias': v = String(f.dias); break;
    case 'plazo': v = `${f.dias} días hábiles`; break;
    default: if (f[campo] == null) throw new Error(`«${id}» no tiene «${campo}»`); v = String(f[campo]);
  }
  if (filtro === 'mayuscula') v = v.charAt(0).toUpperCase() + v.slice(1);
  else if (filtro) throw new Error(`filtro desconocido: ${filtro}`);
  return v;
}

/* Importes válidos para el --check */
function importesValidos() {
  const set = new Set();
  for (const f of [...Object.values(DATOS.servicios), ...Object.values(DATOS.extras)]) for (const k of ['precio', 'base', 'iva']) if (typeof f[k] === 'number') set.add(euros(f[k]).replace(' €', ''));
  return set;
}
const stripeValidos = () => new Set(Object.values(DATOS.servicios).map((s) => s.stripe));

const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function procesar(html) {
  const errores = [];
  let out = html.replace(/<([a-z][a-z0-9]*)(\s[^>]*?)?\sdata-dato="([^"]+)"([^>]*)>([^<]*)<\/\1>/g, (m, tag, a1 = '', ruta, a2, texto) => {
    let v; try { v = escapar(valor(ruta)); } catch (e) { errores.push(e.message); return m; }
    return `<${tag}${a1} data-dato="${ruta}"${a2}>${v}</${tag}>`;
  });
  out = out.replace(/<a\b[^>]*\sdata-dato-href="([^"]+)"[^>]*>/g, (tag, ruta) => {
    let v; try { v = valor(ruta); } catch (e) { errores.push(e.message); return tag; }
    return tag.replace(/\shref="[^"]*"/, ` href="${v}"`);
  });
  return { out, errores };
}

function publicados() {
  return execSync('git ls-files --cached --others --exclude-standard -- "*.html" llms.txt ":!dossier"', { cwd: ROOT, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const validos = importesValidos(); const stripe = stripeValidos();
  let cambiadas = 0; let marcas = 0; const problemas = [];
  for (const f of publicados()) {
    const full = path.join(ROOT, f);
    const html = fs.readFileSync(full, 'utf8');
    marcas += (html.match(/\sdata-dato(-href)?="/g) || []).length;
    const { out, errores } = procesar(html);
    errores.forEach((e) => problemas.push(`${f}: ${e}`));
    if (out !== html) { cambiadas++; if (check) problemas.push(`${f}: hay datos que no coinciden con data/servicios.json (ejecuta node scripts/precios.js)`); else fs.writeFileSync(full, out); }
    const texto = html.replace(/<style id="css-critico">[\s\S]*?<\/style>/, '');
    for (const m of texto.matchAll(/(\d{1,3}(?:\.\d{3})*(?:,\d{2})?) ?€/g)) if (!validos.has(m[1])) problemas.push(`${f}: importe «${m[0]}» que no está en data/servicios.json`);
    for (const m of texto.matchAll(/"price":\s*"?(\d+(?:\.\d+)?)"?/g)) if (!validos.has(m[1].replace('.', ','))) problemas.push(`${f}: precio de datos estructurados ${m[1]} que no está en data/servicios.json`);
    for (const m of texto.matchAll(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/g)) if (!stripe.has(m[0])) problemas.push(`${f}: enlace de Stripe ${m[0]} que no está en data/servicios.json`);
  }
  console.log(`precios: ${marcas} marcas data-dato en las páginas · ${check ? 'desactualizadas' : 'actualizadas'}: ${cambiadas}`);
  if (problemas.length) { problemas.forEach((p) => console.log('  ' + p)); process.exit(1); }
}

module.exports = { DATOS, valor, euros, ficha };
