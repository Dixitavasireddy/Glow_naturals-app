import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getPlaceholderImage } from '../utils/helpers';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-dark">Cart</span>
        </nav>

        <h1 className="text-3xl font-bold text-text-dark mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          Shopping Cart
        </h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-text-light mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-bold text-text-dark mb-2">Your cart is empty</h2>
            <p className="text-text-medium mb-6">Looks like you haven&apos;t added any products yet.</p>
            <Link to="/collections" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-text-light uppercase tracking-wider pb-3 border-b">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y">
                {cart.items.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 py-4 items-center">
                    <div className="col-span-12 md:col-span-6 flex gap-3">
                      <img
                        src={item.images?.[0] || getPlaceholderImage('Product')}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={e => { e.target.src = getPlaceholderImage('Product'); }}
                      />
                      <div>
                        <Link to={`/products/${item.slug}`} className="font-medium text-text-dark hover:text-primary text-sm">
                          {item.title}
                        </Link>
                        {item.variant && <p className="text-xs text-text-light mt-0.5">{item.variant}</p>}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={loading}
                          className="text-xs text-error hover:underline mt-1 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="col-span-4 md:col-span-2 text-center text-sm">
                      {formatPrice(item.price)}
                    </div>
                    <div className="col-span-4 md:col-span-2 flex justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={loading}
                          className="px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          className="px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-span-4 md:col-span-2 text-right text-sm font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="text-sm text-error hover:underline disabled:opacity-50"
                >
                  Clear Cart
                </button>
                <Link to="/collections" className="text-sm text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary-light rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-medium">Subtotal</span>
                    <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-medium">Shipping</span>
                    <span className="font-medium">{cart.subtotal >= 50 ? 'FREE' : formatPrice(5.99)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-medium">Tax (8%)</span>
                    <span className="font-medium">{formatPrice(cart.subtotal * 0.08)}</span>
                  </div>
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(cart.subtotal + (cart.subtotal >= 50 ? 0 : 5.99) + cart.subtotal * 0.08)}
                    </span>
                  </div>
                </div>

                {cart.subtotal < 50 && (
                  <p className="text-xs text-accent-dark mt-3 text-center">
                    Add {formatPrice(50 - cart.subtotal)} more for FREE shipping!
                  </p>
                )}

                <Link
                  to="/checkout"
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors mt-4"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-light">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
