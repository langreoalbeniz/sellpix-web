/* Cuestionario «¿Qué web necesitas?» (que-web-necesitas/). Cuatro preguntas, una por pantalla, y una recomendación.
   Los precios, alcances, plazos y URLs salen del JSON #datos-cuestionario, que escribe scripts/cuestionario.js desde
   data/servicios.json; aquí solo están las reglas. No usa cookies ni almacenamiento y no envía nada a ningún sitio:
   las respuestas viven en esta página mientras está abierta. Nunca enlaza a Stripe ni a confirmar/. */
(function () {
  var raiz = document.querySelector('[data-quiz]');
  var datos = document.getElementById('datos-cuestionario');
  if (!raiz || !datos) return;
  var S = JSON.parse(datos.textContent).servicios;
  var pix = document.querySelector('[data-quiz-pix]');
  var P = window.SellPixPix || { anima: function () { return false; }, pose: function () {}, salta: function () {}, brinca: function () {} };
  var IVA = 'IVA incluido';
  var NOTA_20 = 'Si necesitas más de 20 productos, te lo presupuestamos por escrito.';
  var NOTA_PAG = 'Las páginas adicionales se presupuestan por escrito antes de hacerlas.';
  var NOTA_OTRA = 'Cuéntanos qué tienes y te lo presupuestamos por escrito.';
  var PLAZOS = 'Los plazos cuentan desde que recibimos tus materiales.';

  var Q1 = { t: '¿Qué quieres conseguir?', o: [['vender', 'Vender online'], ['contactos', 'Conseguir contactos o clientes'], ['presentar', 'Presentar mi negocio'], ['cuidar', 'Cuidar una web que ya tengo']] };
  var Q2 = {
    vender: { t: '¿Cuántos productos vas a vender?', o: [['hasta20', 'Hasta 20'], ['mas20', 'Más de 20'], ['nolose', 'Todavía no lo sé']] },
    cuidar: { t: '¿Con qué está hecha?', o: [['sellpix', 'La hizo SellPix'], ['wordpress', 'WordPress'], ['woocommerce', 'WooCommerce'], ['otra', 'Otra o no lo sé']] },
    paginas: { t: '¿Cuántas páginas necesitas?', o: [['una', 'Una sola'], ['dos-cinco', 'De 2 a 5'], ['mas5', 'Más de 5']] }
  };
  var Q3 = { t: '¿Tienes ya los textos y las fotos?', o: [['si', 'Sí'], ['parte', 'Una parte'], ['no', 'Todavía no']] };
  var Q4 = { t: '¿Tienes logo y marca?', o: [['si', 'Sí'], ['necesito', 'No, lo necesito'], ['no', 'No lo necesito']] };
  var DUDAS = { nolose: true, otra: true };

  var resp = [];     // respuestas dadas: [{v, texto}]
  var ocupado = false;

  function preguntas() {
    var q = [Q1];
    var o = resp[0] && resp[0].v;
    if (o === 'cuidar') q.push(Q2.cuidar);
    else if (o === 'vender') q.push(Q2.vender, Q3, Q4);
    else if (o) q.push(Q2.paginas, Q3, Q4);
    return q;
  }
  function total() { return resp[0] && resp[0].v === 'cuidar' ? 2 : 4; }

  /* Reglas: qué servicio recomienda cada camino (id de data/servicios.json, o null si se presupuesta) */
  function recomendar() {
    var o = resp[0].v, v = resp[1].v, notas = [], id = null;
    if (o === 'vender') {
      if (v === 'mas20') notas.push(NOTA_20);
      else { id = 'tienda-online-shopify'; if (v === 'nolose') notas.push(NOTA_20); }
    } else if (o === 'cuidar') {
      id = { sellpix: 'mantenimiento-web', wordpress: 'mantenimiento-wordpress', woocommerce: 'mantenimiento-woocommerce' }[v] || null;
      if (!id) notas.push(NOTA_OTRA);
    } else {
      id = v === 'una' ? 'landing' : 'web-corporativa';
      if (v === 'mas5') notas.push(NOTA_PAG);
    }
    return { id: id, notas: notas, marca: !!(resp[3] && resp[3].v === 'necesito') };
  }

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  var origen = null; // dónde estaba Pix antes de limpiar (la cima de la escalera, la primera vez)
  function limpiar() { origen = pix && pix.parentNode ? pix.getBoundingClientRect() : null; if (pix && pix.parentNode) pix.parentNode.removeChild(pix); while (raiz.firstChild) raiz.removeChild(raiz.firstChild); }
  /* Título con Pix a su izquierda: Pix se mueve de sitio sin recrearse y, si venía de otro lugar, salta hasta aquí */
  function cabeza(t) {
    var antes = origen;
    var c = el('div', 'quiz-cabeza');
    if (pix) c.appendChild(pix);
    c.appendChild(t);
    return { nodo: c, volar: function () {
      if (!pix || !antes || !antes.width) return;
      var d = pix.getBoundingClientRect(), dx = antes.left - d.left, dy = antes.top - d.top;
      if (Math.abs(dx) + Math.abs(dy) > 4 && P.vuela) P.vuela(pix, dx, dy);
    } };
  }
  /* Al cambiar de pantalla, el foco va al título y, si no se ve, la tarjeta sube al principio de la vista */
  function mostrar(t) {
    t.focus({ preventScroll: true });
    var r = t.getBoundingClientRect();
    if (r.top < 80 || r.bottom > (window.innerHeight || document.documentElement.clientHeight)) raiz.parentNode.scrollIntoView({ block: 'start', behavior: P.anima() ? 'smooth' : 'auto' });
  }
  function retardo(ms) { return P.anima() ? ms : 0; }

  function pintarPregunta(i, enfoque) {
    var q = preguntas()[i];
    limpiar();
    var t = el('h2', 'quiz-titulo sp-h2', q.t); t.id = 'quiz-titulo'; t.tabIndex = -1;
    var g = el('div', 'quiz-opciones'); g.setAttribute('role', 'group'); g.setAttribute('aria-labelledby', 'quiz-titulo');
    q.o.forEach(function (op) {
      var b = el('button', 'sp-btn sp-btn--ghost quiz-opcion', op[1]); b.type = 'button';
      b.setAttribute('aria-pressed', resp[i] && resp[i].v === op[0] ? 'true' : 'false');
      b.addEventListener('click', function () { responder(i, op, b, g); });
      g.appendChild(b);
    });
    raiz.appendChild(el('p', 'quiz-paso sp-small', 'Paso ' + (i + 1) + ' de ' + total()));
    var cb = cabeza(t); raiz.appendChild(cb.nodo); raiz.appendChild(g);
    if (i > 0) {
      var pie = el('div', 'quiz-pie'); var a = el('button', 'sp-btn sp-btn--ghost', 'Atrás'); a.type = 'button';
      a.addEventListener('click', function () { if (ocupado) return; pintarPregunta(i - 1, true); P.pose(pix, 'mira'); });
      pie.appendChild(a); raiz.appendChild(pie);
    }
    cb.volar();
    if (enfoque) mostrar(t);
  }

  function responder(i, op, boton, grupo) {
    if (ocupado) return;
    ocupado = true;
    [].forEach.call(grupo.children, function (b) { b.setAttribute('aria-pressed', b === boton ? 'true' : 'false'); });
    resp.length = i; resp[i] = { v: op[0], texto: op[1] };
    var duda = !!DUDAS[op[0]];
    P.brinca(pix);
    if (duda) P.pose(pix, 'duda');
    var ultima = i + 1 >= preguntas().length;
    window.setTimeout(function () {
      if (ultima) { pensar(duda); return; }
      pintarPregunta(i + 1, true); ocupado = false;
      if (duda) window.setTimeout(function () { P.pose(pix, 'mira'); }, retardo(900)); else P.pose(pix, 'mira');
    }, retardo(300));
  }

  /* Un momento de duda si hace falta, unos 700 ms de «piensa» y el resultado */
  function pensar(duda) {
    window.setTimeout(function () {
      P.pose(pix, 'piensa');
      window.setTimeout(function () { resultado(); ocupado = false; }, retardo(700));
    }, duda ? retardo(900) : 0);
  }

  function resultado() {
    var r = recomendar(); var s = r.id && S[r.id];
    limpiar();
    var t = el('h2', 'quiz-titulo sp-h2', s ? s.nombre : 'Te lo presupuestamos'); t.id = 'quiz-titulo'; t.tabIndex = -1;
    raiz.appendChild(el('p', 'quiz-paso sp-small', s ? 'Te recomendamos' : 'Tu resultado'));
    var cb = cabeza(t); raiz.appendChild(cb.nodo);
    if (s) {
      var pr = el('p', 'quiz-precio');
      pr.appendChild(el('span', 'sp-stat', s.precio));
      pr.appendChild(el('small', null, (s.unidad ? '/' + s.unidad + ' · ' : '') + IVA));
      raiz.appendChild(pr);
      var ul = el('ul', 'quiz-datos');
      if (s.alcance) ul.appendChild(el('li', null, 'Alcance: ' + s.alcance));
      if (s.plazo) ul.appendChild(el('li', null, 'Plazo: ' + s.plazo));
      if (ul.children.length) raiz.appendChild(ul);
    }
    r.notas.forEach(function (n) { raiz.appendChild(el('p', 'quiz-nota', n)); });
    if (s && s.plazo) raiz.appendChild(el('p', 'quiz-nota', PLAZOS));
    if (r.marca) raiz.appendChild(el('p', 'quiz-nota', 'Branding: a presupuesto'));
    var ac = el('div', 'quiz-acciones');
    function enlace(txt, href, cls) { var a = el('a', 'sp-btn ' + cls, txt); a.href = href; return a; }
    if (s) { ac.appendChild(enlace('Ver este servicio', s.url, 'sp-btn--primary')); ac.appendChild(enlace('Pide presupuesto', '../contacto/', 'sp-btn--ghost')); }
    else { ac.appendChild(enlace('Pide presupuesto', '../contacto/', 'sp-btn--primary')); ac.appendChild(enlace('Ver servicios', '../servicios/', 'sp-btn--ghost')); }
    raiz.appendChild(ac);
    var otra = el('div', 'quiz-otro'); var b = el('button', 'sp-btn sp-btn--ghost', 'Volver a empezar'); b.type = 'button';
    b.addEventListener('click', function () { empezar(true); }); otra.appendChild(b); raiz.appendChild(otra);
    P.pose(pix, P.anima() ? 'celebra' : 'contento');
    mostrar(t);
  }

  function empezar(enfoque) {
    resp = []; ocupado = false;
    var enLaCima = !!pix && pix.parentNode === document.querySelector('.pixel-stair--quiz') && pix.getBoundingClientRect().width > 0;
    pintarPregunta(0, enfoque);
    P.pose(pix, 'mira');
    if (!enLaCima) P.salta(pix);
  }
  empezar(false);
})();
