'use strict';

(function () {

  var adFormElement = document.querySelector('.ad-form');
  var avatarChooserElement = adFormElement.querySelector('.ad-form-header__input');
  var avatarImgElement = adFormElement.querySelector('.ad-form-header__preview img');
  var apartmentChooserElement = adFormElement.querySelector('.ad-form__input');
  var apartmentImgContainerElement = adFormElement.querySelector('.ad-form__photo');

  var FILE_AVATAR_TYPES = ['jpg', 'jpeg', 'png'];
  var FILE_APARTMENT_TYPES = ['jpg', 'jpeg'];

  var ApartmentImg = {
    WIDTH: 70,
    HEIGHT: 70
  };

  avatarChooserElement.addEventListener('change', function () {
    setLoadImg(avatarChooserElement, FILE_AVATAR_TYPES, setAvatarImg, avatarImgElement);
  });

  apartmentChooserElement.addEventListener('change', function () {
    setLoadImg(apartmentChooserElement, FILE_APARTMENT_TYPES, setApartmentImg, apartmentImgContainerElement);
  });

  function setLoadImg(chooserElement, fileTypes, loadFunction, imgContainer) {
    var file = chooserElement.files[0];
    var fileName = file.name.toLowerCase();

    var matches = fileTypes.some(function (extension) {
      return fileName.endsWith(extension);
    });

    if (matches) {
      var render = new FileReader();

      render.addEventListener('load', function () {
        loadFunction(imgContainer, render);
      });

      render.readAsDataURL(file);
    }
  }

  function setAvatarImg(imgContainer, render) {
    imgContainer.src = render.result;
  }

  function setApartmentImg(imgContainer, render) {
    var apartmentImgElement = apartmentImgContainerElement.querySelector('img');

    if (apartmentImgElement) {
      apartmentImgElement.src = render.result;
    } else {
      var imgElement = document.createElement('img');

      imgElement.src = render.result;
      imgElement.width = ApartmentImg.WIDTH;
      imgElement.height = ApartmentImg.HEIGHT;

      imgContainer.appendChild(imgElement);
    }
  }

})();
