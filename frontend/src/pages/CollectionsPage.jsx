import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { getPlaceholderImage } from '../utils/helpers';

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const data = await api.getCollections();
        setCollections(data.collections || []);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-dark">Collections</span>
        </nav>

        <h1 className="text-3xl font-bold text-text-dark mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Our Collections
        </h1>
        <p className="text-text-medium mb-8">Explore our curated skincare collections</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, idx) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all aspect-video flex items-end"
            >
              <div
                className="absolute inset-0"
                style={{ backgroundColor: ['#2D5016', '#D4A574', '#F5E6D3', '#3D6B1E', '#C08B55'][idx % 5] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="relative p-6 text-white w-full">
                <h3 className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform" style={{ fontFamily: 'var(--font-heading)' }}>
                  {col.title}
                </h3>
                <p className="text-white/80 text-sm">{col.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
