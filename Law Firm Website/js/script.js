/**
 * CALDWELL & PARTNERS — Premium Law Firm
 * Main JavaScript | js/script.js
 * Author: Senior Frontend Engineer
 * Version: 1.0.0
 *
 * Table of Contents:
 * 01. Strict Mode & Module Setup
 * 02. Utility Functions
 * 03. Loader / Preloader
 * 04. Navigation (sticky, mobile menu)
 * 05. Theme Toggle (dark / light)
 * 06. Smooth Scroll
 * 07. Scroll Animations (Intersection Observer)
 * 08. Counter Animation
 * 09. Testimonials Slider
 * 10. FAQ Accordion
 * 11. Contact Form (validation + XSS prevention)
 * 12. Pricing Toggle (monthly / yearly)
 * 13. Back to Top Button
 * 14. Ripple Effect
 * 15. Keyboard Navigation (trap in mobile menu)
 * 16. Blog Filter Buttons
 * 17. Init
 * — Premium Effects v2.0 —
 * 18. Reading Progress Bar
 * 19. Cursor Glow + Trail
 * 20. Hero Blobs (parallax)
 * 21. Page Transitions
 * 22. Progressive Images (lazy load)
 * 23. Parallax Hero
 * 24. Magnetic Buttons
 * 25. Highlights Slider
 * 26. Chat Widget
 * 27. Command Palette (Ctrl+K)
 */

'use strict';

/* ==================================================
   01. STRICT MODE & CONSTANTS
   ================================================== */
const APP = {
  // Selectors
  sel: {
    loader:         '.loader',
    navbar:         '.navbar',
    hamburger:      '.hamburger',
    mobileMenu:     '.mobile-menu',
    menuOverlay:    '.menu-overlay',
    mobileLink:     '.mobile-menu__link',
    themeToggle:    '.theme-toggle',
    backToTop:      '.back-to-top',
    revealEls:      '[data-reveal]',
    counters:       '[data-counter]',
    faqItem:        '.faq-item',
    faqQuestion:    '.faq-item__question',
    testimonialTrack: '.testimonials__track',
    testimonialSlide: '.testimonial-slide',
    testimonialDots:  '.testimonials__dots',
    testimonialPrev:  '.testimonials__prev',
    testimonialNext:  '.testimonials__next',
    contactForm:    '#contact-form',
    pricingToggle:  '.toggle-switch',
    pricingAmounts: '[data-monthly][data-yearly]',
  },
  // Storage key
  themeKey: 'cp_theme',
};


/* ==================================================
   02. UTILITY FUNCTIONS
   ================================================== */

/**
 * Query selector shorthand
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {Element|null}
 */
function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Query selector all shorthand
 * @param {string} selector
 * @param {Element} [context=document]
 * @returns {NodeList}
 */
function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Sanitize a string to prevent XSS.
 * Converts dangerous characters to HTML entities.
 * @param {string} input
 * @returns {string}
 */
function sanitize(input) {
  if (typeof input !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return input.replace(/[&<>"'`=/]/g, (char) => map[char] || char);
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

/**
 * Validate phone number (international friendly)
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,8}$/;
  return pattern.test(phone.replace(/\s/g, ''));
}

/**
 * Debounce a function call
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Set a DOM element's text safely (no innerHTML)
 * @param {Element} el
 * @param {string} text
 */
function setTextSafe(el, text) {
  if (!el) return;
  el.textContent = sanitize(text);
}

/**
 * Show a field error
 * @param {Element} group - .form-group element
 * @param {string} message
 */
function showFieldError(group, message) {
  group.classList.add('has-error');
  const control = group.querySelector('.form-control');
  const error   = group.querySelector('.form-error span') || group.querySelector('.form-error');
  if (control) control.classList.add('has-error');
  if (error)   error.textContent = sanitize(message);
}

/**
 * Clear a field error
 * @param {Element} group
 */
function clearFieldError(group) {
  group.classList.remove('has-error');
  const control = group.querySelector('.form-control');
  if (control) control.classList.remove('has-error');
}

/**
 * Mark field as valid
 * @param {Element} group
 */
function showFieldSuccess(group) {
  clearFieldError(group);
  const control = group.querySelector('.form-control');
  if (control) control.classList.add('has-success');
}


/* ==================================================
   03. LOADER / PRELOADER
   ================================================== */
function initLoader() {
  const loader = $(APP.sel.loader);
  if (!loader) return;

  // Prevent scroll during load
  document.body.classList.add('is-loading');

  const hideLoader = () => {
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
  };

  // Hide after window load + small delay for polish
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 400);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 400), { once: true });
  }

  // Safety fallback — never block the page
  setTimeout(hideLoader, 3500);
}


