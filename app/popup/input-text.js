'use strict';

const key = 'chrome_extensions_qr_input';

module.exports = {
  getValue: function() {
    return localStorage[key] || '';
  },
  setValue: function(value) {
    localStorage[key] = value;
  },
  clear: function() {
    localStorage[key] = '';
  }
};
