/**
 * Anant Interiors — Studio Portfolio Script
 * Location: Jaipur, Rajasthan, India
 * 
 * Clean, lightweight vanilla JavaScript handling:
 * - Responsive mobile navigation drawer
 * - Sticky header state & active section highlighting
 * - Project gallery interactive category filtering
 * - Interactive project lightbox preview
 * - Client-side contact form validation & success state
 * - WhatsApp enquiry redirection
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGalleryFilters();
  initGalleryLightbox();
  initContactForm();
  initSmoothScroll();
  initImageFallbacks();
});

/* ==========================================================================
   0. Resilient Image Fallback Handler
   ========================================================================== */
function initImageFallbacks() {
  const fallbackUrl = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      if (img.src !== fallbackUrl) {
        img.src = fallbackUrl;
      }
    });
  });
}

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll appearance
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Drawer Toggle
  const toggleDrawer = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('is-open');
    if (shouldOpen) {
      mobileDrawer.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    } else {
      mobileDrawer.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => toggleDrawer());

    // Close when clicking outside content area
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleDrawer(false);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });

    // Close drawer when any mobile nav link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleDrawer(false);
      });
    });
  }

  // Active section indicator on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update desktop links
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update mobile links
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));
}

/* ==========================================================================
   2. Project Gallery Filters
   ========================================================================== */
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterButtons.length || !galleryItems.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetFilter = button.getAttribute('data-filter');

      // Update active button styling
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter gallery cards
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (targetFilter === 'all' || category === targetFilter) {
          item.style.display = 'block';
          // trigger subtle fade
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
          }, 30);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Project Lightbox Preview
   ========================================================================== */
function initGalleryLightbox() {
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightboxModal || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Prevent opening if clicking an interactive sub-link
      const img = item.querySelector('.gallery-img');
      const title = item.querySelector('.gallery-title');
      const category = item.querySelector('.gallery-category');

      if (img && title && category) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title.textContent.trim();
        lightboxTitle.textContent = title.textContent.trim();
        lightboxCategory.textContent = category.textContent.trim();

        lightboxModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   4. Contact Form Validation & Friendly Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('projectForm');
  const successMessage = document.getElementById('formSuccessMessage');
  const resetBtn = document.getElementById('resetFormBtn');
  const dynamicWhatsAppBtn = document.getElementById('dynamicWhatsAppBtn');

  if (!form) return;

  const validateField = (input, validator, errorMsg) => {
    const parentGroup = input.closest('.form-group');
    const errorElem = parentGroup.querySelector('.form-field-error');
    const isValid = validator(input.value.trim());

    if (!isValid) {
      parentGroup.classList.add('has-error');
      if (errorElem) errorElem.textContent = errorMsg;
      return false;
    } else {
      parentGroup.classList.remove('has-error');
      if (errorElem) errorElem.textContent = '';
      return true;
    }
  };

  const nameInput = document.getElementById('userName');
  const phoneInput = document.getElementById('userPhone');
  const emailInput = document.getElementById('userEmail');
  const projectTypeSelect = document.getElementById('projectType');
  const messageInput = document.getElementById('userMessage');

  // Input event clear errors
  [nameInput, phoneInput, emailInput, projectTypeSelect, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => {
        const parent = field.closest('.form-group');
        if (parent) parent.classList.remove('has-error');
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate Name
    if (!validateField(nameInput, val => val.length >= 2, 'Please provide your full name.')) {
      isFormValid = false;
    }

    // Validate Phone (digits and common phone formatting)
    if (!validateField(phoneInput, val => val.replace(/[^0-9]/g, '').length >= 10, 'Please enter a valid 10-digit phone number.')) {
      isFormValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validateField(emailInput, val => emailRegex.test(val), 'Please enter a valid email address.')) {
      isFormValid = false;
    }

    // Validate Project Type
    if (!validateField(projectTypeSelect, val => val !== '', 'Please select your project space type.')) {
      isFormValid = false;
    }

    // Validate Message
    if (!validateField(messageInput, val => val.length >= 10, 'Please briefly describe your space (at least 10 characters).')) {
      isFormValid = false;
    }

    if (isFormValid) {
      const clientName = nameInput.value.trim();
      const projectType = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;

      // Update dynamic WhatsApp link in the success message
      if (dynamicWhatsAppBtn) {
        const textPayload = encodeURIComponent(
          `Hi Anant Interiors, my name is ${clientName}. I just submitted an enquiry for a ${projectType} project and would like to discuss details.`
        );
        dynamicWhatsAppBtn.href = `https://wa.me/919876543210?text=${textPayload}`;
      }

      // Hide form card, reveal friendly success block
      form.style.display = 'none';
      if (successMessage) {
        successMessage.classList.add('is-visible');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Reset enquiry button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (successMessage) {
        successMessage.classList.remove('is-visible');
      }
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* ==========================================================================
   5. Smooth Scroll Fallback & Link Focus
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
