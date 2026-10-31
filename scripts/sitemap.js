/*
 * Genera sitemap.xml con <lastmod> real.
 *
 * Uso: node scripts/sitemap.js
 *
* - Páginas: todos los index.html del repositorio (también los nuevos aún sin confirmar) que no lleven <meta name="robots" content="noindex…">
 *   (así quedan fuera sobre-mi/, confirmar/ y gracias/; 404.html no es un index.html).
 * - lastmod: fecha del último commit que tocó el archivo; si el archivo tiene cambios sin confirmar, la fecha de hoy
 *   (porque el commit que viene será de hoy).
 * - El orden sigue la estructura del sitio: portada, servicios, proyectos, guías, estudio, contacto, Asturias y legales.
 *
 * No se publica: _config.yml excluye scripts/.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://sellpix.es/';
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8' }).trim();
const hoy = new Date().toISOString().slice(0, 10);

const GRUPOS = ['', 'servicios/', 'que-web-necesitas/', 'proyectos/', 'guias/', 'estudio/', 'contacto/', 'diseno-web-asturias/', 'aviso-legal/', 'privacidad/', 'cookies/', 'condiciones/'];
function rango(url) {
  const i = GRUPOS.findIndex((g) => (g === '' ? url === '' : url.startsWith(g)));
  const grupo = i === -1 ? GRUPOS.length : i;
  const hijo = url !== GRUPOS[grupo] ? 1 : 0; // la página de sección va antes que sus hijas
  return [grupo, hijo, url];
}

const paginas = git('ls-files --cached --others --exclude-standard -- "*.html" ":!dossier"')
  .split(/\r?\n/)
  .filter((f) => f.endsWith('index.html'))
  .filter((f) => !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(fs.readFileSync(path.join(ROOT, f), 'utf8')))
  .map((f) => {
    const url = f.replace(/index\.html$/, '');
    const sucio = git(`status --porcelain -- "${f}"`) !== '';
    const lastmod = sucio ? hoy : git(`log -1 --format=%cs -- "${f}"`) || hoy;
    return { url, lastmod };
  })
  .sort((a, b) => {
    const ra = rango(a.url); const rb = rango(b.url);
    for (let i = 0; i < 3; i++) if (ra[i] !== rb[i]) return ra[i] < rb[i] ? -1 : 1;
    return 0;
  });

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paginas.map((p) => `  <url><loc>${SITE}${p.url}</loc><lastmod>${p.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${paginas.length} URLs`);
for (const p of paginas) console.log(`  ${p.lastmod}  ${SITE}${p.url}`);
