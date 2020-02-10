'use strict';

(function () {

  var mainMapPinElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');
  var adFormFieldsetsElements = adFormElement.querySelectorAll('fieldset');
  var formAddressElement = adFormElement.querySelector('[name="address"]');
  var formPriceElement = adFormElement.querySelector('[name="price"]');
  var formApartmentTypeElement = adFormElement.querySelector('[name="type"]');
  var formTimeinElement = adFormElement.querySelector('[name="timein"]');
  var formTimeoutElement = adFormElement.querySelector('[name="timeout"]');
  var formTRoomsElement = adFormElement.querySelector('[name="rooms"]');
  var formGuestsElement = adFormElement.querySelector('[name="capacity"]');

  var DECIMAL_NUMBER_SYSTEM = 10;
  var MAIN_PIN = {
    WIDTH: 65,
    HEIGHT: 65,
    TAIL_HEIGHT: 22
  };

  disabledAdForm();
  enterAddress();

  function disabledAdForm() {
    adFormFieldsetsElements.forEach(function (formItem) {
      formItem.setAttribute('disabled', 'disabled');
    });
  }

  function unDisabledAdForm() {
    for (var i = 0; i < adFormFieldsetsElements.length; i++) {
      adFormFieldsetsElements[i].removeAttribute('disabled');
    }
  }

  function enterAddress() {
    var mainPinLeftСoord = parseInt(mainMapPinElement.style.left, DECIMAL_NUMBER_SYSTEM);
    var mainPinTopСoord = parseInt(mainMapPinElement.style.top, DECIMAL_NUMBER_SYSTEM);
    var FULL_Y_OFFSET = 1;
    var HALF_Y_OFFSET = 2;
    var PIN_TAIL_NONE = 0;
    var rateYОffset = window.map.pageIsActive ? FULL_Y_OFFSET : HALF_Y_OFFSET;
    var pinTeil = window.map.pageIsActive ? MAIN_PIN.TAIL_HEIGHT : PIN_TAIL_NONE;

    var mainPinXLocation = Math.floor(mainPinLeftСoord - MAIN_PIN.WIDTH / 2);
    var mainPinYLocation = Math.floor(mainPinTopСoord - (MAIN_PIN.HEIGHT + pinTeil) / rateYОffset);

    formAddressElement.value = mainPinXLocation + ', ' + mainPinYLocation;
  }

  formApartmentTypeElement.addEventListener('change', onApartmentTypeChange);

  function onApartmentTypeChange() {
    var minAppartamentPrice;

    switch (formApartmentTypeElement.value) {
      case 'bungalo': minAppartamentPrice = 0;
        break;
      case 'flat': minAppartamentPrice = 1000;
        break;
      case 'house': minAppartamentPrice = 5000;
        break;
      case 'palace': minAppartamentPrice = 10000;
    }

    formPriceElement.setAttribute('min', minAppartamentPrice);
    formPriceElement.setAttribute('placeholder', minAppartamentPrice);
  }

  formTimeinElement.addEventListener('change', function () {
    adjustmentTimeField(formTimeinElement, formTimeoutElement);
  });

  formTimeoutElement.addEventListener('change', function () {
    adjustmentTimeField(formTimeoutElement, formTimeinElement);
  });

  function adjustmentTimeField(timeField, dependTimeField) {
    dependTimeField.value = timeField.value;
    dependTimeField.focus();
  }

  formGuestsElement.setCustomValidity('Данное количество комнат не рассчитано на столько гостей');

  formGuestsElement.addEventListener('change', onGuestsAndRoomsChange);
  formTRoomsElement.addEventListener('change', onGuestsAndRoomsChange);

  function onGuestsAndRoomsChange() {
    formGuestsElement.setCustomValidity('');

    if (formTRoomsElement.value < formGuestsElement.value || formTRoomsElement.value === '100' || formGuestsElement.value === '0') {
      formGuestsElement.setCustomValidity('Данное количество комнат не рассчитано на столько гостей');
    }

    if (formTRoomsElement.value === '100' && formGuestsElement.value === '0') {
      formGuestsElement.setCustomValidity('');
    }
  }

  adFormElement.addEventListener('reset', function () {
    setTimeout(function () {
      enterAddress();
    }, 50);
  });

  window.form = {
    unDisabledAdForm: unDisabledAdForm,
    enterAddress: enterAddress
  };

})();
