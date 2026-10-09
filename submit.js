import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Faqat POST' });

    const { username, score } = request.body;
    const userKey = `user:${username}`;

    try {
        const user = await kv.get(userKey);
        if (!user) return response.status(404).json({ error: 'Foydalanuvchi topilmadi' });

        user.points = (user.points || 0) + score;
        await kv.set(userKey, user);
        await kv.zadd('leaderboard', { score: user.points, member: username });

        return response.status(200).json({ message: 'Ball saqlandi', points: user.points });
    } catch (error) {
        return response.status(500).json({ error: 'Server xatosi' });
    }
}