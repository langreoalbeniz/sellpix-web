/*
 * Datos del cuestionario «¿Qué web necesitas?» (que-web-necesitas/) desde data/servicios.json.
 *
 * Uso:
 *   node scripts/cuestionario.js           reescribe el JSON embebido en que-web-necesitas/index.html
 *   node scripts/cuestionario.js --check   falla si ese JSON no coincide con data/servicios.json
 *
 * La página lleva entre <!-- cuestionario-datos --> y <!-- /cuestionario-datos --> un <script type="application/json">
 * con nombre, precio, unidad, alcance, plazo y URL (relativa a la página) de los seis servicios. Las reglas del
 * cuestionario (qué respuesta lleva a qué servicio) están en js/cuestionario.js; los números, solo aquí.
 * Nada se envía a ningún sitio y no hay cookies. No se publica: _config.yml excluye scripts/ y data/.
 */
const fs = require('fs');
const path = require('path');
const { DATOS, valor } = require('./precios.js');

const ROOT = path.resolve(__dirname, '..');
const PAGINA = path.join(ROOT, 'que-web-necesitas/index.html');
const ORDEN = ['landing', 'web-corporativa', 'tienda-online-shopify', 'mantenimiento-web', 'mantenimiento-wordpress', 'mantenimiento-woocommerce'];

function datos() {
  const servicios = {};
  for (const id of ORDEN) {
    const f = DATOS.servicios[id];
    const s = { nombre: f.nombre, precio: valor(`${id}.precio`) };
    if (f.unidad) s.unidad = f.unidad;
    if (f.alcance) s.alcance = f.alcance;
    if (f.dias) s.plazo = valor(`${id}.plazo`);
    s.url = f.url.replace('https://sellpix.es/', '../');
    servicios[id] = s;
  }
  return { servicios };
}
const MARCA = /(<!-- cuestionario-datos -->)[\s\S]*?(<!-- \/cuestionario-datos -->)/;
function bloque() {
  return `<script type="application/json" id="datos-cuestionario">${JSON.stringify(datos(), null, 1).replace(/</g, '\u003c')}</script>`;
}
if (require.main === module) {
  const html = fs.readFileSync(PAGINA, 'utf8');
  if (!MARCA.test(html)) { console.log('cuestionario: la página no tiene las marcas <!-- cuestionario-datos -->'); process.exit(1); }
  const out = html.replace(MARCA, (m, a, b) => `${a}\n${bloque()}\n${b}`);
  if (process.argv.includes('--check')) {
    console.log(`cuestionario: ${out === html ? 'al día' : 'desactualizado (ejecuta node scripts/cuestionario.js)'}`);
    if (out !== html) process.exit(1);
  } else { fs.writeFileSync(PAGINA, out); console.log('cuestionario: datos actualizados en que-web-necesitas/index.html'); }
}
module.exports = { datos };
