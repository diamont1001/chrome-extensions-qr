/**
 * content 中，二维码操作 JS
 */

'use strict';

/* global $ */

$('.jr_qr_wall').on('wheel', function(event) {
  event.preventDefault();
  var delta = event.originalEvent.deltaY;
  var $this = $(this);
  var $img = $this.find('.jr_qr_img');

  var w, h, x, y;
  var padding = 10;
  var maxSize = Math.min(window.innerWidth, window.innerHeight) - padding * 2;

  if (delta > 0) { // 放大
    w = $this.width() + 10;
    h = $this.height() + 10;
  } else { // 缩小
    w = $this.width() - 10;
    h = $this.height() - 10;
  }

  w = Math.min(Math.max(100, w), maxSize);
  h = Math.min(Math.max(100, h), maxSize);

  x = (window.innerWidth - w) / 2 - padding;
  y = (window.innerHeight - h) / 2 - padding;

  // console.log('w, h', w, h, delta);
  
  $this.css('left', x + 'px');
  $this.css('top', y + 'px');
  $this.css('width', w + 'px');
  $this.css('height', h + 'px');
  $img.css('width', w + 'px');
  $img.css('height', h + 'px');
});

// 点击黑色区域，关闭
$('.jr_qr_overlay').click(function(e) {
  e.stopPropagation();
  const $this = $(this);
  if ($(e.target).hasClass('jr_qr_overlay')) {
    $this.hide();
  }
});

// 键盘响应
$(window).keydown(function(e) {
  if (e.which === 27) { // ESC
    $('.jr_qr_overlay').click();
  }
});

// 浏览器大小变化
$(window).resize(function() {
  const $handle = $('.jr_qr_wall');
  let x, y;
  const padding = 10;
  x = (window.innerWidth - $handle.width()) / 2 - padding;
  y = (window.innerHeight - $handle.height()) / 2 - padding;
  
  $handle.css('left', x + 'px');
  $handle.css('top', y + 'px');
});
