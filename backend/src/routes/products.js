const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { getDatabase } = require('../database');

// GET all products
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const productModel = new Product(db);
    const { featured, best_seller, search, product_type, tags, limit, offset } = req.query;

    const products = productModel.findAll({
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      bestSeller: best_seller === 'true' ? true : best_seller === 'false' ? false : undefined,
      search,
      productType: product_type,
      tags,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : 0
    });

    const total = productModel.count();
    res.json({ products, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET product by slug
router.get('/slug/:slug', (req, res) => {
  try {
    const db = getDatabase();
    const productModel = new Product(db);
    const reviewModel = new Review(db);
    const product = productModel.findBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviews = reviewModel.findByProduct(product.id);
    const ratingInfo = reviewModel.getAverageRating(product.id);

    res.json({ product, reviews, rating: ratingInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET product by ID
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const productModel = new Product(db);
    const reviewModel = new Review(db);
    const product = productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviews = reviewModel.findByProduct(product.id);
    const ratingInfo = reviewModel.getAverageRating(product.id);

    res.json({ product, reviews, rating: ratingInfo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create product
router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const productModel = new Product(db);
    const { title, slug, price } = req.body;

    if (!title || !slug || price === undefined) {
      return res.status(400).json({ error: 'Title, slug, and price are required' });
    }

    const product = productModel.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Product with this slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT update product
router.put('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const productModel = new Product(db);
    const product = productModel.update(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const productModel = new Product(db);
    const deleted = productModel.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
