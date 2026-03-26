/**
 * Arizona Health & Daycare - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initGallery();
  initContactForm();
  initPreloader();
});

/**
 * Preloader handling
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide preloader after a short delay for smoothness
  window.addEventListener('load', function () {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.remove();
      }, 300);
    }, 100);
  });

  // Fallback
  setTimeout(() => {
    if (preloader && preloader.parentElement) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader && preloader.parentElement) preloader.remove();
      }, 300);
    }
  }, 500);
}

/**
 * Navbar scroll effect
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');

  if (!navbar) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');

    // Toggle hamburger icon
    const isOpen = mobileMenu.classList.contains('open');
    menuToggle.innerHTML = isOpen
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      document.body.style.overflow = '';
    });
  });
}

/**
 * Scroll reveal animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Gallery filtering and lightbox
 */
function initGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (galleryItems.length === 0) return;

  let currentImageIndex = 0;
  let filteredItems = Array.from(galleryItems);

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const category = this.dataset.filter;

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      galleryItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      // Update filtered items array
      filteredItems = Array.from(galleryItems).filter(item => {
        return category === 'all' || item.dataset.category === category;
      });
    });
  });

  // Lightbox functionality
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');

  // Open lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      const title = this.querySelector('.gallery-item-title');

      currentImageIndex = filteredItems.indexOf(this);

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = title ? title.textContent : img.alt;
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${filteredItems.length}`;

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Navigate images
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      navigateImage(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      navigateImage(1);
    });
  }

  function navigateImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
      currentImageIndex = filteredItems.length - 1;
    } else if (currentImageIndex >= filteredItems.length) {
      currentImageIndex = 0;
    }

    const item = filteredItems[currentImageIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : img.alt;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${filteredItems.length}`;
  }

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateImage(-1);
    } else if (e.key === 'ArrowRight') {
      navigateImage(1);
    }
  });
}

/**
 * Contact form handling
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');

  if (!form) return;

  const formSuccess = form.querySelector('.form-success');
  const formContent = form.querySelector('.form-content');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="1"></path>
        </svg>
        Sending...
      `;
    }

    // Simulate form submission
    setTimeout(() => {
      if (formContent) formContent.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';

      // Reset form
      form.reset();

      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Send Message
        `;
      }

      // Hide success message after 5 seconds and show form again
      setTimeout(() => {
        if (formSuccess) formSuccess.style.display = 'none';
        if (formContent) formContent.style.display = 'block';
      }, 5000);
    }, 1500);
  });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Add spinner styles dynamically
 */
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyles);
