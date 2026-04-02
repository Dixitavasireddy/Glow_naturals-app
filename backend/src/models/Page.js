const crypto = require('crypto');

class Page {
  constructor(db) {
    this.db = db;
  }

  findAll({ status = 'published' } = {}) {
    return this.db.prepare('SELECT * FROM pages WHERE status = ? ORDER BY title ASC').all(status);
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM pages WHERE id = ?').get(id) || null;
  }

  findBySlug(slug) {
    return this.db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug) || null;
  }

  create(data) {
    const id = crypto.randomUUID();
    this.db.prepare(`
      INSERT INTO pages (id, title, slug, content, meta_title, meta_description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.slug, data.content || null,
      data.meta_title || data.title, data.meta_description || null,
      data.status || 'published');
    return this.findById(id);
  }

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;
    const fields = [];
    const params = [];
    const allowed = ['title', 'slug', 'content', 'meta_title', 'meta_description', 'status'];
    for (const field of allowed) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(data[field]);
      }
    }
    if (fields.length === 0) return existing;
    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    this.db.prepare(`UPDATE pages SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    return this.findById(id);
  }

  delete(id) {
    const result = this.db.prepare('DELETE FROM pages WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

module.exports = Page;
