const quizData = [
  {
    clue: "Clue 1/5 - The Logs Whisper...",
    question: "You check the logs and see: undefined is not a function. What does that most likely mean?",
    answers: [
      { text: "Someone tried to call a variable like a function" },
      { text: "The server exploded" },
      { text: "You need more coffee" },
      { text: "The app is haunted" }
    ],
    correctIndex: 0
  },
  {
    clue: "Clue 2/5 - Database Dungeon",
    question: "You query a table and get nothing back, even though you're sure it has data. What's the likely culprit?",
    answers: [
      { text: "Forgot the WHERE clause" },
      { text: "Table's on vacation" },
      { text: "Wrong database selected" },
      { text: "The data union went on strike" }
    ],
    correctIndex: 2
  },
  {
    clue: "Clue 3/5 - The Styling Phantom",
    question: "You noticed that none of the styles are applying. What do you check first?",
    answers: [
      { text: "If the CSS is haunted" },
      { text: "If the link to the CSS is correct" },
      { text: "If the browser forgot how to CSS" },
      { text: "If you used Comic Sans" }
    ],
    correctIndex: 1
  },
  {
    clue: "Clue 4/5 - The Caching Curse",
    question: "You fixed a bug, reload the browser... and nothing changes. What's going on?",
    answers: [
      { text: "Your browser is stuck in the past" },
      { text: "Your code is time-traveling" },
      { text: "You forgot to save" },
      { text: "Cache is showing old files" }
    ],
    correctIndex: 3
  },
  {
    clue: "Clue 5/5 - The Bracket Bandit",
    question: "The script won't run, and you're staring at your code for 20 minutes. Then you see it...",
    answers: [
      { text: "A missing semicolon" },
      { text: "A console.log typo" },
      { text: "A curly bracket is missing" },
      { text: "A ghost in the machine" }
    ],
    correctIndex: 2
  }
];

const introCard = document.querySelector('.intro-card');
const quizCard = document.querySelector('.question-card');
const quizContainer = document.querySelector('.quiz-container');
const clues = document.getElementById('clue');
const questionEl = document.getElementById('question');
const answerEls = document.querySelectorAll('input[type="radio"]');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const feedback = document.getElementById('feedback');
const submitBtn = document.getElementById('submit');
const startBtn = document.getElementById('start');

let currentQuiz = 0;
let score = 0;
let correctOptionId = '';

const labelMap = ['a', 'b', 'c', 'd'];
const labelTextMap = {
  a: a_text,
  b: b_text,
  c: c_text,
  d: d_text
};

function deselectAnswers() {
  answerEls.forEach(el => el.checked = false);
  document.querySelectorAll('ul li').forEach(li => li.classList.remove('selected'));
}

function selectedAns() {
  let selectedId = null;
  answerEls.forEach(el => {
    if (el.checked) selectedId = el.id;
  });
  return selectedId;
}

function loadQuiz() {
  deselectAnswers();
  submitBtn.style.backgroundColor = '#333';
  submitBtn.disabled = true;

  const current = quizData[currentQuiz];
  const originalAnswers = [...current.answers];
  const shuffledAnswers = originalAnswers
    .map((ans, index) => ({ ...ans, originalIndex: index }))
    .sort(() => Math.random() - 0.5);

  questionEl.innerText = current.question;
  clues.innerText = current.clue;

  shuffledAnswers.forEach((ans, i) => {
    const id = labelMap[i];
    labelTextMap[id].innerText = ans.text;

    if (ans.originalIndex === current.correctIndex) {
      correctOptionId = id;
    }
  });

  submitBtn.textContent = (currentQuiz === quizData.length - 1) ? 'Run Analysis' : 'Next Clue';
}

answerEls.forEach(el => {
  el.addEventListener('change', () => {
    document.querySelectorAll('ul li').forEach(li => li.classList.remove('selected'));
    el.closest('li').classList.add('selected');
    submitBtn.style.backgroundColor = '#a4e93d';
    submitBtn.disabled = false
  });
});

startBtn.addEventListener('click', () => {
  introCard.classList.add('hidden');
  quizCard.classList.remove('hidden');
  loadQuiz();
});

submitBtn.addEventListener('click', () => {
  const selected = selectedAns();
  if (!selected) return;

  const isCorrect = selected === correctOptionId;

  if (isCorrect) {
    score++;
    feedback.innerText = 'Good job! You are one clue closer to solving the mystery.';
    feedback.style.color = '#a4e93d';
    feedback.classList.add('show');

    setTimeout(() => {
      submitBtn.style.backgroundColor = '#333';
      quizCard.style.opacity = 0;

      setTimeout(() => {
        currentQuiz++;
        if (currentQuiz < quizData.length) {
          loadQuiz();
          feedback.classList.remove('show');
          quizCard.style.opacity = 1;
        } else {
          showResult();
        }
      }, 400);
    }, 2000);
  } else {
    const correctText = labelTextMap[correctOptionId].innerText;
    feedback.innerText = `Not quite. Hint: It's something like "${correctText}"`;
    feedback.style.color = '#dc143c';
    feedback.classList.add('show');

    setTimeout(() => {
      quizCard.style.opacity = 0;
      setTimeout(() => {
        currentQuiz++;
        if (currentQuiz < quizData.length) {
          loadQuiz();
          quizCard.style.opacity = 1;
          feedback.innerText = '';
          feedback.classList.remove('show');
        } else {
          showResult();
        }
      }, 400);
    }, 2000);
  }
});

function showResult() {
  let endMessage = `You solved ${score}/${quizData.length} clues.`;

  if (score === quizData.length) {
    endMessage += ` 🏆 Legendary Bug Hunter!`;
  }

  quizContainer.innerHTML = `
    <h2>Case Closed!</h2>
    <p>${endMessage}</p>
    <button onclick="location.reload()">Restart Investigation</button>
  `;

  if (score === quizData.length) {
    confetti();
  }
}
