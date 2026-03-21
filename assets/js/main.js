/* ════════════════════════════════════════════════════
   BUANA'S ART — main.js
   Requires: GSAP 3 + ScrollTrigger
════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════════════════════════════
   1. CUSTOM CURSOR  (pointer devices only)
════════════════════════════════════════════════════ */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

if (cur && ring && window.matchMedia('(hover: hover)').matches) {
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  gsap.ticker.add(() => {
    gsap.set(cur,  { x: mx, y: my });
    gsap.to(ring,  { x: mx, y: my, duration: 0.14, ease: 'power2.out' });
  });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cur,  { scale: 1.8, duration: 0.2 });
      gsap.to(ring, { scale: 2.2, opacity: 0.9, duration: 0.25 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cur,  { scale: 1,   duration: 0.2 });
      gsap.to(ring, { scale: 1,   opacity: 0.5, duration: 0.25 });
    });
  });
}

/* ════════════════════════════════════════════════════
   2. SPLIT HERO TITLE INTO CHARS
════════════════════════════════════════════════════ */
function splitChars(el) {
  el.innerHTML = [...el.textContent]
    .map(ch => `<span class="char">${ch}</span>`)
    .join('');
  return el.querySelectorAll('.char');
}
const titleEl = document.getElementById('heroTitle');
const chars   = titleEl ? splitChars(titleEl) : [];

/* ════════════════════════════════════════════════════
   3. INITIAL GSAP STATES  (before reveal)
════════════════════════════════════════════════════ */
gsap.set('#navbar',          { opacity: 0, y: -30 });
gsap.set('#heroScript',      { opacity: 0, y: 20 });
gsap.set('#heroMobileText',  { opacity: 0, y: 18 });  /* mobile text block */
gsap.set('#heroPhoto',  { opacity: 0, y: 70 });
gsap.set('.hero-geo',   { opacity: 0, y: 14 });
gsap.set('#heroLine',   { opacity: 0 });
gsap.set(['#heroMetaLeft', '#heroMetaRight', '#scrollHint'], { opacity: 0, y: 14 });

/* Widgets: slide in from their natural side */
gsap.set('#w1', { opacity: 0, x: -36, y: 18 });   /* left-mid  */
gsap.set('#w2', { opacity: 0, x:  36, y: 18 });   /* right-mid */
gsap.set('#w3', { opacity: 0, x: -28, y: 28 });   /* left-bot  */
gsap.set('#w4', { opacity: 0, x:  28, y: 28 });   /* right-bot */
gsap.set('#wProgressFill', { width: '0%' });

/* ════════════════════════════════════════════════════
   4. LOADER
════════════════════════════════════════════════════ */
const loaderTL = gsap.timeline({ onComplete: revealHero });
loaderTL
  .to('#loaderFill', {
    width: '100%', duration: 1.85, ease: 'power2.inOut',
    onUpdate() {
      const n = document.getElementById('loaderNum');
      if (n) n.textContent = Math.round(this.progress() * 100) + '%';
    }
  })
  .to('.loader-logo', { yPercent: -110, opacity: 0, duration: 0.4, ease: 'power3.in' }, '-=0.3')
  .to('#loader',      { yPercent: -100, duration: 0.88, ease: 'power4.inOut' });

/* ════════════════════════════════════════════════════
   5. HERO REVEAL TIMELINE
════════════════════════════════════════════════════ */
function revealHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl
    /* navbar */
    .to('#navbar', { opacity: 1, y: 0, duration: 0.75 }, 0)

    /* PORTFOLIO letters stagger up with 3-D flip */
    .fromTo(chars,
      { yPercent: 130, opacity: 0, rotationX: -50 },
      { yPercent: 0,   opacity: 1, rotationX: 0, duration: 1.05, stagger: 0.04 },
      0.25)

    /* "Creative" bounces in (desktop) */
    .to('#heroScript', { opacity: 1, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.55)' }, 0.8)

    /* Mobile text block fades up (hidden on desktop via CSS — GSAP no-ops gracefully) */
    .to('#heroMobileText', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.4)

    /* headshot rises */
    .to('#heroPhoto', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 0.6)

    /* accent ring scales in */
    .fromTo('#photoRing',
      { scale: 0.55, opacity: 0 },
      { scale: 1,    opacity: 1, duration: 1.3, ease: 'power2.out' }, 0.7)

    /* decorative SVG shapes */
    .to('.hero-geo', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 1.0)

    /* left accent line */
    .to('#heroLine', { opacity: 1, duration: 0.7 }, 1.1)

    /* bottom labels + scroll hint */
    .to(['#heroMetaLeft', '#heroMetaRight', '#scrollHint'],
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, 1.2)

    /* widgets spring in from their sides */
    .to('#w1', { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'back.out(1.5)' }, 1.45)
    .to('#w2', { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'back.out(1.5)' }, 1.58)
    .to('#w3', { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'back.out(1.5)' }, 1.7)
    .to('#w4', { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'back.out(1.5)' }, 1.8)

    /* progress bar fills */
    .to('#wProgressFill', { width: '62%', duration: 1.1, ease: 'power2.out' }, 1.95);

  /* ── Perpetual float loops (all run independently) ── */
  startFloatLoops();
}

