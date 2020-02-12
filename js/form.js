'use strict';

(function () {

  var mainElement = document.querySelector('main');
  var mainMapPinElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');
  var adFormResetElement = adFormElement.querySelector('.ad-form__reset');
  var adFormFieldsetsElements = adFormElement.querySelectorAll('fieldset');
  var formAddressElement = adFormElement.querySelector('[name="address"]');
  var formPriceElement = adFormElement.querySelector('[name="price"]');
  var formApartmentTypeElement = adFormElement.querySelector('[name="type"]');
  var formTimeinElement = adFormElement.querySelector('[name="timein"]');
  var formTimeoutElement = adFormElement.querySelector('[name="timeout"]');
  var formTRoomsElement = adFormElement.querySelector('[name="rooms"]');
  var formGuestsElement = adFormElement.querySelector('[name="capacity"]');

  var successMasageTemplateElement = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorMasageTemplateElement = document.querySelector('#error')
    .content
    .querySelector('.error');

  var DECIMAL_NUMBER_SYSTEM = 10;
  var MAIN_PIN = {
    WIDTH: 65,
    HEIGHT: 65,
    TAIL_HEIGHT: 15
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
    var mainPinYLocation = Math.floor(mainPinTopСoord + (MAIN_PIN.HEIGHT + pinTeil) / rateYОffset);

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
    window.map.deactivationPage();
    setTimeout(function () {
      enterAddress();
    }, 50);
  });

  adFormElement.addEventListener('submit', function (evt) {
    window.backend.sendForm(new FormData(adFormElement), successSend, errorSend);
    evt.preventDefault();
  });

  function successSend() {
    adFormResetElement.click();
    openSuccessMesage();
  }

  function openSuccessMesage() {
    var successPopupElement = mainElement.querySelector('.success');

    if (successPopupElement === null) {
      createSuccessPopup();
    } else {
      successPopupElement.classList.remove('visually-hidden');
    }

    addMesagePopupLissteners(onSuccessPopupEscdown, onSuccessPopupMousedown);
  }

  function createSuccessPopup() {
    var fragment = document.createDocumentFragment();
    var successMasageElement = successMasageTemplateElement.cloneNode(true);

    fragment.appendChild(successMasageElement);
    mainElement.appendChild(fragment);
  }

  function addMesagePopupLissteners(onEscdown, onMousedown) {
    document.addEventListener('keydown', onEscdown);
    document.addEventListener('mousedown', onMousedown);
  }

  function onSuccessPopupEscdown(evt) {
    window.util.isEscEvent(evt, closeSuccessPopup);
  }

  function onSuccessPopupMousedown(evt) {
    window.util.isLeftMouseEvent(evt, closeSuccessPopup);
  }

  function closeSuccessPopup() {
    var successPopupElement = mainElement.querySelector('.success');
    successPopupElement.classList.add('visually-hidden');

    document.removeEventListener('keydown', onSuccessPopupEscdown);
    document.removeEventListener('mousedown', onSuccessPopupMousedown);
  }

  function errorSend(errorMesage) {
    var errorPopupElement = mainElement.querySelector('.error');

    if (errorPopupElement === null) {
      createErrorPopup(errorMesage);
    } else {
      errorPopupElement.querySelector('.error__message').textContent = errorMesage;
      errorPopupElement.classList.remove('visually-hidden');
    }

    var closeButtonElement = mainElement.querySelector('.error__button');

    addMesagePopupLissteners(onErrorPopupEscdown, onErrorPopupMousedown);
    closeButtonElement.focus();
  }

  function createErrorPopup(errorMesage) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(renderErrorPopup(errorMesage));

    mainElement.appendChild(fragment);
  }

  function renderErrorPopup(errorMesage) {
    var errorMasageElement = errorMasageTemplateElement.cloneNode(true);
    var closeButtonElement = errorMasageElement.querySelector('.error__button');

    errorMasageElement.querySelector('.error__message').textContent = errorMesage;

    closeButtonElement.addEventListener('click', function () {
      closeErrorPopup();
    });

    return errorMasageElement;
  }

  function onErrorPopupEscdown(evt) {
    window.util.isEscEvent(evt, closeErrorPopup);
  }

  function onErrorPopupMousedown(evt) {
    window.util.isLeftMouseEvent(evt, closeErrorPopup);
  }

  function closeErrorPopup() {
    var errorPopupElement = mainElement.querySelector('.error');
    errorPopupElement.classList.add('visually-hidden');

    document.removeEventListener('keydown', onErrorPopupEscdown);
    document.removeEventListener('mousedown', onErrorPopupMousedown);
  }

  window.form = {
    unDisabledAdForm: unDisabledAdForm,
    disabledAdForm: disabledAdForm,
    enterAddress: enterAddress
  };

})();
