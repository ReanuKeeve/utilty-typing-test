const wordList = [
    "algorithm", "binary", "compiler", "database", "encryption", "firewall", "gateway", "hardware", "interface", "javascript",
    "kernel", "latency", "metadata", "network", "object", "protocol", "query", "runtime", "software", "terminal",
    "universe", "variable", "webhook", "xml", "yield", "zero", "async", "boolean", "canvas", "debug",
    "ethernet", "function", "graph", "hash", "integer", "json", "keyboard", "library", "module", "node",
    "opacity", "package", "queue", "react", "stack", "toolkit", "utility", "virtual", "worker", "xss"
];

const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const resultsModal = document.getElementById('results-modal');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const closeResults = document.getElementById('close-results');
const diffBtns = document.querySelectorAll('.diff-btn');

let timer;
let timeLeft = 60;
let isPlaying = false;
let currentText = "";
let charIndex = 0;
let mistakes = 0;
let totalChars = 0;

function getRandomText() {
    let text = "";
    for (let i = 0; i < 50; i++) {
        text += wordList[Math.floor(Math.random() * wordList.length)] + " ";
    }
    return text.trim();
}

function initGame() {
    currentText = getRandomText();
    textDisplay.innerHTML = "";
    currentText.split("").forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
    });
    textDisplay.querySelectorAll('span')[0].classList.add('current');

    typingInput.value = "";
    isPlaying = false;
    charIndex = 0;
    mistakes = 0;
    totalChars = 0;
    clearInterval(timer);
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = "100%";
    timerDisplay.innerText = timeLeft + "s";
    resultsModal.classList.remove('active');
}

function startTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = timeLeft + "s";
        updateWPM();
    } else {
        endGame();
    }
}

function updateWPM() {
    const timeSpent = (parseInt(timerDisplay.dataset.totalTime || 60) - timeLeft) / 60;
    const correctChars = charIndex - mistakes;
    const wpm = Math.round((correctChars / 5) / timeSpent) || 0;
    wpmDisplay.innerText = wpm > 0 ? wpm : 0;
}

function updateAccuracy() {
    const accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100) || 100;
    accuracyDisplay.innerText = accuracy + "%";
}

function handleTyping(e) {
    const characters = textDisplay.querySelectorAll('span');
    const typedChar = typingInput.value.split("")[charIndex];

    if (!isPlaying && typedChar != null) {
        isPlaying = true;
        const totalTime = parseInt(timerDisplay.innerText);
        timerDisplay.dataset.totalTime = totalTime;
        timer = setInterval(startTimer, 1000);
    }

    if (typedChar == null) {
        // Backspace handled by input value reduction, but we need to update visual
        if (charIndex > 0) {
            charIndex--;
            characters[charIndex].classList.remove('correct', 'incorrect', 'current');
            characters[charIndex].classList.add('current');
            if (charIndex + 1 < characters.length) {
                characters[charIndex + 1].classList.remove('current');
            }
        }
    } else {
        if (characters[charIndex].innerText === typedChar) {
            characters[charIndex].classList.add('correct');
        } else {
            mistakes++;
            characters[charIndex].classList.add('incorrect');
        }

        characters[charIndex].classList.remove('current');
        charIndex++;

        if (charIndex < characters.length) {
            characters[charIndex].classList.add('current');
        } else {
            endGame();
        }
    }

    updateAccuracy();
}

function endGame() {
    clearInterval(timer);
    isPlaying = false;
    typingInput.disabled = true;

    finalWpm.innerText = wpmDisplay.innerText + " WPM";
    finalAccuracy.innerText = accuracyDisplay.innerText;
    resultsModal.classList.add('active');
}

restartBtn.addEventListener('click', () => {
    typingInput.disabled = false;
    initGame();
    typingInput.focus();
});

closeResults.addEventListener('click', () => {
    typingInput.disabled = false;
    initGame();
});

typingInput.addEventListener('input', handleTyping);

diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timeLeft = parseInt(btn.dataset.time);
        timerDisplay.innerText = timeLeft + "s";
        initGame();
    });
});

// Auto-focus input on click anyway
document.addEventListener('click', () => {
    if (!resultsModal.classList.contains('active')) {
        typingInput.focus();
    }
});

initGame();
