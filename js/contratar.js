/* Recorrido de contratación: botón → cuestionario de Tally (ventana emergente) → confirmar/<servicio>/ → pago en Stripe.
   Sin JavaScript el enlace abre el cuestionario en tally.so. El email del cuestionario se guarda en sessionStorage
   (clave sellpix_email) para que la página de confirmación lo pase a Stripe; nunca viaja en la URL de sellpix.es.
   Navegadores automatizados (navigator.webdriver) y cualquier host distinto de sellpix.es / www.sellpix.es no cargan Tally ni lo abren:
   así las pruebas no ensucian la analítica del formulario. En ese caso el botón muestra el enlace de respaldo, sin seguirlo. */
(function () {
  var BLOQUEADO = navigator.webdriver === true || !/^(www\.)?sellpix\.es$/.test(location.hostname);
  var EMBED = 'https://tally.so/widgets/embed.js';
  var loading = null;
  var openFormId = null;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openFormId && window.Tally && window.Tally.closePopup) window.Tally.closePopup(openFormId);
  });

  function loadEmbed() {
    if (window.Tally && window.Tally.openPopup) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = EMBED;
      s.async = true;
      s.onload = function () { if (window.Tally && window.Tally.openPopup) { resolve(); } else { reject(new Error('Tally no disponible')); } };
      s.onerror = function () { reject(new Error('No se pudo cargar Tally')); };
      document.head.appendChild(s);
    });
    return loading;
  }

  function emailFromPayload(payload) {
    var fields = (payload && payload.fields) || [];
    var value = null;
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (f && f.type === 'INPUT_EMAIL' && f.answer && f.answer.value) { value = f.answer.value; break; }
    }
    if (!value) {
      for (var j = 0; j < fields.length; j++) {
        var v = fields[j] && fields[j].answer ? fields[j].answer.value : null;
        if (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { value = v; break; }
      }
    }
    return typeof value === 'string' ? value.trim() : '';
  }

  function goToConfirm(url, email) {
    try { if (email) window.sessionStorage.setItem('sellpix_email', email); } catch (e) { /* sin almacenamiento: el pago sigue sin email */ }
    window.location.assign(url);
  }

  function open(link) {
    var formId = link.getAttribute('data-contratar-form');
    var confirmar = link.getAttribute('data-contratar-confirmar');
    link.setAttribute('aria-busy', 'true');
    loadEmbed().then(function () {
      link.removeAttribute('aria-busy');
      openFormId = formId;
      window.Tally.openPopup(formId, {
        layout: 'modal',
        width: 640,
        autoClose: 0,
        onClose: function () { openFormId = null; link.focus(); },
        onSubmit: function (payload) { goToConfirm(confirmar, emailFromPayload(payload)); }
      });
    }).catch(function () {
      link.removeAttribute('aria-busy');
      window.location.href = link.href;
    });
  }

  function mostrarRespaldo(link) {
    if (link.nextElementSibling && link.nextElementSibling.hasAttribute('data-contratar-respaldo')) return;
    var nota = document.createElement('p');
    nota.className = 'sp-small u-muted u-mt-5';
    nota.setAttribute('role', 'status');
    nota.setAttribute('data-contratar-respaldo', '');
    nota.appendChild(document.createTextNode('Aquí no se carga el cuestionario. '));
    var enlace = document.createElement('a');
    enlace.href = link.href;
    enlace.textContent = 'Ábrelo en Tally';
    nota.appendChild(enlace);
    nota.appendChild(document.createTextNode('.'));
    link.insertAdjacentElement('afterend', nota);
  }

  var links = document.querySelectorAll('a[data-contratar-form][data-contratar-confirmar]');
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute('aria-haspopup', 'dialog');
    links[i].addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      e.preventDefault();
      if (BLOQUEADO) { mostrarRespaldo(e.currentTarget); return; }
      open(e.currentTarget);
    });
  }
})();
