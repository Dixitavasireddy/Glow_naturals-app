const crypto = require('crypto');

class Product {
  constructor(db) {
    this.db = db;
  }

  findAll({ status = 'active', featured, bestSeller, limit, offset = 0, search, productType, tags } = {}) {
    let query = 'SELECT * FROM products WHERE status = ?';
    const params = [status];

    if (featured !== undefined) {
      query += ' AND featured = ?';
      params.push(featured ? 1 : 0);
    }
    if (bestSeller !== undefined) {
      query += ' AND best_seller = ?';
      params.push(bestSeller ? 1 : 0);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    if (productType) {
      query += ' AND product_type = ?';
      params.push(productType);
    }
    if (tags) {
      query += ' AND tags LIKE ?';
      params.push(`%${tags}%`);
    }

    query += ' ORDER BY created_at DESC';

    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const products = this.db.prepare(query).all(...params);
    return products.map(this._parseProduct);
  }

  findById(id) {
    const product = this.db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return product ? this._parseProduct(product) : null;
  }

  findBySlug(slug) {
    const product = this.db.prepare('SELECT * FROM products WHERE slug = ?').get(slug);
    return product ? this._parseProduct(product) : null;
  }

  create(data) {
    const id = crypto.randomUUID();
    const stmt = this.db.prepare(`
      INSERT INTO products (id, title, slug, description, short_description, price, compare_price,
        currency, sku, inventory_quantity, product_type, vendor, tags, images, variants,
        featured, best_seller, status, meta_title, meta_description, shipping_info, ingredients, how_to_use)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id, data.title, data.slug, data.description || null, data.short_description || null,
      data.price, data.compare_price || null, data.currency || 'USD',
      data.sku || null, data.inventory_quantity || 0,
      data.product_type || null, data.vendor || 'GlowNaturals',
      JSON.stringify(data.tags || []), JSON.stringify(data.images || []),
      JSON.stringify(data.variants || []),
      data.featured ? 1 : 0, data.best_seller ? 1 : 0,
      data.status || 'active', data.meta_title || data.title,
      data.meta_description || null, data.shipping_info || null,
      data.ingredients || null, data.how_to_use || null
    );

    return this.findById(id);
  }

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const fields = [];
    const params = [];

    const allowedFields = ['title', 'slug', 'description', 'short_description', 'price',
      'compare_price', 'currency', 'sku', 'inventory_quantity', 'product_type', 'vendor',
      'featured', 'best_seller', 'status', 'meta_title', 'meta_description',
      'shipping_info', 'ingredients', 'how_to_use'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        if (field === 'featured' || field === 'best_seller') {
          params.push(data[field] ? 1 : 0);
        } else {
          params.push(data[field]);
        }
      }
    }

    if (data.tags !== undefined) {
      fields.push('tags = ?');
      params.push(JSON.stringify(data.tags));
    }
    if (data.images !== undefined) {
      fields.push('images = ?');
      params.push(JSON.stringify(data.images));
    }
    if (data.variants !== undefined) {
      fields.push('variants = ?');
      params.push(JSON.stringify(data.variants));
    }

    if (fields.length === 0) return existing;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    this.db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    return this.findById(id);
  }

  delete(id) {
    const result = this.db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  }

  count(status = 'active') {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM products WHERE status = ?').get(status);
    return row.count;
  }

  findByCollection(collectionId) {
    const products = this.db.prepare(`
      SELECT p.* FROM products p
      JOIN product_collections pc ON p.id = pc.product_id
      WHERE pc.collection_id = ? AND p.status = 'active'
      ORDER BY p.created_at DESC
    `).all(collectionId);
    return products.map(this._parseProduct);
  }

  _parseProduct(product) {
    return {
      ...product,
      tags: product.tags ? JSON.parse(product.tags) : [],
      images: product.images ? JSON.parse(product.images) : [],
      variants: product.variants ? JSON.parse(product.variants) : [],
      featured: Boolean(product.featured),
      best_seller: Boolean(product.best_seller)
    };
  }
}

module.exports = Product;
