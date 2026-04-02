const crypto = require('crypto');

class Order {
  constructor(db) {
    this.db = db;
  }

  findAll({ status, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM orders';
    const params = [];
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    return this.db.prepare(query).all(...params).map(this._parseOrder);
  }

  findById(id) {
    const order = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return order ? this._parseOrder(order) : null;
  }

  findByOrderNumber(orderNumber) {
    const order = this.db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber);
    return order ? this._parseOrder(order) : null;
  }

  create(data) {
    const id = crypto.randomUUID();
    const orderNumber = Date.now() % 1000000 + Math.floor(Math.random() * 1000);
    this.db.prepare(`
      INSERT INTO orders (id, order_number, session_id, customer_email, customer_first_name,
        customer_last_name, shipping_address, billing_address, items, subtotal,
        shipping_cost, discount_amount, discount_code, tax, total, status, payment_status, fulfillment_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, orderNumber, data.session_id || null, data.customer_email,
      data.customer_first_name || null, data.customer_last_name || null,
      JSON.stringify(data.shipping_address || {}), JSON.stringify(data.billing_address || {}),
      JSON.stringify(data.items), data.subtotal, data.shipping_cost || 0,
      data.discount_amount || 0, data.discount_code || null,
      data.tax || 0, data.total,
      data.status || 'pending', data.payment_status || 'unpaid',
      data.fulfillment_status || 'unfulfilled', data.notes || null
    );
    return this.findById(id);
  }

  updateStatus(id, status) {
    this.db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    return this.findById(id);
  }

  _parseOrder(order) {
    return {
      ...order,
      shipping_address: order.shipping_address ? JSON.parse(order.shipping_address) : {},
      billing_address: order.billing_address ? JSON.parse(order.billing_address) : {},
      items: order.items ? JSON.parse(order.items) : []
    };
  }
}

module.exports = Order;
