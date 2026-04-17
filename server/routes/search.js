/**
 * Search Router
 * Smart search with real-time suggestions and user-type prioritization
 */
const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// ─── GET /api/search?q=&category=&userType= ───────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { q = '', category, userType, limit = 10 } = req.query;

    const query = { isActive: true };

    // Text search
    if (q.trim()) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) query.category = category;

    let results = await Scheme.find(query).limit(Number(limit));

    // Prioritize by userType - schemes targeted to the user come first
    if (userType) {
      results.sort((a, b) => {
        const aMatch = a.targetUsers.includes(userType) ? 1 : 0;
        const bMatch = b.targetUsers.includes(userType) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/search/suggestions?q= ──────────────────────────────────────────
// Returns quick title suggestions for autocomplete
router.get('/suggestions', async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q.trim()) return res.json([]);

    const suggestions = await Scheme.find({
      isActive: true,
      title: { $regex: q, $options: 'i' }
    }).limit(6).select('title category');

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
