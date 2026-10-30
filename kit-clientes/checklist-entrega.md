# Checklist de entrega

> Lista para repasar antes de publicar una web de cliente y de darla por entregada. Copia este archivo a la carpeta del cliente y ve marcando. Nada se publica con un punto sin marcar o sin una nota que explique por qué no aplica. No se publica en la web.

**Cliente:** [NOMBRE_CLIENTE] · **Proyecto:** [TIPO_DE_PROYECTO] · **Dominio:** [DOMINIO] · **Fecha de entrega:** [FECHA]

---

## Antes de publicar

### Contenido y venta

- [ ] La primera pantalla dice qué vende el negocio, para quién y qué hacer, sin hacer scroll en el móvil.
- [ ] Cada servicio o producto tiene qué incluye, para quién es y precio (o de qué depende).
- [ ] Hay una sola acción principal por pantalla y se repite al final de la página.
- [ ] Las preguntas frecuentes son las reales de la reunión inicial.
- [ ] Los textos están revisados: sin faltas, sin «soluciones integrales», con el tratamiento acordado (tú o usted).
- [ ] Nombre, dirección, teléfono y horario coinciden con los del Perfil de Empresa de Google y las redes.
- [ ] No queda ningún texto de relleno, corchete ni dato por confirmar en ninguna página (buscar en todo el código, incluidos `alt`, `title` y comentarios).
- [ ] Las opiniones publicadas son reales y tienen permiso de quien las firma.
- [ ] Las imágenes son del cliente o con licencia; ninguna foto de banco.

### Técnica

- [ ] Todas las páginas cargan en el dominio final con `https://` y la versión sin `www` (o con) redirige a la elegida.
- [ ] `<title>` único por página (hasta 60 caracteres) y meta descripción única (hasta 155).
- [ ] `rel="canonical"`, Open Graph con imagen de 1200 × 630 y un solo `h1` por página.
- [ ] Favicon e icono de Apple.
- [ ] Página 404 propia con enlace al inicio.
- [ ] `robots.txt` y `sitemap.xml` publicados; el sitemap solo lista páginas que deben indexarse.
- [ ] Enlaces internos y externos comprobados: ninguno roto, los externos abren en la misma pestaña salvo que haya motivo.
- [ ] Formularios probados de verdad: el envío llega al correo del cliente y la página de gracias funciona.
- [ ] Botones de teléfono (`tel:`) y WhatsApp (`wa.me`) probados desde un móvil.
- [ ] Imágenes comprimidas y con `width`/`height`; las que no se ven al cargar llevan `loading="lazy"`.
- [ ] Sin errores en la consola del navegador.
- [ ] Dirección antigua de la web, si existía, redirigida con 301 a la nueva.

### Rendimiento, accesibilidad y validación

- [ ] Lighthouse en móvil: 90 o más en rendimiento, accesibilidad, buenas prácticas y SEO en todas las páginas.
- [ ] pa11y (WCAG 2 AA) sin errores en todas las páginas.
- [ ] html-validate sin errores.
- [ ] Capturas en 375 px y 1440 px, claro y oscuro si la web tiene tema oscuro: sin scroll horizontal, todo legible.
- [ ] Contraste AA en textos y botones; foco visible al navegar con teclado; objetivos táctiles de al menos 48 px.
- [ ] Todas las imágenes con `alt` (vacío si son decorativas).
- [ ] Probado en un iPhone y un Android reales, no solo en el emulador.

### Legal

- [ ] Aviso legal con nombre o razón social, NIF o CIF, dirección y email del titular.
- [ ] Política de privacidad adaptada a lo que la web hace de verdad (formularios, analítica, terceros).
- [ ] Política de cookies que corresponde a lo que se instala; banner de consentimiento solo si hay cookies que lo exigen.
- [ ] Si es tienda: condiciones de venta, precios con impuestos y gastos de envío visibles antes de pagar, derecho de desistimiento, política de devoluciones.
- [ ] Enlaces a las páginas legales en el pie de todas las páginas.

## Publicación

- [ ] DNS apuntando al alojamiento y certificado SSL activo.
- [ ] Dominio, alojamiento, cuentas de Google y pasarela de pagos a nombre del cliente, no de SellPix.
- [ ] Perfil de Empresa de Google actualizado con la web nueva.
- [ ] Propiedad verificada en Google Search Console y sitemap enviado.
- [ ] Analítica (si la hay) funcionando y declarada en cookies y privacidad.

## Entrega al cliente

- [ ] Videollamada corta (o vídeo grabado) explicando cómo cambiar textos, fotos y horarios.
- [ ] Documento con los accesos (dominio, alojamiento, editor, Google) enviado por un canal seguro, nunca en un email en claro si incluye contraseñas.
- [ ] Factura emitida.
- [ ] Explicado qué entra en el mantenimiento y qué no, y cómo contratarlo si lo quiere.
- [ ] Pedido permiso para citar el proyecto como referencia a futuros clientes (y en qué términos). En la web no se publican casos.
- [ ] Recordatorio en la agenda para preguntar a los 30 días cómo va y qué contactos han llegado.

## Para SellPix, después

- [ ] Copia del proyecto final archivada.
- [ ] Notas de lo que se podría mejorar en el proceso o en el kit.
