import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function CollectionPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      try {
        const data = await api.getCollectionBySlug(slug);
        setCollection(data.collection);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch collection:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollection();
    window.scrollTo(0, 0);
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'title-asc': return a.title.localeCompare(b.title);
      case 'title-desc': return b.title.localeCompare(a.title);
      default: return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
          <Link to="/collections" className="text-primary hover:underline">View All Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Collection Header */}
      <div className="bg-secondary py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <nav className="text-sm text-text-light mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/collections" className="hover:text-primary">Collections</Link>
            <span className="mx-2">/</span>
            <span className="text-text-dark">{collection.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {collection.title}
          </h1>
          <p className="text-text-medium max-w-2xl mx-auto">{collection.description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-medium">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Name: A-Z</option>
            <option value="title-desc">Name: Z-A</option>
          </select>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-medium">No products in this collection yet.</p>
            <Link to="/collections" className="text-primary hover:underline text-sm mt-2 inline-block">Browse other collections</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
