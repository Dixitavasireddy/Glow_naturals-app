const request = require('supertest');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const createApp = require('../src/app');
const { initializeTables, resetDatabase } = require('../src/database');

// Use in-memory database for tests
let db;
let app;

// Override getDatabase to use test database
jest.mock('../src/database', () => {
  const original = jest.requireActual('../src/database');
  let testDb = null;
  return {
    ...original,
    getDatabase: () => {
      if (!testDb) {
        testDb = new (require('better-sqlite3'))(':memory:');
        testDb.pragma('journal_mode = WAL');
        testDb.pragma('foreign_keys = ON');
        original.initializeTables(testDb);
      }
      return testDb;
    },
    closeDatabase: () => {
      if (testDb) {
        testDb.close();
        testDb = null;
      }
    },
    resetDatabase: () => {
      testDb = null;
    },
    _getTestDb: () => testDb
  };
});

const { getDatabase, closeDatabase } = require('../src/database');

beforeAll(() => {
  db = getDatabase();
  app = createApp();
});

afterAll(() => {
  closeDatabase();
});

// Seed test data helper
function seedTestData() {
  const crypto = require('crypto');

  // Create a test product
  const productId = crypto.randomUUID();
  db.prepare(`
    INSERT INTO products (id, title, slug, description, short_description, price, compare_price, sku,
      inventory_quantity, product_type, vendor, tags, images, variants, featured, best_seller, status,
      meta_title, meta_description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    productId, 'Test Serum', 'test-serum', 'A test product', 'Short desc',
    29.99, 39.99, 'TEST-001', 50, 'Serum', 'GlowNaturals',
    JSON.stringify(['test', 'serum']),
    JSON.stringify(['/images/test.jpg']),
    JSON.stringify([{ name: '30ml', price: 29.99 }]),
    1, 1, 'active', 'Test Serum', 'A test serum'
  );

  // Create a test collection
  const collectionId = crypto.randomUUID();
  db.prepare(`
    INSERT INTO collections (id, title, slug, description, sort_order, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(collectionId, 'Test Collection', 'test-collection', 'A test collection', 1, 'active');

  // Map product to collection
  db.prepare('INSERT INTO product_collections (product_id, collection_id) VALUES (?, ?)').run(productId, collectionId);

  // Create a test review
  const reviewId = crypto.randomUUID();
  db.prepare(`
    INSERT INTO reviews (id, product_id, author, email, rating, title, body, verified, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(reviewId, productId, 'Test User', 'test@example.com', 5, 'Great!', 'Loved it', 1, 'published');

  // Create a test page
  const pageId = crypto.randomUUID();
  db.prepare(`
    INSERT INTO pages (id, title, slug, content, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(pageId, 'About Us', 'about', '<h1>About Us</h1>', 'published');

  // Create a test discount
  const discountId = crypto.randomUUID();
  db.prepare(`
    INSERT INTO discount_codes (id, code, type, value, min_order_amount, active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(discountId, 'TEST10', 'percentage', 10, 0, 1);

  // Store settings
  db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)').run('store_name', 'GlowNaturals');

  return { productId, collectionId, reviewId, pageId, discountId };
}

let testData;

beforeAll(() => {
  testData = seedTestData();
});

// ==================== HEALTH CHECK ====================
describe('GET /api/health', () => {
  test('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.store).toBe('GlowNaturals');
  });
});

// ==================== PRODUCTS ====================
describe('Products API', () => {
  test('GET /api/products - should return all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products).toBeDefined();
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThan(0);
  });

  test('GET /api/products?featured=true - should return featured products', async () => {
    const res = await request(app).get('/api/products?featured=true');
    expect(res.status).toBe(200);
    expect(res.body.products.every(p => p.featured === true)).toBe(true);
  });

  test('GET /api/products?best_seller=true - should return best sellers', async () => {
    const res = await request(app).get('/api/products?best_seller=true');
    expect(res.status).toBe(200);
    expect(res.body.products.every(p => p.best_seller === true)).toBe(true);
  });

  test('GET /api/products?search=Test - should search products', async () => {
    const res = await request(app).get('/api/products?search=Test');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  test('GET /api/products/:id - should return product by ID', async () => {
    const res = await request(app).get(`/api/products/${testData.productId}`);
    expect(res.status).toBe(200);
    expect(res.body.product).toBeDefined();
    expect(res.body.product.id).toBe(testData.productId);
    expect(res.body.product.title).toBe('Test Serum');
    expect(res.body.reviews).toBeDefined();
    expect(res.body.rating).toBeDefined();
  });

  test('GET /api/products/slug/test-serum - should return product by slug', async () => {
    const res = await request(app).get('/api/products/slug/test-serum');
    expect(res.status).toBe(200);
    expect(res.body.product.slug).toBe('test-serum');
  });

  test('GET /api/products/:id - should return 404 for non-existent product', async () => {
    const res = await request(app).get('/api/products/non-existent-id');
    expect(res.status).toBe(404);
  });

  test('POST /api/products - should create a product', async () => {
    const res = await request(app).post('/api/products').send({
      title: 'New Product',
      slug: 'new-product',
      price: 19.99,
      description: 'A new product'
    });
    expect(res.status).toBe(201);
    expect(res.body.product.title).toBe('New Product');
    expect(res.body.product.price).toBe(19.99);
  });

  test('POST /api/products - should return 400 without required fields', async () => {
    const res = await request(app).post('/api/products').send({ title: 'Missing fields' });
    expect(res.status).toBe(400);
  });

  test('POST /api/products - should return 409 for duplicate slug', async () => {
    const res = await request(app).post('/api/products').send({
      title: 'Duplicate',
      slug: 'test-serum',
      price: 10
    });
    expect(res.status).toBe(409);
  });

  test('PUT /api/products/:id - should update a product', async () => {
    const res = await request(app).put(`/api/products/${testData.productId}`).send({
      title: 'Updated Serum',
      price: 34.99
    });
    expect(res.status).toBe(200);
    expect(res.body.product.title).toBe('Updated Serum');
    expect(res.body.product.price).toBe(34.99);
  });

  test('PUT /api/products/:id - should return 404 for non-existent product', async () => {
    const res = await request(app).put('/api/products/non-existent').send({ title: 'X' });
    expect(res.status).toBe(404);
  });

  test('DELETE /api/products/:id - should delete non-critical product', async () => {
    // Create a product to delete
    const createRes = await request(app).post('/api/products').send({
      title: 'To Delete',
      slug: 'to-delete',
      price: 5
    });
    const res = await request(app).delete(`/api/products/${createRes.body.product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('deleted');
  });
});

// ==================== COLLECTIONS ====================
describe('Collections API', () => {
  test('GET /api/collections - should return all collections', async () => {
    const res = await request(app).get('/api/collections');
    expect(res.status).toBe(200);
    expect(res.body.collections).toBeDefined();
    expect(Array.isArray(res.body.collections)).toBe(true);
  });

  test('GET /api/collections/:id - should return collection with products', async () => {
    const res = await request(app).get(`/api/collections/${testData.collectionId}`);
    expect(res.status).toBe(200);
    expect(res.body.collection).toBeDefined();
    expect(res.body.products).toBeDefined();
  });

  test('GET /api/collections/slug/test-collection - should return collection by slug', async () => {
    const res = await request(app).get('/api/collections/slug/test-collection');
    expect(res.status).toBe(200);
    expect(res.body.collection.slug).toBe('test-collection');
  });

  test('GET /api/collections/:id - should return 404 for non-existent', async () => {
    const res = await request(app).get('/api/collections/non-existent');
    expect(res.status).toBe(404);
  });

  test('POST /api/collections - should create a collection', async () => {
    const res = await request(app).post('/api/collections').send({
      title: 'New Collection',
      slug: 'new-collection'
    });
    expect(res.status).toBe(201);
    expect(res.body.collection.title).toBe('New Collection');
  });

  test('POST /api/collections - should return 400 without required fields', async () => {
    const res = await request(app).post('/api/collections').send({ title: 'Missing slug' });
    expect(res.status).toBe(400);
  });
});

// ==================== CART ====================
describe('Cart API', () => {
  const sessionId = 'test-session-123';

  test('GET /api/cart/:sessionId - should return empty cart', async () => {
    const res = await request(app).get(`/api/cart/${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.body.items).toBeDefined();
    expect(res.body.subtotal).toBe(0);
    expect(res.body.itemCount).toBe(0);
  });

  test('POST /api/cart/:sessionId/items - should add item to cart', async () => {
    const res = await request(app).post(`/api/cart/${sessionId}/items`).send({
      product_id: testData.productId,
      quantity: 2
    });
    expect(res.status).toBe(200);
    expect(res.body.itemCount).toBe(2);
    expect(res.body.items.length).toBe(1);
  });

  test('POST /api/cart/:sessionId/items - should return 400 without product_id', async () => {
    const res = await request(app).post(`/api/cart/${sessionId}/items`).send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/cart/:sessionId - should return cart with items', async () => {
    const res = await request(app).get(`/api/cart/${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.body.itemCount).toBe(2);
    expect(res.body.subtotal).toBeGreaterThan(0);
  });

  test('PUT /api/cart/:sessionId/items/:itemId - should update quantity', async () => {
    const cartRes = await request(app).get(`/api/cart/${sessionId}`);
    const itemId = cartRes.body.items[0].id;
    const res = await request(app).put(`/api/cart/${sessionId}/items/${itemId}`).send({
      quantity: 3
    });
    expect(res.status).toBe(200);
    expect(res.body.itemCount).toBe(3);
  });

  test('DELETE /api/cart/:sessionId/items/:itemId - should remove item', async () => {
    const cartRes = await request(app).get(`/api/cart/${sessionId}`);
    const itemId = cartRes.body.items[0].id;
    const res = await request(app).delete(`/api/cart/${sessionId}/items/${itemId}`);
    expect(res.status).toBe(200);
    expect(res.body.itemCount).toBe(0);
  });

  test('DELETE /api/cart/:sessionId - should clear cart', async () => {
    // Add item first
    await request(app).post(`/api/cart/${sessionId}/items`).send({
      product_id: testData.productId,
      quantity: 1
    });
    const res = await request(app).delete(`/api/cart/${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.body.itemCount).toBe(0);
  });
});

// ==================== REVIEWS ====================
describe('Reviews API', () => {
  test('GET /api/reviews/product/:productId - should return reviews', async () => {
    const res = await request(app).get(`/api/reviews/product/${testData.productId}`);
    expect(res.status).toBe(200);
    expect(res.body.reviews).toBeDefined();
    expect(res.body.rating).toBeDefined();
    expect(res.body.rating.count).toBeGreaterThan(0);
  });

  test('POST /api/reviews - should create a review', async () => {
    const res = await request(app).post('/api/reviews').send({
      product_id: testData.productId,
      author: 'Jane',
      rating: 4,
      title: 'Nice product',
      body: 'Really liked it'
    });
    expect(res.status).toBe(201);
    expect(res.body.review.author).toBe('Jane');
    expect(res.body.review.rating).toBe(4);
  });

  test('POST /api/reviews - should return 400 without required fields', async () => {
    const res = await request(app).post('/api/reviews').send({ author: 'Jane' });
    expect(res.status).toBe(400);
  });

  test('POST /api/reviews - should return 400 for invalid rating', async () => {
    const res = await request(app).post('/api/reviews').send({
      product_id: testData.productId,
      author: 'Jane',
      rating: 6
    });
    expect(res.status).toBe(400);
  });
});

// ==================== NEWSLETTER ====================
describe('Newsletter API', () => {
  test('POST /api/newsletter/subscribe - should subscribe email', async () => {
    const res = await request(app).post('/api/newsletter/subscribe').send({
      email: 'subscriber@example.com',
      first_name: 'Test'
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('subscribed');
  });

  test('POST /api/newsletter/subscribe - should handle duplicate subscription', async () => {
    const res = await request(app).post('/api/newsletter/subscribe').send({
      email: 'subscriber@example.com'
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('already subscribed');
  });

  test('POST /api/newsletter/subscribe - should return 400 without email', async () => {
    const res = await request(app).post('/api/newsletter/subscribe').send({});
    expect(res.status).toBe(400);
  });

  test('POST /api/newsletter/subscribe - should return 400 for invalid email', async () => {
    const res = await request(app).post('/api/newsletter/subscribe').send({ email: 'invalid' });
    expect(res.status).toBe(400);
  });

  test('POST /api/newsletter/unsubscribe - should unsubscribe email', async () => {
    const res = await request(app).post('/api/newsletter/unsubscribe').send({
      email: 'subscriber@example.com'
    });
    expect(res.status).toBe(200);
  });

  test('GET /api/newsletter/count - should return subscriber count', async () => {
    const res = await request(app).get('/api/newsletter/count');
    expect(res.status).toBe(200);
    expect(typeof res.body.count).toBe('number');
  });
});

// ==================== PAGES ====================
describe('Pages API', () => {
  test('GET /api/pages - should return all pages', async () => {
    const res = await request(app).get('/api/pages');
    expect(res.status).toBe(200);
    expect(res.body.pages).toBeDefined();
    expect(Array.isArray(res.body.pages)).toBe(true);
  });

  test('GET /api/pages/slug/about - should return page by slug', async () => {
    const res = await request(app).get('/api/pages/slug/about');
    expect(res.status).toBe(200);
    expect(res.body.page.slug).toBe('about');
  });

  test('GET /api/pages/:id - should return page by ID', async () => {
    const res = await request(app).get(`/api/pages/${testData.pageId}`);
    expect(res.status).toBe(200);
    expect(res.body.page.title).toBe('About Us');
  });

  test('GET /api/pages/slug/nonexistent - should return 404', async () => {
    const res = await request(app).get('/api/pages/slug/nonexistent');
    expect(res.status).toBe(404);
  });

  test('POST /api/pages - should create a page', async () => {
    const res = await request(app).post('/api/pages').send({
      title: 'New Page',
      slug: 'new-page',
      content: '<h1>New Page</h1>'
    });
    expect(res.status).toBe(201);
    expect(res.body.page.title).toBe('New Page');
  });

  test('PUT /api/pages/:id - should update a page', async () => {
    const res = await request(app).put(`/api/pages/${testData.pageId}`).send({
      content: '<h1>Updated</h1>'
    });
    expect(res.status).toBe(200);
    expect(res.body.page.content).toContain('Updated');
  });
});

// ==================== DISCOUNTS ====================
describe('Discounts API', () => {
  test('POST /api/discounts/validate - should validate discount code', async () => {
    const res = await request(app).post('/api/discounts/validate').send({
      code: 'TEST10',
      order_total: 50
    });
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
    expect(res.body.discountAmount).toBe(5);
  });

  test('POST /api/discounts/validate - should reject invalid code', async () => {
    const res = await request(app).post('/api/discounts/validate').send({
      code: 'INVALID',
      order_total: 50
    });
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(false);
  });

  test('POST /api/discounts/validate - should return 400 without code', async () => {
    const res = await request(app).post('/api/discounts/validate').send({});
    expect(res.status).toBe(400);
  });

  test('GET /api/discounts - should return all discount codes', async () => {
    const res = await request(app).get('/api/discounts');
    expect(res.status).toBe(200);
    expect(res.body.discounts).toBeDefined();
    expect(Array.isArray(res.body.discounts)).toBe(true);
  });

  test('POST /api/discounts - should create a discount', async () => {
    const res = await request(app).post('/api/discounts').send({
      code: 'NEW20',
      type: 'percentage',
      value: 20
    });
    expect(res.status).toBe(201);
    expect(res.body.discount.code).toBe('NEW20');
  });
});

// ==================== ORDERS ====================
describe('Orders API', () => {
  const orderSessionId = 'order-test-session';

  test('POST /api/orders - should create an order from cart', async () => {
    // First add items to cart
    await request(app).post(`/api/cart/${orderSessionId}/items`).send({
      product_id: testData.productId,
      quantity: 2
    });

    const res = await request(app).post('/api/orders').send({
      session_id: orderSessionId,
      customer_email: 'order@example.com',
      customer_first_name: 'Test',
      customer_last_name: 'User',
      shipping_address: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' }
    });
    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.customer_email).toBe('order@example.com');
    expect(res.body.order.items.length).toBe(1);
    expect(res.body.order.total).toBeGreaterThan(0);
  });

  test('POST /api/orders - should return 400 without email', async () => {
    const res = await request(app).post('/api/orders').send({
      session_id: 'some-session'
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/orders - should return 400 for empty cart', async () => {
    const res = await request(app).post('/api/orders').send({
      session_id: 'empty-cart-session',
      customer_email: 'test@example.com'
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Cart is empty');
  });

  test('GET /api/orders - should return all orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(res.body.orders).toBeDefined();
    expect(Array.isArray(res.body.orders)).toBe(true);
  });
});

// ==================== SETTINGS ====================
describe('Settings API', () => {
  test('GET /api/settings - should return all settings', async () => {
    const res = await request(app).get('/api/settings');
    expect(res.status).toBe(200);
    expect(res.body.settings).toBeDefined();
    expect(res.body.settings.store_name).toBe('GlowNaturals');
  });

  test('GET /api/settings/:key - should return specific setting', async () => {
    const res = await request(app).get('/api/settings/store_name');
    expect(res.status).toBe(200);
    expect(res.body.value).toBe('GlowNaturals');
  });

  test('GET /api/settings/:key - should return 404 for non-existent', async () => {
    const res = await request(app).get('/api/settings/nonexistent');
    expect(res.status).toBe(404);
  });

  test('PUT /api/settings/:key - should update a setting', async () => {
    const res = await request(app).put('/api/settings/store_name').send({
      value: 'GlowNaturals Updated'
    });
    expect(res.status).toBe(200);
    expect(res.body.value).toBe('GlowNaturals Updated');
  });
});

// ==================== 404 HANDLER ====================
describe('404 Handler', () => {
  test('should return 404 for unknown API endpoints', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('not found');
  });
});
