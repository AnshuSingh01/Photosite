// Photonics-themed 5-letter words for each level
const levelWords = [
    "OPTIC", "TAPER", "PROBE", "XENON", "MODAL",
    "QDOTS", "SPECT", "BRAGG", "KERMA", "ZBLAN"
];

// Game state
let currentLevel = 0;
let targetWord = "";
let currentRow = 0;
let currentTile = 0;
let gameOver = false;

// DOM elements
const board = document.getElementById("board");
const message = document.getElementById("message");
const nextLevelBtn = document.getElementById("next-level-btn");
const levelDisplay = document.getElementById("level");

// Initialize the game
function initGame() {
    // Set up the board
    board.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.dataset.state = "empty";
            row.appendChild(tile);
        }
        board.appendChild(row);
    }

    // Set target word for current level
    targetWord = levelWords[currentLevel];
    levelDisplay.textContent = currentLevel + 1;

    // Reset game state
    currentRow = 0;
    currentTile = 0;
    gameOver = false;
    message.textContent = "";
    message.className = "message";
    nextLevelBtn.style.display = "none";

    // Highlight first tile
    updateActiveTile();
}

// Update the active tile
function updateActiveTile() {
    // Reset all tiles to empty
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => {
        if (tile.dataset.state === "active") {
            tile.dataset.state = "empty";
        }
    });

    // Set current tile to active if game isn't over
    if (!gameOver && currentRow < 6 && currentTile < 5) {
        const activeRow = board.children[currentRow];
        if (activeRow && activeRow.children[currentTile]) {
            activeRow.children[currentTile].dataset.state = "active";
        }
    }
}

// Handle keyboard input
function handleKeyPress(key) {
    if (gameOver) return;

    if (key === "ENTER") {
        checkGuess();
    } else if (key === "BACKSPACE") {
        deleteLetter();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
}

// Add a letter to the current tile
function addLetter(letter) {
    if (currentTile >= 5) return;

    const activeRow = board.children[currentRow];
    const tile = activeRow.children[currentTile];
    tile.textContent = letter;
    tile.dataset.state = "filled";
    tile.dataset.animation = "pop";
    
    // Remove animation after it completes
    setTimeout(() => {
        tile.dataset.animation = "";
    }, 100);
    
    currentTile++;
    updateActiveTile();
}

// Delete the last letter
function deleteLetter() {
    if (currentTile <= 0) return;

    currentTile--;
    const activeRow = board.children[currentRow];
    const tile = activeRow.children[currentTile];
    tile.textContent = "";
    tile.dataset.state = "empty";
    updateActiveTile();
}

// Check if the current guess is valid
function checkGuess() {
    if (currentTile !== 5) {
        showMessage("Not enough letters");
        return;
    }

    const activeRow = board.children[currentRow];
    let guess = "";
    for (let i = 0; i < 5; i++) {
        guess += activeRow.children[i].textContent;
    }

    evaluateGuess(guess);
}

// Evaluate the guess against the target word
function evaluateGuess(guess) {
    const activeRow = board.children[currentRow];
    const targetLetters = targetWord.split("");
    const guessLetters = guess.split("");
    const result = Array(5).fill("absent");

    // First pass: mark correct letters
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            result[i] = "correct";
            targetLetters[i] = null; // Mark as used
        }
    }

    // Second pass: mark present letters
    for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue;
        
        const index = targetLetters.indexOf(guessLetters[i]);
        if (index !== -1) {
            result[i] = "present";
            targetLetters[index] = null; // Mark as used
        }
    }

    // Animate tiles and update their state
    for (let i = 0; i < 5; i++) {
        const tile = activeRow.children[i];
        tile.dataset.animation = "flip";
        tile.dataset.state = result[i];
        
        // Update keyboard key colors
        const key = document.querySelector(`.key[data-key="${guessLetters[i]}"]`);
        if (key) {
            if (result[i] === "correct" || 
                (result[i] === "present" && key.dataset.state !== "correct") ||
                (result[i] === "absent" && key.dataset.state !== "correct" && key.dataset.state !== "present")) {
                key.dataset.state = result[i];
            }
        }
    }

    // Check if the game is won
    if (guess === targetWord) {
        gameOver = true;
        showMessage(`Level ${currentLevel + 1} Complete!`, true);
        if (currentLevel < 9) {
            nextLevelBtn.style.display = "block";
        } else {
            showMessage("Congratulations! You've completed all levels!", true);
        }
        return;
    }

    // Move to next row
    currentRow++;
    currentTile = 0;

    // Check if the game is lost
    if (currentRow === 6) {
        gameOver = true;
        showMessage(`Game Over! The word was ${targetWord}`, true);
        return;
    }

    updateActiveTile();
}

// Show a message to the player
function showMessage(text, isSuccess = false) {
    message.textContent = text;
    message.className = isSuccess ? "message show success" : "message show";
    
    if (!isSuccess) {
        setTimeout(() => {
            message.className = "message";
        }, 2000);
    }
}

// Move to the next level
function nextLevel() {
    if (currentLevel < 9) {
        currentLevel++;
        initGame();
    }
}

// Event listeners
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleKeyPress("ENTER");
    } else if (e.key === "Backspace") {
        handleKeyPress("BACKSPACE");
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
    }
});

document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => {
        handleKeyPress(key.dataset.key);
    });
});

nextLevelBtn.addEventListener("click", nextLevel);

// Start the game
initGame();