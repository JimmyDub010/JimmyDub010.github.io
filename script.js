const wheel = [500, 600, 700, 800, 900, 1000, 2500, "Bankrupt", "Lose a Turn"];

let puzzles = [];
let currentRound = 1;
let currentPuzzle = "";
let currentCategory = "";
let revealedPuzzle = "";
let guessedLetters = [];
let playerScore = 0;
let isSpin = true;

const puzzleElement = document.getElementById("puzzle");
const categoryElement = document.getElementById("category");
const roundNumberElement = document.getElementById("round-number");
const playerScoreElement = document.getElementById("player-score");
const messageElement = document.getElementById("message");
const spinButton = document.getElementById("spin-button");
const buyVowelButton = document.getElementById("buy-vowel-button");
const solveButton = document.getElementById("solve-button");
const letterInputContainer = document.getElementById("letter-input-container");
const letterInput = document.getElementById("letter-input");
const submitLetterButton = document.getElementById("submit-letter-button");

function initializeGame() {
    puzzles = [...puzzlesData];  // reset puzzles array from original data
    currentRound = 1;
    playerScore = 0;
    updateScore();
    startRound();
}

function startRound() {
    if (currentRound <= 3) {
        const puzzleIndex = Math.floor(Math.random() * puzzles.length);
        const selectedPuzzle = puzzles.splice(puzzleIndex, 1)[0];
        currentPuzzle = selectedPuzzle.puzzle;
        currentCategory = selectedPuzzle.category;
        revealedPuzzle = revealPuzzle(currentPuzzle, []);
        puzzleElement.textContent = revealedPuzzle;
        categoryElement.textContent = `Category: ${currentCategory}`;
        roundNumberElement.textContent = currentRound;
        guessedLetters = [];
        showMessage("");
    } else {
        startBonusRound();
    }
}

function revealPuzzle(puzzle, letters) {
    let revealed = "";
    for (const char of puzzle) {
        if (char === " " || letters.includes(char)) {
            revealed += char;
        } else {
            revealed += "*";
        }
    }
    return revealed;
}

function handleGuess(letter, spinValue) {
    letter = letter.toUpperCase();
    if (!guessedLetters.includes(letter)) {
        guessedLetters.push(letter);
        if (currentPuzzle.includes(letter)) {
            const count = currentPuzzle.split(letter).length - 1;
            if (isSpin) {
                playerScore += count * spinValue;
            } else {
                playerScore -= 250;
            }
            updateScore();
            revealedPuzzle = revealPuzzle(currentPuzzle, guessedLetters);
            puzzleElement.textContent = revealedPuzzle;
            if (!revealedPuzzle.includes("*")) {
                showMessage("You solved the puzzle!");
                setTimeout(() => {
                    currentRound++;
                    startRound();
                }, 2000);
            }
        } else {
            showMessage("Incorrect letter.");
        }
    }
    letterInput.value = "";
    letterInputContainer.classList.add("hidden");
}

function updateScore() {
    playerScoreElement.textContent = playerScore;
}

function showMessage(msg) {
    messageElement.textContent = msg;
}

spinButton.addEventListener("click", () => {
    isSpin = true;
    const spinValue = wheel[Math.floor(Math.random() * wheel.length)];
    if (spinValue === "Bankrupt") {
        playerScore = 0;
        updateScore();
        showMessage("Bankrupt!");
    } else if (spinValue === "Lose a Turn") {
        showMessage("You lost a turn.");
    } else {
        showMessage(`You spun ${spinValue}`);
        letterInputContainer.classList.remove("hidden");
        submitLetterButton.onclick = () => handleGuess(letterInput.value, spinValue);
    }
});

buyVowelButton.addEventListener("click", () => {
    isSpin = false;
    if (playerScore >= 250) {
        letterInputContainer.classList.remove("hidden");
        submitLetterButton.onclick = () => handleGuess(letterInput.value, null);
    } else {
        showMessage("You don't have enough money to buy a vowel.");
    }
});

solveButton.addEventListener("click", () => {
    const solution = prompt("Enter your solution:");
    if (solution && solution.toUpperCase() === currentPuzzle) {
        showMessage("You solved the puzzle!");
        playerScore += 1000; // Bonus for solving
        updateScore();
        setTimeout(() => {
            currentRound++;
            startRound();
        }, 2000);
    } else {
        showMessage("Incorrect solution.");
    }
});

letterInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        submitLetterButton.click();
    }
});
let bonusTimer; // global timer variable

function startBonusRound() {
    showMessage("Bonus Round!");

    spinButton.disabled = true;
    buyVowelButton.disabled = true;
    solveButton.disabled = false; // keep active

    const puzzleIndex = Math.floor(Math.random() * puzzles.length);
    const selectedPuzzle = puzzles.splice(puzzleIndex, 1)[0];
    currentPuzzle = selectedPuzzle.puzzle.toUpperCase();
    currentCategory = selectedPuzzle.category;
    categoryElement.textContent = `Category: ${currentCategory}`;

    guessedLetters = ["R", "S", "T", "L", "N", "E"];
    revealedPuzzle = revealPuzzle(currentPuzzle, guessedLetters);
    puzzleElement.textContent = revealedPuzzle;

    let timeLeft = 10;
    showMessage(`You have ${timeLeft} seconds to solve the puzzle!`);

    // Update timer every second
    bonusTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            showMessage(`You have ${timeLeft} seconds to solve the puzzle!`);
        } else {
            clearInterval(bonusTimer);
            showMessage("Time's up!");
            alert(`Sorry, the correct answer was: ${currentPuzzle}`);
            resetAfterBonus();
        }
    }, 1000);
}

solveButton.addEventListener("click", () => {
    if (currentRound === 4) { // assuming bonus round is round 4
        clearInterval(bonusTimer);
        const solution = prompt("Enter your final guess:")?.toUpperCase();
        if (solution === currentPuzzle) {
            alert("Congratulations! You won the bonus round and $25,000!");
            playerScore += 25000;
            updateScore();
        } else {
            alert(`Sorry, the correct answer was: ${currentPuzzle}`);
        }
        resetAfterBonus();
    } else {
        // Normal solve logic for regular rounds here...
    }
});

function resetAfterBonus() {
    spinButton.disabled = false;
    buyVowelButton.disabled = false;
    solveButton.disabled = false;
    initializeGame();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});
