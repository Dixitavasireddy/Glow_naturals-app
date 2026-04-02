const crypto = require('crypto');

class Review {
  constructor(db) {
    this.db = db;
  }

  findByProduct(productId, { status = 'published' } = {}) {
    return this.db.prepare(
      'SELECT * FROM reviews WHERE product_id = ? AND status = ? ORDER BY created_at DESC'
    ).all(productId, status);
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM reviews WHERE id = ?').get(id) || null;
  }

  create(data) {
    const id = crypto.randomUUID();
    this.db.prepare(`
      INSERT INTO reviews (id, product_id, author, email, rating, title, body, verified, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.product_id, data.author, data.email || null,
      data.rating, data.title || null, data.body || null,
      data.verified ? 1 : 0, data.status || 'published'
    );
    return this.findById(id);
  }

  getAverageRating(productId) {
    const row = this.db.prepare(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ? AND status = ?'
    ).get(productId, 'published');
    return { average: row.avg_rating ? Math.round(row.avg_rating * 10) / 10 : 0, count: row.count };
  }

  delete(id) {
    const result = this.db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

module.exports = Review;
