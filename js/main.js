/* ===========================================================
   Shared behaviour for every page: burger menu + scroll reveal.
   The homepage additionally builds the animated hero text below.
   =========================================================== */

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

  var sparkPositions = [
    { x: '8%', y: '20%', c: 'var(--ink)', s: 16 },
    { x: '88%', y: '26%', c: 'var(--coral)', s: 22 },
    { x: '92%', y: '34%', c: 'var(--coral)', s: 12 },
    { x: '6%', y: '70%', c: 'var(--purple)', s: 14 },
    { x: '85%', y: '72%', c: 'var(--ink)', s: 12 }
  ];
  sparkPositions.forEach(function (p, i) {
    var s = document.createElement('span');
    s.className = 'spark-mark';
    s.style.left = p.x; s.style.top = p.y;
    s.style.width = p.s + 'px'; s.style.height = p.s + 'px';
    s.innerHTML = '<svg viewBox="0 0 24 24" fill="' + p.c + '"><path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z"/></svg>';
    hero.appendChild(s);
    if (window.anime) {
      anime({
        targets: s,
        translateY: [0, -14, 0],
        rotate: [0, 12, 0],
        easing: 'easeInOutSine',
        duration: 3200 + i * 400,
        loop: true,
        delay: i * 300
      });
    }
  });

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
