/*
 * llms.txt desde data/servicios.json (precios, plazos y alcances) y data/llms.plantilla.txt (el resto del texto).
 *
 * Uso:
 *   node scripts/llms.js           genera llms.txt
 *   node scripts/llms.js --check   falla (código 1) si llms.txt no coincide con lo que saldría de la plantilla y los datos,
 *                                  si queda algún {{marcador}} sin resolver o si aparece creditos/, confirmar/ o gracias/
 *
 * En la plantilla, {{id.campo}} se sustituye con las mismas reglas que data-dato en scripts/precios.js
 * (precio, plazo, alcance, url…). Para cambiar un precio o un plazo se edita data/servicios.json, nunca llms.txt.
 * No se publica: _config.yml excluye scripts/ y data/.
 */
const fs = require('fs');
const path = require('path');
const { valor } = require('./precios.js');

const ROOT = path.resolve(__dirname, '..');
const PLANTILLA = path.join(ROOT, 'data/llms.plantilla.txt');
const SALIDA = path.join(ROOT, 'llms.txt');

function generar() {
  const plantilla = fs.readFileSync(PLANTILLA, 'utf8').replace(/\r\n/g, '\n');
  return plantilla.replace(/\{\{([^}]+)\}\}/g, (m, ruta) => valor(ruta.trim()));
}

if (require.main === module) {
  const esperado = generar();
  if (process.argv.includes('--check')) {
    const actual = fs.readFileSync(SALIDA, 'utf8').replace(/\r\n/g, '\n');
    const problemas = [];
    if (actual !== esperado) problemas.push('llms.txt no coincide con data/llms.plantilla.txt y data/servicios.json (ejecuta node scripts/llms.js)');
    if (/\{\{|\}\}/.test(esperado)) problemas.push('queda algún {{marcador}} sin resolver');
    for (const prohibida of ['/creditos/', '/confirmar/', '/gracias/']) if (esperado.includes(prohibida)) problemas.push(`llms.txt no debe enlazar ${prohibida}`);
    console.log(`llms: ${problemas.length ? 'con problemas' : 'al día'}`);
    if (problemas.length) { problemas.forEach((p) => console.log('  ' + p)); process.exit(1); }
  } else {
    fs.writeFileSync(SALIDA, esperado);
    console.log('llms.txt generado desde data/servicios.json y data/llms.plantilla.txt');
  }
}
