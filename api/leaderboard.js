import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method !== 'GET') return response.status(405).json({ error: 'Faqat GET' });

    try {
        const results = await kv.zrange('leaderboard', 0, 99, { rev: true, withScores: true });
        const leaderboard = results.map(item => ({
            username: item.member,
            points: item.score
        }));
        return response.status(200).json(leaderboard);
    } catch (error) {
        return response.status(200).json([]);
    }
}