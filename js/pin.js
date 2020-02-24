'use strict';

(function () {

  var mainMapPinElement = document.querySelector('.map__pin--main');

  var MainPin = {
    WIDTH: 65,
    HEIGHT: 65,
    TAIL_HEIGHT: 15
  };
  var MAP_WIDTH = 1200;
  var MAX_PIN_X = MAP_WIDTH - (MainPin.WIDTH / 2);
  var MIN_X = 0;
  var MIN_PIN_X = MIN_X - (MainPin.WIDTH / 2);
  var MAX_Y = 630;
  var MAX_PIN_Y = MAX_Y - MainPin.HEIGHT - MainPin.TAIL_HEIGHT;
  var MIN_Y = 130;
  var MIN_PIN_Y = MIN_Y - MainPin.HEIGHT - MainPin.TAIL_HEIGHT;
  var DECIMAL_NUMBER_SYSTEM = 10;
  var START_MAIN_PIN_Y = mainMapPinElement.style.top;
  var START_MAIN_PIN_X = mainMapPinElement.style.left;
  var mainPinY = parseInt(mainMapPinElement.style.top, DECIMAL_NUMBER_SYSTEM);
  var mainPinX = parseInt(mainMapPinElement.style.left, DECIMAL_NUMBER_SYSTEM);

  function Coordinate(x, y) {
    this.x = x;
    this.y = y;
  }

  mainMapPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    if (window.map.pageIsActive === false) {
      window.map.onMainPinMousedown(evt);
    }

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      window.form.enterAddress();

      var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);

      startCoords = new Coordinate(moveEvt.clientX, moveEvt.clientY);

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
