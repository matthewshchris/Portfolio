// ============================================================
// main.js
// ============================================================

// --- Nav: add background when user scrolls down ---
var nav = document.getElementById('nav');

window.addEventListener('scroll', function () {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});


// --- Mobile menu toggle ---
var navToggle = document.getElementById('navToggle');
var navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', function () {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// close the menu when any link is clicked
var menuLinks = navLinks.querySelectorAll('a');
menuLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


// --- Fade-in on scroll ---
// IntersectionObserver watches elements and adds .visible when they
// enter the viewport. Simpler than listening to scroll manually.
var fadeElements = document.querySelectorAll('.fade-in');

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.12 });

fadeElements.forEach(function (el) {
  observer.observe(el);
});


// --- Portfolio filter ---
var filterBtns = document.querySelectorAll('.filter-btn');
var workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {

    // update active button style
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    var selected = btn.getAttribute('data-filter');

    workCards.forEach(function (card) {
      if (selected === 'all' || card.getAttribute('data-category') === selected) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


// --- Lightbox ---
var lightbox     = document.getElementById('lightbox');
var lightboxInner   = document.getElementById('lightboxInner');
var lightboxCaption = document.getElementById('lightboxCaption');
var lightboxClose   = document.getElementById('lightboxClose');

function openLightbox(type, src, title) {
  lightboxInner.innerHTML = '';
  lightboxCaption.textContent = title || '';

  if (type === 'image') {
    var img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
    lightboxInner.appendChild(img);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

  } else if (type === 'video') {
    var vid = document.createElement('video');
    vid.src = src;
    vid.controls = true;
    vid.autoplay = true;
    lightboxInner.appendChild(vid);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';

  } else if (type === 'link') {
    // websites just open in a new tab
    window.open(src, '_blank', 'noopener,noreferrer');
  }
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';

  // stop video if playing
  var vid = lightboxInner.querySelector('video');
  if (vid) { vid.pause(); }

  setTimeout(function () {
    lightboxInner.innerHTML = '';
  }, 300);
}

// listen for clicks on all the overlay buttons
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.overlay-btn');
  if (btn) {
    e.preventDefault();
    openLightbox(btn.dataset.type, btn.dataset.src, btn.dataset.title);
  }
});

lightboxClose.addEventListener('click', closeLightbox);

// click outside the image/video to close
lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// press Escape to close
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});


// --- Contact form ---
var contactForm = document.getElementById('contactForm');
var formStatus  = document.getElementById('formStatus');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // clear any previous status
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  var name    = contactForm.elements['name'];
  var email   = contactForm.elements['email'];
  var message = contactForm.elements['message'];
  var valid   = true;

  // check required fields
  if (!name.value.trim()) {
    name.classList.add('error');
    valid = false;
  } else {
    name.classList.remove('error');
  }

  if (!email.value.trim()) {
    email.classList.add('error');
    valid = false;
  } else {
    email.classList.remove('error');
  }

  if (!message.value.trim()) {
    message.classList.add('error');
    valid = false;
  } else {
    message.classList.remove('error');
  }

  if (!valid) {
    formStatus.textContent = 'Please fill in all required fields.';
    formStatus.classList.add('error');
    return;
  }

  // Swap button text while sending
  var submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  // Send to Formspree
  fetch(contactForm.action, {
    method: 'POST',
    body: new FormData(contactForm),
    headers: { 'Accept': 'application/json' }
  })
  .then(function (response) {
    if (response.ok) {
      formStatus.textContent = "Message sent! I'll get back to you soon.";
      formStatus.classList.add('success');
      contactForm.reset();
    } else {
      formStatus.textContent = 'Something went wrong. Please email me directly.';
      formStatus.classList.add('error');
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  })
  .catch(function () {
    formStatus.textContent = 'Something went wrong. Please email me directly.';
    formStatus.classList.add('error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  });
});

// remove error highlight as user types
contactForm.querySelectorAll('input, textarea').forEach(function (field) {
  field.addEventListener('input', function () {
    field.classList.remove('error');
  });
});


// --- Footer year ---
document.getElementById('footerYear').textContent = new Date().getFullYear();


// --- WHC Gallery Modal ---
var whcGallery      = document.getElementById('whcGallery');
var openWhcBtn      = document.getElementById('openWhcGallery');
var whcGalleryClose = document.getElementById('whcGalleryClose');
var whcTabs         = document.querySelectorAll('.whc-tab');
var whcPanels       = document.querySelectorAll('.whc-panel');

// open the gallery
openWhcBtn.addEventListener('click', function () {
  whcGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
});

// close the gallery
function closeWhcGallery() {
  whcGallery.classList.remove('open');
  document.body.style.overflow = '';
}

whcGalleryClose.addEventListener('click', closeWhcGallery);

// click outside the box to close
whcGallery.addEventListener('click', function (e) {
  if (e.target === whcGallery) {
    closeWhcGallery();
  }
});

// Escape key closes it
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && whcGallery.classList.contains('open')) {
    closeWhcGallery();
  }
});

// tab switching
whcTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    whcTabs.forEach(function (t) { t.classList.remove('active'); });
    whcPanels.forEach(function (p) { p.classList.remove('active'); });

    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// --- Angel Athletica Gallery ---
var aaGallery      = document.getElementById('aaGallery');
var openAaBtn      = document.getElementById('openAaGallery');
var aaGalleryClose = document.getElementById('aaGalleryClose');

