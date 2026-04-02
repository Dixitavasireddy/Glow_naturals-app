const crypto = require('crypto');

class Collection {
  constructor(db) {
    this.db = db;
  }

  findAll({ status = 'active' } = {}) {
    const collections = this.db.prepare(
      'SELECT * FROM collections WHERE status = ? ORDER BY sort_order ASC'
    ).all(status);
    return collections;
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM collections WHERE id = ?').get(id) || null;
  }

  findBySlug(slug) {
    return this.db.prepare('SELECT * FROM collections WHERE slug = ?').get(slug) || null;
  }

  create(data) {
    const id = crypto.randomUUID();
    this.db.prepare(`
      INSERT INTO collections (id, title, slug, description, image, sort_order, status, meta_title, meta_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, data.title, data.slug, data.description || null,
      data.image || null, data.sort_order || 0,
      data.status || 'active', data.meta_title || data.title,
      data.meta_description || null
    );
    return this.findById(id);
  }

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const fields = [];
    const params = [];
    const allowed = ['title', 'slug', 'description', 'image', 'sort_order', 'status', 'meta_title', 'meta_description'];

    for (const field of allowed) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(data[field]);
      }
    }

    if (fields.length === 0) return existing;
    params.push(id);
    this.db.prepare(`UPDATE collections SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    return this.findById(id);
  }

  delete(id) {
    const result = this.db.prepare('DELETE FROM collections WHERE id = ?').run(id);
    return result.changes > 0;
  }

  addProduct(collectionId, productId) {
    try {
      this.db.prepare(
        'INSERT OR IGNORE INTO product_collections (product_id, collection_id) VALUES (?, ?)'
      ).run(productId, collectionId);
      return true;
    } catch (e) {
      return false;
    }
  }

  removeProduct(collectionId, productId) {
    const result = this.db.prepare(
      'DELETE FROM product_collections WHERE product_id = ? AND collection_id = ?'
    ).run(productId, collectionId);
    return result.changes > 0;
  }

  getProducts(collectionId) {
    return this.db.prepare(`
      SELECT p.* FROM products p
      JOIN product_collections pc ON p.id = pc.product_id
      WHERE pc.collection_id = ? AND p.status = 'active'
      ORDER BY p.created_at DESC
    `).all(collectionId);
  }
}

module.exports = Collection;
