/**
 * background script
 * 常驻进程
 */

'use strict';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    createContextMenus();
  });
});

function createContextMenus() {
  console.log('createContextMenus');
  const menuIds = [
    'chrome_ext_pp_qr_menu_text_link',
    'chrome_ext_pp_qr_menu_text_img',
    'chrome_ext_pp_qr_menu_text_select',
    'chrome_ext_pp_qr_menu_text_page'
  ];
  chrome.contextMenus.create({
    id: menuIds[0],
    title: chrome.i18n.getMessage('menu_text_link'),
    contexts: ['all']
  });
  chrome.contextMenus.create({
    id: menuIds[1],
    title: chrome.i18n.getMessage('menu_text_img'),
    contexts: ['all']
  });
  chrome.contextMenus.create({
    id: menuIds[2],
    title: chrome.i18n.getMessage('menu_text_select'),
    contexts: ['all']
  });

  chrome.contextMenus.create({
    id: 'chrome_ext_pp_qr_menu_separator_1',
    type: 'separator',
    contexts: ['all']
  });
  chrome.contextMenus.create({
    id: menuIds[3],
    title: chrome.i18n.getMessage('menu_text_page'),
    contexts: ['all']
  });

  // 接收 content_script 发来的消息
  chrome.runtime.onMessage.addListener(function(request/* , sender, sendResponse */) {
    if (request && request.name === 'update_menu') {
      const menus = request.menus;
      for (let i = 0; i < menus.length; i++) {
        chrome.contextMenus.update(menuIds[i], {
          visible: true,
          enabled: !!menus[i]
        });
      }
    }
  });

  // 监听上下文菜单的点击事件
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    let content = '';

    switch (info.menuItemId) {
    case menuIds[0]:
      content = info.linkUrl;
      break;
    case menuIds[1]:
      content = info.srcUrl;
      break;
    case menuIds[2]:
      content = info.selectionText; // 用户选择内容
      break;
    case menuIds[3]:
      content = tab.url; // 当前页面
      break;
    }

    if (content) {
      chrome.tabs.sendMessage(tab.id, {
        name: 'generate_qr',
        content: content
      }, function(response) {
        if (!response || response.name !== 'run_script') {
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
          // console.log('注入二维码处理JS');
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: [
              'lib/jquery-1.7.1.min.js',
              'bundle/content-qr.js'
            ]
          });
        }
      });
    }
  });
}
