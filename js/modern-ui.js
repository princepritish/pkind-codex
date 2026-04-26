(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('#siteMenu');
  var nav = document.querySelector('.nav');
  var smallViewportQuery = window.matchMedia('(max-width: 760px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lightweightMode = smallViewportQuery.matches || reducedMotionQuery.matches;

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  if (!lightweightMode) {
    reveals.forEach(function (item, idx) {
      item.style.setProperty('--reveal-delay', String((idx % 8) * 90) + 'ms');
    });
  }

  if (!lightweightMode && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    reveals.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  var previousScrolledState = null;
  var ticking = false;

  var updateNavState = function () {
    if (!nav) {
      return;
    }

    var nextState = window.scrollY > 18;
    if (nextState === previousScrolledState) {
      return;
    }

    nav.classList.toggle('scrolled', nextState);
    previousScrolledState = nextState;
  };

  updateNavState();
  window.addEventListener('scroll', function () {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(function () {
      updateNavState();
      ticking = false;
    });
  }, { passive: true });

  var yearNode = document.querySelector('.site-footer p');
  if (yearNode) {
    yearNode.textContent = '© ' + new Date().getFullYear() + ' PK INDUSTRIES. All rights reserved.';
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.body.appendChild(script);
    });
  }

  var formEmbed = document.getElementById('formkeep-embed');
  var loadInquiryBtn = document.getElementById('loadInquiryBtn');
  if (formEmbed) {
    var formScriptsLoaded = false;
    var loadFormScripts = function () {
      if (formScriptsLoaded) {
        return;
      }

      formScriptsLoaded = true;
      if (loadInquiryBtn) {
        loadInquiryBtn.disabled = true;
        loadInquiryBtn.textContent = 'Loading Form...';
      }

      loadScript('https://pym.nprapps.org/pym.v1.min.js')
        .then(function () {
          return loadScript('https://formkeep-production-herokuapp-com.global.ssl.fastly.net/formkeep-embed.js');
        })
        .then(function () {
          if (loadInquiryBtn) {
            loadInquiryBtn.textContent = 'Inquiry Form Loaded';
          }
        })
        .catch(function () {
          if (loadInquiryBtn) {
            loadInquiryBtn.disabled = false;
            loadInquiryBtn.textContent = 'Retry Loading Form';
          }
          // Keep fallback link available if third-party scripts fail.
        });
    };

    if (loadInquiryBtn) {
      loadInquiryBtn.addEventListener('click', loadFormScripts);
    }
  }

  var mapContainer = document.getElementById('mapContainer');
  var loadMapBtn = document.getElementById('loadMapBtn');
  if (mapContainer && loadMapBtn) {
    loadMapBtn.addEventListener('click', function () {
      if (mapContainer.getAttribute('data-loaded') === 'true') {
        return;
      }

      var src = mapContainer.getAttribute('data-map-src');
      if (!src) {
        return;
      }

      var iframe = document.createElement('iframe');
      iframe.title = 'P.K. Industries Google Map location';
      iframe.src = src;
      iframe.width = '100%';
      iframe.height = '420';
      iframe.style.border = '0';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      mapContainer.appendChild(iframe);
      mapContainer.setAttribute('data-loaded', 'true');
      loadMapBtn.disabled = true;
      loadMapBtn.textContent = 'Map Loaded';
    });
  }
})();
