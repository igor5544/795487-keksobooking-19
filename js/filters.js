'use strict';

(function () {

  var TIMEOUT_LOAD_IN_MS = 500;

  var mapFiltersElement = document.querySelector('.map__filters');
  var selectFiltersListElements = mapFiltersElement.querySelectorAll('.map__filter');
  var housTypeFilterElement = mapFiltersElement.querySelector('#housing-type');
  var housPriceFilterElement = mapFiltersElement.querySelector('#housing-price');
  var housRoomsFilterElement = mapFiltersElement.querySelector('#housing-rooms');
  var housGuestsFilterElement = mapFiltersElement.querySelector('#housing-guests');
  var featureFilterContainerElement = mapFiltersElement.querySelector('.map__features');
  var checkboxFiltersListElements = featureFilterContainerElement.querySelectorAll('.map__checkbox');
  var selectHits = 0;
  var checkboxHits = 0;

  var Price = {
    LOW_TOP: 10000,
    HIGH_BOTTOM: 50000
  };

  deactivateFilterForm();

  function deactivateFilterForm() {
    selectFiltersListElements.forEach(function (selectElement) {
      selectElement.setAttribute('disabled', 'disabled');
    });

    featureFilterContainerElement.setAttribute('disabled', 'disabled');
  }

  function activateFilterForm() {
    selectFiltersListElements.forEach(function (selectElement) {
      selectElement.removeAttribute('disabled');
    });

    featureFilterContainerElement.removeAttribute('disabled');
  }

  selectFiltersListElements.forEach(function (filterElement) {
    filterElement.addEventListener('change', function () {
      useAdsFilter();
    });
  });

  checkboxFiltersListElements.forEach(function (filterElement) {
    filterElement.addEventListener('change', function () {
      useAdsFilter();
    });
  });

  var useAdsFilter = window.debounce(function () {
    selectHits = getSelectHitsValue();
    checkboxHits = getCheckboxHitsValue();
    var needHits = selectHits + checkboxHits;

    if (needHits === 0) {
      return activeFilters(window.data.usersAdsAll);
    }

    var newActualAds = window.data.usersAdsAll.filter(function (ad) {
      return getSelectAdHits(ad) + getCheckboxAdHits(ad) === needHits;
    });

    return activeFilters(newActualAds);
  });

  function getSelectAdHits(ad) {
    var hits = 0;

    if (ad['offer']['type'] === housTypeFilterElement.value) {
      hits++;
    }

    if (corectPriceType(ad['offer']['price']) === housPriceFilterElement.value) {
      hits++;
    }

    if (ad['offer']['rooms'] === +housRoomsFilterElement.value) {
      hits++;
    }

    if (ad['offer']['guests'] === +housGuestsFilterElement.value) {
      hits++;
    }

    return hits;
  }

  function corectPriceType(priceInValue) {
    var priceCategory = '';

    if (priceInValue < Price.LOW_TOP) {
      priceCategory = 'low';
    } else if (priceInValue >= Price.LOW_TOP && priceInValue <= Price.HIGH_BOTTOM) {
      priceCategory = 'middle';
    } else if (priceInValue >= Price.HIGH_BOTTOM) {
      priceCategory = 'high';
    }

    return priceCategory;
  }

  function getCheckboxAdHits(ad) {
    var hits = 0;
    var checkedFeatures = getCheckedFeatures();
    var adFeatures = ad['offer']['features'];

    checkedFeatures.forEach(function (checkedItem) {
      if (adFeatures.indexOf(checkedItem) !== -1) {
        hits++;
      }
    });

    return hits;
  }

  function getCheckedFeatures() {
    var checkedFeatures = [];

    checkboxFiltersListElements.forEach(function (checkboxElement) {
      if (checkboxElement.checked) {
        checkedFeatures.push(checkboxElement.value);
      }
    });

    return checkedFeatures;
  }

  function getSelectHitsValue() {
    var hitsValue = 0;

    selectFiltersListElements.forEach(function (filterElement) {
      if (filterElement.value !== 'any') {
        hitsValue++;
      }
    });

    return hitsValue;
  }

  function getCheckboxHitsValue() {
    var hitsValue = 0;

    checkboxFiltersListElements.forEach(function (checkboxElement) {
      if (checkboxElement.checked) {
        hitsValue++;
      }
    });

    return hitsValue;
  }

  function activeFilters(ads) {
    window.card.removedAdsInfoCards();
    window.data.renderMapPins(ads);
    setTimeout(function () {
      window.card.createButtonsCards();
    }, TIMEOUT_LOAD_IN_MS);
  }

  function dropFiltersSettings() {
    selectFiltersListElements.forEach(function (filterElement) {
      filterElement.value = 'any';
    });

    checkboxFiltersListElements.forEach(function (checkboxElement) {
      checkboxElement.checked = false;
    });
  }

  window.filters = {
    dropSettings: dropFiltersSettings,
    deactivate: deactivateFilterForm,
    activate: activateFilterForm
  };

})();
