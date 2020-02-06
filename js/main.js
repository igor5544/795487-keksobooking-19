'use strict';

var mapElement = document.querySelector('.map');
var mapPinsContainerElement = document.querySelector('.map__pins');
var mapButtonsPinsElements = mapPinsContainerElement.querySelectorAll('.map__pin');
var mainMapPinElement = document.querySelector('.map__pin--main');
var mapFilters = mapElement.querySelector('.map__filters-container');

var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var mainPinXLocation;
var mainPinYLocation;

var adFormElement = document.querySelector('.ad-form');
var adFormFieldsetsElements = adFormElement.querySelectorAll('fieldset');
var formAddressElement = adFormElement.querySelector('[name="address"]');

var usersAds = [];
var apartmentsTyps = ['Palace', 'Flat', 'House', 'Bungalo'];
var timesCheckin = ['12:00', '13:00', '14:00'];
var timesCheckout = ['12:00', '13:00', '14:00'];
var apartmentsFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var apartmentsPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var apartmentsTitleSale = [' посуточно', ' для туристов', ' не дорого'];

var MAP_WIDTH = 1200;
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var ADS_NUMBER = 8;
var MAX_MAP_Y = 630;
var MIN_MAP_Y = 130;
var MAX_MAP_X = MAP_WIDTH - PIN_WIDTH;
var MIN_PRICE = 200;
var MAX_PRICE = 2500;

var DECIMAL_NUMBER_SYSTEM = 10;
var LEFT_MOUSE_BUTTON = 0;
var ENTER_KEY = 'Enter';
var ESC_KEY = 'Escape';
var pageIsActive = false;

disabledAdForm();
enterAddress();

function disabledAdForm() {
  adFormFieldsetsElements.forEach(function (formItem) {
    formItem.setAttribute('disabled', 'disabled');
  });
}

function enterAddress() {
  var mainPinLeftСoord = parseInt(mainMapPinElement.style.left, DECIMAL_NUMBER_SYSTEM);
  var mainPinTopСoord = parseInt(mainMapPinElement.style.top, DECIMAL_NUMBER_SYSTEM);
  var FULL_Y_OFFSET = 1;
  var HALF_Y_OFFSET = 2;
  var rateYОffset = pageIsActive ? FULL_Y_OFFSET : HALF_Y_OFFSET;

  mainPinXLocation = Math.floor(mainPinLeftСoord - MAIN_PIN_WIDTH / 2);
  mainPinYLocation = Math.floor(mainPinTopСoord - MAIN_PIN_HEIGHT / rateYОffset);
  formAddressElement.value = mainPinXLocation + ', ' + mainPinYLocation;
}

mainMapPinElement.addEventListener('mousedown', function (evt) {
  if (evt.button === LEFT_MOUSE_BUTTON) {
    activePage();
  }
});

mainMapPinElement.addEventListener('keydown', function (evt) {
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
  createButtonsCards();
}

function removeFades() {
  mapElement.classList.remove('map--faded');
  adFormElement.classList.remove('ad-form--disabled');
}

function unDisabledAdForm() {
  for (var i = 0; i < adFormFieldsetsElements.length; i++) {
    adFormFieldsetsElements[i].removeAttribute('disabled');
  }
}

function activeMapPins() {
  var mapPinTemplateElement = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

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
    var mapPinElement = mapPinTemplateElement.cloneNode(true);
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

    mapPinsContainerElement.appendChild(fragment);
  }

  var pinsOtherUsers = mapButtonsPinsElements.length - 1;

  if (pinsOtherUsers !== usersAds.length) {
    buildMapPins();
  }

  mapButtonsPinsElements = mapPinsContainerElement.querySelectorAll('.map__pin');
}

// Работа с формой

var formPriceElement = adFormElement.querySelector('[name="price"]');
var formApartmentTypeElement = adFormElement.querySelector('[name="type"]');
var formTimeinElement = adFormElement.querySelector('[name="timein"]');
var formTimeoutElement = adFormElement.querySelector('[name="timeout"]');
var formTRoomsElement = adFormElement.querySelector('[name="rooms"]');
var formGuestsElement = adFormElement.querySelector('[name="capacity"]');

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

// Отрисовка информационных карточек

var adInfoCardTemplateElement = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var USER_MAP_PIN = 1;
var activeCardElement;

function createButtonsCards() {
  mapButtonsPinsElements.forEach(function (mapButton, i) {
    if (i === 0) {
      return;
    }

    mapButton.addEventListener('click', function () {
      var actualCardInDomElement = document.querySelector('#card-' + i);
      activeCardElement = mapElement.querySelector('.active-card');

      if (activeCardElement !== null) {
        return;
      }

      if (actualCardInDomElement === null) {
        buildAdInfoCard(i - USER_MAP_PIN);
      } else {
        openCard(actualCardInDomElement);
      }
    });
  });
}


function onActiveCardEscPress(evt) {
  if (evt.key === ESC_KEY) {
    closeCard();
  }
}

function openCard(actualCard) {
  actualCard.classList.add('active-card');
  actualCard.classList.remove('visually-hidden');

  document.addEventListener('keydown', onActiveCardEscPress);
}

function closeCard() {
  activeCardElement = mapElement.querySelector('.active-card');
  activeCardElement.classList.add('visually-hidden');
  activeCardElement.classList.remove('active-card');

  document.removeEventListener('keydown', onActiveCardEscPress);
}


function buildAdInfoCard(cardIndex) {
  var fragment = document.createDocumentFragment();

  fragment.appendChild(renderAdInfoCard(cardIndex));

  mapElement.insertBefore(fragment, mapFilters);
}

