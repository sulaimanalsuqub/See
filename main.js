/* ============================================
   SEE — GSAP Animations
   ============================================ */

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("seeEase", "M0,0 C0.2,0.72 0.2,1 1,1");
CustomEase.create("seeSpring", "M0,0 C0.18,1 0.3,1 1,1");
CustomEase.create("seeIn", "M0,0 C0.55,0 1,0.45 1,1");

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ============================================
   CURSOR
   ============================================ */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = -200, mouseY = -200;
let followerX = -200, followerY = -200;

if (cursor && cursorFollower && supportsFinePointer && !prefersReducedMotion) {
  // Start both cursors off-screen so they don't flash at (0,0)
  gsap.set(cursor, { x: -200, y: -200 });
  gsap.set(cursorFollower, { x: -200, y: -200 });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Show cursors on first move
    cursor.classList.add('cursor--visible');
    cursorFollower.classList.add('cursor--visible');

    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.05, ease: 'none' });

    // Orb parallax (merged to avoid double listener)
    const rx = (e.clientX / window.innerWidth - 0.5) * 30;
    const ry = (e.clientY / window.innerHeight - 0.5) * 30;
    gsap.to('.orb-1', { x: rx * 1.5, y: ry * 1.5, duration: 1.5, ease: 'seeEase', overwrite: 'auto' });
    gsap.to('.orb-3', { x: -rx, y: -ry, duration: 2, ease: 'seeEase', overwrite: 'auto' });
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    gsap.set(cursorFollower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .service-card, .bento-item, .logo-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      cursorFollower.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      cursorFollower.classList.remove('cursor--hover');
    });
  });
} else {
  document.body.classList.add('no-custom-cursor');
}

/* ============================================
   LOADER
   ============================================ */
const loaderTl = gsap.timeline({
  onComplete: () => {
    gsap.to('#loader', {
      opacity: 0, duration: 0.8, ease: 'seeEase',
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        initHeroAnimation();
      }
    });
  }
});

loaderTl
  .to('.loader-logo', { opacity: 1, duration: 0.45, ease: 'seeEase' })
  .to('#loaderFill', { width: '100%', duration: 0.95, ease: 'power2.inOut' }, '-=0.1')
  .to('.loader-logo', { y: -8, duration: 0.25, ease: 'seeEase' }, '-=0.1');

/* ============================================
   HEADER — Directionally Aware
   ============================================ */
const header = document.getElementById('header');
let lastScrollY = 0;
let scrollDirection = 'up';
let headerVisible = true;
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      if (currentScrollY > 80) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      if (scrollDirection === 'down' && currentScrollY > 200 && headerVisible) {
        gsap.to(header, {
          yPercent: -100,
          duration: 0.35,
          ease: 'seeEase',
          onComplete: () => { headerVisible = false; }
        });
      } else if (scrollDirection === 'up' && !headerVisible) {
        gsap.to(header, {
          yPercent: 0,
          duration: 0.3,
          ease: 'seeSpring',
          onStart: () => { headerVisible = true; }
        });
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });
    ticking = true;
  }
});

/* ============================================
   BURGER MENU
   ============================================ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

const burgerSpans = burger ? burger.querySelectorAll('span') : [];

function setMenuOpen(open) {
  menuOpen = open;
  mobileMenu.classList.toggle('open', menuOpen);
  burger.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
  burger.setAttribute('aria-label', menuOpen ? 'إغلاق القائمة' : 'فتح القائمة');
  document.body.classList.toggle('menu-open', menuOpen);

  gsap.to(burgerSpans[0], {
    rotation: menuOpen ? 45 : 0,
    y: menuOpen ? 7.5 : 0,
    duration: 0.3, ease: 'seeEase'
  });
  gsap.to(burgerSpans[1], {
    rotation: menuOpen ? -45 : 0,
    y: menuOpen ? -7.5 : 0,
    duration: 0.3, ease: 'seeEase'
  });
}

burger.addEventListener('click', () => {
  setMenuOpen(!menuOpen);
});

mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuOpen) {
    setMenuOpen(false);
  }
});

document.addEventListener('click', (event) => {
  if (!menuOpen) return;
  const clickedOutsideMenu = !mobileMenu.contains(event.target);
  const clickedOutsideBurger = !burger.contains(event.target);
  if (clickedOutsideMenu && clickedOutsideBurger) {
    setMenuOpen(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && menuOpen) {
    setMenuOpen(false);
  }
});

/* ============================================
   HERO ANIMATION
   ============================================ */
function initHeroAnimation() {
  const heroTl = gsap.timeline({ defaults: { ease: 'seeEase' } });

  heroTl
    .to('.hero-badge', {
      opacity: 1, y: 0, duration: 0.55,
      from: { y: 20, opacity: 0 }
    })
    .fromTo('[data-hero="line"]',
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: 'seeSpring' },
      '-=0.25'
    )
    .fromTo('.hero-sub',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.32'
    )
    .fromTo('.hero-actions',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45 },
      '-=0.3'
    )
    .fromTo('.hero-stats',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45 },
      '-=0.24'
    )
    .fromTo('.hero-scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.45 },
      '-=0.2'
    );

  // Count up numbers
  setTimeout(() => {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count);
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.3,
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = Math.round(this.targets()[0].val);
        }
      });
    });
  }, 1200);

  // Orb parallax
  gsap.to('.orb-1', {
    y: -45, x: 24,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    }
  });
  gsap.to('.orb-2', {
    y: 36, x: -20,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });
}

