'use strict';

(function () {

  var mapPinsContainerElement = document.querySelector('.map__pins');
  var mapPinTemplateElement = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var PIN_HEIGHT = 70;
  var usersAds = [];


  function renderMapPin(userAd) {
    var mapPinElement = mapPinTemplateElement.cloneNode(true);
    var mapPinStyle = 'left: ' + userAd['location']['x'] + 'px; ' +
      'top: ' + (userAd['location']['y'] - PIN_HEIGHT) + 'px;';

    mapPinElement.setAttribute('style', mapPinStyle);
    mapPinElement.querySelector('img').setAttribute('alt', userAd['offer']['title']);
    mapPinElement.querySelector('img').setAttribute('src', userAd['author']['avatar']);

    return mapPinElement;
  }

  function successLoad(usersData) {
    var fragment = document.createDocumentFragment();
    window.data.usersAds = usersData;

    for (var i = 0; i < usersData.length; i++) {
      fragment.appendChild(renderMapPin(usersData[i]));
    }

    mapPinsContainerElement.appendChild(fragment);
  }

  function errorLoad(errorMesage) {
    var nodeElemetn = document.createElement('div');
    nodeElemetn.classList.add('error-load-message');
    nodeElemetn.style = 'z-index: 100; margin: 0 auto; color: #fff; text-align: center; background-color: firebrick;';
    nodeElemetn.style.position = 'fixed';
    nodeElemetn.style.left = 0;
    nodeElemetn.style.right = 0;
    nodeElemetn.style.fontSize = '30px';

    nodeElemetn.textContent = errorMesage;
    document.body.insertAdjacentElement('beforebegin', nodeElemetn);
  }

  function activeMapPins() {
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
    activeMapPins: activeMapPins,
    removeMapPins: removeMapPins,
    usersAds: usersAds
  };

})();
