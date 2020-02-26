'use strict';

(function () {

  var DECIMAL_NUMBER_SYSTEM = 10;
  var FULL_Y_OFFSET = 1;
  var HALF_Y_OFFSET = 2;
  var PIN_TAIL_NONE = 0;

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
  var formRoomsElement = adFormElement.querySelector('[name="rooms"]');
  var formGuestsElement = adFormElement.querySelector('[name="capacity"]');

  var successMasageTemplateElement = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorMasageTemplateElement = document.querySelector('#error')
    .content
    .querySelector('.error');

  var MainPin = {
    WIDTH: 65,
    HEIGHT: 65,
    TAIL_HEIGHT: 15
  };

  deactivateAdForm();
  enterAddress();

  function deactivateAdForm() {
    adFormFieldsetsElements.forEach(function (formItem) {
      formItem.setAttribute('disabled', 'disabled');
    });
  }

  function activateAdForm() {
    adFormFieldsetsElements.forEach(function (formItem) {
      formItem.removeAttribute('disabled');
    });
  }

  function enterAddress() {
    var mainPinLeftСoord = parseInt(mainMapPinElement.style.left, DECIMAL_NUMBER_SYSTEM);
    var mainPinTopСoord = parseInt(mainMapPinElement.style.top, DECIMAL_NUMBER_SYSTEM);
    var rateYОffset = window.map.pageIsActive ? FULL_Y_OFFSET : HALF_Y_OFFSET;
    var pinTeil = window.map.pageIsActive ? MainPin.TAIL_HEIGHT : PIN_TAIL_NONE;

    var mainPinXLocation = Math.floor(mainPinLeftСoord - MainPin.WIDTH / 2);
    var mainPinYLocation = Math.floor(mainPinTopСoord + (MainPin.HEIGHT + pinTeil) / rateYОffset);

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
        break;
      default: minAppartamentPrice = 0;
        break;
    }

    formPriceElement.setAttribute('min', minAppartamentPrice);
    formPriceElement.setAttribute('placeholder', minAppartamentPrice);
  }

  formTimeinElement.addEventListener('change', function () {
    selectTimeField(formTimeinElement, formTimeoutElement);
  });

  formTimeoutElement.addEventListener('change', function () {
    selectTimeField(formTimeoutElement, formTimeinElement);
  });

  function selectTimeField(timeField, dependTimeField) {
    dependTimeField.value = timeField.value;
    dependTimeField.focus();
  }

  formGuestsElement.setCustomValidity('Данное количество комнат не рассчитано на столько гостей');

  formGuestsElement.addEventListener('change', onGuestValueChange);
  formRoomsElement.addEventListener('change', onRoomValueChange);

  function onGuestValueChange() {
    checkMaxGuest();
  }

  function onRoomValueChange() {
    checkMaxGuest();
  }

  function checkMaxGuest() {
    formGuestsElement.setCustomValidity('');

    if (formRoomsElement.value < formGuestsElement.value || formRoomsElement.value === '100' || formGuestsElement.value === '0') {
      formGuestsElement.setCustomValidity('Данное количество комнат не рассчитано на столько гостей');
    }

    if (formRoomsElement.value === '100' && formGuestsElement.value === '0') {
      formGuestsElement.setCustomValidity('');
    }
  }

  adFormElement.addEventListener('reset', function () {
    window.map.deactivatePage();
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
    openSuccessMessage();
  }

  function openSuccessMessage() {
    var successPopupElement = mainElement.querySelector('.success');

    if (successPopupElement === null) {
      createSuccessPopup();
    } else {
      successPopupElement.classList.remove('visually-hidden');
    }

    addMessagePopupLissteners(onSuccessPopupEscdown, onSuccessPopupMousedown);
  }

  function createSuccessPopup() {
    var fragment = document.createDocumentFragment();
    var successMasageElement = successMasageTemplateElement.cloneNode(true);

    fragment.appendChild(successMasageElement);
    mainElement.appendChild(fragment);
  }

  function addMessagePopupLissteners(onEscdown, onMousedown) {
    document.addEventListener('keydown', onEscdown);
    document.addEventListener('mousedown', onMousedown);
  }

  function onSuccessPopupEscdown(evt) {
    window.util.trackEscEvent(evt, closeSuccessPopup);
  }

  function onSuccessPopupMousedown(evt) {
    window.util.trackLeftMouseEvent(evt, closeSuccessPopup);
  }

  function closeSuccessPopup() {
    var successPopupElement = mainElement.querySelector('.success');
    successPopupElement.classList.add('visually-hidden');

    document.removeEventListener('keydown', onSuccessPopupEscdown);
    document.removeEventListener('mousedown', onSuccessPopupMousedown);
  }

  function errorSend(errorMessage) {
    var errorPopupElement = mainElement.querySelector('.error');

    if (errorPopupElement === null) {
      createErrorPopup(errorMessage);
    } else {
      errorPopupElement.querySelector('.error__message').textContent = errorMessage;
      errorPopupElement.classList.remove('visually-hidden');
    }

    var closeButtonElement = mainElement.querySelector('.error__button');

    addMessagePopupLissteners(onErrorPopupEscdown, onErrorPopupMousedown);
    closeButtonElement.focus();
  }

  function createErrorPopup(errorMessage) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(renderErrorPopup(errorMessage));

    mainElement.appendChild(fragment);
  }

  function renderErrorPopup(errorMessage) {
    var errorMasageElement = errorMasageTemplateElement.cloneNode(true);
    var closeButtonElement = errorMasageElement.querySelector('.error__button');

    errorMasageElement.querySelector('.error__message').textContent = errorMessage;

    closeButtonElement.addEventListener('click', function () {
      closeErrorPopup();
    });

    return errorMasageElement;
  }

  function onErrorPopupEscdown(evt) {
    window.util.trackEscEvent(evt, closeErrorPopup);
  }

  function onErrorPopupMousedown(evt) {
    window.util.trackLeftMouseEvent(evt, closeErrorPopup);
  }

  function closeErrorPopup() {
    var errorPopupElement = mainElement.querySelector('.error');
    errorPopupElement.classList.add('visually-hidden');

    document.removeEventListener('keydown', onErrorPopupEscdown);
    document.removeEventListener('mousedown', onErrorPopupMousedown);
  }

  window.form = {
    activate: activateAdForm,
    deactivate: deactivateAdForm,
    enterAddress: enterAddress
  };

})();
