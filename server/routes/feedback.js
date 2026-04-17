/**
 * Feedback Router
 * Submit and retrieve user feedback/reviews
 */
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protect, adminOnly } = require('../middleware/auth');

// ─── GET /api/feedback ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const feedback = await Feedback.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/feedback ───────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, message, userId } = req.body;
    if (!name || !rating || !message) {
      return res.status(400).json({ message: 'Name, rating and message are required' });
    }
    const fb = await Feedback.create({ name, email, rating, message, user: userId });
    res.status(201).json(fb);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/feedback/:id (admin) ─────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
