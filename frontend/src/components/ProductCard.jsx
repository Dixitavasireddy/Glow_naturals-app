import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getPlaceholderImage, renderStars } from '../utils/helpers';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image = product.images?.[0] || getPlaceholderImage(product.product_type || 'Product', 0);
  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      <Link to={`/products/${product.slug}`} className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = getPlaceholderImage(product.product_type || 'Product'); }}
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-error text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.best_seller && (
          <span className="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
            Best Seller
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-text-light uppercase tracking-wider mb-1">{product.product_type}</p>
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-text-dark hover:text-primary transition-colors line-clamp-2 text-sm mb-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-text-light line-clamp-2 mb-2">{product.short_description}</p>

        <div className="flex items-center gap-1 mb-2">
          {renderStars(4.5).map((star, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${star === 'full' ? 'text-star' : star === 'half' ? 'text-star' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-auto mb-3">
          <span className="font-bold text-primary text-lg">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-text-light text-sm line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product.id)}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
