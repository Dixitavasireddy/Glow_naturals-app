import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';
import { formatPrice } from '../utils/helpers';

export default function CheckoutPage() {
  const { cart, sessionId, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    phone: '', notes: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyDiscount = async () => {
    setDiscountError('');
    try {
      const data = await api.validateDiscount(discountCode, cart.subtotal);
      setDiscount(data);
    } catch (err) {
      setDiscountError(err.message || 'Invalid discount code');
      setDiscount(null);
    }
  };

  const shipping = cart.subtotal >= 50 ? 0 : 5.99;
  const discountAmount = discount ? discount.discount_amount : 0;
  const subtotalAfterDiscount = cart.subtotal - discountAmount;
  const tax = subtotalAfterDiscount * 0.08;
  const freeShipping = discount?.free_shipping;
  const finalShipping = freeShipping ? 0 : shipping;
  const total = subtotalAfterDiscount + tax + finalShipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOrderLoading(true);
    try {
      const orderData = {
        session_id: sessionId,
        customer: {
          email: form.email,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone
        },
        shipping_address: {
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country
        },
        discount_code: discount ? discountCode : null,
        notes: form.notes
      };
      const result = await api.createOrder(orderData);
      await clearCart();
      navigate(`/order-confirmation/${result.order.order_number}`);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/collections" className="text-primary hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[{ n: 1, label: 'Information' }, { n: 2, label: 'Review' }].map(s => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s.n ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'
              }`}>
                {s.n}
              </div>
              <span className={`text-sm font-medium ${step >= s.n ? 'text-primary' : 'text-text-light'}`}>{s.label}</span>
              {s.n < 2 && <div className="w-16 h-0.5 bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Contact & Shipping</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="you@example.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name *</label>
                        <input name="firstName" value={form.firstName} onChange={handleChange} required
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name *</label>
                        <input name="lastName" value={form.lastName} onChange={handleChange} required
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address *</label>
                      <input name="address" value={form.address} onChange={handleChange} required
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="123 Main St" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input name="city" value={form.city} onChange={handleChange} required
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State *</label>
                        <input name="state" value={form.state} onChange={handleChange} required
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ZIP *</label>
                        <input name="zip" value={form.zip} onChange={handleChange} required
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Order Notes</label>
                      <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none" placeholder="Special delivery instructions..." />
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)}
                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors mt-6">
                    Continue to Review
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Review Order</h2>
                  <div className="bg-secondary-light rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-text-medium">{form.email}</p>
                        <p className="text-text-medium">{form.firstName} {form.lastName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Shipping</p>
                        <p className="text-text-medium">{form.address}</p>
                        <p className="text-text-medium">{form.city}, {form.state} {form.zip}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="text-primary text-xs hover:underline mt-2">Edit</button>
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <h3 className="font-medium mb-3 text-sm">Payment (Test Mode)</h3>
                    <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                      <p className="font-medium">This is a demo store</p>
                      <p>No real payment will be processed. Click &quot;Place Order&quot; to simulate a purchase.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)}
                      className="flex-1 border border-gray-200 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                      Back
                    </button>
                    <button type="submit" disabled={orderLoading}
                      className="flex-1 bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50 text-sm">
                      {orderLoading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="relative">
                      <div className="w-14 h-14 bg-secondary rounded-lg" />
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-dark line-clamp-1">{item.title}</p>
                      {item.variant && <p className="text-xs text-text-light">{item.variant}</p>}
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="border-t pt-4 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Discount code"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button onClick={applyDiscount} className="bg-secondary text-text-dark px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors">
                    Apply
                  </button>
                </div>
                {discountError && <p className="text-error text-xs mt-1">{discountError}</p>}
                {discount && <p className="text-success text-xs mt-1">Discount applied: -{formatPrice(discountAmount)}</p>}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-medium">Subtotal</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-medium">Shipping</span>
                  <span>{finalShipping === 0 ? 'FREE' : formatPrice(finalShipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-medium">Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>
              <div className="border-t mt-3 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
