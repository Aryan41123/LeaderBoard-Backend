const express = require('express');
const router = express.Router();
const User = require('../models/user');
const History = require('../models/History');

// Claim random points
router.post('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const points = Math.floor(Math.random() * 10) + 1;
  user.totalPoints += points;
  await user.save();

  const history = new History({
    userId: user._id,
    userName: user.name,
    points,
  });
  await history.save();

  res.json({ userId: user._id, name: user.name, points });
});

// Get claim history
router.get('/history', async (req, res) => {
  const history = await History.find().sort({ claimedAt: -1 });
  res.json(history);
});

module.exports = router;
