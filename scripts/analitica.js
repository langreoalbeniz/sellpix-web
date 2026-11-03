#!/usr/bin/env node
/* Analítica y formularios de Tally solo en el sitio real.
 *
 * Objetivo: que las pruebas automáticas (Playwright, Lighthouse, pa11y, CI) y cualquier host que no sea
 * sellpix.es / www.sellpix.es no ensucien la analítica de Cloudflare ni la de Tally.
 *
 *   node scripts/analitica.js           Pone en todas las páginas el fragmento canónico de Cloudflare Web Analytics
 *                                      (sustituye el anterior; no añade nada a las páginas de redirección).
 *   node scripts/analitica.js --check  Falla si alguna página publicada no lleva el fragmento canónico, si CLAUDE.md
 *                                      no lo recoge igual, o si falta el filtro en js/contratar.js o en contacto/.
 *
 * El filtro es el mismo en los tres sitios: navigator.webdriver === true o host distinto de sellpix.es / www.sellpix.es.
 * No hace ninguna petición de red.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const FILTRO = "navigator.webdriver === true || !/^(www\\.)?sellpix\\.es$/.test(location.hostname)";

const CANONICO =
  "<!-- Cloudflare Web Analytics: se carga tras el evento load para no competir con el contenido; no se carga en navegadores automatizados (navigator.webdriver) ni fuera de sellpix.es -->" +
  "<script>window.addEventListener('load', function () { if (" + FILTRO + ") return; " +
  "var s = document.createElement('script'); s.type = 'module'; s.src = 'https://static.cloudflareinsights.com/beacon.min.js'; " +
  "s.setAttribute('data-cf-beacon', '{\"token\": \"724c084d30e94710b4ae653efca91731\"}'); document.body.appendChild(s); });</script>" +
  "<!-- End Cloudflare Web Analytics -->";

const BLOQUE = /<!-- Cloudflare Web Analytics:[\s\S]*?<!-- End Cloudflare Web Analytics -->/;

function paginas() {
  return execSync('git ls-files --cached --others --exclude-standard -- "*.html" ":!dossier"', { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/).filter(Boolean).sort();
}
const leer = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const esRedireccion = (t) => /http-equiv="refresh"/i.test(t);

function aplicar() {
  let cambiadas = 0;
  for (const f of paginas()) {
    const t = leer(f);
    if (esRedireccion(t)) continue;
    let nuevo;
    if (BLOQUE.test(t)) nuevo = t.replace(BLOQUE, () => CANONICO);
    else if (t.includes('</body>')) nuevo = t.replace('</body>', () => CANONICO + '\n</body>');
    else continue;
    if (nuevo !== t) { fs.writeFileSync(path.join(ROOT, f), nuevo); cambiadas++; console.log('actualizada: ' + f); }
  }
  console.log(cambiadas + ' página(s) actualizada(s).');
}

function comprobar() {
  const problemas = [];
  let n = 0;
  for (const f of paginas()) {
    const t = leer(f);
    if (esRedireccion(t)) continue;
    n++;
    const veces = t.split('<!-- Cloudflare Web Analytics:').length - 1;
    if (veces !== 1) { problemas.push(f + ': tiene ' + veces + ' fragmentos de Cloudflare Web Analytics (debe haber 1)'); continue; }
    if (!t.includes(CANONICO)) problemas.push(f + ': el fragmento de Cloudflare no es el canónico (con el filtro de navegadores automatizados y host). Ejecuta node scripts/analitica.js');
    if (!/<!-- End Cloudflare Web Analytics -->\s*<\/body>/.test(t)) problemas.push(f + ': el fragmento de Cloudflare debe ir justo antes de </body>');
  }
  const claude = leer('CLAUDE.md');
  if (!claude.includes(CANONICO)) problemas.push('CLAUDE.md: el fragmento de Cloudflare no coincide con el canónico de scripts/analitica.js');
  for (const f of ['js/contratar.js', 'contacto/index.html']) {
    const t = leer(f);
    if (!t.includes('navigator.webdriver === true') || !t.includes('(www\\.)?sellpix\\.es$')) problemas.push(f + ': falta el filtro de navegadores automatizados y host para Tally');
  }
  if (problemas.length) {
    console.error('Analítica y Tally: ' + problemas.length + ' problema(s):');
    for (const p of problemas) console.error(' - ' + p);
    process.exit(1);
  }
  console.log('Analítica y Tally: ' + n + ' páginas con el fragmento canónico de Cloudflare; filtro presente en contratar.js y contacto/; CLAUDE.md al día.');
}

if (process.argv.includes('--check')) comprobar(); else aplicar();
