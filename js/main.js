'use strict';

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters-container');
var mapPins = document.querySelector('.map__pins');
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
var usersAds = [];

var apartmentsTyps = ['Palace', 'Flat', 'House', 'Bungalo'];
var timesCheckin = ['12:00', '13:00', '14:00'];
var timesCheckout = ['12:00', '13:00', '14:00'];
var apartmentsFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var apartmentsPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var apartmentsTitleSale = [' посуточно', ' для туристов', ' не дорого'];

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

createAd();

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

  mapPins.appendChild(fragment);
}

buildMapPins();

map.classList.remove('map--faded');

var mapButtonsPins = mapPins.querySelectorAll('.map__pin');
var adInfoCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var adsInfoCards = document.querySelectorAll('.map__card');

mapButtonsPins[1].onclick = function openAdInfoPopup() {
  if (adsInfoCards[0] === undefined) {
    buildAdInfoCard();
    adsInfoCards = document.querySelectorAll('.map__card');
  }
};

function buildAdInfoCard() {
  var fragment = document.createDocumentFragment();

  fragment.appendChild(renderAdInfoCard());

  map.insertBefore(fragment, mapFilters);
}

function renderAdInfoCard() {
  var adInfoCardElement = adInfoCardTemplate.cloneNode(true);
  var featuresContianerInTemplate = adInfoCardElement.querySelector('.popup__features');
  var featuresListInTemplate = featuresContianerInTemplate.querySelectorAll('.popup__feature');
  var photosContainer = adInfoCardElement.querySelector('.popup__photos');
  var photoImgTeplate = photosContainer.querySelector('.popup__photo');
  var adTitle = usersAds[0]['offer']['tittle'];
  var adAddress = usersAds[0]['offer']['address'];
  var adPrice = usersAds[0]['offer']['price'] + '₽/ночь';
  var adType = usersAds[0]['offer']['type'];
  var adRooms = usersAds[0]['offer']['rooms'];
  var adGuests = usersAds[0]['offer']['guests'];
  var adTimeCheckin = usersAds[0]['offer']['checkin'];
  var adTimeCheckout = usersAds[0]['offer']['checkout'];
  var adDescription = usersAds[0]['offer']['description'];
  var adAvatar = usersAds[0]['author']['avatar'];
  var featuresList = usersAds[0]['offer']['features'];
  var photosList = usersAds[0]['offer']['photos'];

  var adRoomsAndGuests;
  var adTimes;

  if (adRooms !== '' && adGuests === 0) {
    adGuests = ' не для';
  } else {
    adGuests = ' для ' + adGuests;
  }

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

  if (featuresListInTemplate.length !== featuresList.length) {
    if (featuresList.length === 0) {
      featuresContianerInTemplate.classList.add('visually-hidden');
    } else {
      hiddenExcessFeatures(featuresListInTemplate, featuresList);
    }
  }

  if (photosList.length !== 0) {
    buildAdPhotos(photosList, photoImgTeplate, photosContainer);
  } else {
    photosContainer.classList.add('visually-hidden');
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