/* ==================================================
   04. NAVIGATION
   ================================================== */
function initNavigation() {
  const navbar      = $(APP.sel.navbar);
  const hamburger   = $(APP.sel.hamburger);
  const mobileMenu  = $(APP.sel.mobileMenu);
  const overlay     = $(APP.sel.menuOverlay);
  const mobileLinks = $$(APP.sel.mobileLink);

  if (!navbar) return;

  // --- Sticky scroll behavior ---
  const handleScroll = debounce(() => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('navbar--scrolled', scrolled);
  }, 10);

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on init

  // --- Mark active nav link based on current page ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = $$(`.navbar__link, ${APP.sel.mobileLink}`);
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href === `./${currentPath}`)) {
      link.classList.add('is-active');
    }
  });

  // --- Mobile menu toggle ---
  if (!hamburger || !mobileMenu || !overlay) return;

  const openMenu = () => {
    hamburger.classList.add('is-active');
    mobileMenu.classList.add('is-open');
    overlay.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first link in menu
    const firstLink = mobileMenu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  };

  const closeMenu = () => {
    hamburger.classList.remove('is-active');
    mobileMenu.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.focus();
  };

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}


/* ==================================================
   05. THEME TOGGLE (Dark / Light)
   ================================================== */
function initThemeToggle() {
  const toggleBtns = $$(APP.sel.themeToggle);
  if (!toggleBtns.length) return;

  // Retrieve saved theme; default to dark (site is dark-first)
  const savedTheme = localStorage.getItem(APP.themeKey);
  const initialTheme = savedTheme || 'dark';

  applyTheme(initialTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(APP.themeKey, newTheme);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }
}


/* ==================================================
   06. SMOOTH SCROLL
   ================================================== */
function initSmoothScroll() {
  // Handle anchor links that point to sections on the same page
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navbarHeight = $(APP.sel.navbar)?.offsetHeight || 80;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  });
}


/* ==================================================
   07. SCROLL ANIMATIONS (Intersection Observer)
   ================================================== */
function initScrollAnimations() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements
    $$('.reveal, .reveal-left, .reveal-right').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  $$('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}


/* ==================================================
   08. COUNTER ANIMATION
   ================================================== */
function initCounters() {
  const counterEls = $$('[data-counter]');
  if (!counterEls.length) return;

  if (!('IntersectionObserver' in window)) {
    counterEls.forEach(el => {
      const target = parseFloat(el.getAttribute('data-counter'));
      el.textContent = target % 1 === 0 ? target.toFixed(0) : target.toFixed(1);
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      const isDecimal = target % 1 !== 0;

      observer.unobserve(el);

      const animate = (currentTime) => {
        const elapsed  = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        // Update text safely (no innerHTML)
        el.textContent = isDecimal
          ? current.toFixed(1) + suffix
          : Math.floor(current).toFixed(0) + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = (isDecimal ? target.toFixed(1) : target.toFixed(0)) + suffix;
        }
      };

      requestAnimationFrame(animate);
    });
  }, { threshold: 0.3 });

  counterEls.forEach(el => observer.observe(el));
}


/* ==================================================
   09. TESTIMONIALS SLIDER
   ================================================== */
