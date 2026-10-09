import { loadQuizzes } from './quiz.js';

const quizForm = document.getElementById('admin-quiz-form');
const questionForm = document.getElementById('admin-question-form');
const quizSelect = document.getElementById('admin-quiz-select');

async function loadAdminQuizzes() {
    try {
        const res = await fetch('/api/quizzes');
        const quizzes = await res.json();
        
        quizSelect.innerHTML = '<option value="">Avval quiz tanlang...</option>';
        quizzes.forEach(q => {
            const opt = document.createElement('option');
            opt.value = q.id;
            opt.innerText = q.title;
            quizSelect.appendChild(opt);
        });
    } catch (e) {
        console.error("Quizlar yuklanmadi");
    }
}

quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('admin-quiz-title').value;
    const desc = document.getElementById('admin-quiz-desc').value;
    const btn = quizForm.querySelector('button');
    btn.textContent = 'Yaratilmoqda...';
    
    try {
        await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'add_quiz', payload: { title, desc } })
        });
        
        window.showToast("Quiz yaratildi!");
        quizForm.reset();
        loadAdminQuizzes(); 
        loadQuizzes(); 
    } catch(e) {
        window.showToast("Xato yuz berdi", true);
    } finally {
        btn.textContent = 'Yaratish';
    }
});

questionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const quizId = quizSelect.value;
    if(!quizId) {
        window.showToast("Tepadan quiz tanlang!", true);
        return;
    }
    
    const text = document.getElementById('admin-q-text').value;
    const opt1 = document.getElementById('admin-q-opt1').value;
    const opt2 = document.getElementById('admin-q-opt2').value;
    const opt3 = document.getElementById('admin-q-opt3').value;
    const opt4 = document.getElementById('admin-q-opt4').value;
    
    const btn = questionForm.querySelector('button');
    btn.textContent = 'Saqlanmoqda...';
    
    try {
        await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'add_question',
                payload: { quizId, question: { text, opt1, opt2, opt3, opt4 } }
            })
        });
        window.showToast("Savol qo'shildi!");
        questionForm.reset();
        loadQuizzes();
    } catch(e) {
        window.showToast("Xato yuz berdi", true);
    } finally {
        btn.textContent = 'Savolni saqlash';
    }
});

document.getElementById('nav-admin-btn').addEventListener('click', loadAdminQuizzes);