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

        if (activeCardElement !== null) {
          return;
        }

        if (actualCardInDomElement === null) {
          buildAdInfoCard(i);
        } else {
          openCard(actualCardInDomElement);
        }
      });
    });
  }

  function onActiveCardEscPress(evt) {
    window.util.isEscEvent(evt, closeCard);
  }

  function openCard(actualCard) {
    actualCard.classList.add('active-card');
    actualCard.classList.remove('visually-hidden');

    document.addEventListener('keydown', onActiveCardEscPress);
  }

  function closeCard() {
    var activeCardElement = mapElement.querySelector('.active-card');
    activeCardElement.classList.add('visually-hidden');
    activeCardElement.classList.remove('active-card');

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
    var adRooms = window.data.actualAdsList[cardIndex]['offer']['rooms'];
    var adGuests = window.data.actualAdsList[cardIndex]['offer']['guests'];
    var adTimeCheckin = window.data.actualAdsList[cardIndex]['offer']['checkin'];
    var adTimeCheckout = window.data.actualAdsList[cardIndex]['offer']['checkout'];
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

    var cardTextsValues = [window.data.actualAdsList[cardIndex]['offer']['title'], window.data.actualAdsList[cardIndex]['offer']['address'], window.data.actualAdsList[cardIndex]['offer']['price'] + '₽/ночь', window.data.actualAdsList[cardIndex]['offer']['type'], adRoomsAndGuests, adTimes, window.data.actualAdsList[cardIndex]['offer']['description']];

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
    var featuresListInTemplateElement = featuresContianerInTemplateElement.querySelectorAll('.popup__feature');
    var photosContainerElement = elementContainer.querySelector('.popup__photos');
    var photoImgTeplateElement = photosContainerElement.querySelector('.popup__photo');
    var adAvatar = window.data.actualAdsList[cardIndex]['author']['avatar'];
    var featuresList = window.data.actualAdsList[cardIndex]['offer']['features'];
    var photosList = window.data.actualAdsList[cardIndex]['offer']['photos'];

    if (adAvatar === '' || adAvatar === undefined) {
      elementContainer.querySelector('.popup__avatar').classList.add('visually-hidden');
    } else {
      elementContainer.querySelector('.popup__avatar').setAttribute('src', adAvatar);
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
  }

  function hiddenExcessFeatures(featuresInTemplate, needFeatures) {
    var featuresInTemplateArr = Array.prototype.slice.call(featuresInTemplate);
    var excessFeatures = getExcessFeatures(apartmentsFeatures, needFeatures);

    for (var i = 0; i < excessFeatures.length; i++) {
      var excessItemClass = 'popup__feature--' + excessFeatures[i];

      featuresInTemplateArr.find(function (featureItem) {
        return featureItem.classList.contains(excessItemClass);
      }).classList.add('visually-hidden');
    }
  }

  function getExcessFeatures(allFeatures, needFeatures) {
    var excessFeatureslist = allFeatures.slice(0);

    return excessFeatureslist.filter(cleanExcessFeatures);

    function cleanExcessFeatures(needItem) {
      return needFeatures.indexOf(needItem) === -1;
    }
  }

  function buildAdPhotos(photosList, imgTeplate, photosContainer) {
    if (photosList.length === 1) {
      imgTeplate.setAttribute('src', photosList[0]);
    } else {
      buildAdPhotosList(photosList, imgTeplate, photosContainer);
    }
  }

  function buildAdPhotosList(photosList, imgTeplate, photosContainer) {
    var fragment = document.createDocumentFragment();

    imgTeplate.setAttribute('src', photosList.shift());

    for (var i = 0; i < photosList.length; i++) {
      fragment.appendChild(renderNewPhotoForCard(photosList[i], imgTeplate));
    }

    photosContainer.appendChild(fragment);
  }

  function renderNewPhotoForCard(photoLink, imgTeplate) {
    var photoForCard = imgTeplate.cloneNode(true);

    photoForCard.setAttribute('src', photoLink);

    return photoForCard;
  }

  function removedAdsInfoCards() {
    var adsCardSElements = mapElement.querySelectorAll('.map__card');

    adsCardSElements.forEach(function (adCard) {
      adCard.remove();
    });
  }

  window.card = {
    createButtonsCards: createButtonsCards,
    removedAdsInfoCards: removedAdsInfoCards
  };

})();
