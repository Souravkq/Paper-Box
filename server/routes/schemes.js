/**
 * Schemes Router
 * Full CRUD for government schemes, with view tracking
 */
const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// ─── GET /api/schemes ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, limit = 12, page = 1 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const schemes = await Scheme.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Scheme.countDocuments(query);
    res.json({ schemes, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/schemes/recommended ────────────────────────────────────────────
// Returns schemes prioritized by user type
router.get('/recommended', protect, async (req, res) => {
  try {
    const { userType } = req.user;
    const schemes = await Scheme.find({
      isActive: true,
      targetUsers: userType
    }).limit(6).sort({ views: -1 });

    // If fewer than 6, fill with general schemes
    if (schemes.length < 6) {
      const ids = schemes.map(s => s._id);
      const extra = await Scheme.find({
        isActive: true,
        _id: { $nin: ids }
      }).limit(6 - schemes.length);
      return res.json([...schemes, ...extra]);
    }
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/schemes/:id ─────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

    // Track in recently viewed if logged in
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await User.findByIdAndUpdate(decoded.id, {
          $push: { recentlyViewed: { $each: [scheme._id], $slice: -10 } }
        });
      } catch {}
    }
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/schemes (admin) ────────────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── PUT /api/schemes/:id (admin) ─────────────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── DELETE /api/schemes/:id (admin) ──────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scheme deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/schemes/stats/overview (admin) ──────────────────────────────────
router.get('/stats/overview', protect, adminOnly, async (req, res) => {
  try {
    const total = await Scheme.countDocuments();
    const active = await Scheme.countDocuments({ isActive: true });
    const byCategory = await Scheme.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json({ total, active, byCategory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
