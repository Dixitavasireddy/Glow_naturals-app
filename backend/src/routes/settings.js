const express = require('express');
const router = express.Router();
const StoreSettings = require('../models/StoreSettings');
const { getDatabase } = require('../database');

router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const settingsModel = new StoreSettings(db);
    const settings = settingsModel.getAll();
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:key', (req, res) => {
  try {
    const db = getDatabase();
    const settingsModel = new StoreSettings(db);
    const value = settingsModel.get(req.params.key);
    if (value === null) return res.status(404).json({ error: 'Setting not found' });
    try {
      res.json({ key: req.params.key, value: JSON.parse(value) });
    } catch {
      res.json({ key: req.params.key, value });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:key', (req, res) => {
  try {
    const db = getDatabase();
    const settingsModel = new StoreSettings(db);
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ error: 'value is required' });
    settingsModel.set(req.params.key, value);
    res.json({ key: req.params.key, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
