(() => {
    const wordList = [
        "algorithm", "binary", "compiler", "database", "encryption", "firewall", "gateway", "hardware", "interface", "javascript",
        "kernel", "latency", "metadata", "network", "object", "protocol", "query", "runtime", "software", "terminal",
        "universe", "variable", "webhook", "xml", "yield", "zero", "async", "boolean", "canvas", "debug",
        "ethernet", "function", "graph", "hash", "integer", "json", "keyboard", "library", "module", "node",
        "opacity", "package", "queue", "react", "stack", "toolkit", "utility", "virtual", "worker", "xss"
    ];

    let textDisplay, typingInput, wpmDisplay, accuracyDisplay, timerDisplay, restartBtn, resultsModal, finalWpm, finalAccuracy, closeResults, diffBtns;

    let timer;
    let timeLeft = 60;
    let isPlaying = false;
    let currentText = "";
    let charIndex = 0;
    let mistakes = 0;

    let wpmHistory = [];
    let chartInstance = null;

    function getRandomText() {
        let text = "";
        for (let i = 0; i < 40; i++) {
            text += wordList[Math.floor(Math.random() * wordList.length)] + " ";
        }
        return text.trim();
    }

    function initGame() {
        try {
            currentText = getRandomText();
            if (!textDisplay) return;

            textDisplay.innerHTML = "";
            currentText.split("").forEach(char => {
                const span = document.createElement('span');
                span.innerText = char;
                textDisplay.appendChild(span);
            });

            const characters = textDisplay.querySelectorAll('span');
            if (characters.length > 0) {
                characters[0].classList.add('current');
            }

            typingInput.value = "";
            typingInput.disabled = false;
            isPlaying = false;
            charIndex = 0;
            mistakes = 0;
            wpmHistory = [];
            clearInterval(timer);

            wpmDisplay.innerText = "0";
            accuracyDisplay.innerText = "100%";
            timerDisplay.innerText = timeLeft + "s";
            resultsModal.classList.remove('active');
        } catch (error) {
            console.error("Error in initGame:", error);
        }
    }

    function startTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.innerText = timeLeft + "s";
            const currentWpm = updateStats();
            wpmHistory.push(currentWpm);
        } else {
            endGame();
        }
    }

    function updateStats() {
        const totalTime = parseInt(timerDisplay.dataset.totalTime || 60);
        const timeSpent = (totalTime - timeLeft) || 1;
        const correctChars = charIndex - mistakes;

        const wpm = Math.round((correctChars / 5) / (timeSpent / 60)) || 0;
        wpmDisplay.innerText = wpm;

        const accuracy = charIndex > 0 ? Math.round(((charIndex - mistakes) / charIndex) * 100) : 100;
        accuracyDisplay.innerText = accuracy + "%";
        
        return wpm;
    }

    function handleTyping() {
        const characters = textDisplay.querySelectorAll('span');
        const typedChar = typingInput.value[charIndex];

        if (!isPlaying && typingInput.value.length > 0) {
            isPlaying = true;
            timerDisplay.dataset.totalTime = timeLeft;
            timer = setInterval(startTimer, 1000);
        }

        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains('incorrect')) {
                    mistakes--;
                }
                characters[charIndex].classList.remove('correct', 'incorrect', 'current');
                characters[charIndex].classList.add('current');
                if (characters[charIndex + 1]) {
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

        updateStats();
    }

    function endGame() {
        clearInterval(timer);
        isPlaying = false;
        typingInput.disabled = true;

        finalWpm.innerText = wpmDisplay.innerText + " WPM";
        finalAccuracy.innerText = accuracyDisplay.innerText;
        
        renderChart();
        resultsModal.classList.add('active');
    }

    function renderChart() {
        const ctx = document.getElementById('wpm-chart').getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: wpmHistory.map((_, i) => i + 1),
                datasets: [{
                    label: 'WPM',
                    data: wpmHistory,
                    borderColor: '#00e5ff',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        textDisplay = document.getElementById('text-display');
        typingInput = document.getElementById('typing-input');
        wpmDisplay = document.getElementById('wpm');
        accuracyDisplay = document.getElementById('accuracy');
        timerDisplay = document.getElementById('timer');
        restartBtn = document.getElementById('restart-btn');
        resultsModal = document.getElementById('results-modal');
        finalWpm = document.getElementById('final-wpm');
        finalAccuracy = document.getElementById('final-accuracy');
        closeResults = document.getElementById('close-results');
        diffBtns = document.querySelectorAll('.diff-btn');

        if (restartBtn) restartBtn.addEventListener('click', initGame);
        if (closeResults) closeResults.addEventListener('click', initGame);
        if (typingInput) typingInput.addEventListener('input', handleTyping);

        diffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                diffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                timeLeft = parseInt(btn.dataset.time);
                timerDisplay.innerText = timeLeft + "s";
                initGame();
            });
        });

        document.addEventListener('click', () => {
            if (typingInput && !resultsModal.classList.contains('active')) {
                typingInput.focus();
            }
        });

        initGame();
    });
})();
