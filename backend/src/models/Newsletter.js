const crypto = require('crypto');

class Newsletter {
  constructor(db) {
    this.db = db;
  }

  findAll() {
    return this.db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all();
  }

  findByEmail(email) {
    return this.db.prepare('SELECT * FROM newsletter_subscribers WHERE email = ?').get(email) || null;
  }

  subscribe(data) {
    const existing = this.findByEmail(data.email);
    if (existing) {
      if (existing.status === 'unsubscribed') {
        this.db.prepare('UPDATE newsletter_subscribers SET status = ? WHERE id = ?').run('active', existing.id);
        return { ...existing, status: 'active', resubscribed: true };
      }
      return { ...existing, already_subscribed: true };
    }

    const id = crypto.randomUUID();
    this.db.prepare(
      'INSERT INTO newsletter_subscribers (id, email, first_name, source) VALUES (?, ?, ?, ?)'
    ).run(id, data.email, data.first_name || null, data.source || 'popup');

    return this.db.prepare('SELECT * FROM newsletter_subscribers WHERE id = ?').get(id);
  }

  unsubscribe(email) {
    const result = this.db.prepare(
      'UPDATE newsletter_subscribers SET status = ? WHERE email = ?'
    ).run('unsubscribed', email);
    return result.changes > 0;
  }

  count() {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = ?').get('active');
    return row.count;
  }
}

module.exports = Newsletter;
