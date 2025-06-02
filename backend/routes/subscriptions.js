// routes/mailCounters.js
import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not authenticated");
  }

  const userId = req.user.id;
  try {
    const result = await db.query(
      'SELECT * FROM subscriptions WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);

  } catch (err) {
    console.error('Error fetching subscriptions:', err);
    res.status(500).send('Error retrieving subscriptions');
  }
});

export default router;
