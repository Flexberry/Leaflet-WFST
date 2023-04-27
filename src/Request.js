/**
 * Created by PRadostev on 02.02.2015.
 */

L.Util.request = function (options, xhrReferenceCallback) {
  options = L.extend({
    async: true,
    method: 'POST',
    data: '',
    params: {},
    headers: {},
    url: window.location.href,
    withCredentials: false,
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      console.log('Ajax request fail');
      console.log(data);
    },
    complete: function () {
    }
  }, options);

  // good bye IE 6,7
  var xhr = new XMLHttpRequest();

  if (xhrReferenceCallback) {
    xhrReferenceCallback(xhr);
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        options.success(xhr.responseText);
      } else {
        options.error(xhr.responseText);
      }
      options.complete();
    }
  };
  xhr.withCredentials = options.withCredentials;

  var url = options.url + L.Util.getParamString(options.params, options.url);

  xhr.open(options.method, url, options.async);
  for (var header in options.headers) {
    xhr.setRequestHeader(header, options.headers[header]);
  }

  xhr.send(options.data);
};
