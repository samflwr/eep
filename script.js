//
//  script.js
//  eth
//
//  Created by samir buzatu on 11/11/25.
//

// Configurable routes
    const ROUTES = {
      signup: '/signup',
      login: '/login',
      app: '/app',
      web: '/app', // or web app route
    };

    // Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Micro-interactions: soft press + haptics (where available)
    const supportsVibrate = 'vibrate' in navigator;
    const pressables = [...document.querySelectorAll('.btn, .card, .how-step, .faq details')];

    pressables.forEach(el => {
      el.addEventListener('pointerdown', (e) => {
        el.style.transform = 'translateY(1px) scale(0.995)';
        // ripple origin
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--y', (e.clientY - rect.top) + 'px');
        if (supportsVibrate) navigator.vibrate?.(8);
      }, { passive: true });

      el.addEventListener('pointerup', () => { el.style.transform = ''; }, { passive: true });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    // Hero orb parallax
    const orb = document.querySelector('.orb');
    if (orb) {
      window.addEventListener('mousemove', (e) => {
        const { innerWidth: w, innerHeight: h } = window;
        const x = (e.clientX / w - 0.5) * 12;
        const y = (e.clientY / h - 0.5) * 12;
        orb.style.transform = `translate(${x}px, ${y}px)`;
      }, { passive: true });
    }

    // Magnetic buttons (slight attraction to cursor)
    const magnetics = document.querySelectorAll('.btn.primary, .btn.ghost');
    magnetics.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        btn.style.transform = `translate(${dx * 3}px, ${dy * 3}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.animate([
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'translateY(0px)' }
          ], { duration: 360, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => io.observe(el));

    // Scroll spy for tabs
    const sections = [
      { id: 'features', tab: null },
      { id: 'how', tab: null },
      { id: 'privacy', tab: null },
      { id: 'faq', tab: null }
    ];
    sections.forEach(s => { s.tab = document.querySelector(`.tabs a[href="#${s.id}"]`); });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const s = sections.find(x => x.id === entry.target.id);
        if (!s || !s.tab) return;
        if (entry.isIntersecting) {
          document.querySelectorAll('.tabs a').forEach(a => a.classList.remove('active'));
          s.tab.classList.add('active');
        }
      });
    }, { threshold: 0.6 });
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) spy.observe(el);
    });

    // CTA actions
    const go = (path) => { window.location.href = path; };

    document.getElementById('btnJoin')?.addEventListener('click', () => go(ROUTES.signup));
    document.getElementById('btnSignIn')?.addEventListener('click', () => go(ROUTES.login));
    document.getElementById('btnGetApp')?.addEventListener('click', () => go(ROUTES.app));
    document.getElementById('btnGetApp2')?.addEventListener('click', () => go(ROUTES.app));
    document.getElementById('btnOpenWeb')?.addEventListener('click', () => go(ROUTES.web));

    // Learn scroll
    document.getElementById('btnLearn')?.addEventListener('click', () => {
      const target = document.getElementById('features');
      if (!target) return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    });

    // Respect reduced motion for scroll patch (if manual scrollTo used)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const original = window.scrollTo;
      window.scrollTo = (opts) => original({ top: opts.top });
    }

    // Keyboard accessibility for summary
    document.querySelectorAll('.faq summary').forEach(sum => {
      sum.setAttribute('role', 'button');
      sum.setAttribute('tabindex', '0');
      sum.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sum.parentElement.open = !sum.parentElement.open;
        }
      });
    });


    /* eepy site interactions — minimal, soft, accessible */

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header elevation
  const header = $('.site-header');
  const elevate = () => {
    if (!header) return;
    const scrolled = window.scrollY > 8;
    header.classList.toggle('is-elevated', scrolled);
  };
  elevate();
  window.addEventListener('scroll', elevate, { passive: true });

  // Mobile nav toggle
  const navToggle = $('#navToggle');
  const tabs = $('#primaryTabs');
  if (navToggle && tabs) {
    navToggle.addEventListener('click', () => {
      const open = tabs.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // Close on link click
    $$('.tab', tabs).forEach(link => link.addEventListener('click', () => {
      tabs.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scroll with focus management
  $$('.tab').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
      // Scroll spy immediate update
      updateSpy();
      setTimeout(() => target.setAttribute('tabindex', '-1'), 0);
      setTimeout(() => target.focus({ preventScroll: true }), 350);
      setTimeout(() => target.removeAttribute('tabindex'), 1000);
    });
  });

  // Scroll spy
  const spyTargets = $$('.section[id]');
  const spyLinks = new Map(spyTargets.map(sec => [sec.id, $(`.tab[href="#${sec.id}"]`)]));
  const updateSpy = () => {
    let activeId = null;
    let minDist = Infinity;
    spyTargets.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const dist = Math.abs(rect.top - 80);
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

  // Blur-up image load
  $$('.blur-up').forEach(img => {
    if (img.complete) img.classList.add('is-loaded');
    img.addEventListener('load', () => img.classList.add('is-loaded'));
  });

  // Parallax orb
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

  // Buttons and CTAs
  const route = {
    appStore: 'https://apps.apple.com/',
    webApp: '/app',
    signIn: '/signin',
    join: '/signup'
  };

  const click = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };

  click('btnGetApp', () => open(route.appStore, '_blank'));
  click('btnGetApp2', () => open(route.appStore, '_blank'));
  click('pillAppStore', () => open(route.appStore, '_blank'));
  click('btnOpenWeb', () => location.assign(route.webApp));
  click('pillWeb', () => location.assign(route.webApp));
  click('btnSignIn', () => location.assign(route.signIn));
  click('btnJoin', () => location.assign(route.join));
  click('btnLearn', () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }));

  // Haptics (where supported)
  const softTick = () => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(8);
    } catch {}
  };
  $$('button, .tab, .card, details summary').forEach(el => {
    el.addEventListener('pointerdown', softTick, { passive: true });
  });

  // PWA install prompt
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
  // Bind install to primary CTAs if available
  ['btnGetApp', 'btnGetApp2', 'pillAppStore'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', async (ev) => {
      if (window.matchMedia('(display-mode: standalone)').matches) return;
      const used = await triggerInstall();
      if (used) ev.preventDefault();
    });
  });

  // Offline hook (optional)
  window.addEventListener('offline', () => {
    console.info('Sei offline. Alcune funzioni potrebbero non essere disponibili.');
  });

  // Reduce motion: tone down orb movement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches && orb) {
    orb.style.transition = 'none';
  }
})();
