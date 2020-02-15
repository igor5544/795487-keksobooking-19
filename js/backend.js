'use strict';

(function () {
  var DOMAIN = 'https://js.dump.academy/keksobooking';
  var DATA_PATH = '/data';
  var URL_SEND = DOMAIN;
  var URL_DATA = DOMAIN + DATA_PATH;
  var TIMEOUT_IN_MS = 5000;
  var StatusCode = {
    OK: 200
  };

  function load(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    getServerResponseLoad(xhr, onSuccess, onError);
    getServerResponseError(xhr, onError);

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('GET', URL_DATA);
    xhr.send();
  }

  function sendForm(data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    getServerResponseLoad(xhr, onSuccess, onError);
    getServerResponseError(xhr, onError);

    xhr.addEventListener('timeout', function () {
      onError('Новые данные не успели отправиться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('POST', URL_SEND);
    xhr.send(data);
  }

  function getServerResponseLoad(xhr, onSuccess, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  }

  function getServerResponseError(xhr, onError) {
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
  }

  window.backend = {
    load: load,
    sendForm: sendForm
  };

})();
