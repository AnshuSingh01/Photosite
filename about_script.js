document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    
});
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('header nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Sidebar navigation functionality
    const sideLinks = document.querySelectorAll('.side-link');
    
    // Set active link based on URL or section visibility
    function setActiveLink() {
        // First try to get the hash from the URL
        const hash = window.location.hash;
        let activeLink = null;
        
        if (hash) {
            // If there's a hash, find the corresponding link
            activeLink = document.querySelector(`.side-link[href="${hash}"]`);
        } else {
            // If no hash, check which section is most visible
            const sections = document.querySelectorAll('.content-section');
            let mostVisibleSection = null;
            let maxVisibility = 0;
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const visibility = Math.min(rect.bottom, window.innerHeight) - 
                                  Math.max(rect.top, 0);
                
                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    mostVisibleSection = section;
                }
            });
            
            if (mostVisibleSection) {
                const id = mostVisibleSection.id;
                activeLink = document.querySelector(`.side-link[href="#${id}"]`);
            }
        }
        
        // Remove active class from all links
        sideLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to the current link
        if (activeLink) {
            activeLink.classList.add('active');
        } else if (sideLinks.length > 0) {
            // Default to first link if none is active
            sideLinks[0].classList.add('active');
        }
    }
    
    // Handle click on sidebar links
    sideLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target section id from the href
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    e.preventDefault();
                    
                    // Smooth scroll to the section
                    window.scrollTo({
                        top: targetSection.offsetTop - 20,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping
                    history.pushState(null, null, targetId);
                    
                    // Update active link
                    sideLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Set initial active link
    setActiveLink();
    
    // Update active link on scroll
    window.addEventListener('scroll', setActiveLink);
});