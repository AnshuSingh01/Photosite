const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const game = document.getElementById('game');
const collector = document.getElementById('collector');
const scoreDisplay = document.getElementById('score');
const finalScore = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');
const factPopup = document.getElementById('fact-popup');
const factText = document.getElementById('fact-text');
const factCloseBtn = document.getElementById('fact-close-btn');
const pingSound = document.getElementById('ping');

let score = 0;
let level = 1;
let photonInterval;
let isGameRunning = false;

const photonFacts = [
  "Photons have zero rest mass but carry energy.",
  "Photonics is the science of light generation, detection, and manipulation.",
  "LEDs and lasers are key photonics technologies.",
  "Fiber optics rely on the principles of photonics for high-speed data transmission.",
  "Photons exhibit both wave and particle properties – wave-particle duality.",
  "Einstein won a Nobel Prize for explaining the photoelectric effect — a photon phenomenon!",
];

// Mouse movement to control collector
document.addEventListener('mousemove', e => {
  if (!isGameRunning) return;
  const x = e.clientX - collector.offsetWidth / 2;
  collector.style.left = `${x}px`;
});

// Start Game
startBtn.onclick = () => {
  startScreen.classList.add('hidden');
  game.classList.remove('hidden');
  startGame();
};

// Restart Game
restartBtn.onclick = () => {
  gameOverScreen.classList.add('hidden');
  game.classList.remove('hidden');
  startGame();
};

// Handle Fact Popup Close
factCloseBtn.onclick = () => {
  factPopup.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
};

function startGame() {
  score = 0;
  level = 1;
  isGameRunning = true;
  scoreDisplay.textContent = score;
  photonInterval = setInterval(spawnPhoton, 800);
}

function endGame() {
  isGameRunning = false;
  clearInterval(photonInterval);
  document.querySelectorAll('.photon, .dark-photon').forEach(p => p.remove());
  game.classList.add('hidden');

  finalScore.textContent = score;

  // High Score
  let highScore = localStorage.getItem('highScore') || 0;
  if (score > highScore) {
    localStorage.setItem('highScore', score);
    highScore = score;
  }
  highScoreDisplay.textContent = highScore;

  // Leaderboard
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.push(score);
  leaderboard = leaderboard.sort((a, b) => b - a).slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

  const topScoresEl = document.getElementById('top-scores');
  topScoresEl.innerHTML = '';
  leaderboard.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    topScoresEl.appendChild(li);
  });

  // Random Photon Fact
  const fact = photonFacts[Math.floor(Math.random() * photonFacts.length)];
  factText.textContent = fact;
  factPopup.classList.remove('hidden');
}

function spawnPhoton() {
  if (!isGameRunning) return;

  const isDark = Math.random() < 0.2;
  const photon = document.createElement('div');
  photon.classList.add(isDark ? 'dark-photon' : 'photon');
  photon.style.left = `${Math.random() * (window.innerWidth - 20)}px`;
  game.appendChild(photon);

  const fallSpeed = Math.max(2000 - score * 10, 500);
  photon.style.animationDuration = `${fallSpeed}ms`;

  const interval = setInterval(() => {
    const photonRect = photon.getBoundingClientRect();
    const collectorRect = collector.getBoundingClientRect();

    if (
      photonRect.bottom >= collectorRect.top &&
      photonRect.left < collectorRect.right &&
      photonRect.right > collectorRect.left
    ) {
      if (isDark) {
        document.getElementById('buzz')?.play();
        clearInterval(interval);
        photon.remove();
        endGame();
      } else {
        document.getElementById('ping')?.play();
        score++;
        scoreDisplay.textContent = score;
        photon.remove();
        clearInterval(interval);
      }
    }

    if (photonRect.top > window.innerHeight) {
      photon.remove();
      clearInterval(interval);
    }
  }, 50);
}