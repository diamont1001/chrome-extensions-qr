'use strict';

require('./index.less');

const jrQrcode = require('jr-qrcode');
const InputText = require('./input-text.js');

/* eslint-disable */
// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-81627907-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
/* eslint-enable */

$(function() {
  const $main = $('#main');

  // 初始化文案
  $main.find('.title').text(chrome.i18n.getMessage('popup_title'));
  $main.find('.content').text(chrome.i18n.getMessage('popup_main_content'));
  $('#btnMain').text(chrome.i18n.getMessage('popup_main_btn'));
  $('#btnGenerate').text(chrome.i18n.getMessage('popup_2_btn'));
  $('#inputTextMyself').attr('placeholder', chrome.i18n.getMessage('popup_2_placeholder'));
  $('#inputTextMyself').val(InputText.getValue());

  // 生成当前页面链接二维码
  chrome.tabs.getSelected(null, function(tab) {
    const imgUrl = jrQrcode.getQrBase64(tab.url, {
      padding: 10,
      width: 150,
      height: 150,
      correctLevel: QRErrorCorrectLevel.L
    });
    $main.find('.main-qr').attr('src', imgUrl);
  });

  $('#btnMain').click(function(e) {
    e.preventDefault();

    $('.section_1').addClass('hide');
    $('.section_2').removeClass('hide');

    _gaq.push(['_trackEvent', 'btn_popup_main_qr_myself', 'clicked']);
  });

  $('#btnBack').click(function(e) {
    e.preventDefault();

    $('.section_1').removeClass('hide');
    $('.section_2').addClass('hide');
    $('#qrImg2').attr('src', '').hide();

    InputText.clear();
    $('#inputTextMyself').val('');

    _gaq.push(['_trackEvent', 'btn_popup_back', 'clicked']);
  });

  // 自定义内容生成二维码
  $('#btnGenerate').click(function() {
    const input = $('#inputTextMyself').val();

    const imgUrl = jrQrcode.getQrBase64(input, {
      padding: 10,
      width: 320,
      height: 320,
      correctLevel: QRErrorCorrectLevel.L
    });
    $('#qrImg2').attr('src', imgUrl).show();

    InputText.setValue(input);

    _gaq.push(['_trackEvent', 'btn_popup_generate_qr_myself', 'clicked']);
  });

  $(window).unload(function() {
    const input = $('#inputTextMyself').val();
    if (input) {
      InputText.setValue(input);
    }
  });
});
