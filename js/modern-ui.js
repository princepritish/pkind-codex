(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('#siteMenu');
  var nav = document.querySelector('.nav');
  var smallViewportQuery = window.matchMedia('(max-width: 760px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var lightweightMode = smallViewportQuery.matches || reducedMotionQuery.matches;
  var themeStorageKey = 'pkindustries-theme';
  var themeToggleButton = null;

  function getSavedTheme() {
    try {
      return window.localStorage.getItem(themeStorageKey);
    } catch (error) {
      return null;
    }
  }

  function getRequestedTheme() {
    try {
      var queryTheme = new URLSearchParams(window.location.search).get('theme');
      return queryTheme === 'dark' || queryTheme === 'light' ? queryTheme : null;
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      // Theme still works for the current page if storage is unavailable.
    }
  }

  function setTheme(theme) {
    var nextTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.classList.toggle('theme-dark', nextTheme === 'dark');
    document.body.setAttribute('data-theme', nextTheme);

    if (themeToggleButton) {
      var isDark = nextTheme === 'dark';
      themeToggleButton.setAttribute('aria-pressed', String(isDark));
      themeToggleButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggleButton.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      var label = themeToggleButton.querySelector('.theme-label');
      if (label) {
        label.textContent = isDark ? 'Dark' : 'Light';
      }
    }
  }

  var requestedTheme = getRequestedTheme();
  setTheme(requestedTheme || getSavedTheme() || 'light');
  if (requestedTheme) {
    saveTheme(requestedTheme);
  }

  function mountThemeToggle() {
    if (!menu || menu.querySelector('.theme-toggle')) {
      return;
    }

    var item = document.createElement('li');
    item.className = 'theme-toggle-item';

    themeToggleButton = document.createElement('button');
    themeToggleButton.type = 'button';
    themeToggleButton.className = 'theme-toggle';
    themeToggleButton.innerHTML = '<span class="theme-toggle-track" aria-hidden="true"><span class="theme-toggle-knob"></span></span><span class="theme-label">Light</span>';
    themeToggleButton.addEventListener('click', function () {
      var currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      saveTheme(nextTheme);
    });

    item.appendChild(themeToggleButton);
    var languageItem = menu.querySelector('.nav-lang');
    menu.insertBefore(item, languageItem || null);
    setTheme(document.body.getAttribute('data-theme') || 'light');
  }

  mountThemeToggle();

  if (toggle && menu) {
    var dropdownItems = menu.querySelectorAll('.has-dropdown');
    var hoverCapableQuery = window.matchMedia('(hover: hover)');
    var isDesktopDropdownMode = function () {
      return !smallViewportQuery.matches && hoverCapableQuery.matches;
    };
    var closeDropdowns = function () {
      dropdownItems.forEach(function (item) {
        item.classList.remove('open');
        var button = item.querySelector('.nav-dropdown-toggle');
        if (button) {
          button.setAttribute('aria-expanded', 'false');
        }
      });
    };

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (!isOpen) {
        closeDropdowns();
      }
    });

    dropdownItems.forEach(function (item) {
      var button = item.querySelector('.nav-dropdown-toggle');
      if (!button) {
        return;
      }

      item.addEventListener('pointerenter', function () {
        if (!isDesktopDropdownMode()) {
          return;
        }
        closeDropdowns();
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      });

      item.addEventListener('pointerleave', function () {
        if (!isDesktopDropdownMode()) {
          return;
        }
        item.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      });

      button.addEventListener('click', function (event) {
        event.stopPropagation();
        var nextOpen = !item.classList.contains('open');
        closeDropdowns();
        item.classList.toggle('open', nextOpen);
        button.setAttribute('aria-expanded', String(nextOpen));
      });
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        closeDropdowns();
      });
    });

    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target)) {
        closeDropdowns();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        closeDropdowns();
      }
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

  var waFloating = document.querySelector('.whatsapp-float');
  if (waFloating) {
    if (!waFloating.querySelector('.fab-icon')) {
      waFloating.innerHTML = '<span class="fab-icon" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false" aria-hidden="true"><path d="M19.11 17.35c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.29-.74.9-.9 1.09-.17.19-.33.21-.61.07-.29-.14-1.2-.44-2.28-1.4-.84-.74-1.4-1.66-1.56-1.94-.16-.29-.02-.44.12-.58.12-.12.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.53-.88-2.1-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.02 2.8 1.16 2.99c.14.19 2 3.06 4.84 4.29.68.29 1.2.46 1.61.58.68.22 1.29.19 1.78.12.54-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.17-1.31-.07-.12-.24-.19-.52-.33Zm-3.02 10.65h-.01a12.77 12.77 0 0 1-6.5-1.78l-.47-.28-4.84 1.27 1.29-4.72-.31-.49a12.77 12.77 0 0 1-1.95-6.77C3.31 8.17 8.47 3 14.82 3c3.08 0 5.98 1.2 8.16 3.39a11.37 11.37 0 0 1 3.38 8.1c0 6.36-5.17 11.52-11.53 11.52Zm9.79-21.28A13.74 13.74 0 0 0 15.08 2c-7.57 0-13.72 6.15-13.72 13.72 0 2.4.63 4.75 1.82 6.81L1 30l7.69-2.2a13.67 13.67 0 0 0 6.39 1.62h.01c7.57 0 13.72-6.15 13.72-13.72 0-3.66-1.42-7.1-4.01-9.68Z"/></svg></span>';
    }

    if (!document.querySelector('.chatbot-float')) {
      var chatbotFloating = document.createElement('a');
      chatbotFloating.className = 'chatbot-float';
      chatbotFloating.href = 'chatbot.html';
      chatbotFloating.setAttribute('aria-label', 'Get a quote');
      chatbotFloating.innerHTML = '<span class="fab-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M4 12.2c0-4.42 3.72-8 8.3-8 4.58 0 8.3 3.58 8.3 8s-3.72 8-8.3 8c-.88 0-1.72-.13-2.5-.37L5.1 21.8l1.16-4.33A7.7 7.7 0 0 1 4 12.2Zm8.3-5.7c-3.26 0-5.9 2.55-5.9 5.7 0 1.63.71 3.1 1.85 4.14l.46.42-.51 1.9 2.09-.88.39.13c.73.24 1.5.36 2.32.36 3.26 0 5.9-2.55 5.9-5.7s-2.64-5.7-5.9-5.7Zm-3.27 5.7a1.07 1.07 0 1 1 0-2.13 1.07 1.07 0 0 1 0 2.13Zm3.27 0a1.07 1.07 0 1 1 0-2.13 1.07 1.07 0 0 1 0 2.13Zm3.27 0a1.07 1.07 0 1 1 0-2.13 1.07 1.07 0 0 1 0 2.13Z"/></svg></span>';
      waFloating.parentNode.insertBefore(chatbotFloating, waFloating);
    }
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

  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-slider-track]');
    var prev = slider.querySelector('[data-slider-prev]');
    var next = slider.querySelector('[data-slider-next]');
    var dots = slider.querySelector('[data-slider-dots]');
    var cards = track ? Array.prototype.slice.call(track.children) : [];

    if (!track || cards.length === 0) {
      return;
    }

    var getStep = function () {
      var firstCard = cards[0];
      if (!firstCard) {
        return track.clientWidth;
      }

      return firstCard.getBoundingClientRect().width + 16;
    };

    var updateDots = function () {
      if (!dots) {
        return;
      }

      var step = getStep();
      var activeIndex = Math.round(track.scrollLeft / step);
      dots.querySelectorAll('button').forEach(function (dot, index) {
        dot.classList.toggle('active', index === activeIndex);
      });
    };

    if (dots) {
      cards.forEach(function (_, index) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Go to trial video ' + (index + 1));
        dot.addEventListener('click', function () {
          track.scrollTo({ left: getStep() * index, behavior: 'smooth' });
        });
        dots.appendChild(dot);
      });
      updateDots();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -getStep(), behavior: 'smooth' });
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        track.scrollBy({ left: getStep(), behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', function () {
      window.requestAnimationFrame(updateDots);
    }, { passive: true });
  });

})();