function initTestimonialsSlider() {
  const track    = $(APP.sel.testimonialTrack);
  const slides   = $$(APP.sel.testimonialSlide);
  const dotsWrap = $(APP.sel.testimonialDots);
  const prevBtn  = $(APP.sel.testimonialPrev);
  const nextBtn  = $(APP.sel.testimonialNext);

  if (!track || slides.length < 2) return;

  let currentIndex = 0;
  let autoplayTimer;
  const autoplayDelay = 6000;

  // Build dots
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot';
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index) {
    // Clamp index
    const newIndex = ((index % slides.length) + slides.length) % slides.length;

    slides[currentIndex].classList.remove('is-active');
    currentIndex = newIndex;
    slides[currentIndex].classList.add('is-active');

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    if (dotsWrap) {
      $$('.testimonials__dot', dotsWrap).forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  // Keyboard navigation on slider
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
    if (e.key === 'ArrowLeft')  { prev(); resetAutoplay(); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
      resetAutoplay();
    }
  }, { passive: true });

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(next, autoplayDelay);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Pause on hover/focus
  const section = track.closest('.testimonials');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    section.addEventListener('mouseleave', startAutoplay);
    section.addEventListener('focusin',    () => clearInterval(autoplayTimer));
    section.addEventListener('focusout',   startAutoplay);
  }

  // Initialize first slide
  goTo(0);
  startAutoplay();
}


/* ==================================================
   10. FAQ ACCORDION
   ================================================== */
function initFAQ() {
  const faqItems = $$(APP.sel.faqItem);
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector(APP.sel.faqQuestion);
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all others (accordion behavior)
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          const q = other.querySelector(APP.sel.faqQuestion);
          if (q) q.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });

    // Keyboard: toggle on Enter/Space
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}


/* ==================================================
   11. CONTACT FORM
   ================================================== */
