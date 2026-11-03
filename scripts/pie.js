#!/usr/bin/env node
/* Escribe (sin argumentos) o comprueba (--check) el pie de página de todas las páginas.
   El pie es el mismo en todas: solo cambia el prefijo de las rutas relativas (se toma del enlace del logotipo).
   Mantiene el botón «Pausar animaciones» dentro de <footer> (movimiento.js y pix-acompanante.js lo buscan ahí).
   No se publica: _config.yml excluye scripts/. */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

function pie(p) {
  return `<footer>
  <div class="sp-container footer-grid">
    <div class="footer-brand">
      <a class="footer-logo" href="${p || './'}" aria-label="SellPix, inicio">
        <img class="on-light" src="${p}brand/logos/svg/sellpix-lockup.svg" width="426" height="85" alt="SellPix">
        <img class="on-dark" src="${p}brand/logos/svg/sellpix-lockup-reversed.svg" width="426" height="85" alt="SellPix">
      </a>
      <p class="footer-tagline">Diseño web con criterio comercial.</p>
      <a class="footer-mail" href="mailto:hola@sellpix.es">hola@sellpix.es</a>
    </div>
    <nav class="footer-col" aria-label="Servicios">
      <p class="sp-eyebrow footer-title">Servicios</p>
      <a href="${p}servicios/landing-page/">Landing page</a>
      <a href="${p}servicios/web-corporativa/">Web corporativa</a>
      <a href="${p}servicios/tienda-online-shopify/">Tienda Shopify</a>
      <a href="${p}servicios/mantenimiento-web/">Mantenimiento</a>
      <a href="${p}servicios/mantenimiento-wordpress/">Mantenimiento WordPress</a>
    </nav>
    <nav class="footer-col footer-links" aria-label="Pie de página">
      <p class="sp-eyebrow footer-title">El estudio</p>
      <a href="${p}servicios/">Precios</a>
      <a href="${p}proyectos/">Cómo trabajamos</a>
      <a href="${p}guias/">Guías</a>
      <a href="${p}estudio/">El estudio</a>
      <a href="${p}contacto/">Contacto</a>
    </nav>
    <nav class="footer-col footer-legal" aria-label="Legal">
      <p class="sp-eyebrow footer-title">Legal</p>
      <a href="${p}aviso-legal/">Aviso legal</a>
      <a href="${p}privacidad/">Privacidad</a>
      <a href="${p}cookies/">Cookies</a>
      <a href="${p}condiciones/">Condiciones</a>
      <a href="${p}creditos/">Créditos</a>
    </nav>
    <div class="footer-bottom">
      <span>© <span class="js-year">2026</span> SellPix · Diseño web y tiendas online en Shopify · <a class="footer-place" href="${p}diseno-web-asturias/">Oviedo, Asturias</a></span>
      <button type="button" class="sp-btn sp-btn--ghost pausa-anim" aria-pressed="false" hidden>Pausar animaciones</button>
    </div>
  </div>
</footer>`;
}

const files = execSync('git ls-files "*.html"', { cwd: ROOT }).toString().split('\n').filter((f) => f && !/^(dossier|descargas)\//.test(f));
let cambios = 0; const mal = [];
for (const f of files) {
  const abs = path.join(ROOT, f);
  const html = fs.readFileSync(abs, 'utf8');
  const m = html.match(/<footer>[\s\S]*?<\/footer>/);
  if (!m) continue;
  const logo = m[0].match(/class="footer-logo" href="([^"]*)"/);
  if (!logo) { mal.push(f + ': sin enlace de logotipo'); continue; }
  const prefijo = logo[1] === './' ? '' : logo[1];
  const nuevo = html.replace(m[0], () => pie(prefijo));
  if (nuevo !== html) { cambios++; if (CHECK) mal.push(f + ': pie desactualizado'); else fs.writeFileSync(abs, nuevo); }
}
if (mal.length) { console.error(mal.join('\n')); process.exit(1); }
console.log(CHECK ? 'Pie al día en todas las páginas' : `Pie escrito en ${cambios} páginas`);
