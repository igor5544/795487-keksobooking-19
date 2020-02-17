'use strict';

(function () {

  var mapFiltersElement = document.querySelector('.map__filters-container');
  var selectFiltersListElements = mapFiltersElement.querySelectorAll('.map__filter');
  var housTypeFilterElements = mapFiltersElement.querySelector('#housing-type');
  var TIMEOUT_LOAD_IN_MS = 500;
  var selectHits = 0;
  var checkboxHits = 0;

  selectFiltersListElements.forEach(function (filterElement) {
    filterElement.addEventListener('change', function () {
      useAdsFilter();
    });
  });

  var useAdsFilter = window.debounce(function () {
    selectHits = getSelectHitsValue();
    var needHits = selectHits + checkboxHits;

    if (needHits === 0) {
      return activeFilters(window.data.usersAdsAll);
    }
    var newActualAdsList = window.data.usersAdsAll.filter(function (ad) {
      return getAdHits(ad) === needHits;
    });

    return activeFilters(newActualAdsList);
  });

  function getAdHits(ad) {
    var hits = 0;

    if (ad['offer']['type'] === housTypeFilterElements.value) {
      hits++;
    }

    return hits;
  }

  function activeFilters(adsList) {
    window.card.removedAdsInfoCards();
    window.data.renderMapPinsList(adsList);
    setTimeout(function () {
      window.card.createButtonsCards();
    }, TIMEOUT_LOAD_IN_MS);
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

})();
