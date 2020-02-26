'use strict';

(function () {

  var DECIMAL_NUMBER_SYSTEM = 10;
  var MAP_WIDTH = 1200;
  var MIN_X = 0;
  var MIN_Y = 130;
  var MAX_Y = 630;

  var MainPin = {
    WIDTH: 65,
    HEIGHT: 65,
    TAIL_HEIGHT: 15
  };
  var maxPinX = MAP_WIDTH - (MainPin.WIDTH / 2);
  var minPinX = MIN_X - (MainPin.WIDTH / 2);
  var maxPinY = MAX_Y - MainPin.HEIGHT - MainPin.TAIL_HEIGHT;
  var minPinY = MIN_Y - MainPin.HEIGHT - MainPin.TAIL_HEIGHT;

  var mainMapPinElement = document.querySelector('.map__pin--main');
  var startMainPinY = mainMapPinElement.style.top;
  var startMainPinX = mainMapPinElement.style.left;

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

    if (mainPinY >= maxPinY) {
      mainMapPinElement.style.top = maxPinY + 'px ';
    }

    if (mainPinY <= minPinY) {
      mainMapPinElement.style.top = minPinY + 'px ';
    }

    mainMapPinElement.style.left = (mainMapPinElement.offsetLeft - coordOffset.x) + 'px ';
    mainPinX = parseInt(mainMapPinElement.style.left, DECIMAL_NUMBER_SYSTEM);

    if (mainPinX >= maxPinX) {
      mainMapPinElement.style.left = maxPinX + 'px ';
    }

    if (mainPinX <= minPinX) {
      mainMapPinElement.style.left = minPinX + 'px ';
    }
  }

  function setMainButtonStartCoord() {
    mainMapPinElement.style.top = startMainPinY;
    mainMapPinElement.style.left = startMainPinX;
  }

  window.pin = {
    setMainButtonStartCoord: setMainButtonStartCoord
  };

})();
