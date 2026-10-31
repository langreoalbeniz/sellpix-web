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

  /* 1 · Entrada: píxeles, escaleras y bloques */
  var vh = window.innerHeight || d.clientHeight;
  var entrada = [];
  function marcar(el, oculto) { if (oculto) el.classList.add('oculto'); entrada.push(el); }
  document.querySelectorAll('[data-enciende]:not(.encendido), [data-escalera]').forEach(function (el) {
    if (el.getBoundingClientRect().top < vh) { el.classList.add('encendido'); return; }
    el.classList.add('oculto'); entrada.push(el);
  });
  if (document.body && document.body.getAttribute('data-movimiento') === 'revela') {
    var bloques = document.querySelectorAll('main h2.sp-h2, main .service-card, main .plan, main .sp-card, main .guide-card');
    var porPadre = new Map();
    bloques.forEach(function (el) {
      if (el.closest('.sp-cta-block') && el.tagName === 'H2' && el.getBoundingClientRect().top < vh) return;
      var n = porPadre.get(el.parentNode) || 0; porPadre.set(el.parentNode, n + 1);
      el.setAttribute('data-revela', ''); el.style.setProperty('--i', Math.min(n, 5));
      if (el.getBoundingClientRect().top > vh - 8) marcar(el, true);
    });
  }
  if (entrada.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.remove('oculto'); e.target.classList.add('encendido'); io.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    entrada.forEach(function (el) { io.observe(el); });
    /* Red de seguridad: nada se queda oculto si el observador no llega a avisar */
    window.addEventListener('load', function () {
      setTimeout(function () {
        document.querySelectorAll('.oculto').forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > 0) { el.classList.remove('oculto'); el.classList.add('encendido'); }
        });
      }, 2500);
    });
    window.addEventListener('beforeprint', function () { document.querySelectorAll('.oculto').forEach(function (el) { el.classList.remove('oculto'); el.classList.add('encendido'); }); });
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
