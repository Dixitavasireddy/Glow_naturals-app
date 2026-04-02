const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { getDatabase } = require('../database');

router.get('/product/:productId', (req, res) => {
  try {
    const db = getDatabase();
    const reviewModel = new Review(db);
    const reviews = reviewModel.findByProduct(req.params.productId);
    const rating = reviewModel.getAverageRating(req.params.productId);
    res.json({ reviews, rating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const reviewModel = new Review(db);
    const { product_id, author, rating } = req.body;
    if (!product_id || !author || !rating) {
      return res.status(400).json({ error: 'product_id, author, and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    const review = reviewModel.create(req.body);
    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const reviewModel = new Review(db);
    const deleted = reviewModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
