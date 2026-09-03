/* Diva Beauty Salon — homepage interactions */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------ sticky header */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-stuck', window.scrollY > 10);
  }, { passive: true });

  /* -------------------------------------------------------- mobile menu */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');

  // The drawer is fixed, so it must clear whatever the header occupies right now.
  function measureHeader() {
    document.documentElement.style.setProperty(
      '--header-h', Math.max(0, Math.round(header.getBoundingClientRect().bottom)) + 'px');
  }

  function setMenu(open) {
    if (open) measureHeader();
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1180 && drawer.classList.contains('is-open')) setMenu(false);
  });

  /* ------------------------------------------------------ scroll reveal */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- FAQ accordion */
  var faqList = document.getElementById('faqList');

  function closeItem(item) {
    item.classList.remove('is-open');
    item.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
    item.querySelector('.faq__a').style.maxHeight = '';
  }
  function openItem(item) {
    var panel = item.querySelector('.faq__a');
    item.classList.add('is-open');
    item.querySelector('.faq__q').setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }

  faqList.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq__q');
    if (!btn) return;
    var item = btn.parentElement;
    var wasOpen = item.classList.contains('is-open');
    faqList.querySelectorAll('.faq__item.is-open').forEach(closeItem);
    if (!wasOpen) openItem(item);
  });

  var firstOpen = faqList.querySelector('.faq__item.is-open');
  if (firstOpen) openItem(firstOpen);

  window.addEventListener('resize', function () {
    var open = faqList.querySelector('.faq__item.is-open');
    if (open) {
      var panel = open.querySelector('.faq__a');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });

  /* ---------------------------------------------------- testimonial slider */
  var track = document.getElementById('tstTrack');
  var slides = track ? track.children : [];
  var tstImages = document.querySelectorAll('.tst__img');
  var index = 0;
  var timer = null;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    // The picture belongs to the slide, so it moves with the quote.
    tstImages.forEach(function (img) {
      img.classList.toggle('is-active', Number(img.dataset.tst) === index);
    });
  }

  function autoplay() {
    if (reduceMotion || slides.length < 2) return;
    clearInterval(timer);
    timer = setInterval(function () { goTo(index + 1); }, 7000);
  }

  if (slides.length) {
    document.getElementById('tstPrev').addEventListener('click', function () { goTo(index - 1); autoplay(); });
    document.getElementById('tstNext').addEventListener('click', function () { goTo(index + 1); autoplay(); });

    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { goTo(index + (dx < 0 ? 1 : -1)); autoplay(); }
      startX = null;
    }, { passive: true });

    goTo(0);
    autoplay();
  }

  /* ------------------------------------------------- promotion sliders */
  // Each promotion runs its own slider, with its own position — advancing one
  // must never move the other.
  document.querySelectorAll('[data-promo-slider]').forEach(function (slider) {
    var track = slider.querySelector('.promo__track');
    var slides = track.children.length;
    if (slides < 2) return;

    var at = 0;

    function go(next) {
      at = (next + slides) % slides;
      track.style.transform = 'translateX(' + (-at * 100) + '%)';
    }

    slider.querySelector('.promo__nav--prev').addEventListener('click', function () { go(at - 1); });
    slider.querySelector('.promo__nav--next').addEventListener('click', function () { go(at + 1); });

    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(at + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

    go(0);
  });

  /* ------------------------------------------- expert's guide image swap */
  var guideList = document.getElementById('guideList');

  if (guideList) {
    var guideImages = document.querySelectorAll('.guide__img');

    function showGuide(i) {
      guideImages.forEach(function (img) {
        img.classList.toggle('is-active', Number(img.dataset.guide) === i);
      });
    }

    guideList.addEventListener('pointerover', function (e) {
      var link = e.target.closest('.guide__link');
      if (link) showGuide(Number(link.dataset.guide));
    });

    // Keyboard users get the same preview when they tab through the list.
    guideList.addEventListener('focusin', function (e) {
      var link = e.target.closest('.guide__link');
      if (link) showGuide(Number(link.dataset.guide));
    });

    // Leaving the list altogether returns to the first topic.
    guideList.addEventListener('pointerleave', function () { showGuide(0); });
    guideList.addEventListener('focusout', function (e) {
      if (!guideList.contains(e.relatedTarget)) showGuide(0);
    });
  }

  /* ------------------------------------------------------- journey film */
  var video = document.getElementById('journeyVideo');
  var toggle = document.getElementById('videoToggle');

  if (video && toggle) {
    var iconPause = toggle.querySelector('.icon-pause');
    var iconPlay = toggle.querySelector('.icon-play');

    function syncToggle() {
      var paused = video.paused;
      iconPause.hidden = paused;
      iconPlay.hidden = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Play the film' : 'Pause the film');
    }

    toggle.addEventListener('click', function () {
      if (video.paused) {
        var p = video.play();
        // Autoplay can be refused; don't leave the icon lying about the state.
        if (p && p.catch) p.catch(syncToggle);
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', syncToggle);
    video.addEventListener('pause', syncToggle);

    // No source yet, or the file is missing: the poster stands in, so the
    // control would do nothing — hide it rather than offer a dead button.
    // The failure surfaces on the <source> child, and only once the element
    // has finished trying, so check on the error events and again after load.
    function hideIfUnplayable() {
      if (!video.currentSrc || video.networkState === video.NETWORK_NO_SOURCE) {
        toggle.hidden = true;
      }
    }
    video.addEventListener('error', hideIfUnplayable);
    var source = video.querySelector('source');
    if (source) source.addEventListener('error', hideIfUnplayable);
    window.addEventListener('load', hideIfUnplayable);
    hideIfUnplayable();

    if (reduceMotion) { video.removeAttribute('autoplay'); video.pause(); }
    syncToggle();
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
