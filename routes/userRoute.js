const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users with rank
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const users = await User.find().sort({ totalPoints: -1 }).skip(skip).limit(limit);
  const rankedUsers = users.map((user, i) => ({
    _id: user._id,
    name: user.name,
    totalPoints: user.totalPoints,
    avatar: user.avatar,
    rank: i + 1,
  }));
  res.json(rankedUsers);
});

// Add new user
router.post('/', async (req, res) => {

  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    const firstLetter = name.trim().charAt(0).toUpperCase();
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); // Random Hex

    const avatarUrl = `https://placehold.co/100x100/${randomColor}/FFFFFF?text=${firstLetter}`;

    const newUser = new User({
      name: name.trim(),
      avatar: avatarUrl
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
