// Game Constants
const WAVELENGTHS = {
    IR: { color: '#ff4500', name: 'Infrared (IR)' },
    VISIBLE: { color: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)', name: 'Visible Light' },
    UV: { color: '#9400d3', name: 'Ultraviolet (UV)' }
};

const SCIENCE_TIPS = [
    "Infrared light is used in thermal imaging cameras to detect heat signatures.",
    "Visible light is the only part of the electromagnetic spectrum humans can see!",
    "Ultraviolet light causes sunburns but is also used to sterilize medical equipment.",
    "Different wavelengths of light bend at different angles when passing through a prism.",
    "Plants use visible light for photosynthesis but are sensitive to UV light.",
    "Infrared radiation was discovered by William Herschel in 1800.",
    "The ozone layer protects us from harmful UV radiation from the sun."
];

const POWERUPS = {
    SHIELD: { name: 'Shield', duration: 5000, color: '#00ff00' },
    SLOW_TIME: { name: 'Slow Time', duration: 3000, color: '#ffff00' },
    DOUBLE_POINTS: { name: 'Double Points', duration: 10000, color: '#ff00ff' }
};

// Game Variables
let canvas, ctx;
let photon = { 
    x: 50, 
    y: 250, 
    radius: 15, 
    speed: 5, 
    wavelength: 'VISIBLE',
    powerup: null,
    powerupEndTime: 0,
    shielded: false
};
let obstacles = [];
let powerups = [];
let score = 0;
let gameRunning = false;
let obstacleSpeed = 3;
let obstacleFrequency = 100;
let powerupFrequency = 300;
let frameCount = 0;
let level = 1;
let tooltip = null;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const wavelengthDisplay = document.getElementById('current-wavelength');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('final-score');
const powerupDisplay = document.getElementById('current-powerup');
const wavelengthBtns = document.querySelectorAll('.wavelength-btn');
const usePowerupBtn = document.getElementById('use-powerup-btn');
const scienceTipElement = document.getElementById('science-tip');
const scienceFactElement = document.getElementById('science-fact');
const bgMusic = document.getElementById('background-music');
const collisionSound = document.getElementById('collision-sound');
const powerupSound = document.getElementById('powerup-sound');

// Initialize Game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    // Create tooltip element
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // Set random science tip
    scienceTipElement.textContent = SCIENCE_TIPS[Math.floor(Math.random() * SCIENCE_TIPS.length)];

    // Event Listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);
    usePowerupBtn.addEventListener('click', usePowerup);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    wavelengthBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            photon.wavelength = btn.dataset.wavelength.toUpperCase();
            updateWavelengthDisplay();
        });
    });

    // Try to play background music (may require user interaction first)
    bgMusic.volume = 0.3;
    document.body.addEventListener('click', () => {
        bgMusic.play().catch(e => console.log("Audio play failed:", e));
    }, { once: true });
}

