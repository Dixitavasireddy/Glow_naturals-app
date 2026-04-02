import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { formatPrice } from '../utils/helpers';

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.trackOrder(orderNumber, email);
      setOrder(data.order);
    } catch (err) {
      setError(err.message || 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <nav className="text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-dark">Track Order</span>
        </nav>

        <h1 className="text-3xl font-bold text-text-dark mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Track Your Order
        </h1>
        <p className="text-text-medium mb-8">Enter your order number and email to check the status.</p>

        <form onSubmit={handleSubmit} className="bg-secondary-light rounded-xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order Number *</label>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="GN-XXXXX"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
          {error && <p className="text-error text-sm mt-3">{error}</p>}
        </form>

        {order && (
          <div className="bg-white border rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-text-light">Order Number</p>
                <p className="font-bold text-primary text-lg">{order.order_number}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                order.status === 'delivered' ? 'bg-green-100 text-success' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Status Progress */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      idx <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-text-light'
                    }`}>
                      {idx <= currentStep ? '✓' : idx + 1}
                    </div>
                    <p className={`text-xs mt-1 capitalize ${idx <= currentStep ? 'text-primary font-medium' : 'text-text-light'}`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex mt-1">
                {statusSteps.slice(0, -1).map((_, idx) => (
                  <div key={idx} className={`flex-1 h-1 mx-1 rounded ${idx < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-medium">Total</span>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-medium">Items</span>
                <span>{order.items?.length || 0} item(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-medium">Date</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
