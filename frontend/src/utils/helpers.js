export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function getSessionId() {
  let sessionId = localStorage.getItem('gn_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('gn_session_id', sessionId);
  }
  return sessionId;
}

export function renderStars(rating, maxStars = 5) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < fullStars; i++) stars.push('full');
  if (hasHalf) stars.push('half');
  while (stars.length < maxStars) stars.push('empty');
  return stars;
}

export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getPlaceholderImage(type, index = 0) {
  const colors = ['#2D5016', '#D4A574', '#F5E6D3', '#3D6B1E', '#C08B55'];
  const color = colors[index % colors.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="${color}" width="400" height="400" rx="8"/><text fill="white" font-family="sans-serif" font-size="16" x="200" y="200" text-anchor="middle" dominant-baseline="middle">${type}</text></svg>`)}`;
}