function initContactForm() {
  const form = $(APP.sel.contactForm);
  if (!form) return;

  const successEl = form.closest('.contact-form-container')?.querySelector('.contact-form__success')
    || form.parentElement?.querySelector('.contact-form__success');

  // Live validation: clear error on input
  $$('.form-control', form).forEach(control => {
    control.addEventListener('input', () => {
      const group = control.closest('.form-group');
      if (group) {
        clearFieldError(group);
        control.classList.remove('has-success');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      submitForm(form, successEl);
    }
  });
}

/**
 * Validate all form fields
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
function validateForm(form) {
  let isValid = true;

  // Get all form groups
  const groups = $$('.form-group', form);

  groups.forEach(group => {
    const control  = group.querySelector('.form-control');
    if (!control) return;

    const value    = control.value.trim();
    const name     = control.name;
    const required = control.hasAttribute('required');
    const type     = control.type;

    clearFieldError(group);

    // Required field check
    if (required && !value) {
      showFieldError(group, 'This field is required.');
      isValid = false;
      return;
    }

    if (!value) return; // Optional field, skip further checks

    // Email validation
    if (type === 'email' || name === 'email') {
      if (!isValidEmail(value)) {
        showFieldError(group, 'Please enter a valid email address.');
        isValid = false;
        return;
      }
    }

    // Phone validation (optional but if filled must be valid)
    if (type === 'tel' || name === 'phone') {
      if (!isValidPhone(value)) {
        showFieldError(group, 'Please enter a valid phone number.');
        isValid = false;
        return;
      }
    }

    // Min length for messages
    if (name === 'message' && value.length < 10) {
      showFieldError(group, 'Message must be at least 10 characters.');
      isValid = false;
      return;
    }

    // Name minimum length
    if ((name === 'name' || name === 'first_name' || name === 'last_name') && value.length < 2) {
      showFieldError(group, 'Name must be at least 2 characters.');
      isValid = false;
      return;
    }

    // Max length check (prevent huge submissions)
    if (value.length > 2000) {
      showFieldError(group, 'Input is too long (max 2000 characters).');
      isValid = false;
      return;
    }

    showFieldSuccess(group);
  });

  // Privacy checkbox check
  const privacyCheck = form.querySelector('[name="privacy"]');
  if (privacyCheck && !privacyCheck.checked) {
    // Show an accessible error
    const privacyGroup = privacyCheck.closest('.form-group') || privacyCheck.closest('.form-check')?.parentElement;
    if (privacyGroup) showFieldError(privacyGroup, 'You must agree to the privacy policy.');
    isValid = false;
  }

  return isValid;
}

/**
 * Simulate form submission (demo mode)
 * In production, replace with actual fetch/XHR call
 * @param {HTMLFormElement} form
 * @param {Element|null} successEl
 */
function submitForm(form, successEl) {
  const submitBtn = form.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
  }

  // Simulate network delay
  setTimeout(() => {
    form.style.display = 'none';
    if (successEl) {
      successEl.classList.add('is-visible');
      successEl.focus();
    }
    // Re-enable button (in case user navigates back)
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  }, 1200);
}


/* ==================================================
   12. PRICING TOGGLE (Monthly / Yearly)
   ================================================== */
function initPricingToggle() {
  const toggle   = $(APP.sel.pricingToggle);
  const amounts  = $$(APP.sel.pricingAmounts);

  if (!toggle || !amounts.length) return;

  let isYearly = false;

  toggle.addEventListener('click', () => {
    isYearly = !isYearly;
    toggle.classList.toggle('is-on', isYearly);
    toggle.setAttribute('aria-checked', String(isYearly));

    // Update price labels
    const monthlyLabel = toggle.closest('.pricing__toggle')?.querySelector('[data-plan="monthly"]');
    const yearlyLabel  = toggle.closest('.pricing__toggle')?.querySelector('[data-plan="yearly"]');

    if (monthlyLabel) monthlyLabel.classList.toggle('is-active', !isYearly);
    if (yearlyLabel)  yearlyLabel.classList.toggle('is-active',  isYearly);

    // Animate price changes
    amounts.forEach(amountEl => {
      const monthly = amountEl.getAttribute('data-monthly');
      const yearly  = amountEl.getAttribute('data-yearly');
      const value   = isYearly ? yearly : monthly;

      // Fade out, update, fade in
      amountEl.style.opacity = '0';
      amountEl.style.transform = 'translateY(-8px)';
      amountEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

      setTimeout(() => {
        amountEl.textContent = value || amountEl.textContent;
        amountEl.style.opacity = '1';
        amountEl.style.transform = 'translateY(0)';
      }, 200);
    });
  });
}


/* ==================================================
   13. BACK TO TOP BUTTON
   ================================================== */
function initBackToTop() {
  const btn = $(APP.sel.backToTop);
  if (!btn) return;

  const handleScroll = debounce(() => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, 50);

  window.addEventListener('scroll', handleScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ==================================================
   14. RIPPLE EFFECT
   ================================================== */
function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    // Use safe style assignment (no innerHTML)
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    btn.appendChild(ripple);

    // Clean up after animation
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
}


/* ==================================================
   15. KEYBOARD NAVIGATION (Focus Trap in Mobile Menu)
   ================================================== */
function initKeyboardNav() {
  const mobileMenu = $(APP.sel.mobileMenu);
  if (!mobileMenu) return;

  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (!mobileMenu.classList.contains('is-open')) return;

    // Collect all focusable elements in the menu
    const focusable = Array.from(
      mobileMenu.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.disabled && el.offsetParent !== null);

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}


/* ==================================================
   16. NEWSLETTER FORM (Footer)
   ================================================== */
function initNewsletterForm() {
  const forms = $$('.footer__newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.footer__newsletter-input');
      if (!input) return;

      const email = input.value.trim();
      if (!isValidEmail(email)) {
        input.focus();
        input.style.borderColor = 'var(--clr-error)';
        setTimeout(() => (input.style.borderColor = ''), 2000);
        return;
      }

      // Success feedback
      input.value = '';
      const btn = form.querySelector('.btn');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Subscribed!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 3000);
      }
    });
  });
}


/* ==================================================
   17. BLOG FILTER BUTTONS
   ================================================== */
function initBlogFilters() {
  const filterBtns = $$('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // In a real project, you'd filter visible cards here
      // For demo, just show active state
    });
  });
}


/* ==================================================
   INIT — Run all modules when DOM is ready
   ================================================== */
