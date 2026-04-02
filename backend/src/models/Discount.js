const crypto = require('crypto');

class Discount {
  constructor(db) {
    this.db = db;
  }

  findAll() {
    return this.db.prepare('SELECT * FROM discount_codes ORDER BY created_at DESC').all();
  }

  findByCode(code) {
    return this.db.prepare('SELECT * FROM discount_codes WHERE code = ? AND active = 1').get(code.toUpperCase()) || null;
  }

  findById(id) {
    return this.db.prepare('SELECT * FROM discount_codes WHERE id = ?').get(id) || null;
  }

  create(data) {
    const id = crypto.randomUUID();
    this.db.prepare(`
      INSERT INTO discount_codes (id, code, type, value, min_order_amount, usage_limit, active, starts_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.code.toUpperCase(), data.type, data.value,
      data.min_order_amount || 0, data.usage_limit || null,
      data.active !== undefined ? (data.active ? 1 : 0) : 1,
      data.starts_at || null, data.expires_at || null);
    return this.findById(id);
  }

  validate(code, orderTotal) {
    const discount = this.findByCode(code);
    if (!discount) return { valid: false, message: 'Invalid discount code' };
    if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
      return { valid: false, message: 'Discount code has been used too many times' };
    }
    if (discount.min_order_amount && orderTotal < discount.min_order_amount) {
      return { valid: false, message: `Minimum order amount of $${discount.min_order_amount} required` };
    }
    if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
      return { valid: false, message: 'Discount code has expired' };
    }
    if (discount.starts_at && new Date(discount.starts_at) > new Date()) {
      return { valid: false, message: 'Discount code is not yet active' };
    }

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = Math.round(orderTotal * (discount.value / 100) * 100) / 100;
    } else if (discount.type === 'fixed') {
      discountAmount = Math.min(discount.value, orderTotal);
    }

    return { valid: true, discount, discountAmount, type: discount.type };
  }

  incrementUsage(code) {
    this.db.prepare('UPDATE discount_codes SET usage_count = usage_count + 1 WHERE code = ?').run(code.toUpperCase());
  }

  delete(id) {
    const result = this.db.prepare('DELETE FROM discount_codes WHERE id = ?').run(id);
    return result.changes > 0;
  }
}

module.exports = Discount;
