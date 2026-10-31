/* Movimiento de la web (BRAND.md, «Movimiento»). Un solo IntersectionObserver, sin librerías.
   El <head> pone <html class="anima"> solo si hay IntersectionObserver y no se pide movimiento reducido, y
   <html class="sin-movimiento"> si la persona pausó las animaciones (se guarda en localStorage). Sin JavaScript,
   o con movimiento reducido, no se anima nada y todo se ve en su estado final.
   Este script:
   1. Enciende (una vez) los píxeles y escaleras que entran en pantalla y revela los titulares y tarjetas de las
      páginas que lo piden con <body data-movimiento="revela">. Lo que se ve en el primer pantallazo no se anima.
   2. Pausa las animaciones de ambiente fuera de pantalla (clase .fuera).
   3. Activa el botón «Pausar animaciones» del pie (WCAG 2.2.2). */
(function () {
  var d = document.documentElement;
  var KEY = 'sellpix_sin_movimiento';
  var permitido = 'IntersectionObserver' in window && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!permitido) return;

  /* 1 · Entrada: píxeles, escaleras y bloques.
     No se lee ninguna medida del diseño (getBoundingClientRect, innerHeight…): hacerlo al arrancar fuerza un reflujo
     antes del primer pintado. Un primer IntersectionObserver, que el navegador resuelve ya con el diseño calculado,
     dice qué está dentro de la pantalla (se deja quieto y encendido) y qué debajo (se oculta hasta que llegue). */
  var candidatos = Array.prototype.slice.call(document.querySelectorAll('[data-enciende]:not(.encendido), [data-escalera]'));
  if (document.body && document.body.getAttribute('data-movimiento') === 'revela') {
    var porPadre = new Map();
    document.querySelectorAll('main h2.sp-h2, main .service-card, main .plan, main .sp-card, main .guide-card').forEach(function (el) {
      var n = porPadre.get(el.parentNode) || 0; porPadre.set(el.parentNode, n + 1);
      el.setAttribute('data-revela', ''); el.style.setProperty('--i', Math.min(n, 5));
      /* Los titulares del bloque de cierre que ya se ven no se revelan */
      candidatos.push(el);
    });
  }
  function mostrar(el) { el.classList.remove('oculto'); el.classList.add('encendido'); }
  if (candidatos.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        mostrar(e.target); io.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    var primero = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var el = e.target;
        var dentro = e.boundingClientRect.top < (e.rootBounds ? e.rootBounds.height : 0) - (el.hasAttribute('data-revela') ? 8 : 0);
        if (dentro) {
          if (!el.hasAttribute('data-revela')) el.classList.add('encendido');
          else if (el.closest('.sp-cta-block') && el.tagName === 'H2') el.removeAttribute('data-revela');
          return;
        }
        el.classList.add('oculto'); io.observe(el);
      });
      primero.disconnect();
    });
    candidatos.forEach(function (el) { primero.observe(el); });
    /* Red de seguridad: nada se queda oculto si el observador no llega a avisar */
    window.addEventListener('load', function () {
      setTimeout(function () {
        var vh = window.innerHeight || d.clientHeight;
        document.querySelectorAll('.oculto').forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > 0) mostrar(el);
        });
      }, 2500);
    });
    window.addEventListener('beforeprint', function () { document.querySelectorAll('.oculto').forEach(mostrar); });
  }

  /* 2 · Ambiente: parado fuera de pantalla */
  var ambiente = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.target.classList.toggle('fuera', !e.isIntersecting); });
  });
  document.querySelectorAll('.sp-pixel-field, .pixel-stair, .fondo-foto').forEach(function (el) { ambiente.observe(el); });

  /* 3 · Botón «Pausar animaciones» */
  var boton = document.querySelector('.pausa-anim');
  if (!boton) return;
  function aplicar(pausado, guardar) {
    d.classList.toggle('sin-movimiento', pausado);
    d.classList.toggle('anima', !pausado);
    if (pausado) document.getAnimations().forEach(function (an) { try { an.finish(); } catch (e) { an.cancel(); } }); // las de entrada se muestran ya terminadas
    boton.setAttribute('aria-pressed', pausado ? 'true' : 'false');
    boton.textContent = pausado ? 'Reanudar animaciones' : 'Pausar animaciones';
    if (guardar) { try { window.localStorage.setItem(KEY, pausado ? '1' : '0'); } catch (e) { /* sin almacenamiento: vale para esta visita */ } }
  }
  aplicar(d.classList.contains('sin-movimiento'), false);
  boton.hidden = false;
  boton.addEventListener('click', function () { aplicar(!d.classList.contains('sin-movimiento'), true); });
})();
