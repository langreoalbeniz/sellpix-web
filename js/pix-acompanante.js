/* Pix acompañante y visor de realidad aumentada (BRAND.md, «Mascota: Pix»). Se carga con defer después de js/pix.js y
   arranca tras el evento load, en las páginas que no están excluidas (confirmar/, legales, condiciones, créditos,
   cuestionario, gracias y 404 no lo cargan). Nunca hay dos Pix a la vista: se esconde mientras se ve el símbolo 3D del
   héroe de la portada, la sección «Conoce a Pix» (#pix), el formulario de contacto (#formulario), el pie o el menú móvil.
   Mira hacia el ratón (escritorio) o gira un fotograma al hacer scroll (móvil), parpadea, se pone contento si hay un
   precio a la vista y celebra al pulsar «Contratar» o «Suscribirme». Su botón abre un menú (no un bocadillo) con el
   cuestionario, el visor 3D y «Ocultar a Pix», que se guarda en localStorage (sellpix_pix_oculto) y deja un botón
   «Mostrar a Pix» en el pie. Con movimiento reducido o en pausa (sin html.anima) aparece sin salto, quieto en
   pix-mira-3, sin mirar ni reaccionar; el menú y el visor siguen funcionando.
   El visor (@google/model-viewer 4.4.0, alojado en js/vendor/) se importa solo al pulsar «Ver a Pix en tu espacio»,
   nunca al cargar la página; también lo abre cualquier [data-pix-visor] (sección «Conoce a Pix» de El estudio). */
