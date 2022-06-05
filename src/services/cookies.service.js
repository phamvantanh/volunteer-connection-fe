import Cookies from "js-cookie";

const CookiesService = (function () {
  let _service;

  function _getService () {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }

  function _setToken (token) {
    Cookies.set("access_token", token, { expires: 1 / 12 }); //2hours
  }

  function _getToken () {
    return Cookies.get("access_token");
  }

  function _clearToken () {
    Cookies.remove("access_token");
  }

  function _setRefreshToken (token) {
    Cookies.set("refresh_token", token, { expires: 7 }); //7days
  }

  function _getRefreshToken () {
    return Cookies.get("refresh_token");
  }

  function _clearRefreshToken () {
    Cookies.remove("refresh_token");
  }
  return {
    getService: _getService,

    setToken: _setToken,

    getToken: _getToken,

    clearToken: _clearToken,

    setRefreshToken: _setRefreshToken,

    getRefreshToken: _getRefreshToken,

    clearRefreshToken: _clearRefreshToken,
  };
})();
export default CookiesService;
