'use strict';

(function () {

  var LEFT_MOUSE_BUTTON = 0;
  var Key = {
    ESC: 27,
    ENTER: 13
  };

  function trackLeftMouseEvent(evt, action) {
    if (evt.button === LEFT_MOUSE_BUTTON) {
      action();
    }
  }

  function trackEscEvent(evt, action) {
    if (evt.keyCode === Key.ESC) {
      action();
    }
  }

  function trackEnterEvent(evt, action) {
    if (evt.keyCode === Key.ENTER) {
      action();
    }
  }

  window.util = {
    trackLeftMouseEvent: trackLeftMouseEvent,
    trackEscEvent: trackEscEvent,
    trackEnterEvent: trackEnterEvent
  };

})();
