'use strict';

(function () {

  var mapPinsContainerElement = document.querySelector('.map__pins');
  var mapButtonsPinsElements = mapPinsContainerElement.querySelectorAll('.map__pin');

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

  var usersAds = [];

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

  function activeMapPins() {
    if (usersAds.length !== ADS_NUMBER) {
      createAd();
    }

    var pinsOtherUsers = mapButtonsPinsElements.length - 1;

    if (pinsOtherUsers !== usersAds.length) {
      buildMapPins();
    }
  }

  window.data = {
    usersAds: usersAds,
    activeMapPins: activeMapPins
  };

})();
