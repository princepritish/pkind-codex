/* =====================================================================
   P.K. Industries - site behaviour
   Progressive enhancement only. Every page is fully usable without this.
   ===================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('siteMenu');

  if (toggle && menu) {
    var setMenu = function (open) {
      menu.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    // Reset state when resizing back to desktop so the menu can't get stuck
    window.matchMedia('(min-width: 941px)').addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var lastState = null;
    var ticking = false;

    var syncHeader = function () {
      var next = window.scrollY > 12;
      if (next !== lastState) {
        header.classList.toggle('scrolled', next);
        lastState = next;
      }
      ticking = false;
    };

    syncHeader();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncHeader);
      }
    }, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      reveals.forEach(function (el, i) {
        // Stagger only within a group of siblings, capped so nothing lags
        el.style.setProperty('--reveal-delay', (i % 6) * 70 + 'ms');
        observer.observe(el);
      });

      // Safety net: if anything is still hidden after load, show it.
      window.addEventListener('load', function () {
        window.setTimeout(function () {
          reveals.forEach(function (el) {
            var box = el.getBoundingClientRect();
            if (box.top < window.innerHeight) el.classList.add('is-visible');
          });
        }, 400);
      });
    }
  }

  /* ---------- Table of contents highlighting ---------- */
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    var targets = [];

    tocLinks.forEach(function (link) {
      var section = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!section) return;
      byId[section.id] = link;
      targets.push(section);
    });

    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (l) { l.classList.remove('active'); });
        var active = byId[entry.target.id];
        if (active) active.classList.add('active');
      });
    }, { rootMargin: '-88px 0px -70% 0px', threshold: 0 });

    targets.forEach(function (section) { tocObserver.observe(section); });
  }

  /* ---------- Inquiry form ---------- */
  var form = document.getElementById('inquiryForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var submit = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (event) {
      // Bail out to a normal browser POST if fetch is unavailable.
      if (!window.fetch) return;

      event.preventDefault();

      if (status) {
        status.textContent = 'Sending your enquiry...';
        status.className = 'form-status sending';
      }
      if (submit) submit.disabled = true;

      window.fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('Request failed: ' + response.status);
        form.reset();
        if (status) {
          status.textContent = 'Thank you. Your enquiry has been received - we typically reply within one working day.';
          status.className = 'form-status ok';
        }
      }).catch(function () {
        if (status) {
          status.innerHTML = 'We could not send that automatically. Please WhatsApp us on ' +
            '<a href="https://wa.me/919431342715">+91 94313 42715</a> or email ' +
            '<a href="mailto:info@pkindustries.net">info@pkindustries.net</a>.';
          status.className = 'form-status error';
        }
      }).finally(function () {
        if (submit) submit.disabled = false;
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
