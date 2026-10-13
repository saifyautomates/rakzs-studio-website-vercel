(function(){
  'use strict';

  // --- Portfolio & Gallery Data ---
  const photos = [
    {src:'assets/images/wedding-ceremony-colour.webp', cat:'weddings', title:'A ceremony in full colour', label:'Pexels reference'},
    {src:'assets/images/wedding-together-centre.webp', cat:'weddings', title:'Together at the centre', label:'Pexels reference'},
    {src:'assets/images/wedding-portrait-two.webp', cat:'weddings', title:'A portrait of two', label:'Pexels reference'},
    {src:'assets/images/prewedding-quiet-walk.webp', cat:'pre-wedding', title:'A quiet walk together', label:'Pexels reference'},
    {src:'assets/images/prewedding-before-celebration.webp', cat:'pre-wedding', title:'Before the celebration', label:'Pexels reference'},
    {src:'assets/images/prewedding-unguarded-moment.webp', cat:'pre-wedding', title:'An unguarded moment', label:'Pexels reference'},
    {src:'assets/images/portrait-window-light.webp', cat:'portraits', title:'Portrait in window light', label:'Rakzs original'},
    {src:'assets/images/portrait-editorial-study.jpg', cat:'portraits', title:'Editorial portrait study', label:'Pexels reference'},
    {src:'assets/images/portrait-character-focus.webp', cat:'portraits', title:'Character in focus', label:'Pexels reference'},
    {src:'assets/images/portrait-tradition-framed.jpg', cat:'portraits', title:'Tradition, softly framed', label:'Pexels reference'},
    {src:'assets/images/event-room-alive.webp', cat:'events', title:'The room comes alive', label:'Pexels reference'},
    {src:'assets/images/event-corporate-moments.webp', cat:'events', title:'Corporate moments, covered', label:'Pexels reference'},
    {src:'assets/images/event-light-music.webp', cat:'events', title:'Light, music and movement', label:'Pexels reference'}
  ];

  const cats = [
    {key:'weddings', name:'Weddings', line:'Candid emotion. Ceremonial detail.', src:'assets/images/wedding-ceremony-colour.webp'},
    {key:'pre-wedding', name:'Pre-Wedding', line:'Two people. Space to be yourselves.', src:'assets/images/prewedding-quiet-walk.webp'},
    {key:'portraits', name:'Portraits', line:'Presence, personality and light.', src:'assets/images/portrait-window-light.webp'},
    {key:'events', name:'Events', line:'Parties and corporate, end to end.', src:'assets/images/event-room-alive.webp'}
  ];

  // --- Smooth Scroll Helper with Header Offset ---
  function smoothScrollTo(targetSelector) {
    if (!targetSelector || targetSelector === '#') return;
    if (targetSelector === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetEl = document.querySelector(targetSelector);
    if (!targetEl) return;
    const headerHeight = 72;
    const elementPos = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPos = elementPos - headerHeight;
    window.scrollTo({
      top: Math.max(0, offsetPos),
      behavior: 'smooth'
    });
  }

  // --- Category Grid Generation ---
  const grid = document.getElementById('categoryGrid');
  if (grid) {
    cats.forEach((c, i) => {
      const a = document.createElement('a');
      a.href = '#portfolio';
      a.className = 'category reveal ' + (i ? 'd' + (i + 1) : '');
      a.dataset.goto = c.key;
      a.setAttribute('role', 'button');
      a.setAttribute('aria-label', 'View ' + c.name + ' gallery');
      a.innerHTML = '<img src="' + c.src + '" alt="' + c.name + ' photography" loading="lazy"><div class="cat-copy"><span class="cat-num">0' + (i + 1) + '</span><h3>' + c.name + '</h3><p>' + c.line + '</p></div>';
      
      a.addEventListener('click', e => {
        e.preventDefault();
        setFilter(c.key);
        smoothScrollTo('#portfolio');
      });
      grid.appendChild(a);
    });
  }

  // --- Masonry Gallery Generation ---
  const masonry = document.getElementById('masonry');
  if (masonry) {
    photos.forEach((p, i) => {
      const f = document.createElement('figure');
      f.className = 'shot reveal';
      f.dataset.cat = p.cat;
      f.dataset.index = i;
      f.tabIndex = 0;
      f.setAttribute('role', 'button');
      f.setAttribute('aria-label', 'Open full photo: ' + p.title);
      f.innerHTML = '<img src="' + p.src + '" alt="' + p.title + '" loading="lazy" decoding="async"><figcaption class="shot-cap"><strong>' + p.title + '</strong><span>' + p.label + '</span></figcaption>';
      
      f.addEventListener('click', () => openLightbox(i));
      f.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
      masonry.appendChild(f);
    });
  }

  // --- Filtering with Dynamic Badges ---
  const filters = [...document.querySelectorAll('.filter')];
  const shots = [...document.querySelectorAll('.shot')];

  filters.forEach(btn => {
    const key = btn.dataset.filter;
    const count = key === 'all' ? photos.length : photos.filter(p => p.cat === key).length;
    const countSpan = document.createElement('span');
    countSpan.className = 'filter-count';
    countSpan.textContent = count;
    btn.appendChild(countSpan);
    
    btn.addEventListener('click', () => setFilter(key));
  });

  function setFilter(key) {
    filters.forEach(b => {
      const on = b.dataset.filter === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on);
    });
    shots.forEach(s => {
      const match = key === 'all' || s.dataset.cat === key;
      if (match) {
        s.classList.remove('hidden');
        s.style.opacity = '0';
        s.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          s.style.transition = 'opacity .4s ease, transform .4s ease';
          s.style.opacity = '1';
          s.style.transform = 'translateY(0)';
        });
      } else {
        s.classList.add('hidden');
      }
    });
  }

  // --- Lightbox Modal ---
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImage');
  const lbCap = document.getElementById('lbCaption');
  const lbCount = document.getElementById('lbCount');
  let current = 0;
  let lastFocus = null;

  const visible = () => shots.filter(s => !s.classList.contains('hidden')).map(s => +s.dataset.index);

  function render(isStep) {
    const p = photos[current];
    const v = visible();
    if (!p) return;

    if (isStep && lbImg) {
      lbImg.classList.add('fading');
      setTimeout(() => {
        lbImg.src = p.src;
        lbImg.alt = p.title;
        lbImg.classList.remove('fading');
      }, 150);
    } else if (lbImg) {
      lbImg.src = p.src;
      lbImg.alt = p.title;
    }

    if (lbCap) lbCap.textContent = p.title + ' · ' + p.label;
    const idx = v.indexOf(current);
    if (lbCount) {
      lbCount.textContent = (idx >= 0 ? idx + 1 : 1) + ' / ' + (v.length || photos.length);
    }
  }

  function openLightbox(i) {
    lastFocus = document.activeElement;
    current = i;
    render(false);
    lb.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => lb.classList.add('open'));
    const closeBtn = document.getElementById('lbClose');
    if (closeBtn) closeBtn.focus();
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.classList.remove('modal-open');
    setTimeout(() => { lb.hidden = true; }, 280);
    if (lastFocus) lastFocus.focus();
  }

  function step(d) {
    const v = visible();
    if (!v.length) return;
    let x = v.indexOf(current);
    if (x === -1) x = 0;
    current = v[(x + d + v.length) % v.length];
    render(true);
  }

  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if (lbClose) lbClose.onclick = closeLb;
  if (lbPrev) lbPrev.onclick = () => step(-1);
  if (lbNext) lbNext.onclick = () => step(1);

  if (lb) {
    lb.addEventListener('click', e => {
      if (e.target === lb) closeLb();
    });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    let tx = 0;
    lb.addEventListener('touchstart', e => {
      tx = e.touches[0].clientX;
    }, {passive:true});
    lb.addEventListener('touchend', e => {
      const d = e.changedTouches[0].clientX - tx;
      if (Math.abs(d) > 45) step(d < 0 ? 1 : -1);
    }, {passive:true});
  }

  // --- Preloader Handling ---
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const pre = document.getElementById('preloader');
  const hidePre = () => {
    if (pre && !pre.classList.contains('done')) {
      pre.classList.add('done');
    }
  };

  if (reduce) {
    hidePre();
  } else if (pre) {
    if (document.readyState === 'complete') {
      setTimeout(hidePre, 300);
    } else {
      window.addEventListener('load', () => setTimeout(hidePre, 350));
      setTimeout(hidePre, 1500);
    }
    pre.onclick = hidePre;
  }

  // --- Navigation & Mobile Drawer ---
  const nav = document.getElementById('siteNav');
  const menu = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');
  const progress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  // Close mobile drawer function
  function closeMobileNav() {
    if (links && links.classList.contains('open')) {
      links.classList.remove('open');
      if (menu) {
        menu.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open menu');
      }
      document.body.classList.remove('nav-open');
    }
  }

  if (menu && links) {
    menu.onclick = () => {
      const open = links.classList.toggle('open');
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    };

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120) closeMobileNav();
    }, {passive:true});
  }

  // --- Universal Smooth Scroll for All Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      closeMobileNav();
      smoothScrollTo(href);
    });
  });

  // --- Scroll Progress & Header Scrolled & Back to Top ---
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', scrollY > 30);

    // Scroll progress bar
    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    // Back to top visibility
    if (backToTop) {
      backToTop.classList.toggle('show', scrollY > 400);
    }
  }, {passive:true});

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Desktop Cursor Spotlight ---
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, {passive:true});
  }

  // --- Cinematic Scroll Reveal Observer ---
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.08, rootMargin:'0px 0px -40px'});
  document.querySelectorAll('.reveal').forEach(x => obs.observe(x));

  // --- FAQ Accordion Behavior (Single open at a time) ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });

  // --- Date Input Minimum Constraint (Today or Future) ---
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // --- Event Type Quick Chips ---
  const eventChips = document.querySelectorAll('#eventTypeChips .chip');
  const msgEl = document.getElementById('message');
  const charCount = document.getElementById('charCount');

  if (msgEl && charCount) {
    const updateCount = () => {
      charCount.textContent = msgEl.value.length + ' / 800';
    };
    msgEl.addEventListener('input', updateCount);
    updateCount();
  }

  let selectedEventType = '';
  eventChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const ev = chip.dataset.event;
      if (selectedEventType === ev) {
        chip.classList.remove('active');
        selectedEventType = '';
      } else {
        eventChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedEventType = ev;
        if (msgEl) {
          const prefix = `Celebrating: ${ev}`;
          if (!msgEl.value.includes(prefix)) {
            msgEl.value = msgEl.value.trim() ? `${prefix}. ${msgEl.value}` : `${prefix}. `;
            if (charCount) charCount.textContent = msgEl.value.length + ' / 800';
          }
        }
      }
    });
  });

  // --- Pricing Tier Enquire Buttons ---
  document.querySelectorAll('.enquire-tier').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const tier = a.dataset.tier;
      const note = 'Interested in the ' + tier + ' collection.';
      if (msgEl) {
        if (!msgEl.value.includes(note)) {
          msgEl.value = msgEl.value.trim() ? `${note}\n${msgEl.value}` : note;
          if (charCount) charCount.textContent = msgEl.value.length + ' / 800';
        }
      }
      smoothScrollTo('#contact');
      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => nameInput.focus({preventScroll:true}), 500);
      }
    });
  });

  // --- Enquiry Form Submission to WhatsApp ---
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const nameEl = document.getElementById('name');
      const phoneEl = document.getElementById('phone');
      const dateEl = document.getElementById('date');
      const cityEl = document.getElementById('city');
      const err = document.getElementById('formError');
      const status = document.getElementById('formStatus');

      const name = nameEl ? nameEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const date = dateEl ? dateEl.value : '';
      const city = cityEl ? cityEl.value.trim() : '';
      const msg = msgEl ? msgEl.value.trim() : '';

      if (status) status.hidden = true;
      if (err) err.hidden = true;

      if (!name || !phone || !date) {
        if (err) {
          err.textContent = 'Please add your name, phone and event date.';
          err.hidden = false;
        }
        return;
      }

      if (!/^[+\d][\d\s()\-]{6,17}$/.test(phone)) {
        if (err) {
          err.textContent = 'Please enter a valid phone number.';
          err.hidden = false;
        }
        return;
      }

      const text = `Hi Rakzs Studio! I'm ${name} (${phone}).\nEvent date: ${date}${city ? '\nVenue / city: ' + city : ''}${msg ? '\nDetails: ' + msg : ''}\nPlease share availability and collection details.`;

      // Update hidden input for fallback
      const hiddenMsg = document.getElementById('whatsappMessage');
      if (hiddenMsg) hiddenMsg.value = text;

      // Asynchronously log lead to backend API without blocking user
      try {
        fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, date, city, message: msg })
        }).catch(() => {});
      } catch (_) {}

      const waUrl = 'https://wa.me/918522059034?text=' + encodeURIComponent(text);

      if (status) {
        status.textContent = '✓ Redirecting to WhatsApp chat with your details...';
        status.hidden = false;
      }

      const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = waUrl;
      }
    });
  }
})();