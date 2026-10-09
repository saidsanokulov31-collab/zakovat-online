let currentQuizData = null;
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;

export async function loadQuizzes() {
    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML = '<p>Yuklanmoqda...</p>';
    
    try {
        const res = await fetch('/api/quizzes');
        const quizzes = await res.json();
        
        quizList.innerHTML = '';
        if(quizzes.length === 0) {
            quizList.innerHTML = '<p>Hozircha quizlar yo\'q.</p>';
            return;
        }
        
        quizzes.forEach((q) => {
            const card = document.createElement('div');
            card.className = 'glass-card';
            const quizDataStr = encodeURIComponent(JSON.stringify(q));
            card.innerHTML = `
                <h3>${q.title}</h3>
                <p>${q.desc}</p>
                <p style="font-size:12px; color:var(--primary); margin: 5px 0;">Savollar soni: ${q.questions.length}</p>
                <button class="btn-large primary-btn" onclick="startQuiz('${quizDataStr}')">Boshlash</button>
            `;
            quizList.appendChild(card);
        });
    } catch(e) {
        quizList.innerHTML = '<p>Internetni tekshiring.</p>';
    }
}

window.startQuiz = function(quizDataEncoded) {
    if(!window.currentUser) {
        window.showToast("Avval tizimga kiring!", true);
        window.navigate('auth');
        return;
    }
    
    currentQuizData = JSON.parse(decodeURIComponent(quizDataEncoded));
    if(currentQuizData.questions.length === 0) {
        window.showToast("Bu quizda hali savollar yo'q", true);
        return;
    }

    currentQuestionIndex = 0;
    score = 0;
    window.navigate('game');
    showQuestion();
}

function showQuestion() {
    if(currentQuestionIndex >= currentQuizData.questions.length) {
        endQuiz();
        return;
    }
    
    const q = currentQuizData.questions[currentQuestionIndex];
    document.getElementById('question-counter').innerText = `Savol ${currentQuestionIndex + 1} / ${currentQuizData.questions.length}`;
    document.getElementById('current-score').innerText = `Ball: ${score}`;
    document.getElementById('question-text').innerText = q.text;
    
    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';
    
    const options = [
        { text: q.opt1, isCorrect: true },
        { text: q.opt2, isCorrect: false },
        { text: q.opt3, isCorrect: false },
        { text: q.opt4, isCorrect: false }
    ];
    options.sort(() => Math.random() - 0.5);
    
    options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt.text;
        btn.onclick = () => checkAnswer(opt.isCorrect, btn, options);
        optsContainer.appendChild(btn);
    });
    
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    let timeLeft = 30;
    const timerText = document.getElementById('timer-text');
    const timerBar = document.getElementById('timer-bar');
    
    timerText.innerText = timeLeft;
    timerBar.style.strokeDashoffset = 0;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        timerBar.style.strokeDashoffset = 283 - (283 * (timeLeft / 30));
        
        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            window.showToast("Vaqt tugadi!", true);
            const buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(b => b.disabled = true);
            currentQuestionIndex++;
            setTimeout(showQuestion, 1500);
        }
    }, 1000);
}

function checkAnswer(isCorrect, btnElement, allOptions) {
    clearInterval(timerInterval);
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);
    
    if(isCorrect) {
        btnElement.classList.add('correct');
        score += 5;
        window.showToast("+5 Ball!");
    } else {
        btnElement.classList.add('wrong');
        window.showToast("Noto'g'ri!", true);
        buttons.forEach((b, index) => {
            if(allOptions[index].isCorrect) b.classList.add('correct');
        });
    }
    
    currentQuestionIndex++;
    setTimeout(showQuestion, 1500);
}

async function endQuiz() {
    window.showToast(`O'yin tugadi! Yig'ilgan ball: ${score}`);
    
    if(score > 0 && window.currentUser) {
        try {
            await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: window.currentUser.username, score: score })
            });
            window.currentUser.points += score;
            localStorage.setItem('zakovatUser', JSON.stringify(window.currentUser));
        } catch (e) {
            console.error(e);
        }
    }
    window.navigate('leaderboard');
}

document.addEventListener('DOMContentLoaded', loadQuizzes);