function init() {
  initLoader();
  initNavigation();
  initThemeToggle();
  initSmoothScroll();
  initScrollAnimations();
  initCounters();
  initTestimonialsSlider();
  initFAQ();
  initContactForm();
  initPricingToggle();
  initBackToTop();
  initRippleEffect();
  initKeyboardNav();
  initNewsletterForm();
  initBlogFilters();
  // Premium effects v2.0
  initProgressBar();
  initCursorEffects();
  initHeroBlobs();
  initPageTransitions();
  initProgressiveImages();
  initParallaxHero();
  initMagneticButtons();
  initHighlightsSlider();
  initChatWidget();
  initCommandPalette();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


/* ==================================================
   17. READING PROGRESS BAR
   ================================================== */
function initProgressBar() {
  // Inject bar element
  const bar = document.createElement('div');
  bar.id = 'progress-bar';
  const fill = document.createElement('span');
  fill.id = 'progress-bar-fill';
  bar.appendChild(fill);
  document.body.prepend(bar);

  let rafId = null;
  let current = 0;

  const update = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) { bar.classList.add('is-hidden'); return; }
    bar.classList.remove('is-hidden');
    const target = scrollTop / docHeight;
    // Smooth lerp toward target
    current += (target - current) * 0.18;
    fill.style.transform = `scaleX(${current})`;
    rafId = requestAnimationFrame(update);
  };

  const onScroll = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}


/* ==================================================
   18. CURSOR GLOW + CURSOR TRAIL
   ================================================== */
function initCursorEffects() {
  // Skip touch-only devices
  if (!window.matchMedia('(pointer: fine)').matches) return;
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Inject elements
  const glow  = document.createElement('div'); glow.id  = 'cursor-glow';
  const trail = document.createElement('div'); trail.id = 'cursor-trail';
  document.body.append(glow, trail);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let trailX = 0, trailY = 0;
  let isMoving = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    document.body.classList.add('cursor-active');
    isMoving = true;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
  });

  const animate = () => {
    // Glow: slow lerp
    glowX += (mouseX - glowX) * 0.06;
    glowY += (mouseY - glowY) * 0.06;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%) translateZ(0)`;

    // Trail: faster lerp
    trailX += (mouseX - trailX) * 0.14;
    trailY += (mouseY - trailY) * 0.14;
    trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%) translateZ(0)`;

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}


/* ==================================================
   19. HERO BLOBS (parallax via scroll)
   ================================================== */
function initHeroBlobs() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const blobs = $$('.hero__blob');
  if (!blobs.length) return;

  const speeds = [0.04, -0.03, 0.06]; // parallax multipliers per blob
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      blobs.forEach((blob, i) => {
        const speed = speeds[i] ?? 0.04;
        blob.style.setProperty('--blob-sy', `${sy * speed}px`);
      });
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ==================================================
   20. PAGE TRANSITIONS
   ================================================== */
function initPageTransitions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cover = document.createElement('div');
  cover.className = 'page-transition-cover';
  document.body.appendChild(cover);

  // Preload on link hover
  const preloadCache = new Set();
  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.href;
    if (!href || href.includes('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;
    if (preloadCache.has(href)) return;
    preloadCache.add(href);
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.href = href;
    document.head.appendChild(prefetch);
  }, { passive: true });

  // Fade-out on internal link click
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.href;
    if (!href || href.includes('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank') return;
    // Same origin only
    try {
      const url = new URL(href);
      if (url.origin !== location.origin) return;
    } catch { return; }

    e.preventDefault();
    cover.classList.add('is-active');
    setTimeout(() => { window.location.href = href; }, 330);
  });

  // Fade-in on page load
  cover.classList.add('is-active');
  window.addEventListener('load', () => {
    requestAnimationFrame(() => {
      cover.classList.remove('is-active');
    });
  }, { once: true });
  // Immediate fallback
  requestAnimationFrame(() => cover.classList.remove('is-active'));
}


/* ==================================================
   21. PROGRESSIVE IMAGE LOADING
   ================================================== */
function initProgressiveImages() {
  const imgs = $$('img.img-lazy, img[data-src]');
  if (!imgs.length) return;

  if (!('IntersectionObserver' in window)) {
    imgs.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      img.classList.add('is-loaded');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      observer.unobserve(img);
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.addEventListener('load', () => {
        img.classList.add('is-loaded');
        const placeholder = img.closest('.img-lazy-wrap')?.querySelector('.img-lazy-placeholder');
        if (placeholder) placeholder.classList.add('is-hidden');
      }, { once: true });
      // Already loaded (cached)
      if (img.complete) {
        img.classList.add('is-loaded');
      }
    });
  }, { rootMargin: '200px 0px' });

  imgs.forEach(img => observer.observe(img));
}


