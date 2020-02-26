'use strict';

(function () {

  var TIMEOUT_LOAD_IN_MS = 1000;

  var mapElement = document.querySelector('.map');
  var mainMapPinElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');

  var pageIsActive = false;

  mainMapPinElement.addEventListener('keydown', onMainPinKeydown);

  function onMainPinMousedown(evt) {
    window.util.trackLeftMouseEvent(evt, activePage);
  }

  function onMainPinKeydown(evt) {
    window.util.trackEnterEvent(evt, activePage);
  }

  function activePage() {
    window.map.pageIsActive = true;
    toggleFades();
    window.filters.activate();
    window.form.activate();
    window.form.enterAddress();
    window.data.activateMapPins();
    setTimeout(function () {
      window.card.createButtonsCards();
    }, TIMEOUT_LOAD_IN_MS);
    mainMapPinElement.removeEventListener('keydown', onMainPinKeydown);
  }

  function toggleFades() {
    mapElement.classList.toggle('map--faded');
    adFormElement.classList.toggle('ad-form--disabled');
  }

  function deactivatePage() {
    window.map.pageIsActive = false;
    window.pin.setMainButtonStartCoord();
    window.imgLoad.drop();
    window.form.deactivate();
    window.filters.dropSettings();
    window.filters.deactivate();
    toggleFades();
    window.data.removeMapPins();
    window.card.removedAdsInfoCards();
    mainMapPinElement.addEventListener('keydown', onMainPinKeydown);
  }

  window.map = {
    pageIsActive: pageIsActive,
    deactivatePage: deactivatePage,
    onMainPinMousedown: onMainPinMousedown
  };

})();
