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
  var selectHit = 0;
  var checkboxHit = 0;

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
    selectHit = getSelectHitValue();
    checkboxHit = getCheckboxHitValue();
    var needHit = selectHit + checkboxHit;

    if (needHit === 0) {
      return activeFilters(window.data.usersAdsAll);
    }

    var newActualAds = window.data.usersAdsAll.filter(function (ad) {
      return getSelectAdHit(ad) + getCheckboxAdHit(ad) === needHit;
    });

    return activeFilters(newActualAds);
  });

  function getSelectAdHit(ad) {
    var hit = 0;

    if (ad['offer']['type'] === housTypeFilterElement.value) {
      hit++;
    }

    if (corectPriceType(ad['offer']['price']) === housPriceFilterElement.value) {
      hit++;
    }

    if (ad['offer']['rooms'] === +housRoomsFilterElement.value) {
      hit++;
    }

    if (ad['offer']['guests'] === +housGuestsFilterElement.value) {
      hit++;
    }

    return hit;
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

  function getCheckboxAdHit(ad) {
    var hit = 0;
    var checkedFeatures = getCheckedFeatures();
    var adFeatures = ad['offer']['features'];

    checkedFeatures.forEach(function (checkedItem) {
      if (adFeatures.indexOf(checkedItem) !== -1) {
        hit++;
      }
    });

    return hit;
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

  function getSelectHitValue() {
    var hitValue = 0;

    selectFiltersListElements.forEach(function (filterElement) {
      if (filterElement.value !== 'any') {
        hitValue++;
      }
    });

    return hitValue;
  }

  function getCheckboxHitValue() {
    var hitValue = 0;

    checkboxFiltersListElements.forEach(function (checkboxElement) {
      if (checkboxElement.checked) {
        hitValue++;
      }
    });

    return hitValue;
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
