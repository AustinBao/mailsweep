import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send("Not authenticated");
  }

  try {
    const userId = req.user.id;
    const result = await db.query(`
      SELECT s.id AS subscription_id, COUNT(m.email_id) AS email_count
      FROM subscriptions s
      LEFT JOIN mail_to_delete m ON s.id = m.subscription_id
      WHERE s.user_id = $1
      GROUP BY s.id
    `, [userId]);

    const counts = {};
    result.rows.forEach(row => {
      counts[row.subscription_id] = parseInt(row.email_count);
    });

    res.json(counts);
  } catch (err) {
    console.error("Error fetching email counts:", err);
    res.status(500).send("Error retrieving email counts");
  }
});

export default router;
