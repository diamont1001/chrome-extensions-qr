/**
 * background script
 * 常驻进程
 */

'use strict';

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


const menuIds = [];
menuIds[0] = chrome.contextMenus.create({
  title: chrome.i18n.getMessage('menu_text_link'),
  contexts: ['all'],
  onclick: handleMenuOnclick
});
menuIds[1] = chrome.contextMenus.create({
  title: chrome.i18n.getMessage('menu_text_img'),
  contexts: ['all'],
  onclick: handleMenuOnclick
});
menuIds[2] = chrome.contextMenus.create({
  title: chrome.i18n.getMessage('menu_text_select'),
  contexts: ['all'],
  onclick: handleMenuOnclick
});

chrome.contextMenus.create({
  type: 'separator',
  contexts: ['all']
});
const menuCurrent = chrome.contextMenus.create({
  title: chrome.i18n.getMessage('menu_text_page'),
  contexts: ['all'],
  onclick: handleMenuOnclick
});

// 接收 content_script 发来的消息
chrome.runtime.onMessage.addListener(function(request/* , sender, sendResponse */) {
  if (request.name === 'update_menu') {
    const menus = request.menus;
    for (let i = 0; i < menus.length; i++) {
      chrome.contextMenus.update(menuIds[i], {
        visible: true,
        enabled: !!menus[i]
      });
    }
  }
});

function handleMenuOnclick(info, tab) {
  let content = '';

  switch (parseInt(info.menuItemId)) {
  case menuIds[0]:
    content = info.linkUrl;
    break;
  case menuIds[1]:
    content = info.srcUrl;
    break;
  case menuIds[2]:
    content = info.selectionText; // 用户选择内容
    break;
  case menuCurrent:
    content = tab.url; // 当前页面
    break;
  }

  if (content) {
    chrome.tabs.sendMessage(tab.id, {
      name: 'generate_qr',
      content: content
    }, function(response) {
      if (response.name !== 'run_script') {
        return;
      }
      if (response.isframe) {
        const w = 415;
        const h = 415 + 22;
        const x = Math.round((screen.width - w) / 2);
        const y = Math.round((screen.height - h) / 2);
        chrome.windows.create({
          url: 'bundle/qr-frame.html?l=' + encodeURIComponent(response.content),
          left: x,
          top: y,
          width: w,
          height: h,
          type: 'popup'
        });
      } else {
        // 注入二维码处理JS
        chrome.tabs.executeScript(tab.id, {file: 'lib/jquery-1.7.1.min.js'});
        chrome.tabs.executeScript(tab.id, {file: 'lib/jquery.mousewheel.js'}); // 鼠标滚轮事件
        chrome.tabs.executeScript(tab.id, {file: 'bundle/content-qr.js'});
      }
    });
  }
}
