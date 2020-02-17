'use strict';

(function () {

  var LEFT_MOUSE_BUTTON = 0;
  var Key = {
    ESC: 27,
    ENTER: 13
  };

  function isLeftMouseEvent(evt, action) {
    if (evt.button === LEFT_MOUSE_BUTTON) {
      action();
    }
  }

  function isEscEvent(evt, action) {
    if (evt.keyCode === Key.ESC) {
      action();
    }
  }

  function isEnterEvent(evt, action) {
    if (evt.keyCode === Key.ENTER) {
      action();
    }
  }

  window.util = {
    isLeftMouseEvent: isLeftMouseEvent,
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent
  };

})();
