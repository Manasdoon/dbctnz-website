// ══════════════════════════════════════════════════════════════
// SHARED NAV + FOOTER INCLUDE
// Every page needs:
//   1. <div id="site-nav"></div>   where the nav should appear
//   2. <div id="site-footer"></div> where the footer should appear
//   3. <body data-page="about">     (or "home", "mission", "contact",
//        "our-story", "publications", "special-events") so the
//        matching nav link gets highlighted as active
//   4. <script src="/partials/include.js"></script> before </body>
//
// To change the nav or footer for the WHOLE SITE, edit only
// /partials/nav-footer.html — never edit nav/footer HTML on a
// per-page basis again.
// ══════════════════════════════════════════════════════════════

(function () {

  function wireHamburger() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var menuOverlay = document.getElementById('menu-overlay');
    if (!hamburger || !mobileMenu || !menuOverlay) return;

    function openMenu() {
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      menuOverlay.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
    function closeMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) { closeMenu(); } else { openMenu(); }
    });
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    mobileMenu.addEventListener('click', function (e) {
      var link = e.target.closest('A');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        e.preventDefault();
        closeMenu();
        setTimeout(function () {
          var target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        closeMenu();
      }
    });
  }

  function wireDropdowns() {
    function closeAll() {
      document.querySelectorAll('.nav-dropdown.open').forEach(function (m) { m.classList.remove('open'); });
      document.querySelectorAll('.nav-drop-toggle[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    }
    document.querySelectorAll('.nav-drop-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var menu = btn.nextElementSibling;
        var isOpen = menu.classList.contains('open');
        closeAll();
        if (!isOpen) { menu.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
    document.addEventListener('click', closeAll);
  }

  function highlightActive() {
    var page = document.body.getAttribute('data-page');
    if (!page) return;
    document.querySelectorAll('[data-nav-key="' + page + '"]').forEach(function (el) {
      el.classList.add('active');
      var group = el.closest('.nav-item');
      if (group) {
        var toggle = group.querySelector('.nav-drop-toggle');
        if (toggle) toggle.classList.add('active');
      }
    });
  }

  function inject() {
    var navSlot = document.getElementById('site-nav');
    var footerSlot = document.getElementById('site-footer');
    if (!navSlot && !footerSlot) return;

    fetch('/partials/nav-footer.html')
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var navTpl = doc.getElementById('tpl-site-nav');
        var footerTpl = doc.getElementById('tpl-site-footer');
        if (navSlot && navTpl) navSlot.replaceWith(navTpl.content.cloneNode(true));
        if (footerSlot && footerTpl) footerSlot.replaceWith(footerTpl.content.cloneNode(true));

        wireHamburger();
        wireDropdowns();
        highlightActive();
      })
      .catch(function (err) {
        console.error('Failed to load shared nav/footer:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
