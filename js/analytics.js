/* =====================================================================
   Analytics loader
   ---------------------------------------------------------------------
   TO ACTIVATE: put your GA4 Measurement ID below (looks like "G-XXXXXXXXXX")
   and push. While it is empty this file does nothing at all - no network
   requests, no cookies, no performance cost.

   Get the ID from: https://analytics.google.com -> Admin -> Data Streams
   ===================================================================== */
(function () {
  'use strict';

  var MEASUREMENT_ID = '';

  if (!MEASUREMENT_ID) return;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, { anonymize_ip: true });

  // The actions that actually matter for this site
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1) gtag('event', 'whatsapp_click');
    else if (href.indexOf('tel:') === 0) gtag('event', 'phone_click');
    else if (href.indexOf('mailto:') === 0) gtag('event', 'email_click');
  });
})();
