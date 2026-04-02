import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { formatPrice } from '../utils/helpers';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await api.getOrder(orderNumber);
        setOrder(data.order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/" className="text-primary hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-text-dark mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Thank You!
          </h1>
          <p className="text-text-medium mb-6">Your order has been placed successfully.</p>

          <div className="bg-secondary-light rounded-lg p-4 mb-6">
            <p className="text-sm text-text-medium">Order Number</p>
            <p className="text-xl font-bold text-primary">{order.order_number}</p>
          </div>

          <div className="text-left border-t pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-text-dark">Customer</p>
                <p className="text-text-medium">{order.customer_name}</p>
                <p className="text-text-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="font-medium text-text-dark">Shipping Address</p>
                <p className="text-text-medium">{order.shipping_address}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-medium text-sm mb-2">Order Items</p>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-text-medium">{item.title} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-medium">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-medium">Shipping</span>
                <span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-medium">Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/" className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm text-center">
              Continue Shopping
            </Link>
            <Link to={`/track-order?order=${order.order_number}&email=${order.customer_email}`} className="flex-1 border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-sm text-center">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
