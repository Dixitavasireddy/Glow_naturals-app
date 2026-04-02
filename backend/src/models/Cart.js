const crypto = require('crypto');

class Cart {
  constructor(db) {
    this.db = db;
  }

  getItems(sessionId) {
    return this.db.prepare(`
      SELECT ci.*, p.title, p.price, p.compare_price, p.images, p.inventory_quantity, p.slug
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ?
      ORDER BY ci.created_at ASC
    `).all(sessionId).map(item => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : []
    }));
  }

  addItem(sessionId, productId, quantity = 1, variant = null) {
    const existing = this.db.prepare(
      'SELECT * FROM cart_items WHERE session_id = ? AND product_id = ? AND (variant = ? OR (variant IS NULL AND ? IS NULL))'
    ).get(sessionId, productId, variant, variant);

    if (existing) {
      this.db.prepare(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?'
      ).run(quantity, existing.id);
      return this.getItems(sessionId);
    }

    const id = crypto.randomUUID();
    this.db.prepare(
      'INSERT INTO cart_items (id, session_id, product_id, variant, quantity) VALUES (?, ?, ?, ?, ?)'
    ).run(id, sessionId, productId, variant, quantity);
    return this.getItems(sessionId);
  }

  updateQuantity(sessionId, itemId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(sessionId, itemId);
    }
    this.db.prepare(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND session_id = ?'
    ).run(quantity, itemId, sessionId);
    return this.getItems(sessionId);
  }

  removeItem(sessionId, itemId) {
    this.db.prepare(
      'DELETE FROM cart_items WHERE id = ? AND session_id = ?'
    ).run(itemId, sessionId);
    return this.getItems(sessionId);
  }

  clear(sessionId) {
    this.db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
    return [];
  }

  getTotal(sessionId) {
    const items = this.getItems(sessionId);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal: Math.round(subtotal * 100) / 100, itemCount, items };
  }
}

module.exports = Cart;
