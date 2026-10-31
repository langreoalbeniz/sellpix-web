/* Pix, la mascota (BRAND.md, «Mascota: Pix»). El SVG y las poses son CSS (css/site.css, marcado en scripts/pix.js);
   este archivo solo cambia la pose y hace los saltos de las páginas interactivas (hoy, el cuestionario). Los saltos
   usan la Web Animations API con transform únicamente y no se hacen con movimiento reducido ni en pausa (sin html.anima). */
(function () {
  var d = document.documentElement;
  var EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  function anima() { return d.classList.contains('anima') && typeof Element.prototype.animate === 'function'; }
  function saltar(el, frames, ms) { if (el && anima()) el.animate(frames, { duration: ms, easing: EASE }); }
  window.SellPixPix = {
    anima: anima,
    /* Cambia la pose; si ya estaba, la reinicia (así «celebra» o «piensa» vuelven a empezar) */
    pose: function (el, pose) {
      if (!el) return;
      if (el.getAttribute('data-pose') === pose) { el.setAttribute('data-pose', 'normal'); void el.getBoundingClientRect(); }
      el.setAttribute('data-pose', pose);
    },
    /* Salto de entrada, unos 600 ms: sube, cae y se aplasta un poco al aterrizar */
    salta: function (el) {
      saltar(el, [
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(-90%) scale(.94, 1.08)', offset: 0.38 },
        { transform: 'translateY(0) scale(1.08, .86)', offset: 0.72 },
        { transform: 'translateY(0) scale(1, 1)' }
      ], 600);
    },
    /* Salto de entrada desde otro sitio (dx, dy = lo que hay que volver atrás): arco de unos 600 ms y aterrizaje aplastado */
    vuela: function (el, dx, dy) {
      saltar(el, [
        { transform: 'translate(' + dx + 'px, ' + dy + 'px)' },
        { transform: 'translate(' + dx * 0.5 + 'px, ' + (dy * 0.5 - 48) + 'px) scale(.94, 1.08)', offset: 0.4 },
        { transform: 'translate(0, 0) scale(1.08, .86)', offset: 0.75 },
        { transform: 'translate(0, 0) scale(1, 1)' }
      ], 600);
    },
    /* Saltito con cada respuesta, unos 300 ms */
    brinca: function (el) {
      saltar(el, [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-28%)', offset: 0.45 },
        { transform: 'translateY(0)' }
      ], 300);
    }
  };
})();
