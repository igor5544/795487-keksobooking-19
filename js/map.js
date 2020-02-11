'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var mainMapPinElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');

  var pageIsActive = false;
  var TIMEOUT_LOAD_IN_MS = 1000;

  mainMapPinElement.addEventListener('keydown', onMainPinKeydown);

  function onMainPinMousedown(evt) {
    window.util.isLeftMouseEvent(evt, activePage);
  }

  function onMainPinKeydown(evt) {
    window.util.isEnterEvent(evt, activePage);
  }

  function activePage() {
    window.map.pageIsActive = true;
    removeFades();
    window.form.unDisabledAdForm();
    window.form.enterAddress();
    window.data.activeMapPins();
    setTimeout(function () {
      window.card.createButtonsCards();
    }, TIMEOUT_LOAD_IN_MS);
    mainMapPinElement.removeEventListener('keydown', onMainPinKeydown);
  }

  function removeFades() {
    mapElement.classList.remove('map--faded');
    adFormElement.classList.remove('ad-form--disabled');
  }

  window.map = {
    pageIsActive: pageIsActive,
    onMainPinMousedown: onMainPinMousedown
  };

})();
