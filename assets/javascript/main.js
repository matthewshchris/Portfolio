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

  // Swap button text while "sending"
  var submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  // Simulated success — swap this setTimeout for a real
  // fetch() call to Formspree, EmailJS, etc. when ready
  setTimeout(function () {
    formStatus.textContent = "Message sent! I'll get back to you soon.";
    formStatus.classList.add('success');
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }, 1000);
});

// remove error highlight as user types
contactForm.querySelectorAll('input, textarea').forEach(function (field) {
  field.addEventListener('input', function () {
    field.classList.remove('error');
  });
});


// --- Footer year ---
document.getElementById('footerYear').textContent = new Date().getFullYear();
