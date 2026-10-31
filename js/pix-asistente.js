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

  /* ── Bocadillo compacto y aviso ──────────────────────────────────────────────────────────────────────────────────
     El saludo es solo la pregunta, un botón «Sí» y cerrar; las opciones se abren en el panel, que el visitante pide a
     propósito. Antes de mostrarlo se comprueba con getBoundingClientRect que no se cruza con ningún contenido visible
     (titulares, párrafos, listas, precios, etiquetas, tarjetas, la caja de compra, botones, enlaces, formularios y
     cualquier texto). Si choca, no sale: Pix enseña un punto («Pix tiene una sugerencia») y, como mucho una vez, lo
     vuelve a intentar cuando el desplazamiento deja un hueco. Si el hueco desaparece (scroll, resize, giro), se cierra
     solo y vuelve el punto. Al tocar a Pix con el punto se abre el panel con la sugerencia. */
  var globo = null, globoAbierto = false, saludado = false, aviso = null, avisoActivo = false, reintento = false;
  try { saludado = window.sessionStorage.getItem(KEY) === '1'; } catch (e) { /* sin almacenamiento: una vez por carga */ }
  function marcarSaludo() { saludado = true; try { window.sessionStorage.setItem(KEY, '1'); } catch (e) { /* igual */ } }
  function crearGlobo() {
    globo = el('div', 'pix-globo'); globo.setAttribute('role', 'dialog'); globo.setAttribute('aria-modal', 'false'); globo.setAttribute('aria-labelledby', 'pix-globo-texto'); globo.hidden = true;
    var cerrar = boton('', 'pix-globo-cerrar'); cerrar.setAttribute('aria-label', 'Cerrar el mensaje de Pix'); cerrar.appendChild(el('span', null, '×')).setAttribute('aria-hidden', 'true');
    var texto = el('p', 'pix-globo-texto', saludo().t); texto.id = 'pix-globo-texto';
    var si = boton('Sí', 'sp-btn sp-btn--ghost pix-globo-boton');
    si.addEventListener('click', function () { cerrarGlobo(false); abrirPanel(A.boton, null, true); });
    globo.appendChild(cerrar); globo.appendChild(texto); globo.appendChild(si);
    cerrar.addEventListener('click', function () { cerrarGlobo(true); });
    A.raiz.appendChild(globo);
  }
  function mostrarAviso() {
    if (!aviso) { aviso = el('span', 'pix-aviso'); aviso.setAttribute('role', 'img'); aviso.setAttribute('aria-label', 'Pix tiene una sugerencia'); A.raiz.appendChild(aviso); }
    aviso.hidden = false; avisoActivo = true; A.boton.setAttribute('aria-label', 'Opciones de Pix. Pix tiene una sugerencia');
  }
  function quitarAviso() { if (aviso) aviso.hidden = true; avisoActivo = false; A.boton.setAttribute('aria-label', 'Opciones de Pix'); }
  /* ¿Se cruza el rectángulo r con algún contenido visible? Elementos de contenido y, además, cualquier texto suelto */
  var CONTENIDO = 'h1, h2, h3, p, li, [data-dato], .tag, .badge, .service-tag, .sp-eyebrow, .sp-stat, .price, .sp-card, .product-buy, .buy-guarantees, a, button, .sp-btn, form, iframe, input, textarea, select, .sp-tally, img, picture';
  function cruza(b, r) { return b.width > 0 && b.height > 0 && b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top; }
  function choca(r) {
    var raiz = document.querySelector('main') || document.body;
    var nodos = raiz.querySelectorAll(CONTENIDO);
    for (var i = 0; i < nodos.length; i++) {
      if (nodos[i].closest('.pix-acomp, .pix-panel, .fondo-foto')) continue;
      if (cruza(nodos[i].getBoundingClientRect(), r)) return true;
    }
    var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, rango = document.createRange();
    while ((n = tw.nextNode())) {
      if (!n.nodeValue.trim() || !n.parentElement || n.parentElement.closest('.pix-acomp, .pix-panel, .pix-panel-fondo, script, style, noscript')) continue;
      if (!cruza(n.parentElement.getBoundingClientRect(), r)) continue;
      rango.selectNodeContents(n);
      var rs = rango.getClientRects();
      for (var j = 0; j < rs.length; j++) if (cruza(rs[j], r)) return true;
    }
    return false;
  }
  function cajaDeCompraVisible() {
    if (tipo !== 'ficha') return false;
    var cb = document.querySelector('.product-buy'); if (!cb) return false;
    var b = cb.getBoundingClientRect(); return b.bottom > 0 && b.top < window.innerHeight;
  }
  function hayHueco() {
    if (!globo) crearGlobo();
    if (cajaDeCompraVisible()) return false;
    var abierto = !globo.hidden;
    if (!abierto) { globo.style.visibility = 'hidden'; globo.hidden = false; }
    var r = globo.getBoundingClientRect();
    var libre = r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth && !choca(r);
    if (!abierto) { globo.hidden = true; globo.style.visibility = ''; }
    return libre;
  }
  function mostrarGlobo() {
    if (globoAbierto || !A.visible() || A.menuAbierto() || panelAbierto) return false;
    if (saludado && !reintento) return false;
    if (!hayHueco()) { if (!saludado) { marcarSaludo(); mostrarAviso(); reintento = true; } return false; }
    reintento = false; quitarAviso(); marcarSaludo();
    globo.hidden = false; globoAbierto = true;
    if (A.anima()) globo.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
    A.forzar('mira', 0);
    return true;
  }
  function cerrarGlobo(enfocar) {
    if (!globo || !globoAbierto) return;
    globo.hidden = true; globoAbierto = false;
    if (enfocar) A.boton.focus();
  }
  /* Si el hueco desaparece con el bocadillo abierto, se cierra solo y queda el punto */
  function vigilar() { if (globoAbierto && !hayHueco()) { cerrarGlobo(false); mostrarAviso(); } }
  /* Tocar a Pix con el punto abre el panel con la sugerencia (antes que el menú) */
  A.raiz.addEventListener('click', function (e) {
    if (!avisoActivo || !e.target.closest || !e.target.closest('.pix-acomp-boton')) return;
    e.stopPropagation(); e.preventDefault(); quitarAviso(); reintento = false; abrirPanel(A.boton, null, true);
  }, true);
  /* Cuándo intentarlo: a los 8 s, al 40 % de desplazamiento o, en las guías, al final del artículo */
  var intentar = false, tScroll = null, rafVigila = 0;
  function evaluar() { if (intentar && (!saludado || reintento)) mostrarGlobo(); }
  function trasMover() {
    if (tipo !== 'guia') { var max = document.documentElement.scrollHeight - window.innerHeight; if (max > 0 && window.pageYOffset / max >= 0.4) intentar = true; }
    vigilar(); evaluar();
  }
  function programar() {
    if (tipo === 'guia') {
      var fin = document.querySelector('.guide-more') || document.querySelector('article');
      if (fin && 'IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { intentar = true; evaluar(); io.disconnect(); } }); io.observe(fin); }
    } else {
      window.setTimeout(function () { intentar = true; evaluar(); }, 8000);
    }
    window.addEventListener('scroll', function () {
      if (globoAbierto && !rafVigila) rafVigila = window.requestAnimationFrame(function () { rafVigila = 0; vigilar(); });
      window.clearTimeout(tScroll); tScroll = window.setTimeout(trasMover, 300);
    }, { passive: true });
    window.addEventListener('resize', function () { window.clearTimeout(tScroll); tScroll = window.setTimeout(trasMover, 200); });
    window.addEventListener('orientationchange', function () { window.setTimeout(trasMover, 300); });
  }
  A.alCambiar(function (visible) {
    if (!visible) { if (globoAbierto) { globo.hidden = true; globoAbierto = false; mostrarAviso(); } }
    else evaluar();
  });

  /* ── Panel de preguntas frecuentes ───────────────────────────────────────────────────────────────────────────── */
  var panel = null, fondo = null, panelAbierto = false, opener = null, datos = null, cargando = null, sugerencia, sugeridas, resultados, buscador, tBusca = null;
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
    sugerencia = el('div', 'pix-panel-sugerencia');
    sugeridas = el('div', 'pix-panel-lista');
    var campo = el('div', 'pix-panel-busca');
    var label = el('label', 'sp-small', 'Busca en las preguntas frecuentes'); label.htmlFor = 'pix-busca';
    buscador = el('input', 'sp-input'); buscador.type = 'search'; buscador.id = 'pix-busca'; buscador.autocomplete = 'off'; buscador.setAttribute('spellcheck', 'false');
    campo.appendChild(label); campo.appendChild(buscador);
    resultados = el('div', 'pix-panel-lista'); resultados.setAttribute('aria-live', 'polite'); resultados.id = 'pix-resultados';
    panel.appendChild(cab); panel.appendChild(nota); panel.appendChild(sugerencia); panel.appendChild(sugeridas); panel.appendChild(campo); panel.appendChild(resultados);
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
  /* La sugerencia del saludo dentro del panel: la pregunta de la página y sus opciones (enlaces o respuestas) */
  function pintarSugerencia() {
    while (sugerencia.firstChild) sugerencia.removeChild(sugerencia.firstChild);
    var s = saludo();
    sugerencia.appendChild(el('h3', 'sp-h4 pix-sugerencia-titulo', s.t));
    if (s.puntos) {
      sugerencia.appendChild(el('p', 'sp-small', 'Incluye en tu mensaje:'));
      var ul = el('ul', 'pix-sugerencia-puntos'); s.puntos.forEach(function (p) { ul.appendChild(el('li', null, p)); }); sugerencia.appendChild(ul);
      return;
    }
    var bs = el('div', 'pix-sugerencia-botones');
    s.b.forEach(function (par) {
      var b;
      if (typeof par[1] === 'string' && par[1] !== 'panel') { b = el('a', 'sp-btn sp-btn--ghost pix-globo-boton', par[0]); b.href = par[1]; }
      else {
        b = boton(par[0], 'sp-btn sp-btn--ghost pix-globo-boton');
        b.addEventListener('click', function () {
          if (par[1] === 'panel') { buscador.focus(); return; }
          cargarDatos().then(function () { sugerir(par[1]); var q = sugeridas.querySelector('.pix-faq-pregunta'); if (q) q.focus(); });
        });
      }
      bs.appendChild(b);
    });
    sugerencia.appendChild(bs);
  }
  function abrirPanel(desde, ids, conSugerencia) {
    if (!panel) crearPanel();
    opener = desde || document.activeElement;
    cerrarGlobo(false); quitarAviso();
    panel.hidden = false; fondo.hidden = false; panelAbierto = true;
    if (conSugerencia) pintarSugerencia(); else while (sugerencia.firstChild) sugerencia.removeChild(sugerencia.firstChild);
    while (sugeridas.firstChild) sugeridas.removeChild(sugeridas.firstChild);
    sugeridas.appendChild(el('p', 'sp-small', 'Cargando las preguntas…'));
    var primeraOpcion = conSugerencia && sugerencia.querySelector('a, button');
    (primeraOpcion || panel.querySelector('.pix-panel-cerrar')).focus();
    cargarDatos().then(function () { if (panelAbierto) { sugerir(ids); var primero = sugeridas.querySelector('.pix-faq-pregunta'); if (conSugerencia) return; if (primero && !ids) primero.focus(); else if (ids) panel.querySelector('.pix-panel-cerrar').focus(); } },
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
  window.SellPixAsistente = { abrirPanel: abrirPanel, mostrarGlobo: mostrarGlobo, hayHueco: hayHueco, tipo: tipo };
  programar();
}
if (window.SellPixAcomp) sellpixAsistente(); else document.addEventListener('sellpix:pix-listo', sellpixAsistente, { once: true });
