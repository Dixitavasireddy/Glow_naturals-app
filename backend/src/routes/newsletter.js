const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { getDatabase } = require('../database');

router.post('/subscribe', (req, res) => {
  try {
    const db = getDatabase();
    const newsletterModel = new Newsletter(db);
    const { email, first_name, source } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });
    const result = newsletterModel.subscribe({ email, first_name, source });
    if (result.already_subscribed) {
      return res.json({ message: 'You are already subscribed!', subscriber: result });
    }
    res.status(201).json({ message: 'Successfully subscribed!', subscriber: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/unsubscribe', (req, res) => {
  try {
    const db = getDatabase();
    const newsletterModel = new Newsletter(db);
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const result = newsletterModel.unsubscribe(email);
    if (!result) return res.status(404).json({ error: 'Email not found' });
    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/count', (req, res) => {
  try {
    const db = getDatabase();
    const newsletterModel = new Newsletter(db);
    res.json({ count: newsletterModel.count() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
