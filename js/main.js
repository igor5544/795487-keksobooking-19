'use strict';

var map = document.querySelector('.map');
var mapPinsContainer = document.querySelector('.map__pins');
var mapButtonsPins = mapPinsContainer.querySelectorAll('.map__pin');
var mainMapPin = document.querySelector('.map__pin--main');

var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var mainPinXLocation;
var mainPinYLocation;

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var formAddress = adForm.querySelector('[name="address"]');

var usersAds = [];
var apartmentsTyps = ['Palace', 'Flat', 'House', 'Bungalo'];
var timesCheckin = ['12:00', '13:00', '14:00'];
var timesCheckout = ['12:00', '13:00', '14:00'];
var apartmentsFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var apartmentsPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var apartmentsTitleSale = [' посуточно', ' для туристов', ' не дорого'];

var DECIMAL_NUMBER_SYSTEM = 10;
var LEFT_MOUSE_BUTTON = 0;
var ENTER_KEY = 'Enter';
var pageIsActive = false;

disabledAdForm();
enterAddress();

function disabledAdForm() {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].setAttribute('disabled', 'disabled');
  }
}

function enterAddress() {
  var mainPinLeftСoord = parseInt(mainMapPin.style.left, DECIMAL_NUMBER_SYSTEM);
  var mainPinTopСoord = parseInt(mainMapPin.style.top, DECIMAL_NUMBER_SYSTEM);
  var fullYOffset = 1;
  var halfYOffset = 2;
  var rateYОffset = pageIsActive ? fullYOffset : halfYOffset;
  mainPinXLocation = Math.floor(mainPinLeftСoord - MAIN_PIN_WIDTH / 2);
  mainPinYLocation = Math.floor(mainPinTopСoord - MAIN_PIN_HEIGHT / rateYОffset);
  formAddress.value = mainPinXLocation + ', ' + mainPinYLocation;
}

mainMapPin.addEventListener('mousedown', function (evt) {
  if (evt.button === LEFT_MOUSE_BUTTON) {
    activePage();
  }
});

mainMapPin.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    activePage();
  }
});

function activePage() {
  pageIsActive = true;
  removeFades();
  unDisabledAdForm();
  enterAddress();
  activeMapPins();
}

function removeFades() {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
}

function unDisabledAdForm() {
  for (var i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].removeAttribute('disabled');
  }
}

