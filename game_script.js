// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile menu toggle functionality
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('nav');

if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
    });
}

// Games data
// Games data with correct paths and images
const games = [
    {
        title: "Laser Maze",
        image: "laser maze.png",
        description: "Align mirrors to guide your laser through complex mazes.",
        link: "LM_index1.html"
    },
    {
        title: "Light Sniper",
        image: "light siper.png",
        description: "Navigate through mirrors and lenses using light refraction principles.",
        link: "sniper_index.html"
    },
    {
        title: "Spectrum Runner",
        image: "run.png",
        description: "Identify and classify different light spectra patterns and cross the heardals.",
        link: "spec_game.html"
    },
    {
        title: "Photonics Quiz",
        image: "quiz.png",
        description: "Test your photonics knowledge with challenging quizzes.",
        link: "photoq_index.html"
    },
    {
        title: "Wordle Race",
        image: "wordle.png",
        description: "Solve the wordle using photonics words.",
        link: "wordle_index.html"
    },
    {
        title: "Photon Catcher",
        image: "photon catcher.png",
        description: "abc",
        link: "catcher_index copy.html"
    },
    {
        title: "xyz",
        image: "quantum-leap.png",
        description: "xyz",
        link: "game/Quantum Leap/level1/index1.html"
    },
    {
        title: "pqr",
        image: "images/led-designer.png",
        description: "pqr",
        link: "game/LED Designer/level1/index1.html"
    },
];

// Rest of the JavaScript remains the same...

// Load games into the container
const gamesContainer = document.getElementById('games-container');
if (gamesContainer) {
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image" style="background-image: url('${game.image}')"></div>
            <div class="game-content">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <a href="${game.link}" class="game-play-button">Play Now</a>
            </div>
        `;
        gamesContainer.appendChild(gameCard);
    });
}

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