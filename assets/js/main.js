(function(){
    'use strict';
    const photos=[
      {src:'assets/images/wedding-ceremony-colour.webp',cat:'weddings',title:'A ceremony in full colour',label:'Pexels reference'},
      {src:'assets/images/wedding-together-centre.webp',cat:'weddings',title:'Together at the centre',label:'Pexels reference'},
      {src:'assets/images/wedding-portrait-two.webp',cat:'weddings',title:'A portrait of two',label:'Pexels reference'},
      {src:'assets/images/prewedding-quiet-walk.webp',cat:'pre-wedding',title:'A quiet walk together',label:'Pexels reference'},
      {src:'assets/images/prewedding-before-celebration.webp',cat:'pre-wedding',title:'Before the celebration',label:'Pexels reference'},
      {src:'assets/images/prewedding-unguarded-moment.webp',cat:'pre-wedding',title:'An unguarded moment',label:'Pexels reference'},
      {src:'assets/images/portrait-window-light.webp',cat:'portraits',title:'Portrait in window light',label:'Rakzs original'},
      {src:'assets/images/portrait-editorial-study.jpg',cat:'portraits',title:'Editorial portrait study',label:'Pexels reference'},
      {src:'assets/images/portrait-character-focus.webp',cat:'portraits',title:'Character in focus',label:'Pexels reference'},
      {src:'assets/images/portrait-tradition-framed.jpg',cat:'portraits',title:'Tradition, softly framed',label:'Pexels reference'},
      {src:'assets/images/event-room-alive.webp',cat:'events',title:'The room comes alive',label:'Pexels reference'},
      {src:'assets/images/event-corporate-moments.webp',cat:'events',title:'Corporate moments, covered',label:'Pexels reference'},
      {src:'assets/images/event-light-music.webp',cat:'events',title:'Light, music and movement',label:'Pexels reference'}
    ];
    const cats=[
      {key:'weddings',name:'Weddings',line:'Candid emotion. Ceremonial detail.',src:'assets/images/wedding-ceremony-colour.webp'},
      {key:'pre-wedding',name:'Pre-Wedding',line:'Two people. Space to be yourselves.',src:'assets/images/prewedding-quiet-walk.webp'},
      {key:'portraits',name:'Portraits',line:'Presence, personality and light.',src:'assets/images/portrait-window-light.webp'},
      {key:'events',name:'Events',line:'Parties and corporate, end to end.',src:'assets/images/event-room-alive.webp'}
    ];
    const grid=document.getElementById('categoryGrid');
    cats.forEach((c,i)=>{const a=document.createElement('a');a.href='#portfolio';a.className='category reveal '+(i?'d'+(i+1):'');a.dataset.goto=c.key;a.innerHTML='<img src="'+c.src+'" alt="'+c.name+' photography" loading="lazy"><div class="cat-copy"><span class="cat-num">0'+(i+1)+'</span><h3>'+c.name+'</h3><p>'+c.line+'</p></div>';grid.appendChild(a)});
    const masonry=document.getElementById('masonry');
    photos.forEach((p,i)=>{const f=document.createElement('figure');f.className='shot reveal';f.dataset.cat=p.cat;f.dataset.index=i;f.tabIndex=0;f.setAttribute('role','button');f.setAttribute('aria-label','Open '+p.title);f.innerHTML='<img src="'+p.src+'" alt="'+p.title+'" decoding="async"><figcaption class="shot-cap"><strong>'+p.title+'</strong><span>'+p.label+'</span></figcaption>';f.addEventListener('click',()=>openLightbox(i));f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(i)}});masonry.appendChild(f)});
    const filters=[...document.querySelectorAll('.filter')],shots=[...document.querySelectorAll('.shot')];
    function setFilter(key){filters.forEach(b=>{const on=b.dataset.filter===key;b.classList.toggle('active',on);b.setAttribute('aria-selected',on)});shots.forEach(s=>s.classList.toggle('hidden',key!=='all'&&s.dataset.cat!==key))}
    filters.forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));document.querySelectorAll('[data-goto]').forEach(a=>a.addEventListener('click',()=>setFilter(a.dataset.goto)));
    const lb=document.getElementById('lightbox'),lbImg=document.getElementById('lbImage'),lbCap=document.getElementById('lbCaption'),lbCount=document.getElementById('lbCount');let current=0,lastFocus=null;
    const visible=()=>shots.filter(s=>!s.classList.contains('hidden')).map(s=>+s.dataset.index);
    function render(){const p=photos[current],v=visible();lbImg.src=p.src;lbImg.alt=p.title;lbCap.textContent=p.title+' · '+p.label;lbCount.textContent=(v.indexOf(current)+1)+' / '+v.length}
    function openLightbox(i){lastFocus=document.activeElement;current=i;render();lb.hidden=false;document.body.classList.add('modal-open');requestAnimationFrame(()=>lb.classList.add('open'));document.getElementById('lbClose').focus()}
    function closeLb(){lb.classList.remove('open');document.body.classList.remove('modal-open');setTimeout(()=>lb.hidden=true,280);if(lastFocus)lastFocus.focus()}
    function step(d){const v=visible();let x=v.indexOf(current);current=v[(x+d+v.length)%v.length];render()}
    document.getElementById('lbClose').onclick=closeLb;document.getElementById('lbPrev').onclick=()=>step(-1);document.getElementById('lbNext').onclick=()=>step(1);lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
    let tx=0;lb.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>45)step(d<0?1:-1)},{passive:true});
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;const pre=document.getElementById('preloader');const hidePre=()=>pre.classList.add('done');if(reduce)hidePre();else{setTimeout(hidePre,1400);pre.onclick=hidePre;setTimeout(hidePre,2400)}
    const nav=document.getElementById('siteNav'),menu=document.getElementById('menuBtn'),links=document.getElementById('navLinks');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});menu.onclick=()=>{const open=links.classList.toggle('open');menu.classList.toggle('open',open);menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('nav-open',open)};links.querySelectorAll('a').forEach(a=>a.onclick=()=>{links.classList.remove('open');menu.classList.remove('open');menu.setAttribute('aria-expanded','false');document.body.classList.remove('nav-open')});
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -4%'});document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
    let selectedTier='';document.querySelectorAll('.enquire-tier').forEach(a=>a.onclick=()=>{selectedTier=a.dataset.tier;document.getElementById('message').value='I am interested in the '+selectedTier+' collection.'});
    document.getElementById('enquiryForm').addEventListener('submit',function(e){const name=document.getElementById('name').value.trim(),phone=document.getElementById('phone').value.trim(),date=document.getElementById('date').value,city=document.getElementById('city').value.trim(),msg=document.getElementById('message').value.trim(),err=document.getElementById('formError');err.textContent='Please add your name, phone and event date.';if(!name||!phone||!date){e.preventDefault();err.hidden=false;return}if(!/^[+\d][\d\s()\-]{6,17}$/.test(phone)){e.preventDefault();err.textContent='Please enter a valid phone number.';err.hidden=false;return}err.hidden=true;const text=`Hi Rakzs Studio! I'm ${name} (${phone}).\nEvent date: ${date}${city?'\nVenue / city: '+city:''}${msg?'\nDetails: '+msg:''}\nPlease share availability and collection details.`;document.getElementById('whatsappMessage').value=text});
  })();