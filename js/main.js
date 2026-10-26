/* Alonyo Foundation — site scripts (fast, snappy interactions) */
(function () {
  'use strict';

  /* ---------- Mega menu ---------- */
  var megaItems = document.querySelectorAll('[data-mega]');
  var closeMegaMenus = function () {
    megaItems.forEach(function (item) {
      item.classList.remove('mega-open');
      var btn = item.querySelector('.mega-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };
  megaItems.forEach(function (item) {
    var btn = item.querySelector('.mega-toggle');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !item.classList.contains('mega-open');
      closeMegaMenus();
      if (willOpen) {
        item.classList.add('mega-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', function (e) {
    megaItems.forEach(function (item) {
      if (item.classList.contains('mega-open') && !item.contains(e.target)) {
        item.classList.remove('mega-open');
        var btn = item.querySelector('.mega-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var closeMenu = function () {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      closeMegaMenus();
    };
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (!isOpen) closeMegaMenus();
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (links.classList.contains('is-open') && !links.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); closeMegaMenus(); }
    });
  }

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(function () {
      preloader.classList.add('is-hidden');
      setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 600);
    }, 450);
  }

  /* ---------- Active nav link ---------- */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here || (here === '' && href === 'index.html')) a.classList.add('active');
  });

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  var backTop = document.querySelector('.back-top');
  var onScroll = function () {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (backTop) backTop.classList.toggle('show', y > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Fast reveal-on-scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-scale, .stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Animated counters (quick count-up) ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 700; // fast
      var start = null;
      var from = 0;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        var val = Math.floor(from + (target - from) * eased);
        el.textContent = val.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      }
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Hero image slider ---------- */
  var heroSlidesWrap = document.querySelector('[data-hero-slides]');
  if (heroSlidesWrap) {
    var heroSlides = Array.prototype.slice.call(heroSlidesWrap.querySelectorAll('.hero-slide'));
    var heroDotsWrap = document.querySelector('[data-hero-dots]');
    var heroCurrent = 0;
    var heroDots = [];

    if (heroDotsWrap) {
      heroSlides.forEach(function (_, i) {
        var b = document.createElement('button');
        if (i === 0) b.classList.add('active');
        b.setAttribute('aria-label', 'Show slide ' + (i + 1));
        b.addEventListener('click', function () { showHeroSlide(i); });
        heroDotsWrap.appendChild(b);
        heroDots.push(b);
      });
    }

    function showHeroSlide(i) {
      heroSlides[heroCurrent].classList.remove('active');
      heroCurrent = (i + heroSlides.length) % heroSlides.length;
      heroSlides[heroCurrent].classList.add('active');
      heroDots.forEach(function (d, idx) { d.classList.toggle('active', idx === heroCurrent); });
    }

    var heroAutoplay = setInterval(function () { showHeroSlide(heroCurrent + 1); }, 4500);
    heroSlidesWrap.closest('.hero').addEventListener('mouseenter', function () { clearInterval(heroAutoplay); });
  }

  /* ---------- Testimonial carousel ---------- */
  var testiTrack = document.querySelector('[data-testi-track]');
  if (testiTrack) {
    var slides = Array.prototype.slice.call(testiTrack.querySelectorAll('[data-testi-slide]'));
    var dotsWrap = document.querySelector('[data-testi-dots]');
    var current = 0;
    var dots = [];

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var b = document.createElement('button');
        if (i === 0) b.classList.add('active');
        b.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
        b.addEventListener('click', function () { show(i); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function show(i) {
      slides[current].style.display = 'none';
      current = (i + slides.length) % slides.length;
      slides[current].style.display = '';
      slides[current].style.animation = 'none';
      requestAnimationFrame(function () { slides[current].style.animation = 'pop 260ms cubic-bezier(0.16,1,0.3,1)'; });
      dots.forEach(function (d, idx) { d.classList.toggle('active', idx === current); });
    }

    slides.forEach(function (s, i) { if (i !== 0) s.style.display = 'none'; });

    var autoplay = setInterval(function () { show(current + 1); }, 5200);
    testiTrack.addEventListener('mouseenter', function () { clearInterval(autoplay); });
  }

  /* ---------- News filter pills ---------- */
  var filterGroup = document.querySelector('[data-filter-group]');
  var filterItemsWrap = document.querySelector('[data-filter-items]');
  if (filterGroup && filterItemsWrap) {
    var items = Array.prototype.slice.call(filterItemsWrap.children);
    filterGroup.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      filterGroup.querySelectorAll('[data-filter]').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      items.forEach(function (item) {
        var match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = match ? '' : 'none';
        if (match) {
          item.style.animation = 'none';
          requestAnimationFrame(function () { item.style.animation = 'pop 220ms cubic-bezier(0.16,1,0.3,1)'; });
        }
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Donate tier selection ---------- */
  var tierInputs = document.querySelectorAll('.tier input[name="amount"]');
  var customField = document.querySelector('[data-custom-amount]');
  tierInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      if (customField) customField.style.display = (input.value === 'custom') ? 'block' : 'none';
    });
  });

  /* ---------- Copy bank details ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 1800);
      });
    });
  });

  /* ---------- Simple client-side form validation ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var wrap = field.closest('.field');
        var ok = field.value && field.value.trim().length > 0;
        if (field.type === 'email' && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (wrap) wrap.classList.toggle('error', !ok);
        if (!ok) valid = false;
      });
      var successBox = form.querySelector('.form-success');
      if (valid) {
        form.reset();
        form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('error'); });
        if (successBox) {
          successBox.classList.add('show');
          setTimeout(function () { successBox.classList.remove('show'); }, 5000);
        }
      }
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
