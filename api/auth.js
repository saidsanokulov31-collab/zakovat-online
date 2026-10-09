import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Faqat POST ruxsat etilgan' });

    const { username, password, isLogin } = request.body;
    const userKey = `user:${username.toLowerCase()}`;

    try {
        const existingUser = await kv.get(userKey);
        if (isLogin) {
            if (!existingUser) return response.status(400).json({ error: "Bunday ism ro'yxatdan o'tmagan" });
            if (existingUser.password !== password) return response.status(400).json({ error: "Parol noto'g'ri" });
            return response.status(200).json({ message: "Muvaffaqiyatli", user: existingUser });
        } else {
            if (existingUser) return response.status(400).json({ error: "Bu ism band, boshqasini tanlang" });
            const newUser = {
                username: username.toLowerCase(),
                password: password,
                points: 0,
                role: username.toLowerCase() === 'zenfus' ? 'admin' : 'user'
            };
            await kv.set(userKey, newUser);
            return response.status(200).json({ message: "Ro'yxatdan o'tdingiz", user: newUser });
        }
    } catch (error) {
        return response.status(500).json({ error: "Server xatosi" });
    }
}