/* ════════════════════════════════════════════════════
   6. PERPETUAL WIDGET FLOAT LOOPS
   Each widget bobs at its own speed + phase offset
   so they never move in lockstep.
════════════════════════════════════════════════════ */
function startFloatLoops() {
  const floats = [
    { id: '#w1', y: 11, rot:  1.4, dur: 3.1, delay: 0.0 },
    { id: '#w2', y: 13, rot: -1.4, dur: 2.8, delay: 0.5 },
    { id: '#w3', y:  8, rot:  1.0, dur: 3.5, delay: 1.0 },
    { id: '#w4', y: 10, rot: -1.0, dur: 2.6, delay: 0.3 },
  ];
  floats.forEach(({ id, y, rot, dur, delay }) => {
    gsap.to(id, { y: `+=${y}`, yoyo: true, repeat: -1, duration: dur,   delay, ease: 'sine.inOut' });
    gsap.to(id, { rotation: rot, yoyo: true, repeat: -1, duration: dur * 1.2, delay, ease: 'sine.inOut' });
  });
}

/* ════════════════════════════════════════════════════
   7. MOUSE-MOVE PARALLAX  (desktop only)
════════════════════════════════════════════════════ */
if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
  document.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    gsap.to('#heroTitle',    { x: cx * 20,  y: cy * 10,  duration: 1.3,  ease: 'power2.out' });
    gsap.to('#heroScript',   { x: cx * 34,  y: cy * 18,  duration: 1.5,  ease: 'power2.out' });
    gsap.to('#heroPhoto',    { x: cx * -12, y: cy * -7,  duration: 1.1,  ease: 'power2.out' });
    gsap.to('.hero-blob-1',  { x: cx * 24,  y: cy * 16,  duration: 2.0,  ease: 'power1.out' });
    gsap.to('.hero-blob-2',  { x: cx * -18, y: cy * -12, duration: 2.0,  ease: 'power1.out' });
  });
}

/* ════════════════════════════════════════════════════
   8. SCROLL SCRUB
════════════════════════════════════════════════════ */
gsap.to('.hero-title', {
  scale: 1.06, opacity: 0.25,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});
