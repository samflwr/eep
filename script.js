//
//  script.js
//  eepy landing
//
//  Consolidated, accessible, and bug-free interactions.
//

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Configurable routes (placeholders)
  const ROUTES = {
    signup: '/signup',
    login: '/login',
    app: '/app',
    web: '/app'
  };

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header elevation
  const header = $('.site-header');
  const elevate = () => {
    if (!header) return;
    header.classList.toggle('is-elevated', window.scrollY > 8);
  };
  elevate();
  window.addEventListener('scroll', elevate, { passive: true });

  // Mobile nav toggle
  const navToggle = $('#navToggle');
  const tabsContainer = $('#primaryTabs');
  if (navToggle && tabsContainer) {
    navToggle.addEventListener('click', () => {
      const open = tabsContainer.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close on link click
    $$('.tab', tabsContainer).forEach(link =>
      link.addEventListener('click', () => {
        tabsContainer.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Smooth hash navigation + focus management for in-page tabs
  $$('.tab').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', href);
      // Focus for accessibility
      target.setAttribute('tabindex', '-1');
      setTimeout(() => target.focus({ preventScroll: true }), 300);
      setTimeout(() => target.removeAttribute('tabindex'), 1000);
    });
  });

  // Scroll spy: keep active tab coherent with CSS (.is-active + aria-current)
  const spySections = ['features', 'community', 'privacy', 'subscribe', 'tech', 'testimonials', 'pricing', 'faq']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const spyLinks = new Map(spySections.map(sec => [sec.id, $(`.tab[href="#${sec.id}"]`)]));
  const updateSpy = () => {
    let activeId = null;
    let minDist = Infinity;
    spySections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const dist = Math.abs(rect.top - 100);
      if (rect.top <= 120 && dist < minDist) { activeId = sec.id; minDist = dist; }
    });
    spyLinks.forEach((link, id) => {
      if (!link) return;
      const isActive = id === activeId;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  };
  updateSpy();
  window.addEventListener('scroll', () => requestAnimationFrame(updateSpy), { passive: true });

  // Reveal on scroll
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Parallax orb (mouse + subtle scroll)
  const orb = $('.orb');
  let raf = null;
  const onMove = (x, y) => {
    if (!orb) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const fx = (x / window.innerWidth - 0.5) * 16;
      const fy = (y / window.innerHeight - 0.5) * 12;
      orb.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      orb.style.opacity = '0.6';
    });
  };
  window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY), { passive: true });
  window.addEventListener('scroll', () => {
    if (!orb) return;
    const y = window.scrollY;
    orb.style.transform = `translate3d(0, ${y * 0.02}px, 0)`;
  }, { passive: true });
  if (prefersReduced() && orb) {
    orb.style.transition = 'none';
  }

  // Haptics (soft tick where supported)
  const softTick = () => {
    try { if ('vibrate' in navigator) navigator.vibrate(8); } catch {}
  };
  $$('button, .tab, .card, details summary').forEach(el => {
    el.addEventListener('pointerdown', softTick, { passive: true });
  });

  // Magnetic buttons (primary/ghost)
  const magnetics = $$('.btn.primary, .btn.ghost');
  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      btn.style.transform = `translate(${dx * 3}px, ${dy * 3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // CTA routes
  const go = (path, newTab = false) => newTab ? window.open(path, '_blank', 'noopener') : (window.location.href = path);

  $('#btnJoin')?.addEventListener('click', (e) => {
    const href = $('#btnJoin')?.getAttribute('href') || '';
    if (href.startsWith('#')) return; // let smooth scroll handle it
    e.preventDefault();
    go(ROUTES.signup);
  });
  $('#btnSignIn')?.addEventListener('click', () => go(ROUTES.login));
  $('#btnSignInFooter')?.addEventListener('click', () => go(ROUTES.login));
  $('#btnGetApp')?.addEventListener('click', () => go(ROUTES.app));
  $('#btnGetApp2')?.addEventListener('click', () => go(ROUTES.app));
  $('#btnOpenWeb')?.addEventListener('click', () => go(ROUTES.web));
  $('#pillAppStore')?.addEventListener('click', () => go('https://apps.apple.com/', true));
  $('#pillWeb')?.addEventListener('click', () => go(ROUTES.web));

  // Learn scroll button
  $('#btnLearn')?.addEventListener('click', () => {
    const target = $('#features');
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' });
  });

  // FAQ summary keyboard support
  $$('.faq summary').forEach(sum => {
    sum.setAttribute('role', 'button');
    sum.setAttribute('tabindex', '0');
    sum.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const details = sum.parentElement;
        if (details && details.tagName === 'DETAILS') details.open = !details.open;
      }
    });
  });

  // PWA install prompt (optional)
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
  const triggerInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  };
  ['btnGetApp', 'btnGetApp2', 'pillAppStore'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', async (ev) => {
      if (window.matchMedia('(display-mode: standalone)').matches) return;
      const used = await triggerInstall();
      if (used) ev.preventDefault();
    });
  });

  // Offline notice
  window.addEventListener('offline', () => {
    console.info('You are offline. Some features may be unavailable.');
  });

  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
})();
