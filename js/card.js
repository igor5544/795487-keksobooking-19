'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var mapFiltersElement = mapElement.querySelector('.map__filters-container');
  var apartmentsFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var adInfoCardTemplateElement = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  function createButtonsCards() {
    var mapButtonsPinsElements = document.querySelectorAll('.map__pin');
    var buttonswWithCards = Array.prototype.slice.call(mapButtonsPinsElements);
    buttonswWithCards.shift();

    buttonswWithCards.forEach(function (mapButton, i) {
      mapButton.addEventListener('click', function () {
        var actualCardInDomElement = document.querySelector('#card-' + (i + 1));
        var activeCardElement = mapElement.querySelector('.active-card');

        if (activeCardElement !== null && activeCardElement === actualCardInDomElement) {
          return;
        }

        if (actualCardInDomElement === null && activeCardElement === null) {
          buildAdInfoCard(i);
        } else if (actualCardInDomElement === null) {
          closeCard();
          buildAdInfoCard(i);
        } else if (activeCardElement !== null) {
          closeCard();
          openCard(actualCardInDomElement);
        } else {
          openCard(actualCardInDomElement);
        }

        mapButton.classList.add('map__pin--active');
      });
    });
  }

  function onActiveCardEscPress(evt) {
    window.util.trackEscEvent(evt, closeCard);
  }

  function openCard(actualCard) {
    actualCard.classList.add('active-card');
    actualCard.classList.remove('visually-hidden');

    document.addEventListener('keydown', onActiveCardEscPress);
  }

  function closeCard() {
    var activeCardElement = mapElement.querySelector('.active-card');
    var activeButtonElement = mapElement.querySelector('.map__pin--active');

    activeCardElement.classList.add('visually-hidden');
    activeCardElement.classList.remove('active-card');
    activeButtonElement.classList.remove('map__pin--active');

    document.removeEventListener('keydown', onActiveCardEscPress);
  }


  function buildAdInfoCard(cardIndex) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(renderAdInfoCard(cardIndex));

    mapElement.insertBefore(fragment, mapFiltersElement);
  }

  function renderAdInfoCard(cardIndex) {
    var adInfoCardElement = adInfoCardTemplateElement.cloneNode(true);
    var cardCloseButtonElement = adInfoCardElement.querySelector('.popup__close');
    var adRooms = window.data.actualAds[cardIndex]['offer']['rooms'];
    var adGuests = window.data.actualAds[cardIndex]['offer']['guests'];
    var adTimeCheckin = window.data.actualAds[cardIndex]['offer']['checkin'];
    var adTimeCheckout = window.data.actualAds[cardIndex]['offer']['checkout'];
    var cardTextsFields = ['.popup__title', '.popup__text--address', '.popup__text--price', '.popup__type',
      '.popup__text--capacity', '.popup__text--time', '.popup__description'];
    var adRoomsAndGuests;
    var adTimes;

    adGuests = (adGuests === 0) ? ' не для' : ' для ' + adGuests;

    if (adRooms !== '' && adRooms !== 0 && adGuests !== '') {
      adRoomsAndGuests = adRooms + ' комнат(a/ы)' + adGuests + ' гост(я/ей)';
    }

    if (adTimeCheckin !== '' && adTimeCheckout !== '') {
      adTimes = 'Заезд после ' + adTimeCheckin + ' выезд до ' + adTimeCheckout;
    }

    var cardTextsValues = [window.data.actualAds[cardIndex]['offer']['title'], window.data.actualAds[cardIndex]['offer']['address'], window.data.actualAds[cardIndex]['offer']['price'] + '₽/ночь', window.data.actualAds[cardIndex]['offer']['type'], adRoomsAndGuests, adTimes, window.data.actualAds[cardIndex]['offer']['description']];

    for (var i = 0; i < cardTextsFields.length; i++) {
      renderTextCard(cardTextsFields[i], cardTextsValues[i], adInfoCardElement);
    }

    renderMediaCard(cardIndex, adInfoCardElement);
    addUniqueId(adInfoCardElement, cardIndex);
    firstOpenCard(adInfoCardElement, cardCloseButtonElement);

    return adInfoCardElement;
  }

  function addUniqueId(infoCard, cardIndex) {
    var actualCardId = 'card-' + (cardIndex + 1);
    infoCard.id = actualCardId;
  }

  function firstOpenCard(infoCard, closeButton) {
    infoCard.classList.add('active-card');
    document.addEventListener('keydown', onActiveCardEscPress);

    closeButton.addEventListener('click', function () {
      closeCard();
    });
  }

  function renderTextCard(textField, textCard, elementContainer) {
    if (textCard === '' || textCard === undefined) {
      elementContainer.querySelector(textField).classList.add('visually-hidden');
    }

    elementContainer.querySelector(textField).textContent = textCard;
  }

  function renderMediaCard(cardIndex, elementContainer) {
    var featuresContianerInTemplateElement = elementContainer.querySelector('.popup__features');
    var featuresInTemplateElements = featuresContianerInTemplateElement.querySelectorAll('.popup__feature');
    var photosContainerElement = elementContainer.querySelector('.popup__photos');
    var photoImgTeplateElement = photosContainerElement.querySelector('.popup__photo');
    var adAvatar = window.data.actualAds[cardIndex]['author']['avatar'];
    var features = window.data.actualAds[cardIndex]['offer']['features'];
    var photos = window.data.actualAds[cardIndex]['offer']['photos'];

    if (adAvatar === '' || adAvatar === undefined) {
      elementContainer.querySelector('.popup__avatar').classList.add('visually-hidden');
    } else {
      elementContainer.querySelector('.popup__avatar').setAttribute('src', adAvatar);
    }

    if (featuresInTemplateElements.length !== features.length) {
      if (features.length === 0) {
        featuresContianerInTemplateElement.classList.add('visually-hidden');
      } else {
        hideExcessFeatures(featuresInTemplateElements, features);
      }
    }

    if (photos.length !== 0) {
      buildAdPhotos(photos, photoImgTeplateElement, photosContainerElement);
    } else {
      photosContainerElement.classList.add('visually-hidden');
    }
  }

  function hideExcessFeatures(featuresInTemplate, needFeatures) {
    var featuresInTemplateReformed = Array.prototype.slice.call(featuresInTemplate);
    var excessFeatures = getExcessFeatures(apartmentsFeatures, needFeatures);

    for (var i = 0; i < excessFeatures.length; i++) {
      var excessItemClass = 'popup__feature--' + excessFeatures[i];

      featuresInTemplateReformed.find(function (featureItem) {
        return featureItem.classList.contains(excessItemClass);
      }).classList.add('visually-hidden');
    }
  }

  function getExcessFeatures(allFeatures, needFeatures) {
    var excessFeatures = allFeatures.slice(0);

    return excessFeatures.filter(cleanExcessFeatures);

    function cleanExcessFeatures(needItem) {
      return needFeatures.indexOf(needItem) === -1;
    }
  }

  function buildAdPhotos(photos, imgTeplate, photosContainer) {
    if (photos.length === 1) {
      imgTeplate.setAttribute('src', photos[0]);
    } else {
      buildOtherAdPhotos(photos, imgTeplate, photosContainer);
    }
  }

  function buildOtherAdPhotos(photos, imgTeplate, photosContainer) {
    var fragment = document.createDocumentFragment();

    imgTeplate.setAttribute('src', photos.shift());

    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderNewPhotoForCard(photos[i], imgTeplate));
    }

    photosContainer.appendChild(fragment);
  }

  function renderNewPhotoForCard(photoLink, imgTeplate) {
    var photoForCard = imgTeplate.cloneNode(true);

    photoForCard.setAttribute('src', photoLink);

    return photoForCard;
  }

  function removedAdsInfoCards() {
    var adsCardsElements = mapElement.querySelectorAll('.map__card');

    adsCardsElements.forEach(function (adCard) {
      adCard.remove();
    });
  }

  window.card = {
    createButtonsCards: createButtonsCards,
    removedAdsInfoCards: removedAdsInfoCards
  };

})();
