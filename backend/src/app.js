const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const collectionsRouter = require('./routes/collections');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const newsletterRouter = require('./routes/newsletter');
const pagesRouter = require('./routes/pages');
const discountsRouter = require('./routes/discounts');
const settingsRouter = require('./routes/settings');

function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files (product images, etc.)
  app.use('/static', express.static(path.join(__dirname, '..', 'public')));

  // API Routes
  app.use('/api/products', productsRouter);
  app.use('/api/collections', collectionsRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/pages', pagesRouter);
  app.use('/api/discounts', discountsRouter);
  app.use('/api/settings', settingsRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: 'GlowNaturals', version: '1.0.0' });
  });

  // 404 handler for unknown API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    next();
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
