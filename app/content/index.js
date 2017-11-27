/**
 * content script
 */

'use strict';

const jrQrcode = require('jr-qrcode');

// 右键 => menu 管理
document.addEventListener('mousedown', function(e) {
  if (e.which !== 3) { // 1:mouse left   2:mouse mid   3:mouse right
    return;
  }

  const menus = [0, 0, 0]; // [链接, 图片, 文本]
  const selectText = getSelectionText();
  let targ = e.target ? e.target : e.srcElement;

  if (targ.nodeType === 3) {
    targ = targ.parentNode;
  }
  
  let count = 10;
  while (targ.tagName !== 'HTML' && targ.tagName !== 'BODY' && count > 0) {
    menus[0] = menus[1] = menus[2] = 0;

    switch (targ.tagName) {
    case 'IMG':
      menus[1] = 1;
      if (targ.parentNode.tagName === 'A') {
        menus[0] = 1;
      }
      count = 0;
      break;
    case 'A':
      menus[0] = 1;
      if (selectText) {
        menus[2] = 1;
      }
      count = 0;
      break;
    default:
      if (selectText) {
        menus[2] = 1;
        count = 0;
      }
      break;
    }
    count--;
    targ = targ.parentNode;
  }

  // 向 bg.js 发送消息
  chrome.extension.sendMessage({
    name: 'update_menu',
    menus: menus
  });
}, false);

// 接收 bg.js 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.name === 'generate_qr' && request.content) {
    // 对于多frame的页面，会出现响应多次消息的BUG
    var width = 350;
    var height = 350;
    var padding = 10;
    var x = (window.innerWidth - width) / 2 - padding;
    var y = (window.innerHeight - height) / 2 - padding;
    var isFrame = false;
    if (top.document.getElementsByTagName('FRAME').length > 0) { // 有frameset
      isFrame = true;
    } else {
      const render = require('./qr-img.art');
      $('body').append(render({
        width: width,
        height: height,
        padding: padding,
        x: x,
        y: y,
        imgUrl: jrQrcode.getQrBase64(request.content)
      }));
    }
    sendResponse({
      name: 'run_script',
      isframe: isFrame, // 是否frame结构网页，对于frame结构网页，不能用注入页面的方式，只能用弹窗
      content: request.content
    });
  }
});

// 获取用户选择的内容
function getSelectionText() {
  const userSelection = window.getSelection();

  if (userSelection.isCollapsed) {
    return '';
  }
  
  const range = userSelection.getRangeAt(0);
  const clonedSelection = range.cloneContents();

  const div = document.createElement('div');
  div.appendChild(clonedSelection);

  const hrefs = div.querySelectorAll('[href]');
  for (let i = 0, len = hrefs.length; i < len; i++) {
    hrefs[i].href = hrefs[i].href;
  }

  const srcs = div.querySelectorAll('[src]');
  for (var i = 0, len = srcs.length; i < len; i++) {
    srcs[i].src = srcs[i].src;
  }

  const selectText = (div.innerText || '').trim();
  return selectText;
}
