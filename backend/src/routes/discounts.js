const express = require('express');
const router = express.Router();
const Discount = require('../models/Discount');
const { getDatabase } = require('../database');

router.post('/validate', (req, res) => {
  try {
    const db = getDatabase();
    const discountModel = new Discount(db);
    const { code, order_total } = req.body;
    if (!code) return res.status(400).json({ error: 'Discount code is required' });
    const result = discountModel.validate(code, order_total || 0);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const discountModel = new Discount(db);
    const discounts = discountModel.findAll();
    res.json({ discounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const discountModel = new Discount(db);
    const { code, type, value } = req.body;
    if (!code || !type || value === undefined) {
      return res.status(400).json({ error: 'code, type, and value are required' });
    }
    const discount = discountModel.create(req.body);
    res.status(201).json({ discount });
  } catch (error) {
    if (error.message.includes('UNIQUE')) return res.status(409).json({ error: 'Discount code already exists' });
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const discountModel = new Discount(db);
    const deleted = discountModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Discount not found' });
    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
