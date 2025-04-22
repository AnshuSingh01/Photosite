const gridSize = 10;
let grid = [];
let selectedMirrorType = null;

// Bomb positions (row, col)
const bombPositions = [
    [3, 0], 
    [5, 4],
    [1, 1],
    [0, 8],
    [6, 9],
    [8, 8],
    [9, 0], 
];

function initializeGrid() {
    const gridElement = document.querySelector(".grid");
    gridElement.innerHTML = "";

    for (let row = 0; row < gridSize; row++) {
        const tr = document.createElement("tr");
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const td = document.createElement("td");
            td.dataset.row = row;
            td.dataset.col = col;

            // Set source and target cells
            if (row === 0 && col === 0) {
                td.classList.add("source");
                td.textContent = "🔴";
            } else if (row === gridSize - 1 && col === gridSize - 1) {
                td.classList.add("target");
                td.textContent = "🎯";
            }

            // Place bombs at specified positions
            if (bombPositions.some(([r, c]) => r === row && c === col)) {
                td.classList.add("bomb");
                td.textContent = "💣";
            }

            td.addEventListener("click", () => placeMirror(row, col));
            tr.appendChild(td);
            grid[row][col] = td;
        }
        gridElement.appendChild(tr);
    }
}

function placeMirror(row, col) {
    if (selectedMirrorType && !grid[row][col].classList.contains("source") && !grid[row][col].classList.contains("target") && !grid[row][col].classList.contains("bomb")) {
        grid[row][col].textContent = selectedMirrorType === "slash" ? "/" : "\\";
        grid[row][col].classList.add("mirror");
        grid[row][col].dataset.mirror = selectedMirrorType;
        traceLaser();
    }
}

function traceLaser() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            grid[row][col].classList.remove("laser");
        }
    }

    let x = 0, y = 0;
    let direction = "right";

    while (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
        const cell = grid[x][y];
        cell.classList.add("laser");

        if (cell.classList.contains("target")) {
            document.getElementById("win-message").style.display = "block";
            document.getElementById("next-level-btn").style.display = "block";
            return;
        }

        if (cell.classList.contains("bomb")) {
            return; // Stop the laser if it hits a bomb
        }

        if (cell.classList.contains("mirror")) {
            const mirrorType = cell.dataset.mirror;
            direction = reflectDirection(direction, mirrorType);
        }

        if (direction === "right") y++;
        else if (direction === "left") y--;
        else if (direction === "down") x++;
        else if (direction === "up") x--;
    }
}

function reflectDirection(currentDirection, mirrorType) {
    if (mirrorType === "slash") {
        switch (currentDirection) {
            case "right": return "up";
            case "left": return "down";
            case "up": return "right";
            case "down": return "left";
        }
    } else if (mirrorType === "backslash") {
        switch (currentDirection) {
            case "right": return "down";
            case "left": return "up";
            case "up": return "left";
            case "down": return "right";
        }
    }
    return currentDirection;
}

function resetGame() {
    initializeGrid();
    document.getElementById("win-message").style.display = "none";
    document.getElementById("next-level-btn").style.display = "none";
}

function nextLevel() {
    window.location.href = "LM_index4.html";
}

document.querySelectorAll(".mirror-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedMirrorType = button.dataset.type;
    });
});

initializeGrid();

// You can use JavaScript to disable the right-click context menu:
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});