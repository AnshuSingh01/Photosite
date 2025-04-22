// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Load news dynamically
    const newsContainer = document.getElementById('news-container');
    const newsData = [
        {
            title: "Call for Papers: Photonics Conference 2023",
            date: "June 15, 2023",
            content: "Submit your research to our flagship conference. Deadline approaching soon.",
            link: "#"
        },
        {
            title: "New Issue of Photonics Journal Published",
            date: "June 1, 2023",
            content: "The latest research in quantum photonics and optical communications now available.",
            link: "#"
        },
        {
            title: "Student Chapter Grants Available",
            date: "May 25, 2023",
            content: "Funding opportunities for student chapters to organize photonics-related activities.",
            link: "#"
        }
    ];
    
    newsData.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h3>${news.title}</h3>
            <div class="news-date">${news.date}</div>
            <p>${news.content}</p>
            <a href="${news.link}">Read more</a>
        `;
        newsContainer.appendChild(newsItem);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});