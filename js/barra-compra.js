/* Barra de compra fija en móvil (fichas de producto con un solo botón de contratación).
   Aparece cuando la caja de compra sale de la pantalla y repite precio y botón. El botón delega en el original,
   así que el recorrido (Tally → confirmar/) no cambia. No carga nada de terceros y no guarda datos. */
(function () {
  var caja = document.querySelector('.product-buy');
  if (!caja || !('IntersectionObserver' in window)) return;
  var botones = caja.querySelectorAll('[data-contratar-form]');
  if (botones.length !== 1) return;
  var original = botones[0];
  var precio = caja.querySelector('.product-price > span');
  var tax = caja.querySelector('.price-tax');
  if (!precio) return;

  var barra = document.createElement('div');
  barra.className = 'barra-compra';
  barra.hidden = true;
  var info = document.createElement('p');
  info.className = 'barra-compra-precio';
  var cifra = document.createElement('strong');
  cifra.textContent = precio.textContent;
  var pequeno = document.createElement('small');
  pequeno.textContent = tax ? tax.textContent : '';
  info.appendChild(cifra); info.appendChild(pequeno);
  var boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'sp-btn sp-btn--primary';
  boton.textContent = (original.childNodes[0] && original.childNodes[0].textContent || 'Contratar').trim();
  boton.addEventListener('click', function () { original.click(); });
  barra.appendChild(info); barra.appendChild(boton);
  document.body.appendChild(barra);

  var movil = matchMedia('(max-width: 767px)');
  var visible = true, pasada = false;
  function pintar() {
    var mostrar = movil.matches && !visible && pasada;
    barra.hidden = !mostrar;
    document.documentElement.classList.toggle('barra-compra-activa', mostrar);
  }
  new IntersectionObserver(function (e) {
    visible = e[0].isIntersecting;
    /* solo tras haber visto la caja una vez o haberla dejado por arriba/abajo: no antes de cargar */
    pasada = true;
    pintar();
  }).observe(caja);
  if (movil.addEventListener) movil.addEventListener('change', pintar);
})();
