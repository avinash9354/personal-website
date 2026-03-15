/**
 * main.js - Core Portfolio Functionality
 * Avinash Pandey Portfolio
 */

// ===== PAGE LOADER =====
const initLoader = () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1800);
  });
};

// ===== CURSOR GLOW =====
const initCursorGlow = () => {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
};

// ===== MOBILE NAV & DASHBOARD SIDEBAR =====
const initMobileNav = () => {
  const ham     = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const dashToggle = document.getElementById('dash-mobile-toggle');
  const sidebar = document.getElementById('sidebar');

  if (ham && mobileNav) {
    ham.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      ham.classList.toggle('open');
      const spans = ham.querySelectorAll('span');
      if (ham.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
  }

  // Dashboard Sidebar Toggle
  if (dashToggle && sidebar) {
    dashToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
    // Close sidebar on link click (mobile)
    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) sidebar.classList.remove('active');
      });
    });
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (ham && mobileNav && !ham.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('active');
      ham.classList.remove('open');
      const spans = ham.querySelectorAll('span');
      if(spans.length > 0) {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    }
    if (dashToggle && sidebar && !dashToggle.contains(e.target) && !sidebar.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
};

// ===== ACTIVE NAV LINK =====
const setActiveNavLink = () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.floating-nav a, .mobile-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page) a.classList.add('active');
  });
};

// ===== THEME TOGGLE =====
const initTheme = () => {
  const toggle = document.getElementById('theme-toggle');
  const icon   = toggle?.querySelector('i');
  const saved  = localStorage.getItem('theme');

  if (saved === 'light') {
    document.body.classList.add('light-mode');
    if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
  }

  toggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    if (icon) {
      if (isLight) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
      else         { icon.classList.remove('fa-sun');  icon.classList.add('fa-moon'); }
    }
  });
};

// ===== SCROLL REVEAL =====
const initScrollReveal = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

// ===== TYPING ANIMATION =====
const initTyping = (elementId, words, speed = 100, deleteSpeed = 50, pauseTime = 2200) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  let wi = 0, ci = 0, deleting = false;

  const tick = () => {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(tick, pauseTime); }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 400); }
    }
    setTimeout(tick, deleting ? deleteSpeed : speed);
  };
  tick();
};

// ===== SKILL BARS =====
const initSkillBars = () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        const pct  = fill?.getAttribute('data-pct') || '0';
        if (fill) fill.style.width = pct + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-bar-wrap').forEach(el => observer.observe(el));
};

// ===== COUNTER ANIMATION =====
const animateCounter = (el, target, suffix = '', duration = 1800) => {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
};

const initCounters = () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, +el.dataset.target, el.dataset.suffix || '');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
};

// ===== TOAST NOTIFICATION =====
window.showToast = (message, type = 'info', duration = 3500) => {
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle', warning: 'fa-triangle-exclamation' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(20px)'; setTimeout(() => toast.remove(), 400); }, duration);
};

// ===== BACK TO TOP =====
const initBackToTop = () => {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
};

/// ===== LIVE CHAT FORM (index.html) + FAB TOGGLE (all pages) =====
const API_BASE = 'https://personal-website-ywou.onrender.com';

// Global tab switcher (used by onclick in HTML on index.html)
window.switchChatTab = (tab) => {
  const liveView = document.getElementById('chat-view-live');
  const aiView   = document.getElementById('chat-view-ai');
  const tabLive  = document.getElementById('tab-live');
  const tabAi    = document.getElementById('tab-ai');
  const title    = document.getElementById('chat-panel-title');
  if (!liveView || !aiView) return;
  if (tab === 'live') {
    liveView.style.display = '';
    aiView.style.display   = 'none';
    tabLive.classList.add('active');
    tabAi.classList.remove('active');
    if (title) title.textContent = 'Live Chat';
  } else {
    liveView.style.display = 'none';
    aiView.style.display   = '';
    tabAi.classList.add('active');
    tabLive.classList.remove('active');
    if (title) title.textContent = 'AI Assistant (Gemini)';
  }
};

// Reset live chat form
window.resetLiveChat = () => {
  const form    = document.getElementById('live-chat-form');
  const success = document.getElementById('lc-success');
  if (form)    { form.reset(); form.style.display = ''; }
  if (success)   success.style.display = 'none';
};

