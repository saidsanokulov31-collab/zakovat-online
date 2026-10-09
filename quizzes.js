import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method === 'GET') {
        const quizzes = await kv.get('quizzes_data') || [];
        return response.status(200).json(quizzes);
    }

    if (request.method === 'POST') {
        const { type, payload } = request.body;
        let quizzes = await kv.get('quizzes_data') || [];

        if (type === 'add_quiz') {
            const newQuiz = { id: Date.now().toString(), title: payload.title, desc: payload.desc, questions: [] };
            quizzes.push(newQuiz);
            await kv.set('quizzes_data', quizzes);
            return response.status(200).json({ message: 'Quiz yaratildi' });
        }

        if (type === 'add_question') {
            const quizIndex = quizzes.findIndex(q => q.id === payload.quizId);
            if (quizIndex > -1) {
                quizzes[quizIndex].questions.push(payload.question);
                await kv.set('quizzes_data', quizzes);
                return response.status(200).json({ message: 'Savol qo\'shildi' });
            }
            return response.status(404).json({ error: 'Quiz topilmadi' });
        }
    }
}