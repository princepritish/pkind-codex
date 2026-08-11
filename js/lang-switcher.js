(function () {
  var select = document.getElementById('langSwitcher');
  if (!select) {
    return;
  }

  var STORAGE_KEY = 'pki_lang_pref';
  var supported = ['en', 'hi', 'bn'];

  function getCanonicalUrl() {
    var node = document.querySelector('link[rel="canonical"]');
    if (!node || !node.href) {
      return '';
    }

    try {
      var parsed = new URL(node.href);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.href;
      }
    } catch (_err) {}

    return '';
  }

  function isHttpUrl(urlString) {
    try {
      var parsed = new URL(urlString);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_err) {
      return false;
    }
  }

  function getBaseSourceUrl() {
    try {
      var url = new URL(window.location.href);
      var host = url.hostname;
      var isTranslateHost = host.indexOf('translate.goog') !== -1 || host.indexOf('translate.google') !== -1 || host.indexOf('googleusercontent.com') !== -1;
      if (isTranslateHost) {
        var u = url.searchParams.get('u');
        if (u && isHttpUrl(u)) {
          return u;
        }
      }
    } catch (_err) {}

    var canonical = getCanonicalUrl();
    if (canonical) {
      return canonical;
    }

    try {
      var current = new URL(window.location.href);
      if (current.protocol === 'http:' || current.protocol === 'https:') {
        return current.origin + current.pathname;
      }
    } catch (_err) {}

    return '';
  }

  function getTranslatedLanguage() {
    try {
      var url = new URL(window.location.href);
      var tl = url.searchParams.get('tl');
      if (tl && supported.indexOf(tl) !== -1) {
        return tl;
      }
    } catch (_err) {}

    return '';
  }

  var translatedLang = getTranslatedLanguage();
  var storedLang = '';

  try {
    storedLang = localStorage.getItem(STORAGE_KEY) || '';
  } catch (_err) {}

  if (supported.indexOf(translatedLang) !== -1) {
    select.value = translatedLang;
  } else if (supported.indexOf(storedLang) !== -1) {
    select.value = storedLang;
  } else {
    select.value = 'en';
  }

  select.addEventListener('change', function (event) {
    var lang = event.target.value;
    if (supported.indexOf(lang) === -1) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_err) {}

    var sourceUrl = getBaseSourceUrl();
    if (!sourceUrl) {
      alert('Translation is unavailable in local preview. Open the deployed URL (https://pkindustries.net) and try again.');
      select.value = 'en';
      return;
    }

    if (lang === 'en') {
      window.location.href = sourceUrl;
      return;
    }

    window.location.href = 'https://translate.google.com/translate?sl=en&tl=' + encodeURIComponent(lang) + '&u=' + encodeURIComponent(sourceUrl);
  });
})();
