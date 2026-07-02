import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// 1. POST endpoint that increases a page views: post/:id/view
// Whenever this endpoint gets hit, the id of that post is taken and its view is incremented, using incr
app.post('/post/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        const key = `post:${id}:views`;
        const views = await redis.incr(key);
        res.json({
            success: true,
            id,
            views
        });
    } catch (err) {
        console.error('Error incrementing view:', err);
        res.status(500).json({ error: 'Failed to increment view count' });
    }
});

// 2. POST endpoint that increases an individual's score
// In request body: user id and score are taken and added to their score using zincr
app.post('/score', async (req, res) => {
    try {
        const { userId, score } = req.body;
        if (!userId || score === undefined) {
            return res.status(400).json({ error: 'userId and score are required in the request body' });
        }

        const increment = parseFloat(score);
        if (isNaN(increment)) {
            return res.status(400).json({ error: 'score must be a valid number' });
        }

        // zincrby increments the score of the user in the sorted set
        const newScore = await redis.zincrby('leaderboard', increment, userId);
        res.json({
            success: true,
            userId,
            score: parseFloat(newScore)
        });
    } catch (err) {
        console.error('Error updating score:', err);
        res.status(500).json({ error: 'Failed to increment user score' });
    }
});

// 3. GET endpoint to get top 10 users and their score using zrevrange
app.get('/leaderboard', async (req, res) => {
    try {
        // zrevrange fetches top 10 members from index 0 to 9 in descending order (highest score first)
        const result = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
        
        // Format result: ioredis returns ['user1', 'score1', 'user2', 'score2', ...]
        const leaderboard = [];
        for (let i = 0; i < result.length; i += 2) {
            leaderboard.push({
                rank: i / 2 + 1, // Rank starts from 1
                userId: result[i],
                score: parseFloat(result[i + 1])
            });
        }

        res.json({
            success: true,
            leaderboard
        });
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Failed to retrieve leaderboard' });
    }
});

// 4. GET endpoint to get a user's rank
// User id is in body using zrank
app.get('/rank', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'userId is required in the request body' });
        }

        // zrank returns 0-based rank of member in sorted set, ordered from lowest to highest score
        const rank = await redis.zrank('leaderboard', userId);

        if (rank === null) {
            return res.status(404).json({ error: 'User not found in leaderboard' });
        }

        res.json({
            success: true,
            userId,
            rank // 0-based rank from ZRANK
        });
    } catch (err) {
        console.error('Error fetching rank:', err);
        res.status(500).json({ error: 'Failed to retrieve user rank' });
    }
});

// 5. GET endpoint to get views of a post
// The post id is in the URL params, and the view count is fetched using get
app.get('/post/:id/views', async (req, res) => {
    try {
        const { id } = req.params;
        const key = `post:${id}:views`;
        const views = await redis.get(key) || 0; // Default to 0 if key doesn't exist
        res.json({
            success: true,
            id,
            views: parseInt(views, 10)
        });
    } catch (err) {
        console.error('Error fetching post views:', err);
        res.status(500).json({ error: 'Failed to retrieve post views' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});