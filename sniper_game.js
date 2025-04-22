import { LEVELS, initLevel } from './levels.js';

// Game Constants
const LASER_COLOR = '#ff5555';
const REFLECTED_COLOR = '#5555ff';
const REFRACTED_COLOR = '#55ff55';
const SPLIT_COLOR = '#ffff55';
const GLASS_REFRACTIVE_INDEX = 1.5;
const MAX_BOUNCES = 20;
const LASER_WIDTH = 2;
const LASER_GLOW = 8;

// Game State
const gameState = {
    currentLevel: 0,
    score: 0,
    selectedTool: null,
    components: [],
    targets: [],
    laser: null,
    isShooting: false,
    isDragging: false,
    dragComponent: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    dragStartAngle: 0,
    dragRotation: 0,
    laserPaths: [],
    showInstructions: true
};

// DOM Elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const levelNumberElement = document.getElementById('level-number');
const scoreElement = document.getElementById('score');
const levelCompleteElement = document.getElementById('level-complete');
const levelScoreElement = document.getElementById('level-score');
const gameMenuElement = document.getElementById('game-menu');
const howToPlayElement = document.getElementById('how-to-play');
const nextLevelBtn = document.getElementById('next-level-btn');
const menuBtn = document.getElementById('menu-btn');
const startGameBtn = document.getElementById('start-game-btn');
const howToPlayBtn = document.getElementById('how-to-play-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const shootBtn = document.getElementById('shoot-btn');
const resetBtn = document.getElementById('reset-btn');
const toolButtons = document.querySelectorAll('.tool-button');

// Audio Elements
const laserSound = document.getElementById('laser-sound');
const targetHitSound = document.getElementById('target-hit-sound');
const componentPlaceSound = document.getElementById('component-place-sound');
const levelCompleteSound = document.getElementById('level-complete-sound');

// Initialize Game
function init() {
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', handleRightClick);
    
    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => selectTool(btn.dataset.tool));
    });

    shootBtn.addEventListener('click', shootLaser);
    resetBtn.addEventListener('click', resetLevel);
    nextLevelBtn.addEventListener('click', loadNextLevel);
    menuBtn.addEventListener('click', showMainMenu);
    startGameBtn.addEventListener('click', startGame);
    howToPlayBtn.addEventListener('click', showHowToPlay);
    backToMenuBtn.addEventListener('click', showMainMenu);

    // Show main menu initially
    showMainMenu();
}

// Resize canvas to fit container
function resizeCanvas() {
    const container = document.querySelector('.game-screen');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // If game is loaded, re-render
    if (gameState.laser) {
        render();
    }
}

// Show main menu
function showMainMenu() {
    gameMenuElement.classList.add('active');
    levelCompleteElement.classList.remove('active');
    howToPlayElement.classList.remove('active');
}

// Show how to play screen
function showHowToPlay() {
    howToPlayElement.classList.add('active');
    gameMenuElement.classList.remove('active');
}

// Start the game
function startGame() {
    gameMenuElement.classList.remove('active');
    gameState.currentLevel = 0;
    gameState.score = 0;
    scoreElement.textContent = '0';
    loadLevel(gameState.currentLevel);
}

// Load a level
function loadLevel(levelIndex) {
    const levelData = initLevel(levelIndex, canvas.width, canvas.height);
    
    gameState.components = [...levelData.components];
    gameState.targets = [...levelData.targets];
    gameState.laser = { ...levelData.laser };
    gameState.isShooting = false;
    gameState.currentLevel = levelIndex;
    
    // Update UI
    levelNumberElement.textContent = levelIndex + 1;
    levelCompleteElement.classList.remove('active');
    
    // Show level instructions if enabled
    if (gameState.showInstructions && levelData.instructions) {
        setTimeout(() => {
            alert(`Level ${levelIndex + 1}: ${levelData.name}\n\n${levelData.instructions}`);
        }, 300);
    }
    
    render();
}

