'use strict';

(function () {

  var mapFiltersElement = document.querySelector('.map__filters-container');
  var selectFiltersListElements = mapFiltersElement.querySelectorAll('.map__filter');
  var checkboxFiltersListElements = mapFiltersElement.querySelectorAll('.map__checkbox');
  var housTypeFilterElements = mapFiltersElement.querySelector('#housing-type');
  var housPriceFilterElements = mapFiltersElement.querySelector('#housing-price');
  var housRoomsFilterElements = mapFiltersElement.querySelector('#housing-rooms');
  var housGuestsFilterElements = mapFiltersElement.querySelector('#housing-guests');
  var TIMEOUT_LOAD_IN_MS = 500;
  var selectHits = 0;
  var checkboxHits = 0;

  var Price = {
    LOW_TOP: 10000,
    HIGH_BOTTOM: 50000
  };

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

    var newActualAdsList = window.data.usersAdsAll.filter(function (ad) {
      return getSelectAdHits(ad) + getCheckboxAdHits(ad) === needHits;
    });

    return activeFilters(newActualAdsList);
  });

  function getSelectAdHits(ad) {
    var hits = 0;

    if (ad['offer']['type'] === housTypeFilterElements.value) {
      hits++;
    }

    if (corectPriceType(ad['offer']['price']) === housPriceFilterElements.value) {
      hits++;
    }

    if (ad['offer']['rooms'] === +housRoomsFilterElements.value) {
      hits++;
    }

    if (ad['offer']['guests'] === +housGuestsFilterElements.value) {
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
    var checkedFeatures = getCheckedFeaturesList();
    var adFeatures = ad['offer']['features'];

    checkedFeatures.forEach(function (checkedItem) {
      if (adFeatures.indexOf(checkedItem) !== -1) {
        hits++;
      }
    });

    return hits;
  }

  function getCheckedFeaturesList() {
    var checkedFeaturesList = [];

    checkboxFiltersListElements.forEach(function (checkboxElement) {
      if (checkboxElement.checked) {
        checkedFeaturesList.push(checkboxElement.value);
      }
    });

    return checkedFeaturesList;
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

  function activeFilters(adsList) {
    window.card.removedAdsInfoCards();
    window.data.renderMapPinsList(adsList);
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
    dropSettings: dropFiltersSettings
  };

})();