// Start Game
function startGame() {
    score = 0;
    obstacles = [];
    powerups = [];
    photon.y = 250;
    photon.wavelength = 'VISIBLE';
    photon.powerup = null;
    photon.shielded = false;
    gameRunning = true;
    level = 1;
    obstacleSpeed = 3;
    obstacleFrequency = 100;
    
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    updateWavelengthDisplay();
    updateScore();
    updatePowerupDisplay();
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Game Loop
function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background with level-appropriate design
    drawBackground();
    
    // Update and draw photon
    updatePhoton();
    drawPhoton();
    
    // Update and draw obstacles
    updateObstacles();
    drawObstacles();
    
    // Update and draw powerups
    updatePowerups();
    drawPowerups();
    
    // Check collisions
    checkCollisions();
    
    // Spawn new obstacles and powerups
    if (frameCount % obstacleFrequency === 0) {
        spawnObstacle();
    }
    if (frameCount % powerupFrequency === 0) {
        spawnPowerup();
    }
    
    // Check level progression
    checkLevel();
    
    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Draw background based on level
function drawBackground() {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    if (level === 1) {
        gradient.addColorStop(0, '#000033');
        gradient.addColorStop(1, '#000011');
    } else if (level === 2) {
        gradient.addColorStop(0, '#110033');
        gradient.addColorStop(1, '#000022');
    } else {
        gradient.addColorStop(0, '#330011');
        gradient.addColorStop(1, '#110000');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const x = (frameCount / 2 + i * 100) % canvas.width;
        const y = Math.sin(frameCount / 50 + i) * 50 + 250;
        const size = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Update Photon Position
function updatePhoton() {
    // Simple up/down movement
    if (keys.ArrowUp && photon.y > photon.radius) {
        photon.y -= photon.speed;
    }
    if (keys.ArrowDown && photon.y < canvas.height - photon.radius) {
        photon.y += photon.speed;
    }
    
    // Check if powerup expired
    if (photon.powerupEndTime > 0 && Date.now() > photon.powerupEndTime) {
        deactivatePowerup();
    }
}

// Draw Photon with effects
function drawPhoton() {
    ctx.beginPath();
    ctx.arc(photon.x, photon.y, photon.radius, 0, Math.PI * 2);
    
    // Draw shield if active
    if (photon.shielded) {
        ctx.beginPath();
        ctx.arc(photon.x, photon.y, photon.radius + 10, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    
    if (photon.wavelength === 'VISIBLE') {
        // Rainbow gradient for visible light
        const gradient = ctx.createLinearGradient(photon.x - photon.radius, photon.y, photon.x + photon.radius, photon.y);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.16, 'orange');
        gradient.addColorStop(0.33, 'yellow');
        gradient.addColorStop(0.5, 'green');
        gradient.addColorStop(0.66, 'blue');
        gradient.addColorStop(0.83, 'indigo');
        gradient.addColorStop(1, 'violet');
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = WAVELENGTHS[photon.wavelength].color;
    }
    
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.fillStyle;
}

// Spawn Obstacles
function spawnObstacle() {
    const obstacleTypes = ['mirror', 'heat_cloud', 'uv_barrier', 'prism', 'black_hole'];
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    
    // Special obstacles only appear at higher levels
    if ((type === 'prism' || type === 'black_hole') && level < 2) return;
    
    obstacles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 100) + 50,
        width: type === 'black_hole' ? 60 : 30,
        height: type === 'black_hole' ? 60 : 80,
        type: type,
        rotation: 0,
        rotationSpeed: type === 'prism' ? 0.02 : 0
    });
}

// Update Obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.x -= obstacleSpeed;
        
        // Update rotation for rotating obstacles
        if (obstacle.rotationSpeed !== 0) {
            obstacle.rotation += obstacle.rotationSpeed;
        }
        
        // Remove off-screen obstacles
        if (obstacle.x < -100) {
            obstacles.splice(i, 1);
            if (obstacle.type !== 'black_hole') { // Don't score for black holes
                score += level; // Higher levels give more points
                updateScore();
            }
        }
    }
}

// Draw Obstacles with effects
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.save();
        ctx.translate(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2);
        ctx.rotate(obstacle.rotation);
        
        ctx.fillStyle = getObstacleColor(obstacle.type);
        
        if (obstacle.type === 'prism') {
            // Draw triangle prism
            ctx.beginPath();
            ctx.moveTo(-obstacle.width/2, obstacle.height/2);
            ctx.lineTo(0, -obstacle.height/2);
            ctx.lineTo(obstacle.width/2, obstacle.height/2);
            ctx.closePath();
            ctx.fill();
            
            // Add rainbow effect
            const gradient = ctx.createLinearGradient(-obstacle.width/2, 0, obstacle.width/2, 0);
            gradient.addColorStop(0, 'rgba(255,0,0,0.3)');
            gradient.addColorStop(0.33, 'rgba(0,255,0,0.3)');
            gradient.addColorStop(0.66, 'rgba(0,0,255,0.3)');
            ctx.fillStyle = gradient;
            ctx.fill();
        } 
        else if (obstacle.type === 'black_hole') {
            // Draw black hole with accretion disk
            ctx.beginPath();
            ctx.arc(0, 0, obstacle.width/2, 0, Math.PI * 2);
            ctx.fillStyle = 'black';
            ctx.fill();
            
            // Accretion disk
            ctx.beginPath();
            ctx.arc(0, 0, obstacle.width/2 + 10, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 100, 255, 0.7)';
            ctx.lineWidth = 5;
            ctx.stroke();
        }
        else {
            // Regular rectangular obstacles
            ctx.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
            
            // Add effects based on type
            if (obstacle.type === 'mirror') {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
            }
        }
        
        ctx.restore();
    });
}

// Get Obstacle Color and Properties
function getObstacleColor(type) {
    switch (type) {
        case 'mirror': return 'rgba(200, 200, 255, 0.8)';
        case 'heat_cloud': return 'rgba(255, 100, 0, 0.6)';
        case 'uv_barrier': return 'rgba(150, 0, 255, 0.7)';
        case 'prism': return 'rgba(255, 255, 255, 0.5)';
        case 'black_hole': return 'rgba(0, 0, 0, 1)';
        default: return 'white';
    }
}

