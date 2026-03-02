/* ============================================
   SEE — GSAP Animations
   ============================================ */

gsap.registerPlugin(ScrollTrigger, CustomEase);

CustomEase.create("seeEase", "M0,0 C0.25,0.46 0.45,0.94 1,1");
CustomEase.create("seeSpring", "M0,0 C0.34,1.56 0.64,1 1,1");
CustomEase.create("seeIn", "M0,0 C0.55,0 1,0.45 1,1");

/* ============================================
   CURSOR
   ============================================ */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
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
  .to('.loader-logo', { opacity: 1, duration: 0.5, ease: 'seeEase' })
  .to('#loaderFill', { width: '100%', duration: 1.2, ease: 'power2.inOut' }, '-=0.2')
  .to('.loader-logo', { y: -10, duration: 0.3, ease: 'seeEase' }, '-=0.1');

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
          duration: 0.5,
          ease: 'seeEase',
          onComplete: () => { headerVisible = false; }
        });
      } else if (scrollDirection === 'up' && !headerVisible) {
        gsap.to(header, {
          yPercent: 0,
          duration: 0.4,
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

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  burger.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
  burger.setAttribute('aria-label', menuOpen ? 'إغلاق القائمة' : 'فتح القائمة');

  gsap.to(burger.querySelectorAll('span')[0], {
    rotation: menuOpen ? 45 : 0,
    y: menuOpen ? 7.5 : 0,
    duration: 0.3, ease: 'seeEase'
  });
  gsap.to(burger.querySelectorAll('span')[1], {
    rotation: menuOpen ? -45 : 0,
    y: menuOpen ? -7.5 : 0,
    duration: 0.3, ease: 'seeEase'
  });
});

mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'فتح القائمة');
    gsap.to(burger.querySelectorAll('span')[0], { rotation: 0, y: 0, duration: 0.3 });
    gsap.to(burger.querySelectorAll('span')[1], { rotation: 0, y: 0, duration: 0.3 });
  });
});

/* ============================================
   HERO ANIMATION
   ============================================ */
function initHeroAnimation() {
  const heroTl = gsap.timeline({ defaults: { ease: 'seeEase' } });

  heroTl
    .to('.hero-badge', {
      opacity: 1, y: 0, duration: 0.7,
      from: { y: 20, opacity: 0 }
    })
    .fromTo('[data-hero="line"]',
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'seeSpring' },
      '-=0.3'
    )
    .fromTo('.hero-sub',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      '-=0.4'
    )
    .fromTo('.hero-actions',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('.hero-stats',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.3'
    )
    .fromTo('[data-hero="scroll"]',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.2'
    );

  // Count up numbers
  setTimeout(() => {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.count);
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = Math.round(this.targets()[0].val);
        }
      });
    });
  }, 1200);

  // Orb parallax
  gsap.to('.orb-1', {
    y: -80, x: 40,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    }
  });
  gsap.to('.orb-2', {
    y: 60, x: -30,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
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
  { opacity: 0, y: 60, scale: 0.96 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 0.7,
    stagger: { amount: 0.5, from: 'start' },
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
gsap.set('.bento-item', { scale: 0.88, opacity: 0 });
gsap.set(bentoGrid, { x: isMobile ? 40 : 120 });

const bentTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#bentoWrapper',
    start: 'top top',
    end: 'bottom bottom',
    scrub: isMobile ? 1 : 1.5,
    pin: isMobile ? false : '.bento-track',
  }
});

bentTl
  .to(bentoGrid, {
    x: () => -(bentoGrid.scrollWidth - window.innerWidth + (isMobile ? 80 : 160)),
    ease: 'none',
    duration: 1
  })
  .to('.bento-item', {
    scale: 1,
    opacity: 1,
    stagger: { amount: isMobile ? 0.4 : 0.8, from: 'start' },
    ease: 'seeEase',
    duration: 0.6
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
      opacity: 0.3, x: 0, duration: 0.7, ease: 'seeEase',
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
    duration: 28,
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
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1.2,
        ease: 'seeEase'
      });
    }
  });
});

// ScrollTo plugin fallback (without plugin)
if (!gsap.plugins.scrollTo) {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}
