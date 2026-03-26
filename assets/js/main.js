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


;