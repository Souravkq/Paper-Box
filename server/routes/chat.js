/**
 * Chat Router
 * Proxies requests to Google Gemini API for AI chatbot
 */
const express = require('express');
const router = express.Router();

// ─── POST /api/chat ───────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { message, userType = 'General Citizen', history = [] } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // Build system context
    const systemContext = `You are PaperBox Assistant, an AI helper for a government subsidy discovery platform called Paper Box. 
The user is a ${userType}. Help them find relevant government schemes, subsidies, and benefits in India.
Be concise, friendly, and helpful. When suggesting schemes, mention the scheme name, category, and key benefit.
If you don't know specific current details, suggest they search the Paper Box platform.`;

    // Format conversation history for Gemini
    const contents = [
      { role: 'user', parts: [{ text: systemContext }] },
      { role: 'model', parts: [{ text: `I'm PaperBox Assistant! I'm here to help you discover government schemes and subsidies as a ${userType}. What would you like to know?` }] },
      ...history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm having trouble connecting right now. Please try again!";

    res.json({ reply });
  } catch (err) {
    // Fallback response if API key not set
    res.json({
      reply: `Hello! I'm PaperBox Assistant. To enable full AI features, please configure your Gemini API key. Meanwhile, you can search for schemes using the search bar on the homepage! Your query was: "${req.body.message}"`
    });
  }
});

module.exports = router;