// Spawn Powerups
function spawnPowerup() {
    const powerupTypes = Object.keys(POWERUPS);
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    
    powerups.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 50) + 25,
        radius: 15,
        type: type,
        blinkTimer: 0
    });
}

// Update Powerups
function updatePowerups() {
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        powerup.x -= obstacleSpeed;
        powerup.blinkTimer += 0.1;
        
        // Remove off-screen powerups
        if (powerup.x < -30) {
            powerups.splice(i, 1);
        }
    }
}

// Draw Powerups with blinking effect
function drawPowerups() {
    powerups.forEach(powerup => {
        // Blinking effect
        const alpha = 0.7 + Math.sin(powerup.blinkTimer) * 0.3;
        
        ctx.beginPath();
        ctx.arc(powerup.x, powerup.y, powerup.radius, 0, Math.PI * 2);
        ctx.fillStyle = POWERUPS[powerup.type].color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = POWERUPS[powerup.type].color;
    });
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

// Check Collisions with obstacles and powerups
function checkCollisions() {
    // Check obstacle collisions
    for (let i = 0; i < obstacles.length; i++) {
        const o = obstacles[i];
        
        // Different collision detection for different obstacle types
        let collided = false;
        
        if (o.type === 'black_hole') {
            // Circular collision for black hole
            const dx = photon.x - (o.x + o.width/2);
            const dy = photon.y - (o.y + o.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            collided = distance < (o.width/2 + photon.radius);
        } else {
            // Rectangular collision for others
            collided = (
                photon.x + photon.radius > o.x &&
                photon.x - photon.radius < o.x + o.width &&
                photon.y + photon.radius > o.y &&
                photon.y - photon.radius < o.y + o.height
            );
        }
        
        if (collided) {
            // Check if wavelength can pass or if shielded
            if (photon.shielded) {
                // Shield protects from one hit
                photon.shielded = false;
                obstacles.splice(i, 1);
                playSound(powerupSound);
                return;
            }
            
            let shouldCollide = true;
            
            switch (o.type) {
                case 'mirror':
                    shouldCollide = photon.wavelength !== 'VISIBLE';
                    break;
                case 'heat_cloud':
                    shouldCollide = photon.wavelength !== 'IR';
                    break;
                case 'uv_barrier':
                    shouldCollide = photon.wavelength !== 'UV';
                    break;
                case 'prism':
                    // Prism changes your wavelength randomly
                    const wavelengths = Object.keys(WAVELENGTHS);
                    photon.wavelength = wavelengths[Math.floor(Math.random() * wavelengths.length)];
                    updateWavelengthDisplay();
                    shouldCollide = false;
                    break;
                case 'black_hole':
                    // Black hole is always dangerous
                    shouldCollide = true;
                    break;
            }
            
            if (shouldCollide) {
                gameOver();
                return;
            } else {
                // Passed through successfully
                obstacles.splice(i, 1);
                score += level * 2; // Bonus for passing through
                updateScore();
            }
        }
    }
    
    // Check powerup collisions
    for (let i = 0; i < powerups.length; i++) {
        const p = powerups[i];
        const dx = photon.x - p.x;
        const dy = photon.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < photon.radius + p.radius) {
            // Collect powerup
            if (!photon.powerup) {
                photon.powerup = p.type;
                updatePowerupDisplay();
                playSound(powerupSound);
            }
            powerups.splice(i, 1);
        }
    }
}

// Use collected powerup
function usePowerup() {
    if (!photon.powerup || photon.powerupEndTime > Date.now()) return;
    
    switch (photon.powerup) {
        case 'SHIELD':
            photon.shielded = true;
            break;
        case 'SLOW_TIME':
            obstacleSpeed *= 0.5;
            setTimeout(() => {
                obstacleSpeed *= 2;
            }, POWERUPS.SLOW_TIME.duration);
            break;
        case 'DOUBLE_POINTS':
            // Handled in score update
            break;
    }
    
    photon.powerupEndTime = Date.now() + POWERUPS[photon.powerup].duration;
    photon.powerup = null;
    updatePowerupDisplay();
    
    // Add visual effect
    usePowerupBtn.classList.add('powerup-active');
    setTimeout(() => {
        usePowerupBtn.classList.remove('powerup-active');
    }, 300);
}

// Deactivate powerup when expired
function deactivatePowerup() {
    photon.powerupEndTime = 0;
    photon.shielded = false;
}

// Check level progression
function checkLevel() {
    const newLevel = Math.floor(score / 30) + 1;
    if (newLevel > level) {
        level = newLevel;
        obstacleSpeed += 0.5;
        if (obstacleFrequency > 40) obstacleFrequency -= 5;
        
        // Visual level up effect
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Show level up message
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${level}`, canvas.width/2, canvas.height/2);
        ctx.textAlign = 'left';
    }
}

// Game Over
function gameOver() {
    gameRunning = false;
    finalScoreDisplay.textContent = score;
    scienceFactElement.textContent = SCIENCE_TIPS[Math.floor(Math.random() * SCIENCE_TIPS.length)];
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'block';
    playSound(collisionSound);
}

// Handle Key Presses
const keys = {};
function handleKeyPress(e) {
    keys[e.key] = true;
    
    // Wavelength switching
    if (e.key === '1') photon.wavelength = 'IR';
    if (e.key === '2') photon.wavelength = 'VISIBLE';
    if (e.key === '3') photon.wavelength = 'UV';
    if (e.key === ' ') usePowerup();
    
    updateWavelengthDisplay();
}

function handleKeyRelease(e) {
    keys[e.key] = false;
}

// Handle mouse movement for tooltips
function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if hovering over an obstacle
    let tooltipText = '';
    
    for (const obstacle of obstacles) {
        if (
            x > obstacle.x && x < obstacle.x + obstacle.width &&
            y > obstacle.y && y < obstacle.y + obstacle.height
        ) {
            switch (obstacle.type) {
                case 'mirror':
                    tooltipText = 'Mirror: Only visible light can pass through';
                    break;
                case 'heat_cloud':
                    tooltipText = 'Heat Cloud: Only infrared (IR) can pass through';
                    break;
                case 'uv_barrier':
                    tooltipText = 'UV Barrier: Only ultraviolet (UV) can pass through';
                    break;
                case 'prism':
                    tooltipText = 'Prism: Changes your wavelength randomly';
                    break;
                case 'black_hole':
                    tooltipText = 'Black Hole: Avoid at all costs!';
                    break;
            }
            break;
        }
    }
    
    // Check if hovering over a powerup
    for (const powerup of powerups) {
        const dx = x - powerup.x;
        const dy = y - powerup.y;
        if (Math.sqrt(dx * dx + dy * dy) < powerup.radius + 10) {
            tooltipText = `${POWERUPS[powerup.type].name}: ${getPowerupDescription(powerup.type)}`;
            break;
        }
    }
    
    if (tooltipText) {
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
        tooltip.textContent = tooltipText;
    } else {
        tooltip.style.display = 'none';
    }
}

function getPowerupDescription(type) {
    switch (type) {
        case 'SHIELD': return 'Protects from one collision';
        case 'SLOW_TIME': return 'Slows down obstacles temporarily';
        case 'DOUBLE_POINTS': return 'Doubles points for duration';
        default: return '';
    }
}

// Update Wavelength Display
function updateWavelengthDisplay() {
    wavelengthDisplay.textContent = WAVELENGTHS[photon.wavelength].name;
    wavelengthDisplay.style.color = photon.wavelength === 'VISIBLE' ? 'white' : WAVELENGTHS[photon.wavelength].color;
}

// Update Score Display
function updateScore() {
    const scoreMultiplier = (photon.powerupEndTime > Date.now() && photon.powerup === 'DOUBLE_POINTS') ? 2 : 1;
    scoreDisplay.textContent = `Score: ${score * scoreMultiplier}${scoreMultiplier > 1 ? ' (2x)' : ''}`;
}

// Update Powerup Display
function updatePowerupDisplay() {
    if (photon.powerup) {
        powerupDisplay.textContent = POWERUPS[photon.powerup].name;
        powerupDisplay.style.color = POWERUPS[photon.powerup].color;
    } else if (photon.powerupEndTime > Date.now()) {
        powerupDisplay.textContent = `${photon.shielded ? 'Shield Active' : 'Power Active'}`;
        powerupDisplay.style.color = photon.shielded ? '#00ff00' : '#ffff00';
    } else {
        powerupDisplay.textContent = 'None';
        powerupDisplay.style.color = 'white';
    }
}

// Play sound effects
function playSound(soundElement) {
    soundElement.currentTime = 0;
    soundElement.play().catch(e => console.log("Sound play failed:", e));
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', init);