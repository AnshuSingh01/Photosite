document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Gallery data - This could be loaded from a JSON file or database in a real implementation
    const galleryData = [
        {
            id: 1,
            title: "Annual Photonics Conference 2023",
            description: "Our members presenting research at the flagship IEEE Photonics Conference in Orlando.",
            imageUrl: "https://via.placeholder.com/800x600?text=Conference+2023",
            category: "events",
            date: "November 12, 2023"
        },
        {
            id: 2,
            title: "Laser Lab Demonstration",
            description: "Students experimenting with cutting-edge laser technology in our research lab.",
            imageUrl: "https://via.placeholder.com/800x600?text=Laser+Lab",
            category: "research",
            date: "October 5, 2023"
        },
        {
            id: 3,
            title: "Student Chapter Meetup",
            description: "Monthly meetup of our student chapter members discussing photonics applications.",
            imageUrl: "https://via.placeholder.com/800x600?text=Chapter+Meetup",
            category: "members",
            date: "September 18, 2023"
        },
        {
            id: 4,
            title: "Best Paper Award",
            description: "Our team receiving the Best Paper Award for research in quantum photonics.",
            imageUrl: "https://via.placeholder.com/800x600?text=Best+Paper+Award",
            category: "awards",
            date: "August 22, 2023"
        },
        {
            id: 5,
            title: "Optical Fiber Workshop",
            description: "Hands-on workshop on optical fiber technology for undergraduate students.",
            imageUrl: "https://via.placeholder.com/800x600?text=Fiber+Workshop",
            category: "events",
            date: "July 15, 2023"
        },
        {
            id: 6,
            title: "Photonics Summer Camp",
            description: "High school students learning about photonics through interactive experiments.",
            imageUrl: "https://via.placeholder.com/800x600?text=Summer+Camp",
            category: "events",
            date: "June 30, 2023"
        },
        {
            id: 7,
            title: "Research Team Photo",
            description: "Our core research team working on next-gen photonic computing.",
            imageUrl: "https://via.placeholder.com/800x600?text=Research+Team",
            category: "research",
            date: "May 10, 2023"
        },
        {
            id: 8,
            title: "Industry Collaboration",
            description: "Meeting with industry partners to discuss photonics applications in telecommunications.",
            imageUrl: "https://via.placeholder.com/800x600?text=Industry+Meeting",
            category: "members",
            date: "April 5, 2023"
        }
    ];
    
    const galleryContainer = document.getElementById('gallery-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('gallery-search');
    const loadMoreBtn = document.getElementById('load-more');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('image-title');
    const modalDescription = document.getElementById('image-description');
    const modalDate = document.getElementById('image-date');
    const modalCategory = document.getElementById('image-category');
    const closeModal = document.querySelector('.close-modal');
    
    let currentFilter = 'all';
    let currentSearch = '';
    let visibleItems = 8; // Initial number of items to show
    const itemsPerLoad = 4; // Items to load each time
    
    // Initialize gallery
    function renderGallery() {
        galleryContainer.innerHTML = '';
        
        const filteredItems = galleryData.filter(item => {
            const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
            const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                                item.description.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        
        const itemsToShow = filteredItems.slice(0, visibleItems);
        
        if (itemsToShow.length === 0) {
            galleryContainer.innerHTML = '<p class="no-results">No images found matching your criteria.</p>';
            loadMoreBtn.style.display = 'none';
            return;
        }
        
        itemsToShow.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = `gallery-item ${item.category}`;
            galleryItem.innerHTML = `
                <div class="gallery-img-container">
                    <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
                    <div class="gallery-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.date}</p>
                    </div>
                </div>
            `;
            galleryContainer.appendChild(galleryItem);
            
            // Add click event to open modal
            galleryItem.addEventListener('click', () => openModal(item));
        });
        
        // Show/hide load more button
        loadMoreBtn.style.display = visibleItems >= filteredItems.length ? 'none' : 'block';
    }
    
    // Open modal with image details
    function openModal(item) {
        modalImage.src = item.imageUrl;
        modalImage.alt = item.title;
        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        modalDate.textContent = item.date;
        modalCategory.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModalFunc() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            visibleItems = 8; // Reset to initial count when changing filters
            renderGallery();
        });
    });
    
    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value.trim();
        visibleItems = 8; // Reset to initial count when searching
        renderGallery();
    });
    
    loadMoreBtn.addEventListener('click', () => {
        visibleItems += itemsPerLoad;
        renderGallery();
    });
    
    closeModal.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalFunc();
    });
    
    // Initialize the gallery
    renderGallery();
    
    // Mobile menu toggle functionality (reused from main script)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
});