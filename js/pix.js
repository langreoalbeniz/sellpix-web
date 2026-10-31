/* Pix, la mascota (BRAND.md, «Mascota: Pix»). Cada Pix es una <img> con fotogramas renderizados en img/pix3d/ (el marcado
   lo escribe scripts/pix.js). Cambiar de pose es cambiar el src entre fotogramas ya precargados; los saltos usan la Web
   Animations API con transform únicamente. Sin html.anima (movimiento reducido, pausa o sin IntersectionObserver) Pix se
   queda quieto en su pose final: ni parpadea, ni mira, ni salta. Fuera de pantalla (.fuera, lo pone js/movimiento.js) el
   ambiente se para. Este archivo también lo usa el acompañante (js/pix-acompanante.js) para los fotogramas y los saltos. */
(function () {
  var d = document.documentElement;
  var EASE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  /* Fotograma base de cada pose; «celebra» es contento con chispas y vuelve a contento al 1,1 s */
  var FOTOGRAMA = { normal: 'pix-mira-3', mira: 'pix-mira-3', parpadea: 'pix-parpadea', piensa: 'pix-piensa', contento: 'pix-contento', duda: 'pix-duda', celebra: 'pix-celebra', confundido: 'pix-confundido' };
  var TODOS = ['pix-mira-0', 'pix-mira-1', 'pix-mira-2', 'pix-mira-3', 'pix-mira-4', 'pix-mira-5', 'pix-mira-6', 'pix-parpadea', 'pix-contento', 'pix-celebra', 'pix-piensa', 'pix-duda', 'pix-confundido'];
  var AMBIENTE = ['pix-parpadea', 'pix-mira-2', 'pix-mira-3', 'pix-mira-4'];
  var cache = {};

  function anima() { return d.classList.contains('anima') && typeof Element.prototype.animate === 'function'; }
  function carpeta(el) { var s = el.getAttribute('src') || ''; return s.slice(0, s.lastIndexOf('/') + 1); }
  function fotograma(el, nombre) { var u = carpeta(el) + nombre + '.webp'; if (el.getAttribute('src') !== u) el.setAttribute('src', u); }
  /* Precarga con prioridad baja: nunca compite con el contenido ni puede ser el LCP (es una Image sin pintar) */
  function precargar(el, nombres) {
    var base = carpeta(el);
    (nombres || TODOS).forEach(function (n) {
      var u = base + n + '.webp'; if (cache[u]) return;
      var i = new Image(); try { i.fetchPriority = 'low'; } catch (e) { /* sin fetchPriority: igual */ }
      i.decoding = 'async'; i.src = u; cache[u] = i;
    });
  }
  function saltar(el, frames, ms) { if (el && anima()) el.animate(frames, { duration: ms, easing: EASE }); }

  /* Ambiente de cada Pix: parpadeo cada 5–7 s y, en «mira», la vista que va despacio de un lado a otro. Un solo
     temporizador por Pix; se para sin .anima o fuera de pantalla (.fuera) y se retoma solo. */
  function ambiente(el) {
    if (el._pixAmbiente) return;
    el._pixAmbiente = true;
    var mira = 3, sentido = 1;
    function pose() { return el.getAttribute('data-pose') || 'normal'; }
    function base() { var p = pose(); return p === 'mira' ? 'pix-mira-' + mira : FOTOGRAMA[p]; }
    function parpadea() {
      var p = pose();
      if (p === 'contento' || p === 'celebra') return;
      fotograma(el, 'pix-parpadea');
      window.setTimeout(function () { if (pose() === p) fotograma(el, base()); }, 160);
    }
    function tick() {
      window.setTimeout(tick, 5000 + Math.random() * 2000);
      if (!anima() || el.classList.contains('fuera') || !el.isConnected) return;
      parpadea();
    }
    function mirar() {
      window.setTimeout(mirar, 1800 + Math.random() * 1400);
      if (!anima() || el.classList.contains('fuera') || !el.isConnected || pose() !== 'mira') return;
      mira += sentido; if (mira >= 4 || mira <= 2) sentido = -sentido;
      fotograma(el, 'pix-mira-' + mira);
    }
    window.setTimeout(tick, 2500 + Math.random() * 2000);
    window.setTimeout(mirar, 1500);
    el._pixBase = function () { mira = 3; sentido = 1; return base(); };
  }

  window.SellPixPix = {
    anima: anima,
    FOTOGRAMA: FOTOGRAMA,
    TODOS: TODOS,
    fotograma: fotograma,
    precargar: precargar,
    /* Cambia la pose: fotograma de la pose y, en «celebra», chispas 1,1 s y vuelta a contento (sin .anima, contento directo) */
    pose: function (el, pose) {
      if (!el) return;
      if (pose === 'celebra' && !anima()) pose = 'contento';
      el.setAttribute('data-pose', pose);
      fotograma(el, pose === 'mira' && el._pixBase ? el._pixBase() : FOTOGRAMA[pose]);
      if (pose === 'celebra') {
        window.clearTimeout(el._pixCelebra);
        el._pixCelebra = window.setTimeout(function () { if (el.getAttribute('data-pose') === 'celebra') { el.setAttribute('data-pose', 'contento'); fotograma(el, 'pix-contento'); } }, 1100);
      }
    },
    /* Salto de entrada, unos 600 ms: sube, cae y se aplasta un poco al aterrizar */
    salta: function (el) {
      saltar(el, [
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(-60%) scale(.94, 1.08)', offset: 0.38 },
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
        { transform: 'translateY(-18%)', offset: 0.45 },
        { transform: 'translateY(0)' }
      ], 300);
    },
    ambiente: ambiente
  };

  /* Los Pix que ya están en la página: ambiente y, tras load, precarga de los fotogramas que usan */
  var pixes = Array.prototype.slice.call(document.querySelectorAll('img.pix[data-pose]'));
  pixes.forEach(function (el) {
    ambiente(el);
    if (el.getAttribute('data-pose') === 'celebra') window.SellPixPix.pose(el, 'celebra');
  });
  if (pixes.length) {
    window.addEventListener('load', function () {
      pixes.forEach(function (el) { precargar(el, el.hasAttribute('data-quiz-pix') ? TODOS : AMBIENTE.concat(FOTOGRAMA[el.getAttribute('data-pose')] || [])); });
    });
  }
})();
