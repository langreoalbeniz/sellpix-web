/* Página de confirmación: si el cuestionario de Tally guardó el email en sessionStorage,
   lo añade al enlace de pago de Stripe como prefilled_email. Sin JavaScript el botón funciona igual, sin email.
   El email nunca viaja en la URL de sellpix.es. */
(function () {
  var link = document.querySelector('a[data-pago]');
  if (!link) return;
  var email = '';
  try { email = window.sessionStorage.getItem('sellpix_email') || ''; } catch (e) { email = ''; }
  email = String(email).trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  var href = link.getAttribute('href');
  link.setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + 'prefilled_email=' + encodeURIComponent(email));
})();
