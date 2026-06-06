// ─── TWEAKS STATE ──────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "blue",
  "cardStyle": "lifted",
  "borderWidth": "1px",
  "darkMode": false
}/*EDITMODE-END*/;

// ─── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initTextMorph();
  initScrollReveal();
  initMouseGlow();
  initScrollListeners();
  initSidebar();
  initCardInteractions();
  initContainerScroll();
  initEditMode();
  
  // Init tab indicator position
  setTimeout(() => {
    updateTabIndicator('todos');
  }, 100);
  window.addEventListener('resize', () => {
    updateTabIndicator(currentCategory);
  });
});

// ─── ACETERNITY CONTAINER SCROLL ───────────────────────────────
function initContainerScroll() {
  const container = document.getElementById('gamesGrid');
  const wrapper = document.getElementById('scrollContainerWrapper');
  if (!container || !wrapper) return;
  
  // Initial state setup to avoid jumping
  container.style.transform = `translateY(100px) rotateX(20deg) scale(0.8)`;
  
  window.addEventListener('scroll', () => {
    const rect = wrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // progress: 0 when top of wrapper is 20% down the screen, 1 when it hits the top
    let progress = (windowHeight - rect.top) / (windowHeight * 0.8);
    progress = Math.max(0, Math.min(1, progress));
    
    // Ease-out curve for smoother feel
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    
    const rotateX = 20 - (easeOutProgress * 20); // 20 to 0
    const scale = 0.8 + (easeOutProgress * 0.2); // 0.8 to 1.0
    const translateY = 100 - (easeOutProgress * 100); // 100px to 0
    
    container.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`;
  });
}

// ─── VICTORWELANDER GOOEY TEXT MORPHING ────────────────────────
function initTextMorph() {
  const words = document.querySelectorAll('.morph-word');
  if (!words.length) return;
  
  words.forEach(w => {
    w.style.opacity = '0';
    w.style.filter = 'blur(10px)';
    w.style.position = 'absolute';
    w.style.top = '0';
    w.style.left = '0';
    w.style.width = '100%';
    w.style.textAlign = 'left';
    w.classList.remove('active', 'above', 'below');
  });

  let textIndex = 0;
  const morphTime = 1.5;
  const cooldownTime = 1.0;
  
  let time = new Date();
  let morph = 0;
  let cooldown = cooldownTime;
  
  function setMorph(fraction) {
    const current1 = words[textIndex % words.length];
    const current2 = words[(textIndex + 1) % words.length];
    
    // VictorWelander math
    const blur2 = Math.min(8 / fraction - 8, 100);
    const opac2 = Math.pow(fraction, 0.4) * 100;
    current2.style.filter = `blur(${blur2}px)`;
    current2.style.opacity = `${opac2}%`;
    
    const invertedFraction = 1 - fraction;
    const blur1 = Math.min(8 / invertedFraction - 8, 100);
    const opac1 = Math.pow(invertedFraction, 0.4) * 100;
    current1.style.filter = `blur(${blur1}px)`;
    current1.style.opacity = `${opac1}%`;
  }
  
  function doCooldown() {
    morph = 0;
    const current1 = words[textIndex % words.length];
    const current2 = words[(textIndex + 1) % words.length];
    
    current2.style.filter = 'none';
    current2.style.opacity = '100%';
    current1.style.filter = 'none';
    current1.style.opacity = '0%';
  }
  
  function animate() {
    requestAnimationFrame(animate);
    const newTime = new Date();
    const dt = (newTime.getTime() - time.getTime()) / 1000;
    time = newTime;
    
    cooldown -= dt;
    
    if (cooldown <= 0) {
      const wasInCooldown = cooldown + dt > 0;
      if (wasInCooldown) {
        // Snap to clean state at end of cooldown
        doCooldown();
      }
      
      morph -= cooldown; 
      cooldown = 0;
      let fraction = morph / morphTime;
      
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      
      setMorph(fraction);
      
      if (fraction === 1) {
        textIndex = (textIndex + 1) % words.length;
      }
    } else {
      doCooldown();
    }
  }
  
  animate();
}

// ─── SCROLL REVEAL (IntersectionObserver) ─────────────────────
function initScrollReveal() {
  const cards = document.querySelectorAll('.game-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = Array.from(cards).indexOf(card) * 80;
        setTimeout(() => {
          card.classList.add('revealed');
        }, delay);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
}

// ─── MOUSE-TRACKING GLOW ON CARDS ─────────────────────────────
function initMouseGlow() {
  const cards = document.querySelectorAll('.game-card');

  cards.forEach(card => {
    const glow = card.querySelector('.card-glow');
    if (!glow) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.background = `radial-gradient(
        320px circle at ${x}px ${y}px,
        color-mix(in oklch, var(--accent) 8%, transparent),
        transparent 70%
      )`;
    });

    card.addEventListener('mouseleave', () => {
      glow.style.background = 'transparent';
    });
  });
}

// ─── SCROLL LISTENERS (toolbar, scroll-top) ───────────────────
function initScrollListeners() {
  const toolbar = document.getElementById('hextauiToolbar');
  
  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Show floating toolbar after scrolling 100px
    if (toolbar) {
      if (y > 100) {
        toolbar.classList.add('visible');
      } else {
        toolbar.classList.remove('visible');
      }
    }
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── SIDEBAR ──────────────────────────────────────────────────
function initSidebar() {
  const collapseBtn = document.getElementById('collapseBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const icon = collapseBtn.querySelector('i');
      icon.setAttribute('data-lucide',
        sidebar.classList.contains('collapsed') ? 'chevron-right' : 'chevron-left'
      );
      lucide.createIcons();
    });
  }

  // Mobile
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (window.innerWidth <= 768 && mobileBtn) {
    mobileBtn.style.display = 'inline-flex';
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
  }
}

// ─── CARD INTERACTIONS ─────────────────────────────────────────
function initCardInteractions() {
  const cards = document.querySelectorAll('.game-card');

  cards.forEach(card => {
    const thumb = card.querySelector('.card-thumb');
    let hoverTimer = null;

    card.addEventListener('mouseenter', () => {
      if (thumb && thumb.dataset.animated) {
        thumb.src = thumb.dataset.animated;
      }
      const vimeoId = card.dataset.vimeoId;
      const vimeoHash = card.dataset.vimeoHash;
      if (vimeoId) {
        hoverTimer = setTimeout(() => {
          loadVimeoPreview(card, vimeoId, vimeoHash);
        }, 1000);
      }
    });

    card.addEventListener('mouseleave', () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      if (thumb && thumb.dataset.animated) {
        thumb.src = thumb.src.replace('giphy.gif', 'giphy_s.gif');
      }
      unloadVimeoPreview(card);
    });

    card.addEventListener('click', () => {
      const url = card.dataset.gameUrl;
      if (url) {
        card.style.transform = 'scale(0.97)';
        setTimeout(() => {
          window.location.href = url;
        }, 150);
      }
    });
  });
}

// ─── EDIT MODE ────────────────────────────────────────────────
function initEditMode() {
  window.addEventListener('message', (event) => {
    if (event.data.type === '__activate_edit_mode') {
      const tweaks = document.getElementById('tweaksPanel');
      if (tweaks) tweaks.classList.add('active');
    } else if (event.data.type === '__deactivate_edit_mode') {
      const tweaks = document.getElementById('tweaksPanel');
      if (tweaks) tweaks.classList.remove('active');
    }
  });
  window.parent.postMessage({type: '__edit_mode_available'}, '*');
}

// ─── TWEAKS ACTIONS ───────────────────────────────────────────
function toggleTweaks() {
  const panel = document.getElementById('tweaksPanel');
  if(panel) panel.classList.toggle('active');
}

function setAccentColor(colorName, el) {
  document.querySelectorAll('.color-swatch').forEach(sw => sw.classList.remove('active'));
  if (el) el.classList.add('active');

  const map = { blue: 'var(--primary-blue)', purple: 'var(--primary-purple)', emerald: 'var(--primary-emerald)' };
  document.documentElement.style.setProperty('--accent', map[colorName] || map.blue);

  window.parent.postMessage({
    type: '__edit_mode_set_keys',
    edits: { accentColor: colorName }
  }, '*');
}

function setCardStyle(style) {
  const root = document.documentElement;
  const styles = {
    lifted: {
      shadow: '0 4px 12px -2px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.03)',
      hoverShadow: '0 12px 24px -4px rgba(0,0,0,0.08), 0 4px 12px -2px rgba(0,0,0,0.04)',
      hoverTransform: 'translateY(-4px)'
    },
    flat: {
      shadow: 'none', hoverShadow: 'none', hoverTransform: 'none'
    },
    neubrutalist: {
      shadow: '4px 4px 0px 0px var(--border)',
      hoverShadow: '6px 6px 0px 0px var(--accent)',
      hoverTransform: 'translate(-2px, -2px)'
    }
  };

  const s = styles[style] || styles.lifted;
  root.style.setProperty('--card-shadow', s.shadow);
  root.style.setProperty('--card-shadow-hover', s.hoverShadow);
  root.style.setProperty('--card-transform-hover', s.hoverTransform);

  window.parent.postMessage({
    type: '__edit_mode_set_keys',
    edits: { cardStyle: style }
  }, '*');
}

function setBorderWidth(width) {
  document.documentElement.style.setProperty('--card-border-width', width);
  window.parent.postMessage({
    type: '__edit_mode_set_keys',
    edits: { borderWidth: width }
  }, '*');
}

// ─── CATEGORY & SEARCH ────────────────────────────────────────
let currentCategory = 'todos';
let currentSearch = '';

function selectCategory(categoryName, element) {
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');

  currentCategory = categoryName;
  const titleEl = document.getElementById('gridCategoryTitle');
  if(titleEl && element) titleEl.textContent = element.querySelector('span').textContent;

  // Close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');

  updateTabIndicator(categoryName);
  applyFilters();
}

function selectCategoryTab(categoryName) {
  const sidebarItems = document.querySelectorAll('.sidebar-menu .menu-item');
  let matchingEl = null;
  sidebarItems.forEach(item => {
    const onclickAttr = item.getAttribute('onclick') || '';
    if (onclickAttr.includes(`'${categoryName}'`)) {
      matchingEl = item;
    }
  });

  if (matchingEl) {
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    matchingEl.classList.add('active');
    const titleEl = document.getElementById('gridCategoryTitle');
    if (titleEl) titleEl.textContent = matchingEl.querySelector('span').textContent;
  }

  currentCategory = categoryName;
  updateTabIndicator(categoryName);
  applyFilters();
}

function updateTabIndicator(categoryName) {
  const radio = document.getElementById(`tab-${categoryName}`);
  if (radio) {
    radio.checked = true;
    const label = document.querySelector(`label[for="tab-${categoryName}"]`);
    const indicator = document.querySelector('.indicator');
    if (label && indicator) {
      indicator.style.transform = `translateX(${label.offsetLeft}px)`;
      indicator.style.width = `${label.offsetWidth}px`;
    }
  }
}

function handleSearch(val) {
  currentSearch = val.toLowerCase().trim();
  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll('.game-card');
  let visible = 0;

  cards.forEach(card => {
    const tags = card.dataset.tags || '';
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';

    const matchesCategory = (currentCategory === 'todos' || tags.includes(currentCategory));
    const matchesSearch = (!currentSearch || title.includes(currentSearch) || desc.includes(currentSearch));

    if (matchesCategory && matchesSearch) {
      card.classList.remove('filtered-out');
      visible++;
    } else {
      card.classList.add('filtered-out');
    }
  });

  const visCount = document.getElementById('visibleCount');
  const navCount = document.getElementById('navVisibleCount');
  if (visCount) visCount.textContent = visible;
  if (navCount) navCount.textContent = visible;
}

// ─── THEME ────────────────────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const themeIcons = document.querySelectorAll('.themeIcon');

  if (html.getAttribute('data-theme') === 'dark') {
    html.removeAttribute('data-theme');
    themeIcons.forEach(icon => icon.setAttribute('data-lucide', 'moon'));
  } else {
    html.setAttribute('data-theme', 'dark');
    themeIcons.forEach(icon => icon.setAttribute('data-lucide', 'sun'));
  }
  lucide.createIcons();
}

// ─── VIMEO ────────────────────────────────────────────────────
function loadVimeoPreview(card, id, hash) {
  const container = card.querySelector('.card-iframe-container');
  if (!container || container.querySelector('iframe')) return;

  const loader = document.createElement('div');
  loader.className = 'video-loader';
  loader.innerHTML = '<div class="spinner"></div>';
  container.appendChild(loader);

  const iframe = document.createElement('iframe');
  iframe.src = `https://player.vimeo.com/video/${id}?h=${hash}&autoplay=1&loop=1&muted=1&background=1`;
  iframe.allow = "autoplay; fullscreen";

  iframe.onload = () => {
    card.classList.add('has-preview');
    setTimeout(() => { if (loader) loader.remove(); }, 1500);
  };

  container.appendChild(iframe);
}

function unloadVimeoPreview(card) {
  const container = card.querySelector('.card-iframe-container');
  if (container) {
    container.innerHTML = '';
    card.classList.remove('has-preview');
  }
}