openAaBtn.addEventListener('click', function () {
  aaGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeAaGallery() {
  aaGallery.classList.remove('open');
  document.body.style.overflow = '';
}

aaGalleryClose.addEventListener('click', closeAaGallery);
aaGallery.addEventListener('click', function (e) { if (e.target === aaGallery) closeAaGallery(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && aaGallery.classList.contains('open')) closeAaGallery();
});

aaGallery.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    var img = e.target;
    lightboxInner.innerHTML = '';
    lightboxCaption.textContent = img.getAttribute('data-title') || '';
    var fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.alt = img.alt;
    lightboxInner.appendChild(fullImg);
    lightbox.classList.add('open');
  }
});


// --- Happy Camper Gallery ---
var hcGallery      = document.getElementById('hcGallery');
var openHcBtn      = document.getElementById('openHcGallery');
var hcGalleryClose = document.getElementById('hcGalleryClose');

openHcBtn.addEventListener('click', function () {
  hcGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeHcGallery() {
  hcGallery.classList.remove('open');
  document.body.style.overflow = '';
}

hcGalleryClose.addEventListener('click', closeHcGallery);
hcGallery.addEventListener('click', function (e) { if (e.target === hcGallery) closeHcGallery(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && hcGallery.classList.contains('open')) closeHcGallery();
});

hcGallery.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    var img = e.target;
    lightboxInner.innerHTML = '';
    lightboxCaption.textContent = img.getAttribute('data-title') || '';
    var fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.alt = img.alt;
    lightboxInner.appendChild(fullImg);
    lightbox.classList.add('open');
  }
});


// --- Customer2.AI Gallery ---
var c2Gallery      = document.getElementById('c2Gallery');
var openC2Btn      = document.getElementById('openC2Gallery');
var c2GalleryClose = document.getElementById('c2GalleryClose');

openC2Btn.addEventListener('click', function () {
  c2Gallery.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeC2Gallery() {
  c2Gallery.classList.remove('open');
  document.body.style.overflow = '';
}

c2GalleryClose.addEventListener('click', closeC2Gallery);
c2Gallery.addEventListener('click', function (e) { if (e.target === c2Gallery) closeC2Gallery(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && c2Gallery.classList.contains('open')) closeC2Gallery();
});

c2Gallery.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    var img = e.target;
    lightboxInner.innerHTML = '';
    lightboxCaption.textContent = img.getAttribute('data-title') || '';
    var fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.alt = img.alt;
    lightboxInner.appendChild(fullImg);
    lightbox.classList.add('open');
  }
});


// --- Masterwerks Gallery ---
var mwGallery      = document.getElementById('mwGallery');
var openMwBtn      = document.getElementById('openMwGallery');
var mwGalleryClose = document.getElementById('mwGalleryClose');

openMwBtn.addEventListener('click', function () {
  mwGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeMwGallery() {
  mwGallery.classList.remove('open');
  document.body.style.overflow = '';
}

mwGalleryClose.addEventListener('click', closeMwGallery);
mwGallery.addEventListener('click', function (e) { if (e.target === mwGallery) closeMwGallery(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && mwGallery.classList.contains('open')) closeMwGallery();
});

// clicking images in mwGallery opens the main lightbox
mwGallery.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    var img = e.target;
    lightboxInner.innerHTML = '';
    lightboxCaption.textContent = img.getAttribute('data-title') || '';
    var fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.alt = img.alt;
    lightboxInner.appendChild(fullImg);
    lightbox.classList.add('open');
  }
});


// --- InfernoAds Gallery ---
var iaGallery      = document.getElementById('iaGallery');
var openIaBtn      = document.getElementById('openIaGallery');
var iaGalleryClose = document.getElementById('iaGalleryClose');

openIaBtn.addEventListener('click', function () {
  iaGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeIaGallery() {
  iaGallery.classList.remove('open');
  document.body.style.overflow = '';
}

iaGalleryClose.addEventListener('click', closeIaGallery);
iaGallery.addEventListener('click', function (e) { if (e.target === iaGallery) closeIaGallery(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && iaGallery.classList.contains('open')) closeIaGallery();
});


// --- SMG Gallery ---
var smgGallery      = document.getElementById('smgGallery');
var openSmgBtn      = document.getElementById('openSmgGallery');
var smgGalleryClose = document.getElementById('smgGalleryClose');

openSmgBtn.addEventListener('click', function () {
  smgGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeSmgGallery() {
  smgGallery.classList.remove('open');
  document.body.style.overflow = '';
}

smgGalleryClose.addEventListener('click', closeSmgGallery);
smgGallery.addEventListener('click', function (e) { if (e.target === smgGallery) closeSmgGallery(); });
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && smgGallery.classList.contains('open')) closeSmgGallery();
});


// --- Video tiles open the main lightbox ---
document.addEventListener('click', function (e) {
  var tile = e.target.closest('.vid-tile');
  if (tile) {
    var src   = tile.dataset.src;
    var title = tile.dataset.title || '';

    lightboxInner.innerHTML = '';
    lightboxCaption.textContent = title;

    var vid = document.createElement('video');
    vid.src = src;
    vid.controls = true;
    vid.autoplay = true;
    vid.style.outline = 'none';
    lightboxInner.appendChild(vid);

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});


// clicking an image in the gallery opens it in the main lightbox
whcGallery.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    var img   = e.target;
    var title = img.getAttribute('data-title') || img.getAttribute('alt') || '';

    lightboxInner.innerHTML = '';
    lightboxCaption.textContent = title;

    var fullImg = document.createElement('img');
    fullImg.src = img.src;
    fullImg.alt = title;
    lightboxInner.appendChild(fullImg);

    lightbox.classList.add('open');
  }
});
