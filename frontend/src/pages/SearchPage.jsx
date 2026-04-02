import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      searchProducts(q);
    }
  }, [searchParams]);

  const searchProducts = async (q) => {
    setLoading(true);
    try {
      const data = await api.getProducts({ search: q });
      setProducts(data.products || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-dark">Search</span>
        </nav>

        <h1 className="text-3xl font-bold text-text-dark mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Search Products
        </h1>

        <form onSubmit={handleSubmit} className="max-w-xl mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm">
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searchParams.get('q') ? (
          <>
            <p className="text-text-medium mb-6">
              {products.length} result{products.length !== 1 ? 's' : ''} for &ldquo;{searchParams.get('q')}&rdquo;
            </p>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-medium mb-4">No products found matching your search.</p>
                <Link to="/collections" className="text-primary hover:underline text-sm">Browse all products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-text-medium">
            <p>Start typing to search our products</p>
          </div>
        )}
      </div>
    </div>
  );
}
