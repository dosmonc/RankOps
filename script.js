/* script.js */

// ============================================
// CHARLOTTE NEIGHBORHOODS ARRAY
// ============================================
const charlotteNeighborhoods = [
  { name: "NoDa", slug: "noda", file: "noda-charlotte-nc.html" },
  {
    name: "Plaza Midwood",
    slug: "plaza-midwood",
    file: "plaza-midwood-charlotte-nc.html",
  },
  { name: "Dilworth", slug: "dilworth", file: "dilworth-charlotte-nc.html" },
  { name: "South End", slug: "south-end", file: "south-end-charlotte-nc.html" },
  { name: "Uptown", slug: "uptown", file: "uptown-charlotte-nc.html" },
  {
    name: "Myers Park",
    slug: "myers-park",
    file: "myers-park-charlotte-nc.html",
  },
  { name: "Elizabeth", slug: "elizabeth", file: "elizabeth-charlotte-nc.html" },
  {
    name: "Ballantyne",
    slug: "ballantyne",
    file: "ballantyne-charlotte-nc.html",
  },
  { name: "SouthPark", slug: "southpark", file: "southpark-charlotte-nc.html" },
  { name: "Cotswold", slug: "cotswold", file: "cotswold-charlotte-nc.html" },
  {
    name: "Madison Park",
    slug: "madison-park",
    file: "madison-park-charlotte-nc.html",
  },
  {
    name: "Wesley Heights",
    slug: "wesley-heights",
    file: "wesley-heights-charlotte-nc.html",
  },
  { name: "Belmont", slug: "belmont", file: "belmont-charlotte-nc.html" },
  {
    name: "Villa Heights",
    slug: "villa-heights",
    file: "villa-heights-charlotte-nc.html",
  },
  {
    name: "Optimist Park",
    slug: "optimist-park",
    file: "optimist-park-charlotte-nc.html",
  },
  { name: "Cherry", slug: "cherry", file: "cherry-charlotte-nc.html" },
  { name: "Eastover", slug: "eastover", file: "eastover-charlotte-nc.html" },
  { name: "Foxcroft", slug: "foxcroft", file: "foxcroft-charlotte-nc.html" },
  {
    name: "Quail Hollow",
    slug: "quail-hollow",
    file: "quail-hollow-charlotte-nc.html",
  },
  {
    name: "Steele Creek",
    slug: "steele-creek",
    file: "steele-creek-charlotte-nc.html",
  },
  { name: "Matthews", slug: "matthews", file: "matthews-charlotte-nc.html" },
  { name: "Pineville", slug: "pineville", file: "pineville-charlotte-nc.html" },
  { name: "Mint Hill", slug: "mint-hill", file: "mint-hill-charlotte-nc.html" },
  {
    name: "Huntersville",
    slug: "huntersville",
    file: "huntersville-charlotte-nc.html",
  },
  { name: "Cornelius", slug: "cornelius", file: "cornelius-charlotte-nc.html" },
  { name: "Davidson", slug: "davidson", file: "davidson-charlotte-nc.html" },
  {
    name: "Lake Norman",
    slug: "lake-norman",
    file: "lake-norman-charlotte-nc.html",
  },
  {
    name: "University City",
    slug: "university-city",
    file: "university-city-charlotte-nc.html",
  },
  { name: "Montford", slug: "montford", file: "montford-charlotte-nc.html" },
];

const resourceLinks = [
  { name: "Land CRM", file: "land-crm.html" },
  { name: "AI Class", file: "aiclass.html" },
  { name: "AI Agents", file: "aiagents.html" },
  { name: "Chatbot Demo", file: "chatbot.html" },
  { name: "Terms of Service", file: "terms.html" },
  { name: "Privacy Policy", file: "privacy.html" },
];

