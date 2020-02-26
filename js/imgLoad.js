'use strict';

(function () {

  var FILE_AVATAR_TYPES = ['jpg', 'jpeg', 'png'];
  var FILE_APARTMENT_TYPES = ['jpg', 'jpeg'];
  var MAX_PHOTO = 16;

  var adFormElement = document.querySelector('.ad-form');
  var loadApartmentImgElement = adFormElement.querySelector('[name="images"]');
  var avatarChooserElement = adFormElement.querySelector('.ad-form-header__input');
  var avatarImgElement = adFormElement.querySelector('.ad-form-header__preview img');
  var apartmentChooserElement = adFormElement.querySelector('.ad-form__input');
  var apartmentImgContainerElement = adFormElement.querySelector('.ad-form__photo');
  var apartmentPhotosContainerElement = adFormElement.querySelector('.ad-form__photo-container');
  var defoultAvatarLink = 'img/muffin-grey.svg';

  var ApartmentImg = {
    WIDTH: 70,
    HEIGHT: 70
  };

  function dropUserImages() {
    var allApartmentImgContainersElements = adFormElement.querySelectorAll('.ad-form__photo');
    var firstApartmentImg = adFormElement.querySelector('.ad-form__photo img');

    if (avatarImgElement.src !== defoultAvatarLink) {
      avatarImgElement.src = defoultAvatarLink;
    }

    if (allApartmentImgContainersElements.length > 1) {
      allApartmentImgContainersElements.forEach(function (formItem, i) {
        if (i !== 0) {
          formItem.remove();
        }
      });
    }

    if (firstApartmentImg) {
      firstApartmentImg.remove();
    }

    if (loadApartmentImgElement.hasAttribute('disabled')) {
      loadApartmentImgElement.removeAttribute('disabled');
    }
  }

  avatarChooserElement.addEventListener('change', function () {
    setAvatarImg();
  });

  apartmentChooserElement.addEventListener('change', function () {
    setApartmentImgs();
  });

  function setAvatarImg() {
    var file = avatarChooserElement.files[0];

    if (checkFileType(file, FILE_AVATAR_TYPES)) {
      renderImgFile(file, loadAvatarImg, avatarImgElement);
    }
  }

  function checkFileType(file, fileTypes) {
    var fileName = file.name.toLowerCase();

    var matches = fileTypes.some(function (extension) {
      return fileName.endsWith(extension);
    });

    return matches;
  }

  function loadAvatarImg(render, imgContainer) {
    imgContainer.src = render.result;
  }

  function setApartmentImgs() {
    var allApartmentImagesElements = adFormElement.querySelectorAll('.ad-form__photo img');
    var maxAddImage = MAX_PHOTO - allApartmentImagesElements.length;
    var imageValue = apartmentChooserElement.files.length < maxAddImage ? apartmentChooserElement.files.length : maxAddImage;
    var failTypeImg = 0;

    for (var i = 0; i < imageValue; i++) {
      var file = apartmentChooserElement.files[i];

      if (checkFileType(file, FILE_APARTMENT_TYPES)) {
        renderImgFile(file, loadApartmentImg);
      } else if (imageValue !== apartmentChooserElement.files.length) {
        imageValue++;
        failTypeImg++;
      } else {
        failTypeImg++;
      }
    }

    imageValue -= failTypeImg;

    if (maxAddImage === imageValue) {
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

    if (apartmentImgElement !== null && allApartmentImagesElements.length !== MAX_PHOTO) {
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

  window.imgLoad = {
    drop: dropUserImages
  };

})();
