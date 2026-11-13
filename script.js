(function () {
  'use strict';

  var root = document.documentElement;
  var themeButton = document.getElementById('theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function paintTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
      themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'dark' ? '#07131F' : '#F3EEE2');
    }
  }

  paintTheme(root.getAttribute('data-theme') || 'light');

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      paintTheme(next);
      try {
        localStorage.setItem('bl-theme', next);
      } catch (e) {}
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var stopsDialog = document.getElementById('stops-dialog');
  var openStops = document.getElementById('open-stops');

  if (stopsDialog && openStops) {
    var closeStops = stopsDialog.querySelectorAll('[data-close]');

    openStops.addEventListener('click', function () {
      if (typeof stopsDialog.showModal === 'function') {
        stopsDialog.showModal();
      } else {
        stopsDialog.setAttribute('open', '');
      }
    });

    closeStops.forEach(function (button) {
      button.addEventListener('click', function () {
        stopsDialog.close();
      });
    });

    stopsDialog.addEventListener('click', function (event) {
      if (event.target === stopsDialog) {
        stopsDialog.close();
      }
    });
  }

  var stage = document.getElementById('bubble-stage');
  var bubble = document.getElementById('bus-bubble');
  var hideButton = document.getElementById('bubble-hide');
  var restoreButton = document.getElementById('bubble-restore');
  var bubbleHint = document.getElementById('bubble-hint');

  if (stage && bubble && hideButton && restoreButton) {
    var posX = 0;
    var posY = 0;
    var startX = 0;
    var startY = 0;
    var startPosX = 0;
    var startPosY = 0;
    var dragging = false;
    var hidden = false;

    function bounds() {
      var baseLeft = bubble.offsetLeft;
      var baseTop = bubble.offsetTop;
      return {
        minX: -baseLeft,
        maxX: stage.clientWidth - bubble.offsetWidth - baseLeft,
        minY: -baseTop,
        maxY: stage.clientHeight - bubble.offsetHeight - baseTop
      };
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function applyPosition(x, y) {
      var limit = bounds();
      posX = clamp(x, limit.minX, limit.maxX);
      posY = clamp(y, limit.minY, limit.maxY);
      bubble.style.transform = 'translate3d(' + posX + 'px, ' + posY + 'px, 0)';
    }

    function overlapsHideTarget() {
      var b = bubble.getBoundingClientRect();
      var t = hideButton.getBoundingClientRect();
      var cx = b.left + b.width / 2;
      var cy = b.top + b.height / 2;
      return cx > t.left - 18 && cx < t.right + 18 && cy > t.top - 18 && cy < t.bottom + 18;
    }

    function hideBubble(shouldFocus) {
      hidden = true;
      bubble.hidden = true;
      if (bubbleHint) bubbleHint.hidden = true;
      restoreButton.hidden = false;
      if (shouldFocus) restoreButton.focus();
    }

    function showBubble() {
      hidden = false;
      bubble.hidden = false;
      restoreButton.hidden = true;
      if (bubbleHint) bubbleHint.hidden = false;
      bubble.focus();
    }

    bubble.addEventListener('pointerdown', function (event) {
      if (hidden) return;
      dragging = true;
      startX = event.clientX;
      startY = event.clientY;
      startPosX = posX;
      startPosY = posY;
      stage.classList.add('is-dragging');
      bubble.setPointerCapture(event.pointerId);
      document.body.style.userSelect = 'none';
    });

    bubble.addEventListener('pointermove', function (event) {
      if (!dragging) return;
      applyPosition(startPosX + event.clientX - startX, startPosY + event.clientY - startY);
    });

    function endDrag(event) {
      if (!dragging) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      document.body.style.userSelect = '';

      if (event && bubble.hasPointerCapture && bubble.hasPointerCapture(event.pointerId)) {
        bubble.releasePointerCapture(event.pointerId);
      }

      if (overlapsHideTarget()) {
        hideBubble(true);
      }
    }

    bubble.addEventListener('pointerup', endDrag);
    bubble.addEventListener('pointercancel', endDrag);
    bubble.addEventListener('lostpointercapture', function () {
      if (dragging) endDrag(null);
    });

    hideButton.addEventListener('click', function () {
      if (!hidden) hideBubble(true);
    });

    restoreButton.addEventListener('click', showBubble);
  }
})();