/* ==================================================
   22. PARALLAX HERO
   ================================================== */
function initParallaxHero() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const visual  = $('.hero__visual');
  const content = $('.hero__content');
  if (!visual && !content) return;

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      if (visual)  visual.style.transform  = `translateY(${sy * 0.18}px) translateZ(0)`;
      if (content) content.style.transform = `translateY(${sy * 0.08}px) translateZ(0)`;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ==================================================
   23. MAGNETIC BUTTONS
   ================================================== */
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const btns = $$('.btn--primary, .btn--outline, .btn--dark');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.28;
      const dy     = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { btn.style.transition = ''; }, 450);
    });
  });
}


/* ==================================================
   24. PRACTICE HIGHLIGHTS SLIDER (Landing Page)
   ================================================== */
function initHighlightsSlider() {
  const track   = $('.highlights-track');
  if (!track) return;

  const slides   = $$('.highlight-slide', track.parentElement || track.closest('.highlights-slider'));
  const dotsWrap = $('.highlights-slider__dots');
  const prevBtn  = $('.highlights-slider__btn--prev');
  const nextBtn  = $('.highlights-slider__btn--next');

  if (!slides.length) return;

  let current = 0;
  let timer;
  const DELAY = 5000;

  // Build dots
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'highlights-slider__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsWrap.appendChild(dot);
    });
  }

  const goTo = (idx) => {
    current = ((idx % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    $$('.highlights-slider__dot', dotsWrap).forEach((d, i) => d.classList.toggle('is-active', i === current));
  };

  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });

  // Touch swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 45) { goTo(current + (dx < 0 ? 1 : -1)); resetTimer(); }
  }, { passive: true });

  // Autoplay
  const startTimer = () => { timer = setInterval(() => goTo(current + 1), DELAY); };
  const resetTimer = () => { clearInterval(timer); startTimer(); };
  const slider = track.closest('.highlights-slider');
  if (slider) {
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', startTimer);
  }

  goTo(0);
  startTimer();
}


/* ==================================================
   25. CHAT WIDGET
   ================================================== */
