/* Recorrido de contratación: botón → cuestionario de Tally (ventana emergente) → confirmar/<servicio>/ → pago en Stripe.
   Sin JavaScript el enlace abre el cuestionario en tally.so. El email del cuestionario se guarda en sessionStorage
   (clave sellpix_email) para que la página de confirmación lo pase a Stripe; nunca viaja en la URL de sellpix.es. */
(function () {
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

  var links = document.querySelectorAll('a[data-contratar-form][data-contratar-confirmar]');
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute('aria-haspopup', 'dialog');
    links[i].addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      e.preventDefault();
      open(e.currentTarget);
    });
  }
})();
