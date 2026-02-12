import express from 'express';
const router = express.Router();

// In-memory settings store (for dev). Replace with DB in production.
let storedSettings = {
  language: 'fr',
  theme: 'light',
  primaryColor: '#2563eb',
  fontSize: 'normal',
  notifications: { email: true, sms: false, push: true },
};

/**
 * GET /api/user/settings
 * Returns stored settings
 */
router.get('/settings', (req, res) => {
  res.json(storedSettings);
});

/**
 * POST /api/user/settings
 * Replace stored settings (simple implementation)
 */
router.post('/settings', (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  storedSettings = { ...storedSettings, ...payload };
  return res.json({ ok: true, settings: storedSettings });
});

module.exports = router;