function initChatWidget() {
  // Inject HTML
  const widget = document.createElement('div');
  widget.id = 'chat-widget';
  widget.setAttribute('aria-label', 'Live chat support');
  widget.innerHTML = `
    <div class="chat-widget__panel" id="chat-panel" aria-hidden="true" role="dialog" aria-labelledby="chat-title">
      <div class="chat-widget__head">
        <div class="chat-widget__avatar" aria-hidden="true">C&P</div>
        <div class="chat-widget__head-info">
          <div class="chat-widget__head-name">Caldwell &amp; Partners</div>
          <div class="chat-widget__head-status">Online now</div>
        </div>
        <button class="chat-widget__head-close" aria-label="Close chat" id="chat-close">&times;</button>
      </div>
      <div class="chat-widget__body">
        <div class="chat-widget__greeting" id="chat-title">Need Help?</div>
        <div class="chat-widget__sub">We reply within 5 minutes.<br>How can we assist you today?</div>
        <div class="chat-widget__actions">
          <a class="chat-widget__action" href="contact.html">
            <span class="chat-widget__action-icon"><svg aria-hidden="true" focusable="false"><use href="assets/icons.svg#icon-send"/></svg></span>
            Send us a message
          </a>
          <a class="chat-widget__action" href="tel:+12128472920">
            <span class="chat-widget__action-icon"><svg aria-hidden="true" focusable="false"><use href="assets/icons.svg#icon-phone"/></svg></span>
            Call +1 (212) 847-2920
          </a>
          <a class="chat-widget__action" href="contact.html#contact-form">
            <span class="chat-widget__action-icon"><svg aria-hidden="true" focusable="false"><use href="assets/icons.svg#icon-calendar"/></svg></span>
            Book a free consultation
          </a>
        </div>
      </div>
      <div class="chat-widget__foot">🔒 Confidential &amp; attorney-client protected</div>
    </div>
    <button class="chat-widget__toggle" aria-label="Open support chat" aria-expanded="false" aria-controls="chat-panel" type="button">
      <span class="chat-online-dot" aria-hidden="true"></span>
      <svg class="icon-chat" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
      <svg class="icon-x" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;
  document.body.appendChild(widget);

  const toggleBtn = widget.querySelector('.chat-widget__toggle');
  const panel     = widget.querySelector('.chat-widget__panel');
  const closeBtn  = widget.querySelector('#chat-close');

  const open  = () => { panel.classList.add('is-open'); toggleBtn.classList.add('is-open'); toggleBtn.setAttribute('aria-expanded', 'true'); panel.setAttribute('aria-hidden', 'false'); closeBtn?.focus(); };
  const close = () => { panel.classList.remove('is-open'); toggleBtn.classList.remove('is-open'); toggleBtn.setAttribute('aria-expanded', 'false'); panel.setAttribute('aria-hidden', 'true'); toggleBtn.focus(); };

  toggleBtn.addEventListener('click', () => panel.classList.contains('is-open') ? close() : open());
  closeBtn?.addEventListener('click', close);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
  });
}


/* ==================================================
   26. COMMAND PALETTE (Ctrl+K)
   ================================================== */
function initCommandPalette() {
  // Command data
  const COMMANDS = [
    { group: 'Navigate', icon: '🏠', title: 'Home',          desc: 'Go to homepage',                    href: 'index.html',          badge: '' },
    { group: 'Navigate', icon: '⚖️', title: 'About Us',      desc: 'Our story and values',              href: 'about.html',          badge: '' },
    { group: 'Navigate', icon: '📋', title: 'Practice Areas',desc: 'All legal services',                href: 'practice-areas.html', badge: '' },
    { group: 'Navigate', icon: '👤', title: 'Our Attorneys',  desc: 'Meet our legal team',               href: 'attorneys.html',      badge: '' },
    { group: 'Navigate', icon: '📰', title: 'Legal Insights', desc: 'Blog and legal resources',          href: 'blog.html',           badge: '' },
    { group: 'Navigate', icon: '✉️', title: 'Contact',        desc: 'Get in touch with us',              href: 'contact.html',        badge: '' },
    { group: 'Actions',  icon: '🗓️', title: 'Book Consultation', desc: 'Free 30-min legal consultation', href: 'contact.html',        badge: 'Free' },
    { group: 'Actions',  icon: '📞', title: 'Call Us',        desc: '+1 (212) 847-2920',                 href: 'tel:+12128472920',    badge: '' },
    { group: 'Actions',  icon: '📧', title: 'Email Us',       desc: 'contact@caldwellpartners.com',      href: 'mailto:contact@caldwellpartners.com', badge: '' },
    { group: 'Practice', icon: '🏢', title: 'Corporate Law',  desc: 'M&A, contracts, governance',        href: 'practice-areas.html', badge: '' },
    { group: 'Practice', icon: '🛡️', title: 'Criminal Defense',desc: 'Felony, misdemeanor, DUI',        href: 'practice-areas.html', badge: '' },
    { group: 'Practice', icon: '🏡', title: 'Family Law',     desc: 'Divorce, custody, adoption',        href: 'practice-areas.html', badge: '' },
    { group: 'Practice', icon: '🏗️', title: 'Real Estate',    desc: 'Transactions, disputes, zoning',   href: 'practice-areas.html', badge: '' },
    { group: 'Practice', icon: '💡', title: 'IP Law',         desc: 'Patents, trademarks, copyright',    href: 'practice-areas.html', badge: '' },
    { group: 'Practice', icon: '⚕️', title: 'Personal Injury',desc: 'Accidents, negligence',             href: 'practice-areas.html', badge: '' },
  ];

  // Inject overlay + palette
  const overlay = document.createElement('div');
  overlay.id = 'cmd-overlay';
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Command palette');
  overlay.innerHTML = `
    <div id="cmd-palette">
      <div class="cmd__search-row">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input id="cmd-search" type="text" placeholder="Search pages, practice areas, actions…" autocomplete="off" spellcheck="false" aria-label="Command search" aria-autocomplete="list" aria-controls="cmd-list" role="combobox" aria-expanded="true"/>
        <span class="cmd__esc">Esc</span>
      </div>
      <div class="cmd__results" id="cmd-list" role="listbox">
        <!-- rendered by JS -->
      </div>
      <div class="cmd__empty" id="cmd-empty">No results for your search.</div>
      <div class="cmd__footer">
        <span><kbd>↑↓</kbd> navigate</span>
        <span><kbd>↵</kbd> select</span>
        <span><kbd>Esc</kbd> close</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input   = overlay.querySelector('#cmd-search');
  const list    = overlay.querySelector('#cmd-list');
  const empty   = overlay.querySelector('#cmd-empty');
  let selected  = 0;
  let visible   = [];

  // Fuzzy score: returns 0-1; higher = better match
  const fuzzyScore = (str, query) => {
    if (!query) return 1;
    str = str.toLowerCase(); query = query.toLowerCase();
    if (str.includes(query)) return 1;
    let score = 0, qi = 0;
    for (let i = 0; i < str.length && qi < query.length; i++) {
      if (str[i] === query[qi]) { score++; qi++; }
    }
    return qi === query.length ? score / str.length : 0;
  };

  const render = (query = '') => {
    const q = query.trim();
    const groups = {};

    COMMANDS.forEach(cmd => {
      const score = Math.max(
        fuzzyScore(cmd.title, q),
        fuzzyScore(cmd.desc, q),
        fuzzyScore(cmd.group, q)
      );
      if (q && score === 0) return;
      if (!groups[cmd.group]) groups[cmd.group] = [];
      groups[cmd.group].push({ ...cmd, score });
    });

    list.innerHTML = '';
    visible = [];

    Object.entries(groups).forEach(([group, cmds]) => {
      const label = document.createElement('div');
      label.className = 'cmd__group-label';
      label.textContent = group;
      list.appendChild(label);

      cmds.forEach(cmd => {
        visible.push(cmd);
        const idx = visible.length - 1;
        const el  = document.createElement('a');
        el.className   = 'cmd__item';
        el.href        = cmd.href;
        el.role        = 'option';
        el.dataset.idx = idx;
        el.innerHTML   = `
          <span class="cmd__item-icon">${cmd.icon}</span>
          <span class="cmd__item-body">
            <span class="cmd__item-title">${cmd.title}</span>
            <span class="cmd__item-desc">${cmd.desc}</span>
          </span>
          ${cmd.badge ? `<span class="cmd__item-badge">${cmd.badge}</span>` : ''}
        `;
        el.addEventListener('click', (e) => {
          if (cmd.href.startsWith('tel:') || cmd.href.startsWith('mailto:')) return;
          e.preventDefault();
          close();
          setTimeout(() => { window.location.href = cmd.href; }, 80);
        });
        el.addEventListener('mousemove', () => setSelected(idx));
        list.appendChild(el);
      });
    });

    empty.style.display = visible.length ? 'none' : 'block';
    setSelected(0);
  };

  const setSelected = (idx) => {
    selected = Math.max(0, Math.min(idx, visible.length - 1));
    $$('.cmd__item', list).forEach((el, i) => {
      el.classList.toggle('is-selected', i === selected);
      if (i === selected) el.scrollIntoView({ block: 'nearest' });
    });
  };

  const open = () => {
    overlay.classList.add('is-open');
    input.value = '';
    render('');
    input.focus();
  };

  const close = () => {
    overlay.classList.remove('is-open');
  };

  // Ctrl+K / Cmd+K trigger
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      overlay.classList.contains('is-open') ? close() : open();
    }
  });

  // Keyboard navigation inside palette
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(selected + 1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(selected - 1); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const cur = visible[selected];
      if (!cur) return;
      close();
      setTimeout(() => { window.location.href = cur.href; }, 80);
    }
  });

  // Click outside closes
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Live search
  input.addEventListener('input', () => render(input.value));

  // Add Ctrl+K hint to navbar
  const navActions = $('.navbar__actions');
  if (navActions) {
    const hint = document.createElement('button');
    hint.className = 'navbar__cmd-hint';
    hint.type = 'button';
    hint.setAttribute('aria-label', 'Open command palette (Ctrl+K)');
    hint.innerHTML = 'Search <kbd>Ctrl K</kbd>';
    hint.addEventListener('click', open);
    navActions.insertBefore(hint, navActions.firstChild);
  }
}