/* ============================================
   SECTION HEADERS — Scroll Reveal
   ============================================ */
document.querySelectorAll('[data-section="header"]').forEach(header => {
  gsap.fromTo(header.querySelector('.section-tag'),
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, duration: 0.6, ease: 'seeEase',
      scrollTrigger: { trigger: header, start: 'top 85%' }
    }
  );
  gsap.fromTo(header.querySelector('.section-title'),
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'seeSpring',
      scrollTrigger: { trigger: header, start: 'top 80%' }
    }
  );
  if (header.querySelector('.section-desc')) {
    gsap.fromTo(header.querySelector('.section-desc'),
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'seeEase', delay: 0.1,
        scrollTrigger: { trigger: header, start: 'top 78%' }
      }
    );
  }
});

/* ============================================
   SERVICES CARDS
   ============================================ */
gsap.fromTo('[data-service="card"]',
  { opacity: 0, y: 36, scale: 0.98 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 0.55,
    stagger: { amount: 0.34, from: 'start' },
    ease: 'seeSpring',
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
    }
  }
);

/* ============================================
   BENTO GALLERY — Scrubbed
   ============================================ */
const bentoGrid = document.getElementById('bentoGrid');
const isMobile = window.innerWidth < 768;

// Initial state
gsap.set('.bento-item', { scale: 0.94, opacity: 0 });
gsap.set(bentoGrid, { x: isMobile ? 20 : 80 });

const bentTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#bentoWrapper',
    start: 'top top',
    end: 'bottom bottom',
    scrub: isMobile ? 0.8 : 1.2,
    pin: isMobile ? false : '.bento-track',
  }
});

bentTl
  .to(bentoGrid, {
    x: () => -(bentoGrid.scrollWidth - window.innerWidth + (isMobile ? 40 : 110)),
    ease: 'none',
    duration: 1
  })
  .to('.bento-item', {
    scale: 1,
    opacity: 1,
    stagger: { amount: isMobile ? 0.3 : 0.55, from: 'start' },
    ease: 'seeEase',
    duration: 0.45
  }, 0);

/* ============================================
   PROCESS — Timeline with scroll progress
   ============================================ */
const processSteps = document.querySelectorAll('.process-step');
const processLineFill = document.getElementById('processLineFill');

ScrollTrigger.create({
  trigger: '.process-timeline',
  start: 'top 70%',
  end: 'bottom 30%',
  onUpdate: (self) => {
    const progress = self.progress;
    gsap.to(processLineFill, { height: `${progress * 100}%`, duration: 0.1, ease: 'none' });

    processSteps.forEach((step, i) => {
      const stepProgress = (i + 0.5) / processSteps.length;
      if (progress >= stepProgress) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }
});

processSteps.forEach((step, i) => {
  gsap.fromTo(step,
    { opacity: 0, x: -40 },
    {
      opacity: 0.55, x: 0, duration: 0.7, ease: 'seeEase',
      scrollTrigger: { trigger: step, start: 'top 85%' }
    }
  );
});

/* ============================================
   CLIENTS MARQUEE — GSAP Infinite Loop
   ============================================ */
const logosTrack = document.getElementById('logosTrack');

let marqueeTween;
function setupMarquee() {
  if (marqueeTween) marqueeTween.kill();
  const trackWidth = logosTrack.scrollWidth / 2;
  if (trackWidth <= 0) return;
  marqueeTween = gsap.to(logosTrack, {
    x: `-=${trackWidth}`,
    duration: 36,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % trackWidth)
    }
  });
}

// استدعاء واحد بعد اكتمال التخطيط
ScrollTrigger.addEventListener('refresh', setupMarquee);
ScrollTrigger.refresh();

// Pause on hover - only affect marquee tween
const marqueeWrapper = document.getElementById('logosMarquee');
marqueeWrapper.addEventListener('mouseenter', () => {
  gsap.to(marqueeTween, { timeScale: 0.15, duration: 0.5 });
});
marqueeWrapper.addEventListener('mouseleave', () => {
  gsap.to(marqueeTween, { timeScale: 1, duration: 0.5 });
});

/* ============================================
   FOOTER CTA
   ============================================ */
gsap.fromTo('[data-footer="cta"]',
  { opacity: 0, y: 60 },
  {
    opacity: 1, y: 0, duration: 1, ease: 'seeSpring',
    scrollTrigger: { trigger: '[data-footer="cta"]', start: 'top 80%' }
  }
);
gsap.fromTo('[data-footer="bottom"]',
  { opacity: 0, y: 30 },
  {
    opacity: 1, y: 0, duration: 0.8, ease: 'seeEase',
    scrollTrigger: { trigger: '[data-footer="bottom"]', start: 'top 90%' }
  }
);

/* ============================================
   HERO ORB — Mouse Parallax (merged into main mousemove above)
   ============================================ */

/* ============================================
   SMOOTH ANCHOR SCROLLING
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href) return;
    if (href === '#') {
      e.preventDefault();
      return;
    }

    let target = null;
    try {
      target = document.querySelector(href);
    } catch (error) {
      target = null;
    }

    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
