// ---- mobile nav toggle ----
(function(){
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      links.classList.remove('open');
      toggle.textContent = 'Menu';
    });
  });
})();

// ---- scroll reveal ----
var revealObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initReveal(root){
  (root || document).querySelectorAll('.reveal:not(.in)').forEach(function(el){
    revealObserver.observe(el);
  });
}

initReveal();

// ---- shared body-scroll lock (nested overlays each push/pop) ----
var scrollLockCount = 0;
function pushScrollLock(){
  scrollLockCount++;
  document.body.style.overflow = 'hidden';
}
function popScrollLock(){
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if(scrollLockCount === 0) document.body.style.overflow = '';
}

// ---- lazy image fade-in ----
function markLoaded(img){
  if(img.complete){
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', function(){ img.classList.add('loaded'); });
  }
}

// ---- hero crossfade ----
function initHero(images, container){
  if(!images.length) return;
  var slides = images.map(function(src, i){
    var div = document.createElement('div');
    div.className = 'hero-slide' + (i === 0 ? ' active' : '');
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    div.appendChild(img);
    container.appendChild(div);
    return div;
  });
  if(slides.length < 2) return;
  var idx = 0;
  setInterval(function(){
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 5500);
}

// ---- lightbox (single shared instance; open() can be called repeatedly with new figures) ----
var Lightbox = (function(){
  var lb = document.querySelector('.lightbox');
  if(!lb) return { open: function(){}, bindTriggers: function(){} };

  var imgEl = lb.querySelector('.lightbox-img-wrap img');
  var caption = lb.querySelector('.lightbox-caption');
  var closeBtn = lb.querySelector('.lightbox-close');
  var prevBtn = lb.querySelector('.lightbox-prev');
  var nextBtn = lb.querySelector('.lightbox-next');
  var figures = [];
  var current = 0;

  function show(i){
    current = (i + figures.length) % figures.length;
    var data = figures[current];
    imgEl.classList.remove('loaded');
    imgEl.src = data.full;
    imgEl.alt = data.alt || '';
    caption.textContent = data.caption || '';
    if(imgEl.complete){ imgEl.classList.add('loaded'); }
  }

  function open(newFigures, index){
    figures = newFigures;
    show(index || 0);
    lb.classList.add('open');
    pushScrollLock();
  }

  function close(){
    if(!lb.classList.contains('open')) return;
    lb.classList.remove('open');
    popScrollLock();
  }

  imgEl.addEventListener('load', function(){ imgEl.classList.add('loaded'); });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function(){ show(current - 1); });
  nextBtn.addEventListener('click', function(){ show(current + 1); });
  lb.addEventListener('click', function(e){
    if(e.target === lb || e.target.classList.contains('lightbox-frame')){ close(); }
  });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight') show(current + 1);
    if(e.key === 'ArrowLeft') show(current - 1);
  });

  function bindTriggers(figuresForClick){
    figuresForClick.forEach(function(data, i){
      data.el.addEventListener('click', function(){ open(figuresForClick, i); });
    });
  }

  return { open: open, close: close, bindTriggers: bindTriggers };
})();
