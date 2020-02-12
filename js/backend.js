'use strict';

(function () {
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND = 'https://js.dump.academy/keksobooking';
  var TIMEOUT_LOAD_IN_MS = 1000;
  var TIMEOUT_SEND_IN_MS = 5000;
  var StatusCode = {
    OK: 200
  };

  function load(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_LOAD_IN_MS;

    xhr.open('GET', URL_DATA);
    xhr.send();
  }

  function sendForm(data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Новые данные не успели отправиться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_SEND_IN_MS;

    xhr.open('POST', URL_SEND);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    sendForm: sendForm
  };

})();
