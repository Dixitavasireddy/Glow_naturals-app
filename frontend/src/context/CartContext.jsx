import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { getSessionId } from '../utils/helpers';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const sessionId = getSessionId();

  const fetchCart = useCallback(async () => {
    try {
      const data = await api.getCart(sessionId);
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, variant = null) => {
    setLoading(true);
    try {
      const data = await api.addToCart(sessionId, productId, quantity, variant);
      setCart(data);
      setCartOpen(true);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      const data = await api.updateCartItem(sessionId, itemId, quantity);
      setCart(data);
    } catch (err) {
      console.error('Failed to update cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const data = await api.removeCartItem(sessionId, itemId);
      setCart(data);
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const data = await api.clearCart(sessionId);
      setCart(data);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart, loading, cartOpen, setCartOpen,
      addToCart, updateQuantity, removeItem, clearCart, fetchCart, sessionId
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
