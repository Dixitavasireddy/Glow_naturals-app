class StoreSettings {
  constructor(db) {
    this.db = db;
  }

  get(key) {
    const row = this.db.prepare('SELECT value FROM store_settings WHERE key = ?').get(key);
    return row ? row.value : null;
  }

  set(key, value) {
    this.db.prepare(
      'INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)'
    ).run(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }

  getAll() {
    const rows = this.db.prepare('SELECT * FROM store_settings').all();
    const settings = {};
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }
    return settings;
  }

  delete(key) {
    const result = this.db.prepare('DELETE FROM store_settings WHERE key = ?').run(key);
    return result.changes > 0;
  }
}

module.exports = StoreSettings;
