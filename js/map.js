'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var mainMapPinElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');

  var pageIsActive = false;

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
    window.card.createButtonsCards();

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