// Select a tool
function selectTool(tool) {
    gameState.selectedTool = tool;
    toolButtons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tool}-tool`).classList.add('active');
}

// Shoot the laser and calculate paths
function shootLaser() {
    if (gameState.isShooting) return;
    
    gameState.isShooting = true;
    gameState.targets.forEach(t => t.hit = false);
    
    // Calculate laser path
    gameState.laserPaths = calculateLaserPath(
        gameState.laser.x,
        gameState.laser.y,
        gameState.laser.angle,
        MAX_BOUNCES
    );
    
    // Play laser sound
    playSound(laserSound);
    
    // Check if any targets were hit
    const hitTargets = gameState.targets.filter(t => t.hit);
    
    // Update score and play hit sounds
    if (hitTargets.length > 0) {
        gameState.score += hitTargets.length * 10 * (gameState.currentLevel + 1);
        scoreElement.textContent = gameState.score;
        playSound(targetHitSound);
    }
    
    // If all targets hit, level complete
    if (gameState.targets.every(t => t.hit)) {
        levelScoreElement.textContent = hitTargets.length * 10 * (gameState.currentLevel + 1);
        setTimeout(() => {
            levelCompleteElement.classList.add('active');
            playSound(levelCompleteSound);
        }, 800);
    }
    
    // Animate the laser
    animateLaser();
}

// Calculate the laser path through components
function calculateLaserPath(startX, startY, angle, maxBounces) {
    const paths = [];
    let currentX = startX;
    let currentY = startY;
    let currentAngle = angle;
    let currentColor = LASER_COLOR;
    let remainingBounces = maxBounces;
    
    paths.push({ x: currentX, y: currentY, color: currentColor });
    
    while (remainingBounces > 0) {
        // Calculate next point in this direction
        const nextX = currentX + Math.cos(currentAngle * Math.PI / 180) * 10;
        const nextY = currentY + Math.sin(currentAngle * Math.PI / 180) * 10;
        
        // Check for collisions with components
        let hitComponent = null;
        let intersection = null;
        let normalAngle = 0;
        
        for (const component of gameState.components) {
            const hit = checkComponentCollision(
                currentX, currentY, nextX, nextY, 
                component.x, component.y, component.angle, component.type, 
                component.width, component.height
            );
            
            if (hit && (!intersection || hit.distance < intersection.distance)) {
                intersection = hit;
                hitComponent = component;
                normalAngle = hit.normalAngle;
            }
        }
        
        // Check for collisions with targets
        for (const target of gameState.targets) {
            if (checkTargetCollision(currentX, currentY, nextX, nextY, target.x, target.y, 15)) {
                target.hit = true;
            }
        }
        
        if (intersection) {
            // Add point just before collision
            paths.push({ 
                x: intersection.x - Math.cos(currentAngle * Math.PI / 180) * 0.1, 
                y: intersection.y - Math.sin(currentAngle * Math.PI / 180) * 0.1,
                color: currentColor
            });
            
            // Handle interaction with component
            if (hitComponent.type === 'mirror') {
                // Reflection
                currentAngle = 2 * normalAngle - currentAngle - 180;
                currentColor = REFLECTED_COLOR;
                paths.push({ x: intersection.x, y: intersection.y, color: currentColor });
            } else if (hitComponent.type === 'glass') {
                // Refraction
                const incidentAngle = currentAngle - normalAngle;
                const refractedAngle = calculateRefractionAngle(incidentAngle, 1, GLASS_REFRACTIVE_INDEX);
                currentAngle = normalAngle + refractedAngle;
                currentColor = REFRACTED_COLOR;
                paths.push({ x: intersection.x, y: intersection.y, color: currentColor });
            } else if (hitComponent.type === 'splitter') {
                // Split into two paths (we'll just reflect for simplicity)
                currentAngle = 2 * normalAngle - currentAngle - 180;
                currentColor = SPLIT_COLOR;
                paths.push({ x: intersection.x, y: intersection.y, color: currentColor });
            } else if (hitComponent.type === 'prism') {
                // Dispersion (simplified - just change angle slightly)
                currentAngle += 10;
                currentColor = `hsl(${Math.random() * 60 + 300}, 100%, 50%)`;
                paths.push({ x: intersection.x, y: intersection.y, color: currentColor });
            }
            
            currentX = intersection.x;
            currentY = intersection.y;
            remainingBounces--;
        } else {
            // No collision - continue straight
            currentX = nextX;
            currentY = nextY;
            
            // Stop if we go out of bounds
            if (currentX < 0 || currentX > canvas.width || currentY < 0 || currentY > canvas.height) {
                paths.push({ x: currentX, y: currentY, color: currentColor });
                break;
            }
        }
    }
    
    return paths;
}

// Check collision with a component (implementation similar to previous version)
// Check collision with a target (implementation similar to previous version)
// Calculate refraction angle (implementation similar to previous version)

// Animate the laser path
function animateLaser() {
    let currentIndex = 0;
    const animationSpeed = 5;
    
    function drawFrame() {
        if (currentIndex >= gameState.laserPaths.length - 1) {
            gameState.isShooting = false;
            render();
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        render();
        
        // Draw the laser up to current point
        ctx.beginPath();
        ctx.moveTo(gameState.laserPaths[0].x, gameState.laserPaths[0].y);
        
        for (let i = 1; i <= currentIndex; i++) {
            ctx.strokeStyle = gameState.laserPaths[i-1].color;
            ctx.lineWidth = LASER_WIDTH;
            ctx.lineTo(gameState.laserPaths[i].x, gameState.laserPaths[i].y);
            ctx.stroke();
            
            // Add glow effect
            ctx.shadowBlur = LASER_GLOW;
            ctx.shadowColor = gameState.laserPaths[i-1].color;
            
            ctx.beginPath();
            ctx.moveTo(gameState.laserPaths[i].x, gameState.laserPaths[i].y);
        }
        
        // Draw the current segment
        const nextIndex = Math.min(currentIndex + 1, gameState.laserPaths.length - 1);
        const segmentLength = Math.sqrt(
            Math.pow(gameState.laserPaths[nextIndex].x - gameState.laserPaths[currentIndex].x, 2) + 
            Math.pow(gameState.laserPaths[nextIndex].y - gameState.laserPaths[currentIndex].y, 2)
        );
        
        const progress = Math.min(1, animationSpeed / segmentLength);
        
        const currentX = gameState.laserPaths[currentIndex].x + 
            (gameState.laserPaths[nextIndex].x - gameState.laserPaths[currentIndex].x) * progress;
        const currentY = gameState.laserPaths[currentIndex].y + 
            (gameState.laserPaths[nextIndex].y - gameState.laserPaths[currentIndex].y) * progress;
        
        ctx.strokeStyle = gameState.laserPaths[currentIndex].color;
        ctx.lineWidth = LASER_WIDTH;
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowBlur = LASER_GLOW;
        ctx.shadowColor = gameState.laserPaths[currentIndex].color;
        
        currentIndex += progress >= 1 ? 1 : 0;
        requestAnimationFrame(drawFrame);
    }
    
    drawFrame();
}

// Reset the current level
function resetLevel() {
    loadLevel(gameState.currentLevel);
}

// Load the next level
function loadNextLevel() {
    if (gameState.currentLevel < LEVELS.length - 1) {
        gameState.currentLevel++;
        loadLevel(gameState.currentLevel);
    } else {
        alert('Congratulations! You completed all levels!');
        showMainMenu();
    }
}

// Render the game (implementation similar to previous version but with improved visuals)
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    drawGridBackground();
    
    // Draw laser emitter
    drawLaserEmitter();
    
    // Draw targets
    drawTargets();
    
    // Draw components
    drawComponents();
    
    // Reset shadow effects
    ctx.shadowBlur = 0;
}

// Helper function to draw grid background
function drawGridBackground() {
    const gridSize = 40;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Helper function to draw laser emitter
function drawLaserEmitter() {
    if (!gameState.laser) return;
    
    // Draw emitter base
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(gameState.laser.x, gameState.laser.y, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw emitter light
    ctx.fillStyle = LASER_COLOR;
    ctx.beginPath();
    ctx.arc(gameState.laser.x, gameState.laser.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw emitter direction indicator
    ctx.strokeStyle = LASER_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gameState.laser.x, gameState.laser.y);
    ctx.lineTo(
        gameState.laser.x + Math.cos(gameState.laser.angle * Math.PI / 180) * 25,
        gameState.laser.y + Math.sin(gameState.laser.angle * Math.PI / 180) * 25
    );
    ctx.stroke();
    
    // Draw direction arrowhead
    ctx.fillStyle = LASER_COLOR;
    ctx.beginPath();
    ctx.moveTo(
        gameState.laser.x + Math.cos(gameState.laser.angle * Math.PI / 180) * 30,
        gameState.laser.y + Math.sin(gameState.laser.angle * Math.PI / 180) * 30
    );
    ctx.lineTo(
        gameState.laser.x + Math.cos((gameState.laser.angle - 150) * Math.PI / 180) * 15,
        gameState.laser.y + Math.sin((gameState.laser.angle - 150) * Math.PI / 180) * 15
    );
    ctx.lineTo(
        gameState.laser.x + Math.cos((gameState.laser.angle + 150) * Math.PI / 180) * 15,
        gameState.laser.y + Math.sin((gameState.laser.angle + 150) * Math.PI / 180) * 15
    );
    ctx.closePath();
    ctx.fill();
}

// Helper function to draw targets
function drawTargets() {
    gameState.targets.forEach(target => {
        // Draw outer ring
        ctx.fillStyle = target.hit ? '#00ff00' : target.color;
        ctx.beginPath();
        ctx.arc(target.x, target.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw inner circle
        ctx.fillStyle = target.hit ? '#aaffaa' : '#ffffff';
        ctx.beginPath();
        ctx.arc(target.x, target.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw center mark
        if (!target.hit) {
            ctx.fillStyle = target.color;
            ctx.beginPath();
            ctx.arc(target.x, target.y, 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Draw checkmark for hit targets
            ctx.strokeStyle = '#00aa00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(target.x - 8, target.y);
            ctx.lineTo(target.x - 3, target.y + 5);
            ctx.lineTo(target.x + 8, target.y - 8);
            ctx.stroke();
        }
        
        // Add glow effect for active targets
        if (!target.hit) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = target.color;
        }
    });
}

// Helper function to draw components
function drawComponents() {
    gameState.components.forEach(component => {
        ctx.save();
        ctx.translate(component.x, component.y);
        ctx.rotate(component.angle * Math.PI / 180);
        
        if (component.type === 'mirror') {
            // Draw mirror surface with gradient
            const gradient = ctx.createLinearGradient(-component.width/2, 0, component.width/2, 0);
            gradient.addColorStop(0, '#aaaaaa');
            gradient.addColorStop(0.5, '#eeeeee');
            gradient.addColorStop(1, '#aaaaaa');
            ctx.fillStyle = gradient;
            ctx.fillRect(-component.width/2, -component.height/2, component.width, component.height);
            
            // Draw mirror edges
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(-component.width/2, -component.height/2, component.width, component.height);
            
            // Add highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-component.width/2 + 5, -component.height/2 + 2);
            ctx.lineTo(component.width/2 - 5, -component.height/2 + 2);
            ctx.stroke();
        } 
        else if (component.type === 'glass') {
            // Draw glass block with transparency
            ctx.fillStyle = 'rgba(150, 200, 255, 0.3)';
            ctx.fillRect(-component.width/2, -component.height/2, component.width, component.height);
            
            // Draw glass edges
            ctx.strokeStyle = 'rgba(200, 230, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-component.width/2, -component.height/2, component.width, component.height);
            
            // Add subtle internal reflections
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 1; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(-component.width/2 + i*10, -component.height/2 + 5);
                ctx.lineTo(component.width/2 - i*10, component.height/2 - 5);
                ctx.stroke();
            }
        }
        else if (component.type === 'splitter') {
            // Draw beam splitter diamond
            ctx.fillStyle = 'rgba(255, 255, 200, 0.3)';
            ctx.beginPath();
            ctx.moveTo(0, -component.height/2);
            ctx.lineTo(component.width/2, 0);
            ctx.lineTo(0, component.height/2);
            ctx.lineTo(-component.width/2, 0);
            ctx.closePath();
            ctx.fill();
            
            // Draw splitter edges
            ctx.strokeStyle = 'rgba(255, 255, 150, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add center line
            ctx.strokeStyle = 'rgba(255, 255, 150, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-component.width/2 + 5, 0);
            ctx.lineTo(component.width/2 - 5, 0);
            ctx.stroke();
        }
        else if (component.type === 'prism') {
            // Draw prism triangle
            ctx.fillStyle = 'rgba(255, 150, 150, 0.3)';
            ctx.beginPath();
            ctx.moveTo(-component.width/2, component.height/2);
            ctx.lineTo(0, -component.height/2);
            ctx.lineTo(component.width/2, component.height/2);
            ctx.closePath();
            ctx.fill();
            
            // Draw prism edges
            ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Add rainbow dispersion effect
            const rainbow = ['#ff0000', '#ff9900', '#ffff00', '#00ff00', '#0099ff', '#6633ff'];
            rainbow.forEach((color, i) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-component.width/2 + 5 + i*3, component.height/2 - 5 - i*2);
                ctx.lineTo(0, -component.height/2 + 10 + i*2);
                ctx.stroke();
            });
        }
        
        ctx.restore();
        
        // Draw rotation handle if this component is being dragged
        if (gameState.dragComponent === component && gameState.isDragging) {
            ctx.fillStyle = '#4fc3f7';
            ctx.beginPath();
            ctx.arc(
                component.x + Math.cos(component.angle * Math.PI / 180) * (component.width/2 + 25),
                component.y + Math.sin(component.angle * Math.PI / 180) * (component.width/2 + 25),
                6, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Add glow to rotation handle
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#4fc3f7';
        }
    });
}

// Play a sound effect
function playSound(soundElement) {
    if (soundElement) {
        soundElement.currentTime = 0;
        soundElement.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);