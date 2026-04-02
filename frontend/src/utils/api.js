const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE}/api${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => fetchApi(`/products/${id}`),
  getProductBySlug: (slug) => fetchApi(`/products/slug/${slug}`),

  // Collections
  getCollections: () => fetchApi('/collections'),
  getCollection: (id) => fetchApi(`/collections/${id}`),
  getCollectionBySlug: (slug) => fetchApi(`/collections/slug/${slug}`),

  // Cart
  getCart: (sessionId) => fetchApi(`/cart/${sessionId}`),
  addToCart: (sessionId, productId, quantity = 1, variant = null) =>
    fetchApi(`/cart/${sessionId}/items`, {
      method: 'POST',
      body: { product_id: productId, quantity, variant },
    }),
  updateCartItem: (sessionId, itemId, quantity) =>
    fetchApi(`/cart/${sessionId}/items/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    }),
  removeCartItem: (sessionId, itemId) =>
    fetchApi(`/cart/${sessionId}/items/${itemId}`, { method: 'DELETE' }),
  clearCart: (sessionId) =>
    fetchApi(`/cart/${sessionId}`, { method: 'DELETE' }),

  // Orders
  createOrder: (data) =>
    fetchApi('/orders', { method: 'POST', body: data }),
  getOrder: (id) => fetchApi(`/orders/${id}`),
  trackOrder: (orderNumber) => fetchApi(`/orders/track/${orderNumber}`),

  // Reviews
  getReviews: (productId) => fetchApi(`/reviews/product/${productId}`),
  createReview: (data) =>
    fetchApi('/reviews', { method: 'POST', body: data }),

  // Newsletter
  subscribe: (email, firstName = '', source = 'popup') =>
    fetchApi('/newsletter/subscribe', {
      method: 'POST',
      body: { email, first_name: firstName, source },
    }),

  // Pages
  getPages: () => fetchApi('/pages'),
  getPageBySlug: (slug) => fetchApi(`/pages/slug/${slug}`),

  // Discounts
  validateDiscount: (code, orderTotal) =>
    fetchApi('/discounts/validate', {
      method: 'POST',
      body: { code, order_total: orderTotal },
    }),

  // Settings
  getSettings: () => fetchApi('/settings'),
};
