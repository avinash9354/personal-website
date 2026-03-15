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

// ===== CHATBOT & LIVE CHAT =====
const initChatbot = () => {
  const fab    = document.getElementById('chatbot-fab');
  const panel  = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close');
  const input  = document.getElementById('chatbot-input-field');
  const sendBtn = document.getElementById('chatbot-send');
  const msgs   = document.getElementById('chatbot-messages');
  if (!fab || !panel) return;

  const kb = [
    { k: ['who','avinash','about','yourself'], r: "👨‍💻 Avinash Pandey is a passionate Full Stack Developer & AI Engineer with 5+ years of experience. He specializes in creating stunning web apps and AI-powered solutions!" },
    { k: ['skills','technologies','tech','stack'], r: "⚡ Core skills: React.js, Node.js, Python, Three.js, TensorFlow, MongoDB, AWS, Docker, and Blockchain. Always learning the next big thing!" },
    { k: ['project','portfolio','work'], r: "🚀 50+ projects built! From AI chatbots to 3D dashboards and blockchain apps. Check the Projects page for all case studies!" },
    { k: ['experience','job','company'], r: "💼 5+ years at top companies — Senior Full Stack Dev at TechCorp, Lead AI Engineer at InnovateLabs, and now running his own dev agency!" },
    { k: ['hire','freelance','available'], r: "📬 Yes! Available for freelance projects. Visit the Hire Me page or contact directly — quick response guaranteed!" },
    { k: ['contact','reach','email'], r: "📧 You can reach Avinash via the Contact page. He typically responds within 24 hours!" },
    { k: ['price','cost','rate','budget'], r: "💰 Rates depend on project scope. Visit Hire Me for a custom quote — fair prices for premium work!" },
    { k: ['blog','article','write'], r: "✍️ Avinash writes about AI, Web Dev and Career Growth on the Blog page. New posts every week!" },
    { k: ['github','code','open'], r: "🐙 GitHub: github.com/avinashpandey — 100+ repos, active contributor to open source!" },
    { k: ['award','achievement','win'], r: "🏆 Won multiple hackathons including Google AI Challenge 2023. Also a Google Developer Expert and Microsoft MVP!" },
  ];

  let chatMode = 'ai'; // 'ai' or 'live'

  const getBotReply = (msg) => {
    const m = msg.toLowerCase();
    
    if (chatMode === 'live') {
      return "Hello! I am Avinash. I received your message and will get back to you shortly. Feel free to leave your email!";
    }

    if (m.includes('live chat') || m.includes('real person')) {
      chatMode = 'live';
      return "🚀 Switching to Live Chat mode... Connecting you to Avinash Pandey. One moment please!";
    }

    for (const item of kb) {
      if (item.k.some(k => m.includes(k))) return item.r;
    }
    const defaults = [
      "🤔 Hmm, try asking about Avinash's skills, projects, or how to hire him!",
      "🌟 Great question! Ask me about his experience, tech stack, or services.",
      "💡 I know everything about Avinash — skills, projects, contact info. What would you like to know?",
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const showTyping = () => {
    const div = document.createElement('div');
    div.className = 'chat-bubble bot typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    div.id = 'typing-indicator';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  };

  const addMessage = (text, who) => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();

    const div = document.createElement('div');
    div.className = `chat-bubble ${who}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  };

  const send = () => {
    const val = input?.value.trim();
    if (!val) return;
    addMessage(val, 'user');
    input.value = '';
    
    showTyping();
    setTimeout(() => {
      addMessage(getBotReply(val), 'bot');
    }, chatMode === 'live' ? 2000 : 800);
  };

  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    fab.style.transform = panel.classList.contains('open') ? 'rotate(10deg) scale(1.1)' : '';
  });
  closeBtn?.addEventListener('click', () => { panel.classList.remove('open'); fab.style.transform = ''; });
  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });

  // Welcome message
  setTimeout(() => {
    showTyping();
    setTimeout(() => addMessage("👋 Hi! I'm Avinash's AI assistant. Ask me anything about his skills, projects, or work! (Type 'Live Chat' to talk to me directly)", 'bot'), 1000);
  }, 1500);
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
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // 15-second timeout so button never stays stuck on "Sending..."
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch('https://personal-website-ywou.onrender.com/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success) {
        showToast('Message sent successfully! Avinash will reply soon 🚀', 'success');
        form.reset();
        
        // Trigger Confetti Animation
        if (typeof confetti !== 'undefined') {
          const duration = 3000;
          const end = Date.now() + duration;

          (function frame() {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#00f5ff', '#b300ff', '#ff006e']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#00f5ff', '#b300ff', '#ff006e']
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          }());
        }
      } else {
        showToast('Failed to send. Please try again.', 'error');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Submission Error:', err);
      if (err.name === 'AbortError') {
        showToast('Server is starting up (cold start). Please try again in 30 seconds!', 'warning');
      } else {
        showToast('Could not reach server. Please email directly.', 'warning');
      }
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