(function () {
  var d = document.documentElement;
  var P = window.SellPixPix;
  if (!P || !('IntersectionObserver' in window)) return;
  var KEY = 'sellpix_pix_oculto';
  var script = document.currentScript || document.querySelector('script[src*="pix-acompanante"]');
  var RAIZ = script ? script.getAttribute('src').replace(/js\/pix-acompanante\.js.*$/, '') : '';
  var IMG = RAIZ + 'img/pix3d/';
  var fino = window.matchMedia('(hover: hover) and (pointer: fine)');

  function anima() { return P.anima(); }
  function leerOculto() { try { return window.localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function guardarOculto(v) { try { if (v) window.localStorage.setItem(KEY, '1'); else window.localStorage.removeItem(KEY); } catch (e) { /* sin almacenamiento: vale para esta visita */ } }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  /* ── Visor de realidad aumentada ─────────────────────────────────────────────────────────────────────────────── */
  var visor = { dialogo: null, nota: null, escena: null, opener: null, mv: null };
  function crearVisor() {
    var dlg = el('dialog', 'pix-visor'); dlg.setAttribute('aria-labelledby', 'pix-visor-titulo');
    var cab = el('div', 'pix-visor-cabecera');
    var h = el('h2', 'sp-h3', 'Pix en tu espacio'); h.id = 'pix-visor-titulo';
    var cerrar = el('button', 'sp-btn sp-btn--ghost pix-visor-cerrar', 'Cerrar'); cerrar.type = 'button';
    cab.appendChild(h); cab.appendChild(cerrar);
    var escena = el('div', 'pix-visor-escena');
    var nota = el('p', 'pix-visor-nota sp-small', 'Cargando el visor…');
    dlg.appendChild(cab); dlg.appendChild(escena); dlg.appendChild(nota);
    cerrar.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // clic en el fondo
    dlg.addEventListener('close', function () { if (visor.opener && visor.opener.isConnected) visor.opener.focus(); });
    document.body.appendChild(dlg);
    visor.dialogo = dlg; visor.nota = nota; visor.escena = escena;
    return dlg;
  }
  function montarModelo() {
    var mv = document.createElement('model-viewer');
    mv.setAttribute('src', RAIZ + 'modelos/pix.glb');
    mv.setAttribute('ios-src', RAIZ + 'modelos/pix.usdz');
    mv.setAttribute('ar', ''); mv.setAttribute('ar-modes', 'webxr scene-viewer quick-look'); mv.setAttribute('ar-placement', 'floor');
    mv.setAttribute('camera-controls', ''); mv.setAttribute('touch-action', 'pan-y');
    mv.setAttribute('shadow-intensity', '1'); mv.setAttribute('poster', IMG + 'pix-mira-3.webp');
    mv.setAttribute('alt', 'Pix, la mascota de SellPix: un cubo lima con ojos, en 3D');
    var ar = el('button', 'sp-btn sp-btn--secondary pix-visor-ar', 'Ver en tu espacio'); ar.type = 'button'; ar.setAttribute('slot', 'ar-button');
    mv.appendChild(ar);
    mv.addEventListener('load', function () {
      visor.nota.textContent = mv.canActivateAR ? 'Pulsa «Ver en tu espacio» para ponerlo en tu mesa. Puedes girarlo arrastrando.' : 'Puedes girarlo arrastrando. Desde el móvil puedes ponerlo en tu mesa.';
    });
    mv.addEventListener('error', function () { visor.nota.textContent = 'No se ha podido cargar el modelo. Prueba más tarde.'; });
    visor.escena.appendChild(mv); visor.mv = mv;
  }
  function abrirVisor(opener) {
    var dlg = visor.dialogo || crearVisor();
    visor.opener = opener || document.activeElement;
    if (typeof dlg.showModal !== 'function') { window.location.assign(RAIZ + 'modelos/pix.glb'); return; }
    dlg.showModal();
    dlg.querySelector('.pix-visor-cerrar').focus();
    if (visor.mv) return;
    if (!visor.cargando) {
      /* URL absoluta: un import() dentro de un script clásico se resuelve respecto al propio script (js/), no a la página */
      visor.cargando = import(new URL(RAIZ + 'js/vendor/model-viewer.min.js', document.baseURI).href)
        .then(function () { return window.customElements.whenDefined('model-viewer'); })
        .then(montarModelo, function () { visor.nota.textContent = 'No se ha podido cargar el visor. Prueba más tarde.'; visor.cargando = null; });
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-pix-visor]');
    if (b) { e.preventDefault(); abrirVisor(b); }
  });
  document.querySelectorAll('[data-pix-visor]').forEach(function (b) { b.hidden = false; });
  window.SellPixVisor = { abrir: abrirVisor };

  /* ── Acompañante ─────────────────────────────────────────────────────────────────────────────────────────────── */
  var raiz, boton, img, menu, items, pie, botonMostrar;
  var visible = false, oculto = leerOculto(), menuAbierto = false, haSaltado = false;
  var bloqueos = {}; // qué impide que se vea: hero, pix (sección), formulario, pie, menuMovil
  var estado = 'mira', mira = 3, objetivo = 3, precios = 0, tCelebra = null, tMira = null, tParpadeo = null, tVuelta = null;

  function crear() {
    raiz = el('div', 'pix-acomp'); raiz.hidden = true;
    boton = el('button', 'pix-acomp-boton'); boton.type = 'button';
    boton.setAttribute('aria-label', 'Opciones de Pix'); boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'pix-acomp-menu'); boton.setAttribute('aria-haspopup', 'menu');
    img = el('img', 'pix-acomp-img'); img.src = IMG + 'pix-mira-3.webp'; img.width = 256; img.height = 256; img.alt = ''; img.setAttribute('aria-hidden', 'true'); img.decoding = 'async';
    try { img.fetchPriority = 'low'; } catch (e) { /* sin fetchPriority: igual */ }
    menu = el('div', 'pix-acomp-menu'); menu.id = 'pix-acomp-menu'; menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', 'Opciones de Pix'); menu.hidden = true;
    var a = el('a', 'pix-acomp-item', '¿Te ayudamos a elegir?'); a.href = RAIZ + 'que-web-necesitas/'; a.setAttribute('role', 'menuitem');
    var v = el('button', 'pix-acomp-item', 'Ver a Pix en tu espacio'); v.type = 'button'; v.setAttribute('role', 'menuitem');
    var o = el('button', 'pix-acomp-item', 'Ocultar a Pix'); o.type = 'button'; o.setAttribute('role', 'menuitem');
    menu.appendChild(a); menu.appendChild(v); menu.appendChild(o); items = [a, v, o];
    raiz.appendChild(img); raiz.appendChild(boton); raiz.appendChild(menu);
    document.body.appendChild(raiz);
    boton.addEventListener('click', function () { if (menuAbierto) cerrarMenu(true); else abrirMenu(); });
    v.addEventListener('click', function () { cerrarMenu(false); abrirVisor(boton); });
    o.addEventListener('click', function () { cerrarMenu(false); ocultar(); });
    menu.addEventListener('keydown', teclasMenu);
    raiz.addEventListener('focusout', function (e) { if (menuAbierto && !raiz.contains(e.relatedTarget)) cerrarMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuAbierto) { e.preventDefault(); cerrarMenu(true); } });
    document.addEventListener('click', function (e) { if (menuAbierto && !raiz.contains(e.target)) cerrarMenu(false); });
  }
  function abrirMenu() {
    menu.hidden = false; menuAbierto = true; boton.setAttribute('aria-expanded', 'true');
    items[0].focus();
  }
  function cerrarMenu(enfocar) {
    menu.hidden = true; menuAbierto = false; boton.setAttribute('aria-expanded', 'false');
    if (enfocar) boton.focus();
  }
  function teclasMenu(e) {
    var i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); var n = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length; items[n].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
  }

  /* Fotograma según el estado: celebra > contento > mira-N; quieto en mira-3 sin .anima */
  function pintar() {
    var f = !anima() ? 'pix-mira-3' : estado === 'celebra' ? 'pix-celebra' : estado === 'contento' ? 'pix-contento' : 'pix-mira-' + mira;
    P.fotograma(img, f);
  }
  function parpadear() {
    window.clearTimeout(tParpadeo);
    tParpadeo = window.setTimeout(parpadear, 5000 + Math.random() * 2000);
    if (!visible || !anima() || estado !== 'mira') return;
    P.fotograma(img, 'pix-parpadea');
    window.setTimeout(function () { if (estado === 'mira') pintar(); }, 160);
  }
  /* Escritorio: la mirada sigue al ratón con suavizado (un fotograma cada 70 ms hacia el objetivo) */
  function haciaObjetivo() {
    tMira = null;
    if (mira === objetivo) return;
    mira += mira < objetivo ? 1 : -1; pintar();
    tMira = window.setTimeout(haciaObjetivo, 70);
  }
  function mirarA(frame) {
    objetivo = Math.max(0, Math.min(6, frame));
    if (!tMira && mira !== objetivo) tMira = window.setTimeout(haciaObjetivo, 70);
  }
  var rafRaton = 0;
  function raton(e) {
    if (!visible || !anima() || estado !== 'mira' || rafRaton) return;
    rafRaton = window.requestAnimationFrame(function () {
      rafRaton = 0;
      var r = boton.getBoundingClientRect(); var cx = r.left + r.width / 2;
      var t = (e.clientX - cx) / (window.innerWidth / 2); // −1 … 1
      mirarA(Math.round(3 + 3 * Math.max(-1, Math.min(1, t))));
    });
  }
  /* Móvil: con el scroll gira un fotograma en el sentido del movimiento y vuelve al frente a los 500 ms */
  var ultimoY = window.pageYOffset;
  function scrollMovil() {
    if (fino.matches) return;
    var y = window.pageYOffset; var abajo = y > ultimoY; ultimoY = y;
    if (!visible || !anima() || estado !== 'mira') return;
    mira = abajo ? 4 : 2; pintar();
    window.clearTimeout(tVuelta); tVuelta = window.setTimeout(function () { mira = 3; if (estado === 'mira') pintar(); }, 500);
  }
  function celebrar() {
    if (!visible || !anima()) { return; }
    estado = 'celebra'; pintar(); P.brinca(raiz);
    window.clearTimeout(tCelebra);
    tCelebra = window.setTimeout(function () { estado = 'contento'; pintar(); }, 1100);
  }
  function recalcularEstado() {
    if (estado === 'celebra') return;
    var nuevo = precios > 0 ? 'contento' : 'mira';
    if (nuevo !== estado) { estado = nuevo; if (estado === 'mira') { mira = 3; objetivo = 3; } pintar(); }
  }

  /* Mostrar u ocultar según los bloqueos; la primera vez entra con un salto (600 ms), después con un fundido */
  var animEntrada = null;
  function deseado() { if (oculto) return false; for (var k in bloqueos) if (bloqueos[k]) return false; return true; }
  function aplicar() {
    var quiero = deseado();
    if (quiero === visible) return;
    visible = quiero;
    if (animEntrada) { animEntrada.cancel(); animEntrada = null; }
    if (visible) {
      raiz.hidden = false; pintar();
      if (anima()) {
        animEntrada = haSaltado
          ? raiz.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
          : raiz.animate([
            { opacity: 0, transform: 'translateY(40%) scale(1, 1)' },
            { opacity: 1, transform: 'translateY(-14%) scale(.94, 1.08)', offset: 0.45 },
            { opacity: 1, transform: 'translateY(0) scale(1.08, .86)', offset: 0.75 },
            { opacity: 1, transform: 'translateY(0) scale(1, 1)' }
          ], { duration: 600, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
        haSaltado = true;
      }
    } else {
      if (menuAbierto) cerrarMenu(false);
      if (anima()) {
        animEntrada = raiz.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px)' }], { duration: 200, easing: 'ease-in-out' });
        animEntrada.onfinish = function () { if (!visible) raiz.hidden = true; animEntrada = null; };
      } else raiz.hidden = true;
    }
  }
  function bloquear(k, v) { bloqueos[k] = v; aplicar(); }

  /* «Ocultar a Pix» y «Mostrar a Pix» (botón del pie, junto a «Pausar animaciones») */
  function botonPie() {
    if (botonMostrar || !pie) return;
    botonMostrar = el('button', 'sp-btn sp-btn--ghost pausa-anim mostrar-pix', 'Mostrar a Pix'); botonMostrar.type = 'button';
    var pausa = pie.querySelector('.pausa-anim');
    if (pausa) pausa.insertAdjacentElement('afterend', botonMostrar); else pie.querySelector('.sp-container').appendChild(botonMostrar);
    botonMostrar.addEventListener('click', function () { oculto = false; guardarOculto(false); botonMostrar.remove(); botonMostrar = null; aplicar(); });
  }
  function ocultar() {
    oculto = true; guardarOculto(true); aplicar(); botonPie();
    if (botonMostrar) botonMostrar.focus();
  }

  function arrancar() {
    pie = document.querySelector('footer');
    crear();
    if (oculto) botonPie();
    /* Otro Pix a la vista, el pie o el formulario de contacto: Pix se aparta */
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { bloquear(e.target.getAttribute('data-pix-bloqueo'), e.isIntersecting); }); });
    [['hero', '.hero-3d'], ['pix', '#pix'], ['formulario', '#formulario'], ['pie', 'footer']].forEach(function (par) {
      var n = document.querySelector(par[1]); if (!n) return;
      n.setAttribute('data-pix-bloqueo', par[0]); bloqueos[par[0]] = true; io.observe(n);
    });
    /* Menú móvil abierto: nunca lo tapa */
    var movil = document.getElementById('mobile-menu');
    if (movil) {
      bloqueos.menuMovil = movil.classList.contains('open');
      new MutationObserver(function () { bloquear('menuMovil', movil.classList.contains('open')); }).observe(movil, { attributes: true, attributeFilter: ['class'] });
    }
    /* Precios a la vista: contento */
    var precioIo = new IntersectionObserver(function (es) { es.forEach(function (e) { precios += e.isIntersecting ? 1 : -1; }); precios = Math.max(0, precios); recalcularEstado(); });
    document.querySelectorAll('[data-dato*=".precio"]').forEach(function (n) { precioIo.observe(n); });
    /* Contratar / Suscribirme: celebra sin retrasar nada */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a, button'); if (!a) return;
      var txt = (a.textContent || '').trim();
      if (a.hasAttribute('data-contratar-form') || /^(Contratar|Suscribirme)/.test(txt)) celebrar();
    }, true);
    window.addEventListener('mousemove', raton, { passive: true });
    window.addEventListener('scroll', scrollMovil, { passive: true });
    new MutationObserver(function () { if (!anima()) { window.clearTimeout(tMira); tMira = null; mira = 3; objetivo = 3; } pintar(); }).observe(d, { attributes: true, attributeFilter: ['class'] });
    tParpadeo = window.setTimeout(parpadear, 3000 + Math.random() * 2000);
    aplicar();
    P.precargar(img, P.TODOS); // los 13 fotogramas, prioridad baja
  }
  if (document.readyState === 'complete') window.setTimeout(arrancar, 0);
  else window.addEventListener('load', function () { window.setTimeout(arrancar, 0); });
})();
