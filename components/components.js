/**
 * RankOps Shared Components Loader v2
 * Handles root pages AND /blog/ subfolder pages
 */

(function() {
  'use strict';

  // Detect folder depth
  const path = window.location.pathname;
  const isInBlog = path.includes('/blog/');
  const basePath = isInBlog ? '../' : '';
  const componentsPath = basePath + 'components/';

  // Load component into placeholder
  async function loadComponent(placeholderId, filename) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
      const response = await fetch(componentsPath + filename);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      let html = await response.text();
      
      // Fix internal links for subfolder pages
      if (basePath) {
        // Fix relative links (but not absolute URLs or anchors)
        html = html.replace(
          /href="(?!https?:\/\/|#|mailto:|tel:)([^"]+\.html)/g,
          'href="' + basePath + '\$1'
        );
      }
      
      placeholder.outerHTML = html;
    } catch (err) {
      console.error('Component load error:', err);
    }
  }

  // Initialize hamburger menu
  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll progress bar
  function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(bar, document.body.firstChild);
    }

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    });
  }

  // Active nav link
  function setActiveLink() {
    const currentPage = path.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-links a, .mobile-menu a, #mobileMenu a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPage = href.split('#')[0].split('/').pop();
      
      if (linkPage === currentPage || 
          (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // Navbar scroll effect
  function initNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Main init
  async function init() {
    await Promise.all([
      loadComponent('nav-placeholder', 'nav.html'),
      loadComponent('footer-placeholder', 'footer.html')
    ]);

    initHamburger();
    initScrollProgress();
    setActiveLink();
    initNavScroll();

    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();