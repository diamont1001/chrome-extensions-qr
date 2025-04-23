/**
 * frameset 页面中，新建的弹出窗的落地页面包含的 JS
 */

'use strict';

/* eslint-disable */
// Google Analytics
// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', 'UA-81627907-3']);
// _gaq.push(['_trackPageview']);

// (function() {
//   var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//   ga.src = 'https://ssl.google-analytics.com/ga.js';
//   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
// })();
/* eslint-enable */


const jrQrcode = require('jr-qrcode');

window.addEventListener('load', function() {
  const content = decodeURIComponent(document.location.search.substring(3));
  const imgUrl = jrQrcode.getQrBase64(content, {
    padding: 20,
    width: 400,
    height: 400,
    correctLevel: QRErrorCorrectLevel.L
  });

  document.getElementById('pp-qr-qrimg').setAttribute('src', imgUrl);
});
