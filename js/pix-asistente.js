/* Pix asistente (paso 1, sin IA): amplía el acompañante (js/pix-acompanante.js) con un saludo por visita y un panel de
   preguntas frecuentes. Regla de oro: Pix no dice nada que no esté publicado en la web; las respuestas salen de
   js/pix-faq.data.json, que scripts/pix-faq.js genera con texto literal de las páginas, y solo se pide al abrir el panel.
   El saludo sale una vez por visita (sessionStorage sellpix_pix_saludo), a los 8 s o al 40 % de desplazamiento (en las
   guías, al final del artículo), y nunca si se solaparía con el botón lima o con un formulario. El buscador compara
   palabras en local, sin tildes ni mayúsculas: lo que se escribe no sale del navegador (ni red, ni almacenamiento, ni
   analítica). Sin JavaScript no aparece nada; sin html.anima Pix queda quieto. */
function sellpixAsistente() {
  var A = window.SellPixAcomp, P = window.SellPixPix;
  if (!A || !P || !window.fetch) return;
  var RAIZ = A.RAIZ, KEY = 'sellpix_pix_saludo';
  var QUIZ = RAIZ + 'que-web-necesitas/', CONTACTO = RAIZ + 'contacto/#formulario';
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function boton(txt, cls) { var b = el('button', cls, txt); b.type = 'button'; return b; }

  /* ── Qué página es ───────────────────────────────────────────────────────────────────────────────────────────── */
  var profundidad = (RAIZ.match(/\.\.\//g) || []).length;
  var partes = window.location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean);
  var REL = profundidad ? partes.slice(partes.length - profundidad).join('/') + '/' : '';
  var FICHAS = { 'landing-page': 'landing', 'web-corporativa': 'web', 'tienda-online-shopify': 'tienda', 'mantenimiento-web': 'mant', 'mantenimiento-wordpress': 'wp' };
  var m;
  var tipo = REL === '' ? 'portada' : REL === 'servicios/' ? 'servicios' : REL === 'contacto/' ? 'contacto'
    : (m = REL.match(/^servicios\/([^/]+)\/$/)) && FICHAS[m[1]] ? 'ficha' : /^guias\/[^/]+\/$/.test(REL) ? 'guia' : 'resto';
  var ficha = tipo === 'ficha' ? FICHAS[m[1]] : null;
  /* Qué preguntas abre cada botón de una ficha: [qué incluye], [plazo], [pago y desistimiento], [garantías] */
  var FICHA_IDS = {
    landing: [['landing-incluye', 'landing-no-incluye'], ['landing-plazo'], ['landing-pago', 'desistimiento'], ['garantia-30-dias', 'garantia-legal']],
    web: [['web-incluye', 'web-no-incluye'], ['web-plazo'], ['web-pago', 'desistimiento'], ['garantia-30-dias', 'garantia-legal']],
    tienda: [['tienda-incluye', 'tienda-no-incluye'], ['tienda-plazo'], ['tienda-pago', 'desistimiento'], ['garantia-30-dias', 'garantia-legal']],
    mant: [['mant-incluye', 'mant-no-incluye'], ['mant-cada-mes'], ['mant-cobro', 'desistimiento'], ['mant-baja', 'mant-30-dias']],
    wp: [['wp-incluye', 'woo-incluye', 'wp-no-incluye'], ['wp-como-empieza'], ['baja-mantenimiento-wordpress', 'desistimiento'], ['revision-inicial-wordpress', 'wp-cancelar']]
  };

  /* ── Saludo por página (textos fijados por SellPix) ──────────────────────────────────────────────────────────── */
  function saludo() {
    if (tipo === 'portada') return { t: '¿Qué quieres que haga tu web?', b: [['Vender online', QUIZ + '?objetivo=vender'], ['Conseguir contactos', QUIZ + '?objetivo=contactos'], ['Presentar mi negocio', QUIZ + '?objetivo=presentar'], ['Cuidar mi web actual', QUIZ + '?objetivo=cuidar']] };
    if (tipo === 'servicios') return { t: '¿Te ayudo a elegir?', b: [['Sí, en 4 preguntas', QUIZ], ['Tengo una duda', 'panel']] };
    if (tipo === 'ficha') { var ids = FICHA_IDS[ficha]; return { t: '¿Dudas con lo que incluye?', b: [['Qué incluye y qué no', ids[0]], ['Plazo', ids[1]], ['Pago y desistimiento', ids[2]], ['Garantías', ids[3]]] }; }
    if (tipo === 'guia') {
      var cta = document.querySelector('.sp-cta-block .sp-btn--primary');
      return { t: '¿Te digo qué servicio encaja con lo que has leído?', b: [[cta ? cta.textContent.trim() : 'Ver precios', cta ? cta.getAttribute('href') : RAIZ + 'servicios/'], ['Otra duda', 'panel']] };
    }
    if (tipo === 'contacto') return { t: '¿Te ayudo a escribir el mensaje?', b: [['Sí, dime qué incluir', 'puntos']], puntos: ['Tu tipo de negocio', 'Qué necesitas', 'Para cuándo'] };
    return { t: '¿En qué te ayudo?', b: [['Ver precios', RAIZ + 'servicios/'], ['Elegir mi web', QUIZ], ['Tengo una duda', 'panel']] };
  }

  /* ── Bocadillo ───────────────────────────────────────────────────────────────────────────────────────────────── */
  var globo = null, globoAbierto = false, saludado = false;
  try { saludado = window.sessionStorage.getItem(KEY) === '1'; } catch (e) { /* sin almacenamiento: una vez por carga */ }
  function marcarSaludo() { saludado = true; try { window.sessionStorage.setItem(KEY, '1'); } catch (e) { /* igual */ } }
  function crearGlobo() {
    var s = saludo();
    globo = el('div', 'pix-globo'); globo.setAttribute('role', 'dialog'); globo.setAttribute('aria-modal', 'false'); globo.setAttribute('aria-labelledby', 'pix-globo-texto'); globo.hidden = true;
    var cerrar = boton('', 'pix-globo-cerrar'); cerrar.setAttribute('aria-label', 'Cerrar el mensaje de Pix'); cerrar.appendChild(el('span', null, '×')).setAttribute('aria-hidden', 'true');
    var texto = el('p', 'pix-globo-texto', s.t); texto.id = 'pix-globo-texto';
    var bs = el('div', 'pix-globo-botones');
    s.b.forEach(function (par) {
      var b;
      if (typeof par[1] === 'string' && par[1] !== 'panel' && par[1] !== 'puntos') { b = el('a', 'sp-btn sp-btn--ghost pix-globo-boton', par[0]); b.href = par[1]; }
      else {
        b = boton(par[0], 'sp-btn sp-btn--ghost pix-globo-boton');
        b.addEventListener('click', function () {
          if (par[1] === 'panel') { cerrarGlobo(false); abrirPanel(A.boton, null); }
          else if (par[1] === 'puntos') { var ul = el('ul', 'pix-globo-puntos'); s.puntos.forEach(function (p) { ul.appendChild(el('li', null, p)); }); bs.replaceWith(ul); texto.textContent = 'Incluye en tu mensaje:'; cerrar.focus(); }
          else { cerrarGlobo(false); abrirPanel(A.boton, par[1]); }
        });
      }
      bs.appendChild(b);
    });
    globo.appendChild(cerrar); globo.appendChild(texto); globo.appendChild(bs);
    cerrar.addEventListener('click', function () { cerrarGlobo(true); });
    A.raiz.appendChild(globo);
  }
  /* Rectángulos con los que el bocadillo no puede solaparse: botones lima y formularios visibles */
  function seSolapa(r) {
    var nodos = document.querySelectorAll('.sp-btn--primary, form, .sp-tally, #formulario, iframe, input, textarea, select');
    for (var i = 0; i < nodos.length; i++) {
      if (nodos[i].closest('.pix-globo, .pix-panel')) continue;
      var b = nodos[i].getBoundingClientRect(); if (!b.width || !b.height) continue;
      if (b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top) return true;
    }
    return false;
  }
  function mostrarGlobo() {
    if (saludado || globoAbierto || !A.visible() || A.menuAbierto() || panelAbierto) return false;
    if (!globo) crearGlobo();
    globo.style.visibility = 'hidden'; globo.hidden = false;
    var r = globo.getBoundingClientRect();
    var fuera = r.left < 0 || r.top < 0 || r.right > window.innerWidth;
    if (fuera || seSolapa(r)) { globo.hidden = true; globo.style.visibility = ''; return false; }
    globo.style.visibility = ''; globoAbierto = true; marcarSaludo();
    if (A.anima()) globo.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
    A.forzar('mira', 0);
    return true;
  }
  function cerrarGlobo(enfocar) {
    if (!globo || !globoAbierto) return;
    globo.hidden = true; globoAbierto = false;
    if (enfocar) A.boton.focus();
  }
  /* Cuándo intentarlo: a los 8 s, al 40 % de desplazamiento o, en las guías, al final del artículo; se reintenta en
     cada parada del scroll hasta que sale (si no se solapa con nada) */
  var intentar = false, tScroll = null;
  function evaluar() { if (intentar && !saludado) mostrarGlobo(); }
  function programar() {
    if (saludado) return;
    if (tipo === 'guia') {
      var fin = document.querySelector('.guide-more') || document.querySelector('article');
      if (fin && 'IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { intentar = true; evaluar(); io.disconnect(); } }); io.observe(fin); }
    } else {
      window.setTimeout(function () { intentar = true; evaluar(); }, 8000);
    }
    window.addEventListener('scroll', function () {
      window.clearTimeout(tScroll);
      tScroll = window.setTimeout(function () {
        if (tipo !== 'guia') { var max = document.documentElement.scrollHeight - window.innerHeight; if (max > 0 && window.pageYOffset / max >= 0.4) intentar = true; }
        evaluar();
      }, 300);
    }, { passive: true });
    window.addEventListener('resize', function () { if (globoAbierto) { var r = globo.getBoundingClientRect(); if (seSolapa(r)) cerrarGlobo(false); } });
  }
  A.alCambiar(function (visible) { if (!visible) globoAbierto = false; else evaluar(); });

  /* ── Panel de preguntas frecuentes ───────────────────────────────────────────────────────────────────────────── */
  var panel = null, fondo = null, panelAbierto = false, opener = null, datos = null, cargando = null, sugeridas, resultados, buscador, tBusca = null;
  var FOCO = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
  function sinTildes(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function cargarDatos() {
    if (datos) return Promise.resolve(datos);
    if (!cargando) cargando = window.fetch(RAIZ + 'js/pix-faq.data.json', { credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (j) {
      datos = j.p.map(function (p) { return { i: p.i, q: p.q, r: p.r, u: p.u, t: p.t, g: p.g, n: sinTildes(p.q + ' ' + p.r), nt: p.t.map(sinTildes) }; }); return datos;
    }, function () { cargando = null; throw new Error('sin datos'); });
    return cargando;
  }
  function crearPanel() {
    fondo = el('div', 'pix-panel-fondo'); fondo.hidden = true;
    panel = el('div', 'pix-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-labelledby', 'pix-panel-titulo'); panel.hidden = true;
    var cab = el('div', 'pix-panel-cabecera');
    var h = el('h2', 'sp-h4', 'Preguntas frecuentes'); h.id = 'pix-panel-titulo';
    var cerrar = boton('Cerrar', 'sp-btn sp-btn--ghost pix-panel-cerrar');
    cab.appendChild(h); cab.appendChild(cerrar);
    var nota = el('p', 'sp-small pix-panel-nota', 'Pix responde solo con lo que ya está publicado en la web.');
    sugeridas = el('div', 'pix-panel-lista');
    var campo = el('div', 'pix-panel-busca');
    var label = el('label', 'sp-small', 'Busca en las preguntas frecuentes'); label.htmlFor = 'pix-busca';
    buscador = el('input', 'sp-input'); buscador.type = 'search'; buscador.id = 'pix-busca'; buscador.autocomplete = 'off'; buscador.setAttribute('spellcheck', 'false');
    campo.appendChild(label); campo.appendChild(buscador);
    resultados = el('div', 'pix-panel-lista'); resultados.setAttribute('aria-live', 'polite'); resultados.id = 'pix-resultados';
    panel.appendChild(cab); panel.appendChild(nota); panel.appendChild(sugeridas); panel.appendChild(campo); panel.appendChild(resultados);
    document.body.appendChild(fondo); document.body.appendChild(panel);
    cerrar.addEventListener('click', function () { cerrarPanel(true); });
    fondo.addEventListener('click', function () { cerrarPanel(true); });
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(panel.querySelectorAll(FOCO), function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    buscador.addEventListener('input', function () { window.clearTimeout(tBusca); tBusca = window.setTimeout(buscar, 150); });
  }
  function pintarPregunta(p, abierta) {
    var d = el('div', 'pix-faq');
    var b = boton(p.q, 'pix-faq-pregunta'); b.setAttribute('aria-expanded', abierta ? 'true' : 'false');
    var cuerpo = el('div', 'pix-faq-respuesta'); cuerpo.hidden = !abierta;
    var lineas = p.r.split('\n');
    if (lineas.length > 1 && lineas[0].slice(-1) !== ':') { var ul = el('ul'); lineas.forEach(function (l) { ul.appendChild(el('li', null, l)); }); cuerpo.appendChild(ul); }
    else if (lineas.length > 1) { cuerpo.appendChild(el('p', null, lineas[0])); var ul2 = el('ul'); lineas.slice(1).forEach(function (l) { ul2.appendChild(el('li', null, l)); }); cuerpo.appendChild(ul2); }
    else cuerpo.appendChild(el('p', null, p.r));
    var ver = el('a', 'cta-secondary', 'Ver en la web'); ver.href = RAIZ + p.u; cuerpo.appendChild(el('p', 'pix-faq-ver')).appendChild(ver);
    b.addEventListener('click', function () {
      var ab = cuerpo.hidden;
      if (ab) { A.forzar('piensa', 300); window.setTimeout(function () { cuerpo.hidden = false; b.setAttribute('aria-expanded', 'true'); A.forzar('contento', 2000); }, A.anima() ? 300 : 0); }
      else { cuerpo.hidden = true; b.setAttribute('aria-expanded', 'false'); }
    });
    d.appendChild(b); d.appendChild(cuerpo); return d;
  }
  function sugerir(ids) {
    while (sugeridas.firstChild) sugeridas.removeChild(sugeridas.firstChild);
    var lista = ids ? ids.map(function (i) { return datos.filter(function (p) { return p.i === i; })[0]; }).filter(Boolean)
      : datos.filter(function (p) { return p.g.indexOf(REL) !== -1; }).slice(0, 6);
    if (!lista.length) lista = ['cuanto-tarda', 'como-se-paga', 'desistimiento', 'garantia-30-dias', 'iva-incluido'].map(function (i) { return datos.filter(function (p) { return p.i === i; })[0]; }).filter(Boolean);
    sugeridas.appendChild(el('h3', 'sp-eyebrow', ids ? 'Lo que preguntabas' : 'Sugeridas para esta página'));
    lista.forEach(function (p, n) { sugeridas.appendChild(pintarPregunta(p, !!ids && n === 0)); });
    if (ids && lista[0]) A.forzar('contento', 2000);
  }
  function buscar() {
    while (resultados.firstChild) resultados.removeChild(resultados.firstChild);
    var q = sinTildes(buscador.value.trim());
    var palabras = q.split(/\s+/).filter(function (w) { return w.length >= 2; });
    if (!palabras.length || !datos) return;
    var lista = datos.map(function (p) {
      var puntos = 0;
      for (var i = 0; i < palabras.length; i++) {
        var w = palabras[i], hit = 0;
        if (p.nt.some(function (t) { return t.indexOf(w) !== -1; })) hit = 3; else if (sinTildes(p.q).indexOf(w) !== -1) hit = 2; else if (p.n.indexOf(w) !== -1) hit = 1;
        if (!hit) return null; puntos += hit;
      }
      return { p: p, puntos: puntos };
    }).filter(Boolean).sort(function (a, b) { return b.puntos - a.puntos; }).slice(0, 6);
    A.forzar('piensa', 300);
    window.setTimeout(function () {
      if (sinTildes(buscador.value.trim()) !== q) return;
      while (resultados.firstChild) resultados.removeChild(resultados.firstChild);
      if (lista.length) {
        resultados.appendChild(el('h3', 'sp-eyebrow', lista.length === 1 ? 'Una pregunta encontrada' : lista.length + ' preguntas encontradas'));
        lista.forEach(function (x, n) { resultados.appendChild(pintarPregunta(x.p, n === 0)); });
        A.forzar('contento', 2000);
      } else {
        var p = el('p', 'pix-faq-nada'); var a = el('a', 'cta-secondary', 'Esto mejor te lo contestamos por email'); a.href = CONTACTO; p.appendChild(a);
        resultados.appendChild(p); A.forzar('duda', 3000);
      }
    }, A.anima() ? 300 : 0);
  }
  function abrirPanel(desde, ids) {
    if (!panel) crearPanel();
    opener = desde || document.activeElement;
    cerrarGlobo(false);
    panel.hidden = false; fondo.hidden = false; panelAbierto = true;
    while (sugeridas.firstChild) sugeridas.removeChild(sugeridas.firstChild);
    sugeridas.appendChild(el('p', 'sp-small', 'Cargando las preguntas…'));
    panel.querySelector('.pix-panel-cerrar').focus();
    cargarDatos().then(function () { if (panelAbierto) { sugerir(ids); var primero = sugeridas.querySelector('.pix-faq-pregunta'); if (primero && !ids) primero.focus(); else if (ids) panel.querySelector('.pix-panel-cerrar').focus(); } },
      function () { while (sugeridas.firstChild) sugeridas.removeChild(sugeridas.firstChild); var p = el('p', 'pix-faq-nada'); var a = el('a', 'cta-secondary', 'No se han podido cargar las preguntas. Escríbenos'); a.href = CONTACTO; p.appendChild(a); sugeridas.appendChild(p); });
  }
  function cerrarPanel(enfocar) {
    if (!panelAbierto) return;
    panel.hidden = true; fondo.hidden = true; panelAbierto = false;
    if (buscador) { buscador.value = ''; while (resultados.firstChild) resultados.removeChild(resultados.firstChild); }
    if (enfocar && opener && opener.isConnected) opener.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (panelAbierto) { e.preventDefault(); cerrarPanel(true); }
    else if (globoAbierto) { e.preventDefault(); cerrarGlobo(true); }
  });
  A.alCambiar(function (visible) { if (!visible && panelAbierto) cerrarPanel(false); });

  /* Entrada «Preguntas frecuentes» en el menú de Pix, después del cuestionario */
  A.item('Preguntas frecuentes', function () { abrirPanel(A.boton, null); }, 1);
  window.SellPixAsistente = { abrirPanel: abrirPanel, mostrarGlobo: mostrarGlobo, tipo: tipo };
  programar();
}
if (window.SellPixAcomp) sellpixAsistente(); else document.addEventListener('sellpix:pix-listo', sellpixAsistente, { once: true });