function activeMapPins() {
  var mapPinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var MAP_WIDTH = 1200;
  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;

  var ADS_NUMBER = 8;
  var MAX_MAP_Y = 630;
  var MIN_MAP_Y = 130;
  var MAX_MAP_X = MAP_WIDTH - PIN_WIDTH;
  var MIN_PRICE = 200;
  var MAX_PRICE = 2500;

  function createAd() {
    for (var i = 0; i < ADS_NUMBER; i++) {
      var userAvatar = 'img/avatars/user0' + (i + 1) + '.png';

      var apartmentPrice = getRandomNumber(MIN_PRICE, MAX_PRICE);
      var apartmentType = getRandomItemFromArray(apartmentsTyps);
      var apartmentRooms = getRandomNumber(1, 5);
      var apartmentGuests = getRandomNumber(0, 8);
      var apartmentCheckin = getRandomItemFromArray(timesCheckin);
      var apartmentCheckout = getRandomItemFromArray(timesCheckout);
      var apartmentFeatures = getRandomList(apartmentsFeatures);
      var apartmentPhotos = getRandomList(apartmentsPhotos);

      var positionX = getRandomNumber(0, MAX_MAP_X);
      var positionY = getRandomNumber(MIN_MAP_Y, MAX_MAP_Y);

      var apartmentTittle = apartmentType + getRandomList(apartmentsTitleSale);
      var apartmentDescription = apartmentTittle + '. ' + 'Количество комнат: ' + apartmentRooms + '. ' +
        'Максимальное количество человек: ' + apartmentGuests + '. ' + 'Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.';

      usersAds[i] = {
        author: {
          avatar: userAvatar,
        },
        offer: {
          tittle: apartmentTittle,
          address: positionX,
          price: apartmentPrice,
          type: apartmentType,
          rooms: apartmentRooms,
          guests: apartmentGuests,
          checkin: apartmentCheckin,
          checkout: apartmentCheckout,
          features: apartmentFeatures,
          description: apartmentDescription,
          photos: apartmentPhotos,
        },
        location: {
          x: positionX,
          y: positionY,
        },
      };
    }
  }

  function getRandomNumber(minNumber, maxNumber) {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }

  function getRandomItemFromArray(items) {
    return items[getRandomNumber(0, items.length - 1)];
  }

  function getRandomList(items) {
    var newList = items.slice(0);
    var excessValue = getRandomNumber(0, items.length);

    if (excessValue === items.length) {
      return [];
    }

    for (var i = 0; i < excessValue; i++) {
      var randomItem = getRandomNumber(0, newList.length - 1);

      newList.splice(randomItem, 1);
    }

    return newList;
  }

  if (usersAds.length !== ADS_NUMBER) {
    createAd();
  }

  function renderMapPin(userAd) {
    var mapPinElement = mapPinTemplate.cloneNode(true);
    var mapPinStyle = 'left: ' + (userAd['location']['x'] - PIN_WIDTH / 2) + 'px; ' +
      'top: ' + (userAd['location']['y'] - PIN_HEIGHT) + 'px;';

    mapPinElement.setAttribute('style', mapPinStyle);
    mapPinElement.querySelector('img').setAttribute('alt', userAd['offer']['tittle']);
    mapPinElement.querySelector('img').setAttribute('src', userAd['author']['avatar']);

    return mapPinElement;
  }

  function buildMapPins() {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < usersAds.length; i++) {
      fragment.appendChild(renderMapPin(usersAds[i]));
    }

    mapPinsContainer.appendChild(fragment);
  }

  var pinsOtherUsers = mapButtonsPins.length - 1;

  if (pinsOtherUsers !== usersAds.length) {
    buildMapPins();
  }

  mapButtonsPins = mapPinsContainer.querySelectorAll('.map__pin');
}

// Работа с формой

var formPrice = adForm.querySelector('[name="price"]');
var formApartmentType = adForm.querySelector('[name="type"]');
var formTimein = adForm.querySelector('[name="timein"]');
var formTimeout = adForm.querySelector('[name="timeout"]');
var formTRooms = adForm.querySelector('[name="rooms"]');
var formGuests = adForm.querySelector('[name="capacity"]');

formApartmentType.addEventListener('change', onApartmentTypeChange);

function onApartmentTypeChange() {
  var minAppartamentPrice;

  switch (formApartmentType.value) {
    case 'bungalo': minAppartamentPrice = 0;
      break;
    case 'flat': minAppartamentPrice = 1000;
      break;
    case 'house': minAppartamentPrice = 5000;
      break;
    case 'palace': minAppartamentPrice = 10000;
  }

  formPrice.setAttribute('min', minAppartamentPrice);
  formPrice.setAttribute('placeholder', minAppartamentPrice);
}

formTimein.addEventListener('change', function () {
  adjustmentTimeField(formTimein, formTimeout);
});

formTimeout.addEventListener('change', function () {
  adjustmentTimeField(formTimeout, formTimein);
});

function adjustmentTimeField(timeField, dependTimeField) {
  dependTimeField.value = timeField.value;
  dependTimeField.focus();
}

formGuests.setCustomValidity('Данное количество комнат не рассчитано на столько гостей');

formGuests.addEventListener('change', onGuestsAndRoomsChange);
formTRooms.addEventListener('change', onGuestsAndRoomsChange);

function onGuestsAndRoomsChange() {
  formGuests.setCustomValidity('');

  if (formTRooms.value < formGuests.value || formTRooms.value === '100' || formGuests.value === '0') {
    formGuests.setCustomValidity('Данное количество комнат не рассчитано на столько гостей');
  }

  if (formTRooms.value === '100' && formGuests.value === '0') {
    formGuests.setCustomValidity('');
  }
}

adForm.addEventListener('reset', function () {
  setTimeout(function () {
    enterAddress();
  }, 50);
});
