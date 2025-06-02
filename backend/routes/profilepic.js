import express from 'express';

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.isAuthenticated()) { 
    return res.status(401).send("Not authenticated");
  }
  res.json(req.user.profile_pic);
});

export default router;