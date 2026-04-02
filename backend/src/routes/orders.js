const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Discount = require('../models/Discount');
const { getDatabase } = require('../database');

router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    const orderModel = new Order(db);
    const orders = orderModel.findAll({ status: req.query.status });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const orderModel = new Order(db);
    const order = orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/track/:orderNumber', (req, res) => {
  try {
    const db = getDatabase();
    const orderModel = new Order(db);
    const order = orderModel.findByOrderNumber(parseInt(req.params.orderNumber));
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const orderModel = new Order(db);
    const cartModel = new Cart(db);
    const discountModel = new Discount(db);

    const { session_id, customer_email, customer_first_name, customer_last_name,
      shipping_address, billing_address, discount_code, notes } = req.body;

    if (!customer_email) return res.status(400).json({ error: 'Customer email is required' });
    if (!session_id) return res.status(400).json({ error: 'Session ID is required' });

    const cartTotal = cartModel.getTotal(session_id);
    if (cartTotal.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

    let discountAmount = 0;
    let shippingCost = cartTotal.subtotal >= 50 ? 0 : 5.99;

    if (discount_code) {
      const validation = discountModel.validate(discount_code, cartTotal.subtotal);
      if (!validation.valid) return res.status(400).json({ error: validation.message });
      discountAmount = validation.discountAmount || 0;
      if (validation.type === 'free_shipping') shippingCost = 0;
      discountModel.incrementUsage(discount_code);
    }

    const tax = Math.round((cartTotal.subtotal - discountAmount) * 0.08 * 100) / 100;
    const total = Math.round((cartTotal.subtotal - discountAmount + shippingCost + tax) * 100) / 100;

    const order = orderModel.create({
      session_id,
      customer_email,
      customer_first_name,
      customer_last_name,
      shipping_address,
      billing_address,
      items: cartTotal.items.map(item => ({
        product_id: item.product_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant,
        image: item.images[0] || null
      })),
      subtotal: cartTotal.subtotal,
      shipping_cost: shippingCost,
      discount_amount: discountAmount,
      discount_code: discount_code || null,
      tax,
      total,
      notes
    });

    cartModel.clear(session_id);
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
