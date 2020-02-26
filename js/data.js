'use strict';

(function () {

  var PIN_HEIGHT = 70;
  var MAX_ADS = 5;

  var mapPinsContainerElement = document.querySelector('.map__pins');
  var mapPinTemplateElement = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

  var usersAdsAll = [];
  var actualAds = [];

  function getRandomNumber(minNumber, maxNumber) {
    return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
  }

  function renderMapPin(userAd) {
    var mapPinElement = mapPinTemplateElement.cloneNode(true);
    var mapPinStyle = 'left: ' + userAd['location']['x'] + 'px; ' +
      'top: ' + (userAd['location']['y'] - PIN_HEIGHT) + 'px;';

    mapPinElement.setAttribute('style', mapPinStyle);
    mapPinElement.querySelector('img').setAttribute('alt', userAd['offer']['title']);
    mapPinElement.querySelector('img').setAttribute('src', userAd['author']['avatar']);

    return mapPinElement;
  }

  function renderMapPins(usersData) {
    var fragment = document.createDocumentFragment();
    var firstAds = usersData.length > MAX_ADS ? getRandomNumber(0, usersData.length - MAX_ADS) : 0;
    var lastAds = usersData.length > MAX_ADS ? firstAds + MAX_ADS : usersData.length;

    window.data.actualAds = usersData.slice(firstAds, lastAds);
    window.data.removeMapPins();

    for (var i = 0; i < window.data.actualAds.length; i++) {
      fragment.appendChild(renderMapPin(window.data.actualAds[i]));
    }

    mapPinsContainerElement.appendChild(fragment);
  }

  function successLoad(usersData) {
    var clearUserData = usersData.filter(function (userAd) {
      return userAd['offer'] !== undefined && userAd['offer'] !== '';
    });
    window.data.usersAdsAll = clearUserData;

    renderMapPins(clearUserData);
  }

  function errorLoad(errorMessage) {
    var nodeElemetn = document.createElement('div');
    nodeElemetn.classList.add('error-load-message');
    nodeElemetn.style = 'z-index: 100; margin: 0 auto; color: #fff; text-align: center; background-color: firebrick;';
    nodeElemetn.style.position = 'fixed';
    nodeElemetn.style.left = 0;
    nodeElemetn.style.right = 0;
    nodeElemetn.style.fontSize = '30px';

    nodeElemetn.textContent = errorMessage;
    document.body.insertAdjacentElement('beforebegin', nodeElemetn);
  }

  function activateMapPins() {
    window.backend.load(successLoad, errorLoad);
  }

  function removeMapPins() {
    var mapButtonsPinsElements = document.querySelectorAll('.map__pin');
    var mapButtonsPins = Array.prototype.slice.call(mapButtonsPinsElements);
    mapButtonsPins.shift();

    mapButtonsPins.forEach(function (mapButton) {
      mapButton.remove();
    });
  }

  window.data = {
    activateMapPins: activateMapPins,
    removeMapPins: removeMapPins,
    actualAds: actualAds,
    renderMapPins: renderMapPins,
    usersAdsAll: usersAdsAll
  };

})();
