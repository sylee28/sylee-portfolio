/* ===========================================================
   Shared behaviour for every page: burger menu, scroll reveal,
   and the floating "spark" decorations used across every screen.
   The homepage additionally builds the animated hero text below.
   =========================================================== */

/* Scatters `count` small floating sparks inside `container` at
   randomized positions (kept near the edges so they don't sit on
   top of the centered content), with a randomized color/size/
   animation timing each time. Call this on any element that
   should get the "floating stars" treatment — every full-screen
   section on every page uses it, so no two loads look identical. */
function scatterSparks (container, count) {
  if (!container) return;
  var colors = ['var(--ink)', 'var(--purple)', 'var(--coral)'];
  // Edge-hugging zones (percent of the container) so sparks never
  // collide with the centered text/media.
  var zones = [
    { xMin: 3, xMax: 13, yMin: 10, yMax: 28 },   // top-left
    { xMin: 85, xMax: 95, yMin: 12, yMax: 30 },  // top-right
    { xMin: 2, xMax: 9, yMin: 42, yMax: 58 },    // mid-left
    { xMin: 91, xMax: 97, yMin: 42, yMax: 58 },  // mid-right
    { xMin: 4, xMax: 14, yMin: 68, yMax: 86 },   // bottom-left
    { xMin: 84, xMax: 94, yMin: 66, yMax: 84 }   // bottom-right
  ];
  var shuffled = zones.slice().sort(function () { return Math.random() - 0.5; });

  for (var i = 0; i < count && i < shuffled.length; i++) {
    var z = shuffled[i];
    var left = z.xMin + Math.random() * (z.xMax - z.xMin);
    var top = z.yMin + Math.random() * (z.yMax - z.yMin);
    var size = 10 + Math.random() * 14;
    var color = colors[Math.floor(Math.random() * colors.length)];

    var s = document.createElement('span');
    s.className = 'spark-mark';
    s.style.left = left + '%';
    s.style.top = top + '%';
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="' + color + '"><path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z"/></svg>';
    container.appendChild(s);

    if (window.anime) {
      anime({
        targets: s,
        translateY: [0, -14, 0],
        rotate: [0, 12, 0],
        easing: 'easeInOutSine',
        duration: 3000 + Math.random() * 1600,
        loop: true,
        delay: Math.random() * 1000
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Scroll-reveal for any element with class="reveal"
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) en.target.classList.add('in');
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // Full-screen burger menu (rectangular wipe, not a circle)
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    function closeMenu () {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
    burger.addEventListener('click', function () {
      var willOpen = !burger.classList.contains('open');
      burger.classList.toggle('open', willOpen);
      mobileMenu.classList.toggle('open', willOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  // Every section marked as a spark field gets its own random scatter —
  // present on every page, not just the homepage hero.
  document.querySelectorAll('.spark-field').forEach(function (el) {
    var count = parseInt(el.getAttribute('data-spark-count') || '4', 10);
    scatterSparks(el, count);
  });
});

/* Builds the animated "PORTFOLIO" hero — called only from index.html,
   after anime.js has loaded, so the CDN script order matters. */
function buildHero () {
  var hero = document.getElementById('hero');
  if (!hero) return;

  var row = document.createElement('div');
  row.className = 'hero-row';
  row.innerHTML = '<span>Graphic</span><span>Designer</span>';
  hero.appendChild(row);

  var h1 = document.createElement('h1');
  h1.className = 'portfolio';
  h1.id = 'heroWord';
  hero.appendChild(h1);

  var byline = document.createElement('p');
  byline.className = 'byline';
  byline.innerHTML = 'by <b>LEE SHI YING</b>';
  hero.appendChild(byline);

  var cue = document.createElement('div');
  cue.className = 'scroll-cue';
  cue.innerHTML = '<span>SCROLL</span><div class="bar"></div>';
  hero.appendChild(cue);

  var word = 'PORTFOLIO';
  var wrap = document.getElementById('heroWord');
  word.split('').forEach(function (ch) {
    var s = document.createElement('span');
    s.className = 'ltr';
    s.textContent = ch;
    wrap.appendChild(s);
  });

  if (window.anime) {
    anime({
      targets: '.ltr',
      translateY: [40, 0],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 900,
      delay: anime.stagger(45, { start: 200 })
    });
    anime({
      targets: '.hero-row, .byline',
      opacity: [0, 1],
      translateY: [14, 0],
      easing: 'easeOutQuad',
      duration: 700,
      delay: anime.stagger(120, { start: 100 })
    });
  } else {
    document.querySelectorAll('.ltr').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
    document.querySelectorAll('.hero-row, .byline').forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  }
}

document.addEventListener('DOMContentLoaded', buildHero);