const initChatbot = () => {
  const fab      = document.getElementById('chatbot-fab');
  const panel    = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close');
  if (!fab || !panel) return;

  // FAB toggle — always registered here for all pages
  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    fab.style.transform = panel.classList.contains('open') ? 'rotate(10deg) scale(1.1)' : '';
  });
  closeBtn?.addEventListener('click', () => {
    panel.classList.remove('open');
    fab.style.transform = '';
  });

  // Live Chat Form Submit (index.html tab layout)
  const lcForm   = document.getElementById('live-chat-form');
  const lcSubmit = document.getElementById('lc-submit');
  const lcSuccess= document.getElementById('lc-success');

  if (lcForm) {
    lcForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name    = document.getElementById('lc-name')?.value.trim();
      const email   = document.getElementById('lc-email')?.value.trim();
      const message = document.getElementById('lc-message')?.value.trim();
      if (!name || !email || !message) return;

      lcSubmit.disabled = true;
      lcSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

      try {
        const res  = await fetch(`${API_BASE}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject: `Live Chat from ${name}`, message })
        });
        const data = await res.json();
        if (data.success) {
          lcForm.style.display = 'none';
          if (lcSuccess) lcSuccess.style.display = '';
        } else {
          showToast('Could not send message. Try again.', 'error');
          lcSubmit.disabled = false;
          lcSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
        }
      } catch (err) {
        showToast('Server unreachable. Please WhatsApp or email directly.', 'warning');
        lcSubmit.disabled = false;
        lcSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
      }
    });
  }
};


// ===== SMOOTH ANCHOR SCROLL =====
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
};

// ===== CARD TILT EFFECT =====
const initTilt = () => {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const x   = (e.clientX - r.left) / r.width  - 0.5;
      const y   = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
};

// ===== PARTICLE CLICK BURST =====
const initClickBurst = () => {
  document.addEventListener('click', e => {
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:99999;
        background:hsl(${Math.random()*360},100%,60%);
        transition:all 0.6s ease;transform:translate(-50%,-50%);
      `;
      document.body.appendChild(p);
      setTimeout(() => {
        p.style.left      = e.clientX + (Math.random() - 0.5) * 80 + 'px';
        p.style.top       = e.clientY + (Math.random() - 0.5) * 80 + 'px';
        p.style.opacity   = '0';
        p.style.transform = 'translate(-50%,-50%) scale(0)';
      }, 10);
      setTimeout(() => p.remove(), 700);
    }
  });
};

// ===== CONTACT FORM =====
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const API = 'https://personal-website-ywou.onrender.com';

  // Start warming the server immediately on page load.
  // We track the promise so if user submits before it completes,
  // we wait for it automatically instead of erroring out.
  let serverWarmPromise = fetch(`${API}/health`, { method: 'GET' })
    .then(() => true)
    .catch(() => false);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const formData = Object.fromEntries(new FormData(form));
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Waking up server...';

    // Step 1: If server is still waking up, wait for it automatically (up to 90s)
    await Promise.race([
      serverWarmPromise,
      new Promise(resolve => setTimeout(() => resolve(false), 90000))
    ]).catch(() => false);

    // Step 2: Send the message
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      const res = await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Message sent successfully! Avinash will reply soon 🚀', 'success');
        form.reset();
        // Re-warm for next submission
        serverWarmPromise = fetch(`${API}/health`, { method: 'GET' }).then(() => true).catch(() => false);

        // Trigger Confetti Animation
        if (typeof confetti !== 'undefined') {
          const duration = 3000;
          const end = Date.now() + duration;
          (function frame() {
            confetti({ particleCount: 5, angle: 60,  spread: 55, origin: { x: 0 }, colors: ['#00f5ff', '#b300ff', '#ff006e'] });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#00f5ff', '#b300ff', '#ff006e'] });
            if (Date.now() < end) requestAnimationFrame(frame);
          }());
        }
      } else {
        showToast('Failed to send. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Submission Error:', err);
      showToast('Could not reach server. Please email directly.', 'warning');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
    }
  });
};

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursorGlow();
  initMobileNav();
  setActiveNavLink();
  initTheme();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initBackToTop();
  initChatbot();
  initSmoothScroll();
  initTilt();
  initClickBurst();
  initContactForm();

  // Typing animation on home page
  if (document.getElementById('typed-text')) {
    initTyping('typed-text', [
      'Full Stack Developer',
      'AI & ML Engineer',
      '3D Web Specialist',
      'Blockchain Builder',
      'Open Source Contributor',
    ]);
  }
});
