# MCQ Bank App

A modern, responsive Single Page Application (SPA) for practicing Multiple Choice Questions (MCQs). Built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

*   **Dynamic Question Loading**: Upload any JSON file to start a quiz.
*   **Level-Based Progression**: Questions are served in levels of 20.
*   **Randomization**: Questions are shuffled every time you play.
*   **Instant Feedback**: Immediate Correct/Incorrect validation with detailed rationale.
*   **Score Tracking**: Sticky score badge and detailed level summaries.
*   **Responsive Design**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

*   **HTML5**
*   **CSS3** (Custom properties, Flexbox, Grid, Animations)
*   **JavaScript** (ES6+)

## 📖 How to Use

1.  Open `index.html` in your web browser.
2.  Click the **"Upload JSON Questions"** button.
3.  Select a valid JSON file containing your questions (see format below).
4.  Answer the questions!
    *   Select an option to see if you're correct.
    *   Read the rationale.
    *   Click "Next Question" to proceed.
5.  At the end of a level (20 questions), review your stats and choose to continue to the next level.

## 📄 JSON Format

Your question file must be a JSON array of objects with the following structure:

```json
[
  {
    "id": 1,
    "question": "What is the capital of France?",
    "options": [
      "Berlin",
      "Madrid",
      "Paris",
      "Rome"
    ],
    "answer": "C",
    "rationale": "Paris is the capital and most populous city of France."
  },
  ...
]
```

*   **id**: Unique identifier for the question.
*   **question**: The question text.
*   **options**: An array of strings representing the choices.
*   **answer**: The correct option letter (A, B, C, D, etc.) corresponding to the index (A=0, B=1, ...).
*   **rationale**: Explanation for the correct answer.

## 👨‍💻 Author

Created by : **Fayez Mawad** using **Google Antigravity**
