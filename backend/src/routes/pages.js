const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { getDatabase } = require('../database');

router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const pageModel = new Page(db);
    const pages = pageModel.findAll();
    res.json({ pages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/slug/:slug', (req, res) => {
  try {
    const db = getDatabase();
    const pageModel = new Page(db);
    const page = pageModel.findBySlug(req.params.slug);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const pageModel = new Page(db);
    const page = pageModel.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const pageModel = new Page(db);
    const { title, slug } = req.body;
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug are required' });
    const page = pageModel.create(req.body);
    res.status(201).json({ page });
  } catch (error) {
    if (error.message.includes('UNIQUE')) return res.status(409).json({ error: 'Page with this slug already exists' });
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const pageModel = new Page(db);
    const page = pageModel.update(req.params.id, req.body);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ page });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const pageModel = new Page(db);
    const deleted = pageModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
