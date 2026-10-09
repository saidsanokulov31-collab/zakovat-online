const leaderboardList = document.getElementById('leaderboard-list');
let leaderboardInterval;

export async function fetchLeaderboard() {
    try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        
        leaderboardList.innerHTML = '';
        
        if (data.length === 0) {
            leaderboardList.innerHTML = '<p style="text-align:center;">Hali hech kim ball yig\'madi.</p>';
            return;
        }

        let rank = 1;
        data.forEach((user) => {
            const li = document.createElement('li');
            li.className = 'leaderboard-item glass-card';
            
            let medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            const prettyName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
            const isMe = window.currentUser && window.currentUser.username === user.username;
            
            li.style = isMe ? 'border: 2px solid var(--primary);' : '';
            li.innerHTML = `
                <span>${medal} ${prettyName} ${isMe ? '(Siz)' : ''}</span>
                <span style="color: var(--primary); font-weight: 800;">${user.points} ball</span>
            `;
            leaderboardList.appendChild(li);
            rank++;
        });
    } catch (e) {
        console.error("Reyting yuklanmadi");
    }
}

document.querySelector('button[onclick="navigate(\'leaderboard\')"]').addEventListener('click', () => {
    fetchLeaderboard();
    clearInterval(leaderboardInterval);
    leaderboardInterval = setInterval(fetchLeaderboard, 3000);
});

document.querySelectorAll('.nav-btn, .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!e.target.innerHTML.includes('Reyting') && !e.target.innerText.includes('Reyting')) {
            clearInterval(leaderboardInterval);
        }
    });
});