// ============================================
// BUILD NEIGHBORHOOD DROPDOWN
// ============================================
function buildNeighborhoodDropdown() {
  // Desktop Charlotte Spots Dropdown
  const desktopNeighborhoodPlaceholder = document.getElementById(
    "neighborhood-dropdown-placeholder",
  );
  if (desktopNeighborhoodPlaceholder) {
    desktopNeighborhoodPlaceholder.innerHTML = `
      <div class="nav-dropdown" id="neighborhoodDropdown">
        <button class="nav-dropdown-toggle" aria-expanded="false">
          Charlotte Spots
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="nav-dropdown-menu">
          <div class="dropdown-heading">Charlotte Neighborhoods</div>
          <div class="dropdown-grid">
            ${charlotteNeighborhoods.map((n) => `<a href="${n.file}" class="dropdown-item">${n.name}</a>`).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // Desktop More/Resources Dropdown
  const desktopResourcesPlaceholder = document.getElementById(
    "resources-dropdown-placeholder",
  );
  if (desktopResourcesPlaceholder) {
    desktopResourcesPlaceholder.innerHTML = `
      <div class="nav-dropdown" id="resourcesDropdown">
        <button class="nav-dropdown-toggle" aria-expanded="false">
          More
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="nav-dropdown-menu">
          <div class="dropdown-heading">Resources</div>
          <div class="dropdown-grid single-col">
            ${resourceLinks.map((r) => `<a href="${r.file}" class="dropdown-item">${r.name}</a>`).join("")}
          </div>
        </div>
      </div>
    `;
  }

  // Mobile Charlotte Spots
  const mobileNeighborhoodPlaceholder = document.getElementById(
    "mobile-neighborhood-placeholder",
  );
  if (mobileNeighborhoodPlaceholder) {
    mobileNeighborhoodPlaceholder.innerHTML = `
      <button class="mobile-dropdown-toggle" id="mobileNeighborhoodToggle">
        Charlotte Spots
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="mobile-submenu" id="mobileNeighborhoodSubmenu">
        ${charlotteNeighborhoods.map((n) => `<a href="${n.file}">${n.name}</a>`).join("")}
      </div>
    `;
  }

  // Mobile More/Resources
  const mobileResourcesPlaceholder = document.getElementById(
    "mobile-resources-placeholder",
  );
  if (mobileResourcesPlaceholder) {
    mobileResourcesPlaceholder.innerHTML = `
      <button class="mobile-dropdown-toggle" id="mobileResourcesToggle">
        More
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div class="mobile-submenu" id="mobileResourcesSubmenu">
        ${resourceLinks.map((r) => `<a href="${r.file}">${r.name}</a>`).join("")}
      </div>
    `;
  }

  // Initialize dropdown toggle behavior
  initDropdownToggles();
}

function initDropdownToggles() {
  // Desktop dropdowns
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        // Close other dropdowns
        dropdowns.forEach((d) => {
          if (d !== dropdown) d.classList.remove("open");
        });
        dropdown.classList.toggle("open");
        toggle.setAttribute(
          "aria-expanded",
          dropdown.classList.contains("open"),
        );
      });
    }
  });

  // Mobile dropdowns
  const mobileNeighborhoodToggle = document.getElementById(
    "mobileNeighborhoodToggle",
  );
  const mobileNeighborhoodSubmenu = document.getElementById(
    "mobileNeighborhoodSubmenu",
  );
  if (mobileNeighborhoodToggle && mobileNeighborhoodSubmenu) {
    mobileNeighborhoodToggle.addEventListener("click", () => {
      mobileNeighborhoodToggle.classList.toggle("open");
      mobileNeighborhoodSubmenu.classList.toggle("open");
    });
  }

  const mobileResourcesToggle = document.getElementById(
    "mobileResourcesToggle",
  );
  const mobileResourcesSubmenu = document.getElementById(
    "mobileResourcesSubmenu",
  );
  if (mobileResourcesToggle && mobileResourcesSubmenu) {
    mobileResourcesToggle.addEventListener("click", () => {
      mobileResourcesToggle.classList.toggle("open");
      mobileResourcesSubmenu.classList.toggle("open");
    });
  }

  // Close dropdowns on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      dropdowns.forEach((d) => {
        d.classList.remove("open");
        const toggle = d.querySelector(".nav-dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open")
        ? "hidden"
        : "";
    });

    // Close on link click
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".mobile-menu") &&
        !e.target.closest(".hamburger") &&
        mobileMenu.classList.contains("open")
      ) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  const navHeight = 70;
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: top,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============================================
// SCROLL PROGRESS
// ============================================
function initScrollProgress() {
  const progressBar = document.querySelector(".scroll-progress");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + "%";
    });
  }
}

// ============================================
// STICKY NAV
// ============================================
function initStickyNav() {
  const nav = document.getElementById("navbar");
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });
  }
}

// ============================================
// PORTFOLIO FILTER
// ============================================
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-card");

  if (filterBtns.length && portfolioCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Update active state
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        portfolioCards.forEach((card) => {
          const category = card.getAttribute("data-cat");
          if (filter === "all" || category === filter) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }
}

// ============================================
// FADE IN OBSERVER
// ============================================
function initFadeInObserver() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".service-card, .portfolio-card, .venture-card, .price-item, .stat-item, .contact-form, .pricing-card, .faq-item, .process-step, .neighborhood-feature",
  );

  animatedElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });
}

// ============================================
// COUNTERS
// ============================================
function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");

  if (counters.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const animateCounter = (element, target) => {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(easeOutQuad * target);

      element.textContent = current + (element.dataset.suffix || "");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + (element.dataset.suffix || "");
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter, 10);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => observer.observe(counter));
}

// ============================================
// FAQ ACCORDION
// ============================================
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("open");
          }
        });

        // Toggle current item
        item.classList.toggle("open", !isOpen);
      });
    }
  });
}

// ============================================
// SET ACTIVE NAV LINK
// ============================================
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const filename = currentPath.split("/").pop() || "index.html";

  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-menu a, .dropdown-item",
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      const linkFile = href.split("#")[0];
      if (
        linkFile === filename ||
        (filename === "" && linkFile === "index.html")
      ) {
        link.classList.add("active");
        link.style.color = "var(--green)";
      }
    }
  });
}

// ============================================
// FORM HANDLING
// ============================================
function initForms() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        // Re-enable after 4 seconds as fallback
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 4000);
      }
    });
  });
}

// ============================================
// GENERATE NEIGHBORHOOD LINKS (for neighborhood pages)
// ============================================
function generateNeighborhoodLinks(currentSlug) {
  const container = document.getElementById("neighborhoodLinksGrid");
  if (container) {
    const links = charlotteNeighborhoods
      .filter((n) => n.slug !== currentSlug)
      .map((n) => `<a href="${n.file}">${n.name}</a>`)
      .join("");
    container.innerHTML = links;
  }
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  buildNeighborhoodDropdown();
  initMobileMenu();
  initSmoothScroll();
  initScrollProgress();
  initStickyNav();
  initPortfolioFilter();
  initFadeInObserver();
  initCounters();
  initFAQ();
  setActiveNavLink();
  initForms();

  // Check for neighborhood page and generate links
  const neighborhoodLinksGrid = document.getElementById(
    "neighborhoodLinksGrid",
  );
  if (neighborhoodLinksGrid) {
    const currentSlug = neighborhoodLinksGrid.dataset.currentSlug;
    if (currentSlug) {
      generateNeighborhoodLinks(currentSlug);
    }
  }
});
