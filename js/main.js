'use strict';

var map = document.querySelector('.map');
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
var MAX_PHOTOS = 5;
var usersAds = [];

var apartmentsTyps = ['Palace', 'Flat', 'House', 'Bungalo'];
var timesCheckin = ['12:00', '13:00', '14:00'];
var timesCheckout = ['12:00', '13:00', '14:00'];
var apartmentsFeatures = [' wifi', ' dishwasher', ' parking', ' pwasher', ' elevator', ' conditioner'];

var apartmentsTitleSale = [' посуточно', ' для туристов', ' не дорого'];

function createAd() {
  for (var i = 0; i < ADS_NUMBER; i++) {
    var userAvatar = 'img/avatars/user0' + (i + 1) + '.png';

    var apartmentPrice = getRandomNumber(MIN_PRICE, MAX_PRICE) + ' ¥';
    var apartmentType = getRandomItemFromArray(apartmentsTyps);
    var apartmentRooms = getRandomNumber(1, 5);
    var apartmentGuests = getRandomNumber(1, 8);
    var apartmentCheckin = getRandomItemFromArray(timesCheckin);
    var apartmentCheckout = getRandomItemFromArray(timesCheckout);
    var apartmentFeatures = getRandomList(apartmentsFeatures);
    var apartmentPhotos = getApartmentsPhotos(i);

    var positionX = getRandomNumber(0, MAX_MAP_X);
    var positionY = getRandomNumber(MIN_MAP_Y, MAX_MAP_Y);

    var apartmentTittle = apartmentType + getRandomList(apartmentsTitleSale);
    var apartmentDescription = apartmentTittle + '. ' + 'Количество комнат: ' + apartmentRooms + '. ' +
      'Максимальное количество человек: ' + apartmentGuests + '. ' + 'Удобства: ' + apartmentFeatures;

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

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItemFromArray(arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
}

function getApartmentsPhotos(number) {
  var photosArr = [];
  var j = 0;
  var minPhotoIndex = number * MAX_PHOTOS + 1;
  var randomPhotoValue = getRandomNumber(1, MAX_PHOTOS);

  for (var i = minPhotoIndex; i <= minPhotoIndex + randomPhotoValue; i++) {
    photosArr[j] = 'http://o0.github.io/assets/images/tokyo/hotel' + i;
    j++;
  }

  return photosArr;
}

function getRandomList(arr) {
  var listArr = [];
  var allSortFeatures = randomSortArr(arr);
  var featuresValue = getRandomNumber(1, arr.length);

  for (var i = 0; i < featuresValue; i++) {
    listArr[i] = allSortFeatures[i];
  }

  return listArr;
}

function randomSortArr(arr) {
  var j;
  var receivedItem;
  for (var i = 0; i < arr.length; i++) {
    j = getRandomNumber(0, arr.length - 1);
    receivedItem = arr[j];
    arr[j] = arr[i];
    arr[i] = receivedItem;
  }
  return arr;
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

function builMapPins() {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < usersAds.length; i++) {
    fragment.appendChild(renderMapPin(usersAds[i]));
  }

  mapPins.appendChild(fragment);
}

builMapPins();

map.classList.remove('map--faded');