gsap.to('#heroPhoto', {
  yPercent: 10,
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

/* ════════════════════════════════════════════════════
   9. SCROLL HINT PULSE
════════════════════════════════════════════════════ */
gsap.to('#scrollHint', {
  opacity: 0.12, yoyo: true, repeat: -1,
  duration: 1.5, delay: 4.0, ease: 'sine.inOut'
});

/* ════════════════════════════════════════════════════
   10. NAVBAR SCROLL BACKGROUND
════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ════════════════════════════════════════════════════
   11. MAGNETIC NAV LINKS  (desktop)
════════════════════════════════════════════════════ */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('mousemove', e => {
    const r  = link.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    gsap.to(link, { x: dx * 0.3, y: dy * 0.3, duration: 0.3, ease: 'power2.out' });
  });
  link.addEventListener('mouseleave', () => {
    gsap.to(link, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ════════════════════════════════════════════════════
   12. MOBILE HAMBURGER MENU
════════════════════════════════════════════════════ */
const hamburger     = document.getElementById('hamburger');
const mobileNav     = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  gsap.fromTo('.mobile-nav a',
    { x: 40, opacity: 0 },
    { x: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: 'power3.out', delay: 0.15 }
  );
}
function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', () =>
  hamburger.classList.contains('open') ? closeMenu() : openMenu()
);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));


/* ════════════════════════════════════════════════════
   13. HERO → ABOUT PHOTO TRANSITION
   ─────────────────────────────────────────────────
   Stacking context solution:
   • .about-section has position:relative but NO z-index
     → it does NOT create a stacking context
   • Cards (#aboutCards) are position:absolute inside
     .about-section → they live in the ROOT stacking ctx
   • Clone is position:fixed z-index:4 (root ctx too)
   • Cards get z-index:9999 → always beat the clone
   • Cards are positioned by JS (measuring aboutLeft rect)
════════════════════════════════════════════════════ */
(function () {

  const isMobile = () => window.innerWidth <= 768;

  const heroPhotoEl  = document.getElementById('heroPhoto');
  const heroPhotoImg = heroPhotoEl?.querySelector('img');
  const aboutSection = document.getElementById('about');
  const aboutLeft    = document.getElementById('aboutLeft');
  const aboutFrame   = document.getElementById('aboutFrame');
  const aboutTarget  = document.getElementById('aboutPhotoTarget');
  const framePhoto   = document.getElementById('aboutFramePhoto');
  const cards        = document.getElementById('aboutCards');

  if (!heroPhotoEl || !heroPhotoImg || !aboutFrame || !aboutTarget ||
      !framePhoto || !cards || !aboutLeft || !aboutSection) return;

  /* ── Position cards over the right portion of aboutLeft ──
     Called on load + resize so it always tracks layout.      */
  function positionCards() {
    const sectionR = aboutSection.getBoundingClientRect();
    const leftR    = aboutLeft.getBoundingClientRect();

    /* Cards sit in the right 55% of the left column,
       vertically centred. Coords relative to section.  */
    const cardWidth  = leftR.width * 0.55;
    const cardRight  = (sectionR.right - leftR.right) + 0;   /* flush to left col right edge */
    const cardTop    = (leftR.top - sectionR.top) + leftR.height * 0.22;

    Object.assign(cards.style, {
      width:  cardWidth + 'px',
      right:  (window.innerWidth - leftR.right) + 'px',
      top:    (leftR.top + window.scrollY) + leftR.height * 0.22 + 'px',
      left:   'auto'
    });
  }

  /* Use fixed positioning for cards so they're truly
     outside every stacking context during scroll       */
  function makeCardsFixed() {
    const leftR   = aboutLeft.getBoundingClientRect();
    const cardW   = leftR.width * 0.55;
    Object.assign(cards.style, {
      position: 'fixed',
      zIndex:   '9999',
      width:    cardW + 'px',
      right:    (window.innerWidth - leftR.right) + 'px',
      top:      leftR.top + leftR.height * 0.22 + 'px',
      left:     'auto',
      bottom:   'auto'
    });
  }

  /* ── Flying clone ── */
  const clone = document.createElement('img');
  clone.src = heroPhotoImg.src;
  clone.alt = '';
  clone.setAttribute('aria-hidden', 'true');
  clone.id = 'photoClone';
  Object.assign(clone.style, {
    position:       'fixed',
    top:            '0', left: '0',
    pointerEvents:  'none',
    zIndex:         '4',          /* root ctx — cards at 9999 always win */
    objectFit:      'cover',
    objectPosition: 'top center',
    borderRadius:   '0 0 0 0',
    opacity:        '0',
    display:        'block'
  });
  document.body.appendChild(clone);

  const R = el => el.getBoundingClientRect();

  /* ── ScrollTrigger ── */
  let st = null;

  function build() {
    if (st) { st.kill(); st = null; }
    makeCardsFixed();

    if (isMobile()) { mobileFallback(); return; }

    st = ScrollTrigger.create({
      trigger: '#about',
      start:   'top 85%',
      end:     'top 5%',
      scrub:   1,

      onUpdate(self) {
        const p  = self.progress;
        const sR = R(heroPhotoEl);
        const eR = R(aboutTarget);

        /* Interpolate clone from hero → frame interior */
        Object.assign(clone.style, {
          left:         gsap.utils.interpolate(sR.left,   eR.left,   p) + 'px',
          top:          gsap.utils.interpolate(sR.top,    eR.top,    p) + 'px',
          height:       gsap.utils.interpolate(sR.height, eR.height, p) + 'px',
          borderRadius: `${gsap.utils.interpolate(0, 24, p)}px ${gsap.utils.interpolate(0, 24, p)}px 0 0`,
          opacity:      p > 0.01 ? '1' : '0'
        });

        /* Hero original fades out as clone appears */
        heroPhotoEl.style.opacity = p > 0.02 ? '0' : '1';

        /* Orange frame scales in */
        const fp = Math.min(p * 2, 1);
        gsap.set(aboutFrame, {
          opacity: fp,
          scaleX:  0.4 + fp * 0.6,
          scaleY:  0.5 + fp * 0.5,
          transformOrigin: 'left bottom'
        });

        /* Reposition fixed cards to follow layout on scroll */
        const lR = R(aboutLeft);
        const cW = lR.width * 0.55;
        Object.assign(cards.style, {
          width: cW + 'px',
          right: (window.innerWidth - lR.right) + 'px',
          top:   lR.top + lR.height * 0.22 + 'px'
        });

        /* Reveal cards when photo is mostly landed */
        if (p > 0.75 && cards.dataset.shown !== '1') showCards();
        if (p < 0.6  && cards.dataset.shown === '1') hideCards();
      },

      onLeave() {
        gsap.to(framePhoto, {
          opacity: 1, duration: 0.2,
          onComplete: () => { clone.style.opacity = '0'; }
        });
        showCards();
      },

      onEnterBack() {
        clone.style.opacity   = '1';
        framePhoto.style.opacity = '0';
        hideCards();
      },

      onLeaveBack() {
        clone.style.opacity   = '0';
        heroPhotoEl.style.opacity = '1';
        framePhoto.style.opacity  = '0';
        gsap.set(aboutFrame, { opacity: 0, scaleX: 0.4, scaleY: 0.5 });
        hideCards();
      }
    });
  }

  /* ── Show / hide cards ── */
  function showCards() {
    if (cards.dataset.shown === '1') return;
    cards.dataset.shown = '1';
    gsap.to(['#ac1','#ac2'], {
      opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'back.out(1.5)'
    });
    gsap.to('#aboutHeading', { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', delay: 0.08 });
    gsap.to('#aboutBody',    { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', delay: 0.18 });
    gsap.to('#aboutCta',     { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', delay: 0.28 });
  }
  function hideCards() {
    cards.dataset.shown = '0';
    gsap.set(['#ac1','#ac2'], { opacity: 0, x: 40 });
    gsap.set(['#aboutHeading','#aboutBody','#aboutCta'], { opacity: 0, x: 45 });
  }

  /* ── Mobile fallback ── */
  function mobileFallback() {
    /* On mobile put cards back in normal flow */
    Object.assign(cards.style, {
      position: 'absolute', zIndex: '9999',
      width: '', right: '', top: '', left: '', bottom: ''
    });
    ScrollTrigger.create({
      trigger: '#about', start: 'top 75%',
      toggleActions: 'play none none reverse',
      onEnter() {
        gsap.to(aboutFrame,  { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out', transformOrigin: 'left bottom' });
        gsap.to(framePhoto,  { opacity: 1, duration: 0.5, delay: 0.3 });
        gsap.to(['#ac1','#ac2'], { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)', delay: 0.35 });
        gsap.to('#aboutHeading', { opacity: 1, x: 0, duration: 0.55, delay: 0.2 });
        gsap.to('#aboutBody',    { opacity: 1, x: 0, duration: 0.55, delay: 0.3 });
        gsap.to('#aboutCta',     { opacity: 1, x: 0, duration: 0.45, delay: 0.42 });
      }
    });
    gsap.set(aboutFrame, { opacity: 0, scale: 0.88, transformOrigin: 'left bottom' });
  }

  /* ── Boot ── */
  window.addEventListener('load', () => {
    gsap.set(['#ac1','#ac2'], { opacity: 0, x: 40 });
    setTimeout(build, 300);
  });
  window.addEventListener('resize', () => {
    clearTimeout(window._rTimer);
    window._rTimer = setTimeout(build, 250);
  });

  /* ── Perpetual card float (starts after reveal) ── */
  ['#ac1','#ac2'].forEach((id, i) => {
    gsap.to(id, {
      y: `+=${6 + i * 3}`,
      yoyo: true, repeat: -1,
      duration: 2.6 + i * 0.4,
      delay: 1 + i * 0.2,
      ease: 'sine.inOut'
    });
  });

})();