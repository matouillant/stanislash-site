// ─── COMPOSANTS ───
function loadComponent(id, url, activePage) {
  return fetch(url)
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

// ─── FORMAT DATE FR ───
function formatDate(dateStr, heure) {
  const d = new Date(dateStr + 'T12:00:00');
  const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const mois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  return `${jours[d.getDay()]} ${d.getDate()} ${mois[d.getMonth()]} ${d.getFullYear()} — ${heure}`;
}

// ─── RENDU DATES ───
function renderDates(containerId, limit) {
  fetch('data/dates.json')
    .then(r => r.json())
    .then(dates => {
      const data = limit ? dates.slice(0, limit) : dates;
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = data.map(d => `
        <article class="date-card${d.featured ? ' featured' : ''}">
          ${d.featured ? '<div class="date-ribbon">⭐ À la une</div>' : ''}
          <div class="date-card-header">
            <span class="date-tag">${d.type}</span>
            <h3>${d.nom}</h3>
          </div>
          <p class="date-desc">${d.description}</p>
          <div class="date-meta">
            <div class="date-meta-row"><div class="date-icon">📅</div>${formatDate(d.date, d.heure)}</div>
            <div class="date-meta-row"><div class="date-icon">📍</div><a href="${d.lieu.maps}" target="_blank" rel="noopener" class="lieu-link">${d.lieu.nom}, ${d.lieu.ville}</a></div>
            <div class="date-meta-row"><div class="date-icon">🎟</div>${d.tarif}</div>
          </div>
          <div class="date-card-footer">
            <a href="${d.reservation}" target="_blank" rel="noopener" class="btn btn-red btn-full">→ Réserver ma place</a>
          </div>
        </article>
      `).join('');
      initAnimations();
    });
}

// ─── RENDU TROUPE ───
function renderTroupe(containerId, mode) {
  fetch('data/troupe.json')
    .then(r => r.json())
    .then(membres => {
      const container = document.getElementById(containerId);
      if (!container) return;
      if (mode === 'cards') {
        container.innerHTML = membres.map((m, i) => `
          <div class="member-card" data-id="${m.id}">
            <div class="member-avatar ${m.bg}">
              ${m.photo
                ? `<img src="${m.photo}" alt="${m.nom}">`
                : `<span>${m.emoji}</span>`}
            </div>
            <div class="member-info">
              <h3>${m.nom}</h3>
              <div class="member-role">${m.role} · depuis ${m.depuis}</div>
              <p class="member-bio">${m.bio_courte}</p>
              <span class="member-power">⚡ ${m.pouvoir}</span>
            </div>
          </div>
        `).join('');
      } else if (mode === 'full') {
        container.innerHTML = membres.map((m, i) => `
          <div class="member-card member-card-full" data-id="${m.id}">
            <div class="member-avatar ${m.bg}">
              ${m.photo
                ? `<img src="${m.photo}" alt="${m.nom}">`
                : `<span>${m.emoji}</span>`}
            </div>
            <div class="member-info">
              <h3>${m.nom}</h3>
              <div class="member-role">${m.role} · En scène depuis ${m.depuis}</div>
              <p class="member-bio">${m.bio_longue}</p>
              <span class="member-power">⚡ ${m.pouvoir}</span>
            </div>
          </div>
        `).join('');
      }
      initAnimations();
    });
}

// ─── INIT PAGE ───
function initPage(page) {
  document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
      loadComponent('main-header', 'components/header.html', page),
      loadComponent('main-footer', 'components/footer.html')
    ]).then(() => {});
    initAnimations();
  });
}

// ─── HAMBURGER ───
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

// ─── ANIMATIONS SCROLL ───
function initAnimations() {
  const style = document.getElementById('anim-style');
  if (!style) {
    const s = document.createElement('style');
    s.id = 'anim-style';
    s.textContent = `
      .date-card.visible, .spectacle-card.visible, .contact-info-card.visible, .galerie-item.visible {
        opacity: 1 !important; transform: translateY(0) !important;
      }
      .member-card.visible:nth-child(odd)  { opacity:1!important; transform:rotate(-1.8deg)!important; }
      .member-card.visible:nth-child(even) { opacity:1!important; transform:rotate(1.8deg)!important; }
      .member-card.visible:hover           { opacity:1!important; transform:rotate(0deg) scale(1.05)!important; }
      .member-card-full.visible:nth-child(odd)  { opacity:1!important; transform:rotate(-1.2deg)!important; }
      .member-card-full.visible:nth-child(even) { opacity:1!important; transform:rotate(1.2deg)!important; }
    `;
    document.head.appendChild(s);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.date-card:not(.visible), .member-card:not(.visible), .spectacle-card:not(.visible), .contact-info-card:not(.visible), .galerie-item:not(.visible)').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s, box-shadow 0.2s`;
    if (!el.classList.contains('member-card')) el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });
}

// ─── FORMULAIRE CONTACT ───
function initContactForm() {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '✓ Message envoyé !';
      btn.style.background = '#1a6b3a';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    });
  });
}

// ─── LIGHTBOX GALERIE ───
function initLightbox() {
  document.addEventListener('DOMContentLoaded', () => {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    document.querySelectorAll('.galerie-item').forEach(item => {
      item.addEventListener('click', () => {
        document.getElementById('lightbox-img').innerHTML = `<span style="font-size:6rem">${item.dataset.emoji}</span>`;
        document.getElementById('lightbox-caption').textContent = item.dataset.caption;
        document.getElementById('lightbox-sub').textContent = item.dataset.sub;
        lb.classList.add('open');
      });
    });
    document.getElementById('lightbox-close').addEventListener('click', () => lb.classList.remove('open'));
    lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('open'); });
  });
}
