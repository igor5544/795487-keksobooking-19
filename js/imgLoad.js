'use strict';

(function () {

  var adFormElement = document.querySelector('.ad-form');
  var loadApartmentImgElement = adFormElement.querySelector('[name="images"]');
  var avatarChooserElement = adFormElement.querySelector('.ad-form-header__input');
  var avatarImgElement = adFormElement.querySelector('.ad-form-header__preview img');
  var apartmentChooserElement = adFormElement.querySelector('.ad-form__input');
  var apartmentImgContainerElement = adFormElement.querySelector('.ad-form__photo');
  var apartmentPhotosContainerElement = adFormElement.querySelector('.ad-form__photo-container');

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAX_PHOTOS = 16;

  var ApartmentImg = {
    WIDTH: 70,
    HEIGHT: 70
  };

  avatarChooserElement.addEventListener('change', function () {
    setAvatarImg();
  });

  apartmentChooserElement.addEventListener('change', function () {
    setApartmentImgs();
  });

  function setAvatarImg() {
    var file = avatarChooserElement.files[0];

    if (checkFileType(file)) {
      renderImgFile(file, loadAvatarImg, avatarImgElement);
    }
  }

  function checkFileType(file) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (extension) {
      return fileName.endsWith(extension);
    });

    return matches;
  }

  function loadAvatarImg(render, imgContainer) {
    imgContainer.src = render.result;
  }

  function setApartmentImgs() {
    var allApartmentImagesElements = adFormElement.querySelectorAll('.ad-form__photo img');
    var maxAddImages = MAX_PHOTOS - allApartmentImagesElements.length;
    var imagesValue = apartmentChooserElement.files.length < maxAddImages ? apartmentChooserElement.files.length : maxAddImages;

    for (var i = 0; i < imagesValue; i++) {
      var file = apartmentChooserElement.files[i];

      if (checkFileType(file)) {
        renderImgFile(file, loadApartmentImg);
      }
    }

    if (maxAddImages === imagesValue) {
      loadApartmentImgElement.setAttribute('disabled', 'disabled');
    }
  }

  function renderImgFile(file, loadFunction, imgContainer) {
    var render = new FileReader();

    render.readAsDataURL(file);

    render.addEventListener('load', function () {
      loadFunction(render, imgContainer);
    });
  }

  function loadApartmentImg(render) {
    var imgContainerElement = adFormElement.querySelector('.ad-form__photo');
    var apartmentImgElement = imgContainerElement.querySelector('img');
    var allApartmentImagesElements = adFormElement.querySelectorAll('.ad-form__photo img');

    if (apartmentImgElement !== null && allApartmentImagesElements.length !== MAX_PHOTOS) {
      buildNewImage(render.result);
    } else {
      var imgElement = document.createElement('img');

      imgElement.src = render.result;
      imgElement.width = ApartmentImg.WIDTH;
      imgElement.height = ApartmentImg.HEIGHT;

      imgContainerElement.appendChild(imgElement);

      imgElement.addEventListener('click', function () {
        removeImage(imgElement, imgContainerElement);
      });
    }
  }

  function buildNewImage(imgURL) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(renderNewImage(imgURL));

    apartmentPhotosContainerElement.appendChild(fragment);
  }

  function renderNewImage(imgURL) {
    var newApartmentImgElement = apartmentImgContainerElement.cloneNode(true);
    var imgElement = newApartmentImgElement.querySelector('img');

    imgElement.src = imgURL;

    imgElement.addEventListener('click', function () {
      removeImage(imgElement, newApartmentImgElement);
    });

    return newApartmentImgElement;
  }

  function removeImage(img, imgContainer) {
    var allApartmentImagesElements = adFormElement.querySelectorAll('.ad-form__photo img');

    if (allApartmentImagesElements.length <= 1) {
      img.remove();
    } else {
      imgContainer.remove();
    }

    if (loadApartmentImgElement.hasAttribute('disabled')) {
      loadApartmentImgElement.removeAttribute('disabled');
    }
  }

})();
