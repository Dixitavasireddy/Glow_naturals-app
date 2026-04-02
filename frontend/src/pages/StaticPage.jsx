import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function StaticPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      setLoading(true);
      try {
        const data = await api.getPageBySlug(slug);
        setPage(data.page);
      } catch (err) {
        console.error('Failed to fetch page:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <Link to="/" className="text-primary hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-text-light mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-text-dark">{page.title}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-8" style={{ fontFamily: 'var(--font-heading)' }}>
          {page.title}
        </h1>

        <div className="page-content prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  );
}
