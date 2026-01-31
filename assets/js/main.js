/* ========================================
   Left Unattended - Main JavaScript
   ======================================== */

// Mobile Navigation Toggle
(function() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });

    // Close nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
      }
    });

    // Close nav when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mainNav.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        navToggle.focus();
      }
    });
  }
})();

// Lightbox functionality
(function() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  // Open lightbox
  function openLightbox(images, index) {
    currentImages = images;
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Update displayed image
  function updateLightboxImage() {
    if (currentImages.length > 0) {
      lightboxImg.src = currentImages[currentIndex].src;
      lightboxImg.alt = currentImages[currentIndex].alt || '';
    }
  }

  // Navigate to previous image
  function prevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
  }

  // Navigate to next image
  function nextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
  }

  // Event listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);

  // Close on backdrop click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });

  // Expose openLightbox globally for gallery items
  window.openLightbox = openLightbox;
})();

// Gallery item click handlers
(function() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length === 0) return;

  // Get all visible gallery images
  function getVisibleImages() {
    const items = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
    return Array.from(items).map(item => {
      const img = item.querySelector('img');
      return {
        src: img.dataset.fullSrc || img.src,
        alt: img.alt
      };
    });
  }

  galleryItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
      const visibleImages = getVisibleImages();
      const img = item.querySelector('img');
      const visibleIndex = visibleImages.findIndex(i =>
        i.src === (img.dataset.fullSrc || img.src)
      );
      if (window.openLightbox) {
        window.openLightbox(visibleImages, visibleIndex >= 0 ? visibleIndex : 0);
      }
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
})();

// Filter functionality for comics
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      galleryItems.forEach(function(item) {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();
