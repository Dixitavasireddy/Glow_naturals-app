import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getPlaceholderImage } from '../utils/helpers';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeItem, loading } = useCart();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Cart ({cart.itemCount})
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-1 text-text-medium hover:text-text-dark">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-text-light mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-text-medium mb-4">Your cart is empty</p>
              <button
                onClick={() => setCartOpen(false)}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-3 bg-secondary-light rounded-lg p-3">
                  <img
                    src={item.images?.[0] || getPlaceholderImage('Product')}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md"
                    onError={e => { e.target.src = getPlaceholderImage('Product'); }}
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="text-sm font-medium text-text-dark hover:text-primary line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    {item.variant && <p className="text-xs text-text-light mt-0.5">{item.variant}</p>}
                    <p className="text-sm font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={loading}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100 disabled:opacity-50"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={loading}
                        className="ml-auto text-text-light hover:text-error text-xs disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            {cart.subtotal < 50 && (
              <p className="text-xs text-center text-accent-dark">
                Add {formatPrice(50 - cart.subtotal)} more for FREE shipping!
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold text-lg">{formatPrice(cart.subtotal)}</span>
            </div>
            <p className="text-xs text-text-light">Shipping & taxes calculated at checkout</p>
            <Link
              to="/cart"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="block w-full bg-accent text-white text-center py-3 rounded-lg font-medium hover:bg-accent-dark transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
