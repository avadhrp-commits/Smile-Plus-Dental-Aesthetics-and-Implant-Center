(function(){
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  var onScroll = function(){
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobilePanel = document.getElementById('mobilePanel');
  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', function(){
      var open = mobilePanel.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobilePanel.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mobilePanel.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Hero video: load only on larger screens, after paint ---------- */
  var heroVideo = document.getElementById('heroVideo');
  var heroPoster = document.getElementById('heroPoster');
  function loadHeroVideo(){
    if (!heroVideo) return;
    var isSmall = window.innerWidth < 760;
    var src = isSmall ? 'assets/video/hero-bg-mobile.mp4' : 'assets/video/hero-bg.mp4';
    var source = heroVideo.querySelector('source');
    source.src = src;
    heroVideo.load();
    heroVideo.play().catch(function(){ /* autoplay blocked — poster stays visible */ });
    heroVideo.addEventListener('canplay', function(){
      heroVideo.style.opacity = '1';
      if (heroPoster) heroPoster.style.opacity = '0';
    }, { once: true });
  }
  if (heroVideo) {
    heroVideo.style.opacity = '0';
    heroVideo.style.transition = 'opacity 0.8s ease';
    if (heroPoster) heroPoster.style.transition = 'opacity 0.8s ease';
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadHeroVideo, { timeout: 2500 });
    } else {
      window.addEventListener('load', function(){ setTimeout(loadHeroVideo, 400); });
    }
  }

  /* ---------- Technology section video: same background-autoplay treatment ---------- */
  var techVideo = document.getElementById('techVideo');
  var techPoster = document.getElementById('techPoster');
  function loadTechVideo(){
    if (!techVideo) return;
    var isSmall = window.innerWidth < 760;
    var src = isSmall ? 'assets/video/sterilized-equipment-mobile.mp4' : 'assets/video/sterilized-equipment.mp4';
    var source = techVideo.querySelector('source');
    source.src = src;
    techVideo.load();
    techVideo.play().catch(function(){ /* autoplay blocked — poster stays visible */ });
    techVideo.addEventListener('canplay', function(){
      techVideo.style.opacity = '1';
      if (techPoster) techPoster.style.opacity = '0';
    }, { once: true });
  }
  if (techVideo) {
    techVideo.style.opacity = '0';
    techVideo.style.transition = 'opacity 0.8s ease';
    if (techPoster) techPoster.style.transition = 'opacity 0.8s ease';
    if ('IntersectionObserver' in window) {
      var techIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            loadTechVideo();
            techIO.disconnect();
          }
        });
      }, { rootMargin: '400px 0px' });
      techIO.observe(techVideo.closest('.tech-hero'));
    } else {
      window.addEventListener('load', function(){ setTimeout(loadTechVideo, 600); });
    }
  }

  /* ---------- Google reviews carousel ---------- */
  /* Data-driven: to publish a new Google review, add an object here — the carousel
     re-renders and becomes swipeable automatically. No other markup changes needed. */
  var REVIEWS = [
    { name: "Drashti Patel", time: "4 months ago",
      text: "Had a very good experience with Dr. Yashasvi. She is very polite and makes sure you feel comfortable during the entire procedure. She explains everything beforehand which really helps you feel prepared and relaxed." },
    { name: "Urvish Patel", time: "6 months ago",
      text: "We had a wonderful experience at Smile+ Dental Clinic. Dr. Patel and her team are incredibly professional and made us feel very comfortable. The clinic is clean and modern, offering a pleasant environment for dental care." },
    { name: "Hemanth Nair", time: "8 months ago",
      text: "I had a really good experience here for my root canal treatment. The clinic felt clean and comfortable, and the treatment went smoothly. I truly appreciate their service and would happily recommend this dental hospital to others." },
    { name: "Rutvik Patel", time: "7 months ago",
      text: "I had a fantastic experience with Dr. Yashasvi. The clinic is spotless, hygienic, and equipped with state-of-the-art technology. What truly sets Dr. Yashasvi apart is her patient-centered approach — she takes the time to check in with you." },
    { name: "Parth Patel", time: "8 months ago",
      text: "Dr. Yashasvi is a fine doctor. We are very happy with her treatment — she has done root canal and capping for my grandfather with an amazing result. Definitely recommend her for any dental treatment." },
    { name: "Devansh Patel", time: "8 months ago",
      text: "Dr. Yashasvi is a fine doctor. I am very happy with her treatment — she has done cleaning and root canal for me. It was a great experience. I definitely recommend her for any dental treatment." },
    { name: "Zinkal Delwadiya", time: "7 months ago",
      text: "Clean and hygienic facilities with modern equipment. Professional and friendly staff — doctors and assistants are polite, knowledgeable, and gentle." },
    { name: "Dhwanika Patel", time: "8 months ago",
      text: "Smile+ has one of the most advanced dental setups in the area. The combination of technology, hygiene, and a kind doctor makes it a top-rated clinic." },
    { name: "Kenil Sheth", time: "7 months ago",
      text: "Amazing service and professionalism. The doctor is very polite and friendly. Her consultancy is to the point and honest. Staff is helpful and well trained." }
  ];

  var AVATAR_COLORS = ['#8C5A3C','#A97C2F','#6B4A38','#4A3226','#2E5C4A','#3E5C7A','#7A4A5C','#5C4A7A','#7A6A2E'];
  function initialsAvatar(name){
    var initial = name.trim().charAt(0).toUpperCase();
    var hash = 0;
    for (var i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    var color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
    return { initial: initial, color: color };
  }

  var reviewsTrack = document.getElementById('reviewsTrack');
  if (reviewsTrack) {
    REVIEWS.forEach(function(r){
      var av = initialsAvatar(r.name);
      var card = document.createElement('div');
      card.className = 'review-quote-card';
      card.innerHTML =
        '<div class="rq-head">' +
          '<div class="rq-avatar" style="background:' + av.color + '">' + av.initial + '</div>' +
          '<div class="rq-meta">' +
            '<span class="rq-name">' + r.name + '</span>' +
            '<div class="rq-subline"><span class="rq-stars">★★★★★</span><span class="rq-time">' + r.time + '</span></div>' +
          '</div>' +
          '<svg class="rq-google-g" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.5-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z"/><path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.8 14.2-5l-6.6-5.6C29.6 36 26.9 37 24 37c-5.2 0-9.6-3.1-11.3-7.8l-6.6 5.1C9.5 40.6 16.2 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.6C41.5 36.4 45 30.9 45 24c0-1.4-.1-2.5-.4-3.5z"/></svg>' +
        '</div>' +
        '<p class="rq-text">' + r.text + '</p>';
      reviewsTrack.appendChild(card);
    });

    var rcPrev = document.getElementById('rcPrev');
    var rcNext = document.getElementById('rcNext');
    var rcDotsWrap = document.getElementById('reviewsDots');
    var cards = Array.prototype.slice.call(reviewsTrack.children);

    function cardStep(){
      var c = cards[0];
      var style = getComputedStyle(reviewsTrack);
      var gap = parseFloat(style.columnGap || style.gap || 0);
      return c.getBoundingClientRect().width + gap;
    }

    function buildDots(){
      rcDotsWrap.innerHTML = '';
      cards.forEach(function(_, i){
        var dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
        dot.addEventListener('click', function(){
          reviewsTrack.scrollTo({ left: cardStep() * i, behavior: 'smooth' });
        });
        rcDotsWrap.appendChild(dot);
      });
    }

    function updateControls(){
      var maxScroll = reviewsTrack.scrollWidth - reviewsTrack.clientWidth - 2;
      var overflowing = maxScroll > 4;
      rcPrev.classList.toggle('hidden', !overflowing);
      rcNext.classList.toggle('hidden', !overflowing);
      rcDotsWrap.classList.toggle('hidden', !overflowing);
      if (!overflowing) return;
      rcPrev.disabled = reviewsTrack.scrollLeft <= 2;
      rcNext.disabled = reviewsTrack.scrollLeft >= maxScroll;
      var idx = Math.round(reviewsTrack.scrollLeft / cardStep());
      Array.prototype.forEach.call(rcDotsWrap.children, function(dot, i){
        dot.classList.toggle('active', i === idx);
      });
    }

    buildDots();
    updateControls();

    rcPrev.addEventListener('click', function(){
      reviewsTrack.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });
    rcNext.addEventListener('click', function(){
      reviewsTrack.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });
    reviewsTrack.addEventListener('scroll', function(){
      window.requestAnimationFrame(updateControls);
    }, { passive: true });
    window.addEventListener('resize', function(){
      buildDots();
      updateControls();
    });
  }

  /* ---------- Video lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxVideo = document.getElementById('lightboxVideo');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, poster){
    lightboxVideo.setAttribute('poster', poster || '');
    lightboxVideo.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxVideo.play().catch(function(){});
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.video-trigger').forEach(function(card){
    card.addEventListener('click', function(){
      openLightbox(card.getAttribute('data-video'), card.getAttribute('data-poster'));
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function(e){
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeLightbox();
  });

})();