function renderAdInfoCard(cardIndex) {
  var adInfoCardElement = adInfoCardTemplateElement.cloneNode(true);
  var cardCloseButtonElement = adInfoCardElement.querySelector('.popup__close');
  var featuresContianerInTemplateElement = adInfoCardElement.querySelector('.popup__features');
  var featuresListInTemplateElement = featuresContianerInTemplateElement.querySelectorAll('.popup__feature');
  var photosContainerElement = adInfoCardElement.querySelector('.popup__photos');
  var photoImgTeplateElement = photosContainerElement.querySelector('.popup__photo');
  var adTitle = usersAds[cardIndex]['offer']['tittle'];
  var adAddress = usersAds[cardIndex]['offer']['address'];
  var adPrice = usersAds[cardIndex]['offer']['price'] + '₽/ночь';
  var adType = usersAds[cardIndex]['offer']['type'];
  var adRooms = usersAds[cardIndex]['offer']['rooms'];
  var adGuests = usersAds[cardIndex]['offer']['guests'];
  var adTimeCheckin = usersAds[cardIndex]['offer']['checkin'];
  var adTimeCheckout = usersAds[cardIndex]['offer']['checkout'];
  var adDescription = usersAds[cardIndex]['offer']['description'];
  var adAvatar = usersAds[cardIndex]['author']['avatar'];
  var featuresList = usersAds[cardIndex]['offer']['features'];
  var photosList = usersAds[cardIndex]['offer']['photos'];

  var adRoomsAndGuests;
  var adTimes;

  // Уникальный id
  var actualCardId = 'card-' + (cardIndex + 1);
  adInfoCardElement.id = actualCardId;

  // Первое открытие
  adInfoCardElement.classList.add('active-card');
  document.addEventListener('keydown', onActiveCardEscPress);

  cardCloseButtonElement.addEventListener('click', function () {
    closeCard();
  });

  adGuests = (adRooms !== '' && adGuests === 0) ? ' не для' : ' для ' + adGuests;

  if (adRooms !== '' && adGuests !== '') {
    adRoomsAndGuests = adRooms + ' комнат(a/ы)' + adGuests + ' гост(я/ей)';
  }

  if (adTimeCheckin !== '' && adTimeCheckout !== '') {
    adTimes = 'Заезд после ' + adTimeCheckin + ' выезд до ' + adTimeCheckout;
  }

  var cardTextsValues = [adTitle, adAddress, adPrice, adType, adRoomsAndGuests, adTimes, adDescription];
  var cardTextsFields = ['.popup__title', '.popup__text--address', '.popup__text--price', '.popup__type',
    '.popup__text--capacity', '.popup__text--time', '.popup__description'];

  for (var i = 0; i < cardTextsFields.length; i++) {
    renderTextFieldsForCard(cardTextsFields[i], cardTextsValues[i], adInfoCardElement);
  }

  adInfoCardElement.querySelector('.popup__avatar').setAttribute('src', adAvatar);

  if (adAvatar === '' || adAvatar === undefined) {
    adInfoCardElement.querySelector('.popup__avatar').classList.add('visually-hidden');
  }

  if (featuresListInTemplateElement.length !== featuresList.length) {
    if (featuresList.length === 0) {
      featuresContianerInTemplateElement.classList.add('visually-hidden');
    } else {
      hiddenExcessFeatures(featuresListInTemplateElement, featuresList);
    }
  }

  if (photosList.length !== 0) {
    buildAdPhotos(photosList, photoImgTeplateElement, photosContainerElement);
  } else {
    photosContainerElement.classList.add('visually-hidden');
  }

  return adInfoCardElement;
}

function renderTextFieldsForCard(textField, textValue, elementContainer) {
  elementContainer.querySelector(textField).textContent = textValue;

  if (textValue === '' || textValue === undefined) {
    elementContainer.querySelector(textField).classList.add('visually-hidden');
  }
}

function hiddenExcessFeatures(featuresInTemplate, needFeatures) {
  var excessFeatures = getExcessFeatures(apartmentsFeatures, needFeatures);
  for (var i = 0; i < excessFeatures.length; i++) {
    var excessItemClass = 'popup__feature--' + excessFeatures[i];
    findExcessFeature(featuresInTemplate, excessItemClass).classList.add('visually-hidden');
  }
}

function findExcessFeature(featuresInTemplate, finditemClass) {
  for (var i = 0; i < featuresInTemplate.length; i++) {
    if (featuresInTemplate[i].classList.contains(finditemClass) === true) {
      var neededElement = featuresInTemplate[i];
      break;
    }
  }
  return neededElement;
}

function getExcessFeatures(allFeatures, needFeatures) {
  var excessFeatureslist = allFeatures.slice(0);

  for (var i = 0; i < needFeatures.length; i++) {
    var excessItemIndex = excessFeatureslist.indexOf(needFeatures[i]);

    excessFeatureslist.splice(excessItemIndex, 1);
  }

  return excessFeatureslist;
}

function buildAdPhotos(photosList, imgTeplate, photosContainer) {
  if (photosList === 1) {
    imgTeplate.setAttribute('src', photosList[0]);
  } else {
    buildAdPhotosList(photosList, imgTeplate, photosContainer);
  }
}

function buildAdPhotosList(photosList, imgTeplate, photosContainer) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photosList.length; i++) {
    if (i === 0) {
      imgTeplate.setAttribute('src', photosList[i]);
    } else {
      fragment.appendChild(renderNewPhotoForCard(photosList[i], imgTeplate));
    }
  }

  photosContainer.appendChild(fragment);
}

function renderNewPhotoForCard(photoLink, imgTeplate) {
  var photoForCard = imgTeplate.cloneNode(true);

  photoForCard.setAttribute('src', photoLink);

  return photoForCard;
}
