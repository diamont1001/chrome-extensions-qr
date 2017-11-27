/**
 * content 中，二维码操作 JS
 */

'use strict';

/* global $ */

// 鼠标滚轮（放大缩小）
$('.jr_qr_wall').mousewheel(function(event, delta/* , deltaX, deltaY */) {
  const $this = $(this);
  const $img = $this.find('.jr_qr_img');
  let w, h, x, y;
  const padding = 10;

  if (delta > 0) { // 放大
    w = $this.width() + 20;
    h = $this.height() + 20;
  } else { // 缩小
    w = $this.width() - 20;
    h = $this.height() - 20;
    if (w < 100 || h < 100) {
      return false;
    }
  }
  x = (window.innerWidth - w) / 2 - padding;
  y = (window.innerHeight - h) / 2 - padding;
  
  $this.css('left', x + 'px');
  $this.css('top', y + 'px');
  $this.css('width', w + 'px');
  $this.css('height', h + 'px');
  $img.css('width', w + 'px');
  $img.css('height', h + 'px');
  
  return false; // 阻止浏览器内容滚动
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