/* ---------------------------------------------------------------------------
   Independence Day greeting strip. TEMPORARY.

   Self-expires at the end of 16 Aug 2026 IST, after which nothing renders and
   the stored dismissal is cleaned up. Safe to delete this block and the
   .festive-strip CSS any time after that.

   Injected rather than written into 27 HTML files so there is no markup to
   clean up afterwards, and so it never becomes stale content a crawler sees.
   --------------------------------------------------------------------------- */
(function () {
  'use strict';

  // End of 16 Aug 2026 in IST (UTC+5:30) == 16 Aug 18:30 UTC.
  var EXPIRES_AT = Date.UTC(2026, 7, 16, 18, 30, 0);
  var STORAGE_KEY = 'pki-festive-2026-08-15';

  function store(action, value) {
    try {
      if (action === 'get') return window.localStorage.getItem(STORAGE_KEY);
      if (action === 'set') window.localStorage.setItem(STORAGE_KEY, value);
      if (action === 'remove') window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // Private mode or storage disabled: the strip simply reappears.
    }
    return null;
  }

  if (Date.now() > EXPIRES_AT) {
    store('remove');
    return;
  }
  if (store('get') === 'dismissed') return;

  function build() {
    if (document.querySelector('.festive-strip')) return;

    var strip = document.createElement('aside');
    strip.className = 'festive-strip';
    strip.setAttribute('aria-label', 'Independence Day greeting');

    var text = document.createElement('p');
    text.className = 'festive-text';
    text.innerHTML = '<strong>Happy Independence Day</strong>' +
      '<span class="festive-mid"> &middot; 80th year of freedom</span> &middot; ' +
      '<span class="festive-jai">Jai Hind</span>';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'festive-dismiss';
    close.setAttribute('aria-label', 'Dismiss Independence Day greeting');
    close.innerHTML = '&times;';
    close.addEventListener('click', function () {
      strip.remove();
      document.body.classList.remove('has-festive-strip');
      store('set', 'dismissed');
    });

    strip.appendChild(text);
    strip.appendChild(close);
    document.body.appendChild(strip);
    document.body.classList.add('has-festive-strip');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
