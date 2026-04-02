const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const { getDatabase } = require('../database');

router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const collectionModel = new Collection(db);
    const collections = collectionModel.findAll();
    res.json({ collections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/slug/:slug', (req, res) => {
  try {
    const db = getDatabase();
    const collectionModel = new Collection(db);
    const productModel = new Product(db);
    const collection = collectionModel.findBySlug(req.params.slug);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    const products = productModel.findByCollection(collection.id);
    res.json({ collection, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const collectionModel = new Collection(db);
    const productModel = new Product(db);
    const collection = collectionModel.findById(req.params.id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    const products = productModel.findByCollection(collection.id);
    res.json({ collection, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const collectionModel = new Collection(db);
    const { title, slug } = req.body;
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' });
    const collection = collectionModel.create(req.body);
    res.status(201).json({ collection });
  } catch (error) {
    if (error.message.includes('UNIQUE')) return res.status(409).json({ error: 'Collection with this slug already exists' });
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/products', (req, res) => {
  try {
    const db = getDatabase();
    const collectionModel = new Collection(db);
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ error: 'product_id is required' });
    collectionModel.addProduct(req.params.id, product_id);
    res.json({ message: 'Product added to collection' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const collectionModel = new Collection(db);
    const deleted = collectionModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Collection not found' });
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
