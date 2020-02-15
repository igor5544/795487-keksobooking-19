'use strict';

(function () {

  var mainMapPinElement = document.querySelector('.map__pin--main');

  var MAIN_PIN = {
    WIDTH: 65,
    HEIGHT: 65,
    TAIL_HEIGHT: 15
  };
  var MAP_WIDTH = 1200;
  var MAX_PIN_X = MAP_WIDTH - (MAIN_PIN.WIDTH / 2);
  var MIN_X = 0;
  var MIN_PIN_X = MIN_X - (MAIN_PIN.WIDTH / 2);
  var MAX_Y = 630;
  var MAX_PIN_Y = MAX_Y - MAIN_PIN.HEIGHT - MAIN_PIN.TAIL_HEIGHT;
  var MIN_Y = 130;
  var MIN_PIN_Y = MIN_Y - MAIN_PIN.HEIGHT - MAIN_PIN.TAIL_HEIGHT;
  var DECIMAL_NUMBER_SYSTEM = 10;
  var START_MAIN_PIN_Y = mainMapPinElement.style.top;
  var START_MAIN_PIN_X = mainMapPinElement.style.left;
  var mainPinY = parseInt(mainMapPinElement.style.top, DECIMAL_NUMBER_SYSTEM);
  var mainPinX = parseInt(mainMapPinElement.style.left, DECIMAL_NUMBER_SYSTEM);

  mainMapPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startActive = true;

    if (window.map.pageIsActive === false) {
      setTimeout(function () {
        if (startActive) {
          window.map.onMainPinMousedown(evt);
        }
      }, 100);
    }

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      window.form.enterAddress();

      startActive = false;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      changeMainPinCoord(shift);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function changeMainPinCoord(coordOffset) {
    mainMapPinElement.style.top = (mainMapPinElement.offsetTop - coordOffset.y) + 'px ';
    mainPinY = parseInt(mainMapPinElement.style.top, DECIMAL_NUMBER_SYSTEM);

    if (mainPinY >= MAX_PIN_Y) {
      mainMapPinElement.style.top = MAX_PIN_Y + 'px ';
    }

    if (mainPinY <= MIN_PIN_Y) {
      mainMapPinElement.style.top = MIN_PIN_Y + 'px ';
    }

    mainMapPinElement.style.left = (mainMapPinElement.offsetLeft - coordOffset.x) + 'px ';
    mainPinX = parseInt(mainMapPinElement.style.left, DECIMAL_NUMBER_SYSTEM);

    if (mainPinX >= MAX_PIN_X) {
      mainMapPinElement.style.left = MAX_PIN_X + 'px ';
    }

    if (mainPinX <= MIN_PIN_X) {
      mainMapPinElement.style.left = MIN_PIN_X + 'px ';
    }
  }

  function mainButtonStartCoord() {
    mainMapPinElement.style.top = START_MAIN_PIN_Y;
    mainMapPinElement.style.left = START_MAIN_PIN_X;
  }

  window.pin = {
    mainButtonStartCoord: mainButtonStartCoord
  };

})();
