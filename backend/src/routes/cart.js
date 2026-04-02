const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { getDatabase } = require('../database');

router.get('/:sessionId', (req, res) => {
  try {
    const db = getDatabase();
    const cartModel = new Cart(db);
    const result = cartModel.getTotal(req.params.sessionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:sessionId/items', (req, res) => {
  try {
    const db = getDatabase();
    const cartModel = new Cart(db);
    const { product_id, quantity, variant } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required' });
    const items = cartModel.addItem(req.params.sessionId, product_id, quantity || 1, variant || null);
    const total = cartModel.getTotal(req.params.sessionId);
    res.json(total);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:sessionId/items/:itemId', (req, res) => {
  try {
    const db = getDatabase();
    const cartModel = new Cart(db);
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'quantity is required' });
    cartModel.updateQuantity(req.params.sessionId, req.params.itemId, quantity);
    const total = cartModel.getTotal(req.params.sessionId);
    res.json(total);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:sessionId/items/:itemId', (req, res) => {
  try {
    const db = getDatabase();
    const cartModel = new Cart(db);
    cartModel.removeItem(req.params.sessionId, req.params.itemId);
    const total = cartModel.getTotal(req.params.sessionId);
    res.json(total);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:sessionId', (req, res) => {
  try {
    const db = getDatabase();
    const cartModel = new Cart(db);
    cartModel.clear(req.params.sessionId);
    res.json({ subtotal: 0, itemCount: 0, items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
