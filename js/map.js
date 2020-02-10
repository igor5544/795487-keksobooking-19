'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var mainMapPinElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');

  var pageIsActive = false;

  mainMapPinElement.addEventListener('mousedown', function (evt) {
    window.util.isLeftMouseEvent(evt, activePage);
  });

  mainMapPinElement.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, activePage);
  });

  function activePage() {
    window.map.pageIsActive = true;
    removeFades();
    window.form.unDisabledAdForm();
    window.form.enterAddress();
    window.data.activeMapPins();
    window.card.createButtonsCards();
  }

  function removeFades() {
    mapElement.classList.remove('map--faded');
    adFormElement.classList.remove('ad-form--disabled');
  }

  window.map = {
    pageIsActive: pageIsActive
  };

})();
