'use strict';

const jrQrcode = require('jr-qrcode');

window.addEventListener('load', function() {
  const content = decodeURIComponent(document.location.search.substring(3));
  const imgUrl = jrQrcode.getQrBase64(content, {
    padding: 30,
    width: 400,
    height: 400,
    correctLevel: QRErrorCorrectLevel.L
  });

  document.getElementById('qrimg').setAttribute('src', imgUrl);
});
