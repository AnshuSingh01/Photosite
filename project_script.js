// ===============================
// DOM Content Loaded
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCurrentYear();
    animateProjectCards();
    initProjectFilters();
    initCarousel();
  });
  
  // ===============================
  // Mobile Menu Toggle
  // ===============================
  function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
  
    mobileMenuToggle?.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
  
  // ===============================
  // Set Current Year in Footer
  // ===============================
  function initCurrentYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }
  
  // ===============================
  // Animate Project Cards on Load
  // ===============================
  function animateProjectCards() {
    const cards = document.querySelectorAll(".project-card");
  
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("show");
      }, index * 150); // Staggered animation
    });
  }
  
  // ===============================
  // Project Filter Controls
  // ===============================
  function initProjectFilters() {
    const searchInput = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('filter-category');
    const timelineFilter = document.getElementById('filter-timeline');
    const impactFilter = document.getElementById('filter-impact');
  
    const filterElements = [searchInput, categoryFilter, timelineFilter, impactFilter];
  
    filterElements.forEach(element => {
      element?.addEventListener('input', () => {
        console.log("Search:", searchInput?.value);
        console.log("Category:", categoryFilter?.value);
        console.log("Timeline:", timelineFilter?.value);
        console.log("Impact:", impactFilter?.value);
        // You can trigger filtering logic here
      });
    });
  }
  
  // ===============================
  // Carousel Functionality
  // ===============================
  function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.project-feature-card');
    const prevBtn = document.querySelector('.carousel-arrow.left');
    const nextBtn = document.querySelector('.carousel-arrow.right');
    const dotsContainer = document.getElementById('carousel-dots');
  
    if (!track || cards.length === 0 || !prevBtn || !nextBtn || !dotsContainer) return;
  
    let index = 0;
    const cardWidth = cards[0].offsetWidth + 24; // 24px gap
    const totalCards = cards.length;
  
    // Create Dots
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    }
  
    const dots = document.querySelectorAll('.carousel-dots .dot');
  
    function updateCarousel() {
      track.style.transform = `translateX(-${index * cardWidth}px)`;
  
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    }
  
    function goNext() {
      index = (index + 1) % totalCards;
      updateCarousel();
    }
  
    function goPrev() {
      index = (index - 1 + totalCards) % totalCards;
      updateCarousel();
    }
  
    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('click', goPrev);
  
    // Dot Click Events
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        index = i;
        updateCarousel();
      });
    });
  
    // Auto Scroll
    setInterval(goNext, 5000);
  }
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const selectedCategory = card.dataset.category;
  
      // Update the dropdown to match
      document.getElementById("filter-category").value = selectedCategory;
  
      // Optionally trigger filter function here
      filterProjects();
    });
  });
  
  // Example filterProjects function:
  function filterProjects() {
    const category = document.getElementById("filter-category").value.toLowerCase();
    const cards = document.querySelectorAll(".project-card");
  
    cards.forEach(card => {
      const content = card.textContent.toLowerCase();
      card.style.display = content.includes(category) ? "block" : "none";
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.getElementById("search-bar");
    const categoryDropdown = document.getElementById("filter-category");
    const timelineDropdown = document.getElementById("filter-timeline");
    const impactDropdown = document.getElementById("filter-impact");
    const categoryCards = document.querySelectorAll(".category-card");
    const projectCards = document.querySelectorAll(".project-card");
  
    // Helper: Get inner text and make lowercase
    const textMatch = (element, text) =>
      element.textContent.toLowerCase().includes(text.toLowerCase());
  
    // Filter function
    function applyFilters() {
      const searchValue = searchBar.value.trim().toLowerCase();
      const selectedCategory = categoryDropdown.value;
      const selectedTimeline = timelineDropdown.value;
      const selectedImpact = impactDropdown.value;
  
      projectCards.forEach((card) => {
        const title = card.querySelector("h3")?.textContent || "";
        const description = card.querySelector(".description")?.textContent || "";
        const investigators = card.querySelector("p:nth-of-type(2)")?.textContent || "";
        const cardCategory = card.getAttribute("data-category") || "";
        const cardTimeline = card.getAttribute("data-timeline") || "";
        const cardImpact = card.getAttribute("data-impact") || "";
  
        const matchesSearch =
          textMatch(card, searchValue) || textMatch(description, searchValue);
  
        const matchesCategory =
          !selectedCategory || selectedCategory === cardCategory;
  
        const matchesTimeline =
          !selectedTimeline || selectedTimeline === cardTimeline;
  
        const matchesImpact =
          !selectedImpact || selectedImpact === cardImpact;
  
        if (
          matchesSearch &&
          matchesCategory &&
          matchesTimeline &&
          matchesImpact
        ) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    }
  
    // Filter triggers
    searchBar.addEventListener("input", applyFilters);
    categoryDropdown.addEventListener("change", applyFilters);
    timelineDropdown.addEventListener("change", applyFilters);
    impactDropdown.addEventListener("change", applyFilters);
  
    // Category card click -> apply filter
    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const selected = card.getAttribute("data-category");
        categoryDropdown.value = selected;
        applyFilters();
  
        // Optional: visually highlight selected category
        categoryCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
      });
    });
  });