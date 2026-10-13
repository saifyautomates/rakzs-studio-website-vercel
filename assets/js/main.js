(function(){
  'use strict';

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

  // Render categories
  const grid = document.getElementById('categoryGrid');
  if (grid) {
    cats.forEach((c, i) => {
      const a = document.createElement('a');
      a.href = '#portfolio';
      a.className = 'category reveal ' + (i ? 'd' + (i + 1) : '');
      a.dataset.goto = c.key;
      a.innerHTML = '<img src="' + c.src + '" alt="' + c.name + ' photography" loading="lazy"><div class="cat-copy"><span class="cat-num">0' + (i + 1) + '</span><h3>' + c.name + '</h3><p>' + c.line + '</p></div>';
      grid.appendChild(a);
    });
  }

  // Render masonry
  const masonry = document.getElementById('masonry');
  if (masonry) {
    photos.forEach((p, i) => {
      const f = document.createElement('figure');
      f.className = 'shot reveal';
      f.dataset.cat = p.cat;
      f.dataset.index = i;
      f.tabIndex = 0;
      f.setAttribute('role', 'button');
      f.setAttribute('aria-label', 'Open ' + p.title);
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

  // Filtering
  const filters = [...document.querySelectorAll('.filter')];
  const shots = [...document.querySelectorAll('.shot')];
  function setFilter(key) {
    filters.forEach(b => {
      const on = b.dataset.filter === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on);
    });
    shots.forEach(s => {
      s.classList.toggle('hidden', key !== 'all' && s.dataset.cat !== key);
    });
  }

  filters.forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter)));
  document.querySelectorAll('[data-goto]').forEach(a => {
    a.addEventListener('click', () => setFilter(a.dataset.goto));
  });

  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImage');
  const lbCap = document.getElementById('lbCaption');
  const lbCount = document.getElementById('lbCount');
  let current = 0;
  let lastFocus = null;

  const visible = () => shots.filter(s => !s.classList.contains('hidden')).map(s => +s.dataset.index);

  function render() {
    const p = photos[current];
    const v = visible();
    if (!p) return;
    lbImg.src = p.src;
    lbImg.alt = p.title;
    lbCap.textContent = p.title + ' · ' + p.label;
    const idx = v.indexOf(current);
    lbCount.textContent = (idx >= 0 ? idx + 1 : 1) + ' / ' + (v.length || photos.length);
  }

  function openLightbox(i) {
    lastFocus = document.activeElement;
    current = i;
    render();
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
    render();
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

  // Preloader
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
      setTimeout(hidePre, 1500); // safety fallback
    }
    pre.onclick = hidePre;
  }

  // Navigation
  const nav = document.getElementById('siteNav');
  const menu = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, {passive:true});
  }

  if (menu && links) {
    menu.onclick = () => {
      const open = links.classList.toggle('open');
      menu.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    };

    links.querySelectorAll('a').forEach(a => {
      a.onclick = () => {
        links.classList.remove('open');
        menu.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      };
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        menu.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });

    // Reset when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1120 && links.classList.contains('open')) {
        links.classList.remove('open');
        menu.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    }, {passive:true});
  }

  // Scroll reveal observer
  const obs = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, {threshold:.1, rootMargin:'0px 0px -4%'});
  document.querySelectorAll('.reveal').forEach(x => obs.observe(x));

  // Date input constraint: minimum today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Pricing tier selection
  document.querySelectorAll('.enquire-tier').forEach(a => {
    a.addEventListener('click', () => {
      const tier = a.dataset.tier;
      const msg = document.getElementById('message');
      const note = 'I am interested in the ' + tier + ' collection.';
      if (msg) {
        if (!msg.value.includes(note)) {
          msg.value = msg.value.trim() ? note + '\n' + msg.value : note;
        }
      }
      const nameInput = document.getElementById('name');
      if (nameInput) {
        setTimeout(() => nameInput.focus({preventScroll:true}), 300);
      }
    });
  });

  // Enquiry form submission
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const nameEl = document.getElementById('name');
      const phoneEl = document.getElementById('phone');
      const dateEl = document.getElementById('date');
      const cityEl = document.getElementById('city');
      const msgEl = document.getElementById('message');
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
      
      const waUrl = 'https://wa.me/918522059034?text=' + encodeURIComponent(text);

      if (status) {
        status.textContent = 'Redirecting to WhatsApp...';
        status.hidden = false;
      }

      // Open WhatsApp cleanly
      const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        // Fallback for strict popup blockers
        window.location.href = waUrl;
      }
    });
  }
})();