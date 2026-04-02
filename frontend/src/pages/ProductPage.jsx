import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { formatPrice, getPlaceholderImage, renderStars } from '../utils/helpers';
import TrustBadges from '../components/TrustBadges';

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, title: '', body: '' });
  const [reviewStatus, setReviewStatus] = useState('idle');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const data = await api.getProductBySlug(slug);
        setProduct(data.product);
        setReviews(data.reviews || []);
        setRating(data.rating || { average: 0, count: 0 });
        if (data.product.variants?.length > 0) {
          setSelectedVariant(data.product.variants[0]);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity, selectedVariant?.name || null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewStatus('loading');
    try {
      await api.createReview({ ...reviewForm, product_id: product.id });
      const data = await api.getProductBySlug(slug);
      setReviews(data.reviews || []);
      setRating(data.rating || { average: 0, count: 0 });
      setReviewForm({ author: '', rating: 5, title: '', body: '' });
      setReviewStatus('success');
    } catch (err) {
      setReviewStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to="/collections" className="text-primary hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const discount = product.compare_price ? Math.round((1 - currentPrice / product.compare_price) * 100) : 0;
  const images = product.images?.length > 0 ? product.images : [getPlaceholderImage(product.product_type || 'Product')];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm text-text-light">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-text-dark">{product.title}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square bg-secondary-light rounded-xl overflow-hidden">
              <img
                src={images[activeImage]}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = getPlaceholderImage(product.product_type || 'Product'); }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${idx === activeImage ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = getPlaceholderImage('Thumb'); }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-accent font-medium text-sm uppercase tracking-wider mb-1">{product.product_type}</p>
            <h1 className="text-3xl font-bold text-text-dark mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {renderStars(rating.average).map((star, i) => (
                  <svg key={i} className={`w-4 h-4 ${star !== 'empty' ? 'text-star' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-text-medium">{rating.average} ({rating.count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary">{formatPrice(currentPrice)}</span>
              {product.compare_price && (
                <>
                  <span className="text-lg text-text-light line-through">{formatPrice(product.compare_price)}</span>
                  <span className="bg-error text-white text-xs font-bold px-2 py-1 rounded-full">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="text-text-medium mb-6">{product.short_description}</p>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="flex gap-2">
                  {product.variants.map(variant => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedVariant?.name === variant.name
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 hover:border-primary text-text-dark'
                      }`}
                    >
                      {variant.name} — {formatPrice(variant.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-4">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-lg hover:bg-gray-50">-</button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-lg hover:bg-gray-50">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm"
              >
                Add to Cart — {formatPrice(currentPrice * quantity)}
              </button>
            </div>

            {/* Sticky mobile add to cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 md:hidden z-50">
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium text-sm"
              >
                Add to Cart — {formatPrice(currentPrice * quantity)}
              </button>
            </div>

            {/* Trust badges */}
            <TrustBadges compact />

            {/* Shipping info */}
            <div className="bg-secondary-light rounded-lg p-4 mb-6">
              <p className="text-sm text-text-medium">
                <span className="font-medium text-text-dark">🚚 Free Shipping</span> on orders over $50
              </p>
              <p className="text-sm text-text-medium mt-1">
                <span className="font-medium text-text-dark">↩️ 30-Day Returns</span> — Satisfaction guaranteed
              </p>
            </div>

            {/* SKU & Tags */}
            <div className="text-xs text-text-light space-y-1">
              {product.sku && <p>SKU: {product.sku}</p>}
              {product.tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-secondary px-2 py-0.5 rounded text-text-medium">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs: Description, Ingredients, How to Use, Reviews */}
        <div className="mt-12 border-t pt-8">
          <div className="flex gap-6 border-b mb-6 overflow-x-auto">
            {['description', 'ingredients', 'how_to_use', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text-light hover:text-text-dark'
                }`}
              >
                {tab === 'how_to_use' ? 'How to Use' : tab === 'reviews' ? `Reviews (${rating.count})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="product-description max-w-3xl" dangerouslySetInnerHTML={{ __html: product.description }} />
          )}

          {activeTab === 'ingredients' && (
            <div className="max-w-3xl">
              <h3 className="font-semibold mb-3">Full Ingredient List</h3>
              <p className="text-text-medium text-sm leading-relaxed">{product.ingredients || 'No ingredients listed.'}</p>
            </div>
          )}

          {activeTab === 'how_to_use' && (
            <div className="max-w-3xl">
              <h3 className="font-semibold mb-3">How to Use</h3>
              <p className="text-text-medium text-sm leading-relaxed">{product.how_to_use || 'No usage instructions.'}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl">
              {/* Review Summary */}
              <div className="bg-secondary-light rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">{rating.average}</p>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {renderStars(rating.average).map((star, i) => (
                        <svg key={i} className={`w-4 h-4 ${star !== 'empty' ? 'text-star' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xs text-text-light mt-1">{rating.count} reviews</p>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 mb-8">
                {reviews.map(review => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex gap-0.5">
                        {renderStars(review.rating).map((star, i) => (
                          <svg key={i} className={`w-3.5 h-3.5 ${star !== 'empty' ? 'text-star' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-medium text-sm">{review.author}</span>
                      {review.verified === 1 && <span className="text-xs text-success bg-green-50 px-1.5 py-0.5 rounded">Verified</span>}
                    </div>
                    {review.title && <p className="font-medium text-sm">{review.title}</p>}
                    <p className="text-text-medium text-sm mt-1">{review.body}</p>
                  </div>
                ))}
              </div>

              {/* Write Review Form */}
              <div className="bg-secondary-light rounded-xl p-6">
                <h4 className="font-semibold mb-4">Write a Review</h4>
                {reviewStatus === 'success' ? (
                  <p className="text-success text-sm">Thank you for your review!</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={reviewForm.author}
                      onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
                      required
                    />
                    <div>
                      <label className="text-sm font-medium mb-1 block">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: r })}
                            className={`w-8 h-8 rounded ${r <= reviewForm.rating ? 'text-star' : 'text-gray-200'}`}
                          >
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Review title"
                      value={reviewForm.title}
                      onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                    <textarea
                      placeholder="Your review"
                      value={reviewForm.body}
                      onChange={e => setReviewForm({ ...reviewForm, body: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                      required
                    />
                    <button type="submit" disabled={reviewStatus === 'loading'} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
                      {reviewStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
