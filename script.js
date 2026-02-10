// State Variables
let allQuestions = [];
let roundQuestions = []; // Currently playing 20 questions
let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let history = []; // { id, chosen, correct, result }
let correctCount = 0;
let wrongCount = 0;

// DOM Elements
const fileInput = document.getElementById('file-input');
const screenUpload = document.getElementById('screen-upload');
const screenQuiz = document.getElementById('screen-quiz');
const screenSummary = document.getElementById('screen-summary');
const screenCompletion = document.getElementById('screen-completion');

// Quiz Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const levelNumEl = document.getElementById('level-num');
const questionNumEl = document.getElementById('question-num');
const totalQuestionsEl = document.getElementById('total-questions');
const progressBar = document.getElementById('progress-bar');
const currentScoreEl = document.getElementById('current-score');
const scoreBadge = document.getElementById('score-badge');

// Feedback Elements
const feedbackArea = document.getElementById('feedback-area');
const feedbackMessage = document.getElementById('feedback-message');
const rationaleBox = document.getElementById('rationale-box');
const rationaleText = document.getElementById('rationale-text');
const encouragementText = document.getElementById('encouragement-text');
const nextBtn = document.getElementById('next-btn');

// Summary Elements
const summaryScoreEl = document.getElementById('summary-score');
const summaryCorrectEl = document.getElementById('summary-correct');
const summaryWrongEl = document.getElementById('summary-wrong');
const summaryPercentEl = document.getElementById('summary-percent');
const nextLevelBtn = document.getElementById('next-level-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreVal = document.getElementById('final-score-val');

// Event Listeners
fileInput.addEventListener('change', handleFileUpload);
nextBtn.addEventListener('click', handleNextQuestion);
nextLevelBtn.addEventListener('click', startNextLevel);
restartBtn.addEventListener('click', () => location.reload());

// --- Core Logic ---

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const json = JSON.parse(e.target.result);
            if (Array.isArray(json) && json.length > 0) {
                // Initialize Game
                allQuestions = shuffleArray(json); // Shuffle ALL questions initially
                score = 0;
                currentLevel = 1;
                history = [];

                screenUpload.classList.remove('active');
                screenUpload.classList.add('hidden');

                startLevel();
            } else {
                alert("Invalid JSON format. Please upload a valid Question Bank file.");
            }
        } catch (error) {
            console.error(error);
            alert("Error parsing JSON file.");
        }
    };
    reader.readAsText(file);
}

function startLevel() {
    // Determine questions for this level
    // We treat 'allQuestions' as a queue. We take the next 20.

    const startIndex = (currentLevel - 1) * 20;

    // Check if we have questions left
    if (startIndex >= allQuestions.length) {
        showCompletionScreen();
        return;
    }

    const endIndex = Math.min(startIndex + 20, allQuestions.length);
    roundQuestions = allQuestions.slice(startIndex, endIndex);

    // Reset Level State
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;

    // Update UI for Layout
    levelNumEl.textContent = currentLevel;
    totalQuestionsEl.textContent = roundQuestions.length;
    scoreBadge.classList.remove('hidden');

    screenSummary.classList.add('hidden');
    screenQuiz.classList.remove('hidden');
    screenQuiz.classList.add('active');

    renderQuestion();
}

function renderQuestion() {
    const q = roundQuestions[currentQuestionIndex];

    // Update Progress
    questionNumEl.textContent = currentQuestionIndex + 1;
    const progressPercent = ((currentQuestionIndex) / roundQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Render Text
    questionText.textContent = q.question;
    optionsContainer.innerHTML = '';

    // Clear Feedback
    feedbackArea.classList.add('hidden');

    // Render Options
    q.options.forEach((opt, index) => {
        // Convert array index to Letter (A, B, C...) if needed, 
        // OR simply pass the full text string as the value if the JSON answer key uses letters matching options.
        // Assuming JSON 'answer' field is "A", "B", etc. and options are just strings 0-4.

        const letter = String.fromCharCode(65 + index); // 0->A, 1->B

        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<strong>${letter}.</strong> ${opt}`;
        btn.dataset.letter = letter;
        btn.onclick = () => handleAnswerSelect(letter, q, btn);
        optionsContainer.appendChild(btn);
    });
}

function handleAnswerSelect(selectedLetter, questionObj, selectedBtn) {
    // Disable all buttons
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedLetter === questionObj.answer;

    // Visual Feedback
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score += 5;
        correctCount++;
    } else {
        selectedBtn.classList.add('wrong');
        wrongCount++;
        // Highlight correct answer
        allBtns.forEach(b => {
            if (b.dataset.letter === questionObj.answer) {
                b.classList.add('correct');
            }
        });
    }

    // Update Score UI
    currentScoreEl.textContent = score;

    // Show Feedback Section
    showFeedback(isCorrect, questionObj);
}

function showFeedback(isCorrect, q) {
    feedbackArea.classList.remove('hidden');

    if (isCorrect) {
        feedbackMessage.textContent = "Correct!";
        feedbackMessage.className = "feedback-message correct";
        encouragementText.textContent = getRandomEncouragement(true);
    } else {
        feedbackMessage.textContent = "Incorrect";
        feedbackMessage.className = "feedback-message wrong";
        encouragementText.textContent = getRandomEncouragement(false);
    }

    // Show Rationale
    if (q.rationale) {
        rationaleBox.classList.remove('hidden');
        rationaleText.textContent = q.rationale;
    } else {
        rationaleBox.classList.add('hidden');
    }
}

function handleNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < roundQuestions.length) {
        renderQuestion();
    } else {
        showLevelSummary();
    }
}

function showLevelSummary() {
    screenQuiz.classList.add('hidden');
    screenSummary.classList.remove('hidden');
    screenSummary.classList.add('active');

    summaryScoreEl.textContent = score;
    summaryCorrectEl.textContent = correctCount;
    summaryWrongEl.textContent = wrongCount;

    const total = correctCount + wrongCount;
    const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
    summaryPercentEl.textContent = `${percent}%`;

    // Check if more questions exist
    const nextStartIndex = currentLevel * 20;
    if (nextStartIndex >= allQuestions.length) {
        nextLevelBtn.textContent = "Finish Quiz";
    } else {
        nextLevelBtn.textContent = "Want 20 more questions?";
    }
}

function startNextLevel() {
    currentLevel++;
    startLevel();
}

function showCompletionScreen() {
    screenSummary.classList.add('hidden');
    screenCompletion.classList.remove('hidden');
    screenCompletion.classList.add('active');
    scoreBadge.classList.add('hidden');
    finalScoreVal.textContent = score;
}

// Utils
function shuffleArray(array) {
    // Fisher-Yates shuffle
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

function getRandomEncouragement(success) {
    const successMsgs = [
        "Nice effort—let’s keep going!",
        "Great job! You're on a roll.",
        "Perfect!",
        "Excellent work.",
        "Spot on!"
    ];
    const retryMsgs = [
        "Don't worry, you'll get the next one!",
        "Learning is a process—keep going!",
        "Nice try! Let's tackle the next one.",
        "Shake it off, you've got this.",
        "Close one!"
    ];
    const pool = success ? successMsgs : retryMsgs;
    return pool[Math.floor(Math.random() * pool.length)];
}
