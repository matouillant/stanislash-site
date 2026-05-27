// ─── COMPOSANTS ───
function loadComponent(id, url, activePage) {
  fetch(url)
    .then(r => r.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (id === 'main-header') {
        document.querySelectorAll('nav a').forEach(link => {
          if (link.getAttribute('href') === activePage) link.classList.add('active');
        });
        initHamburger();
      }
    });
}

function initPage(page) {
  document.addEventListener('DOMContentLoaded', () => {
    loadComponent('main-header', 'components/header.html', page);
    loadComponent('main-footer', 'components/footer.html');
    initAnimations();
  });
}

// ─── MENU HAMBURGER ───
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const nav = document.querySelector('header nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ─── ANIMATIONS AU SCROLL ───
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.date-card, .member-card, .spectacle-card, .contact-info-card, .galerie-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = (el.classList.contains('member-card')
      ? (i % 2 === 0 ? 'rotate(-1.8deg) translateY(20px)' : 'rotate(1.8deg) translateY(20px)')
      : 'translateY(24px)');
    el.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s, box-shadow 0.2s`;
    observer.observe(el);
  });

  document.addEventListener('animationend', (e) => {}, { once: true });

  // Inject visible CSS
  const style = document.createElement('style');
  style.textContent = `
    .date-card.visible, .spectacle-card.visible, .contact-info-card.visible, .galerie-item.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .member-card.visible:nth-child(odd) { opacity: 1 !important; transform: rotate(-1.8deg) !important; }
    .member-card.visible:nth-child(even) { opacity: 1 !important; transform: rotate(1.8deg) !important; }
    .member-card.visible:hover { opacity: 1 !important; transform: rotate(0deg) scale(1.05) !important; }
  `;
  document.head.appendChild(style);
}

// ─── FORMULAIRE CONTACT ───
function initContactForm() {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '✓ Message envoyé !';
      btn.style.background = '#1a6b3a';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'ENVOYER';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  });
}
