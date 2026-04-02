import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import ProductCard from '../components/ProductCard';
import TrustBadges from '../components/TrustBadges';
import Newsletter from '../components/Newsletter';
import { formatPrice, getPlaceholderImage } from '../utils/helpers';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodData, colData] = await Promise.all([
          api.getProducts(),
          api.getCollections()
        ]);
        setProducts(prodData.products || []);
        setCollections(colData.collections || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.featured);
  const bestSellers = products.filter(p => p.best_seller);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary-light to-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <span className="inline-block text-accent font-medium text-sm mb-3 tracking-wider uppercase">
                Natural Skincare
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-dark leading-tight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Pure Beauty,<br />
                <span className="text-primary">Naturally Radiant</span>
              </h1>
              <p className="text-text-medium text-lg mb-8 max-w-lg mx-auto md:mx-0">
                Discover skincare that&apos;s 95% natural, science-backed, and designed to reveal your most radiant skin yet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link to="/collections" className="bg-primary text-white px-8 py-3.5 rounded-lg font-medium hover:bg-primary-dark transition-colors text-center">
                  Shop All Products
                </Link>
                <Link to="/collections/best-sellers" className="border-2 border-primary text-primary px-8 py-3.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors text-center">
                  Best Sellers
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-accent/20 rounded-full mx-auto flex items-center justify-center">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-accent/30 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl">🌿</span>
                    <p className="text-primary font-bold mt-2 text-lg">GlowNaturals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Featured Collections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text-dark mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Shop by Category
            </h2>
            <p className="text-text-medium max-w-2xl mx-auto">
              Explore our carefully curated collections of natural skincare products
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {collections.map((col, idx) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug}`}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all aspect-square flex items-center justify-center"
              >
                <div className="absolute inset-0" style={{ backgroundColor: ['#2D5016', '#D4A574', '#F5E6D3', '#3D6B1E', '#C08B55'][idx % 5], opacity: 0.15 }} />
                <div className="relative text-center p-4">
                  <span className="text-4xl mb-2 block">{['✨', '💧', '🧴', '🫧', '🆕'][idx % 5]}</span>
                  <h3 className="font-semibold text-text-dark group-hover:text-primary transition-colors text-sm">
                    {col.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                Best Sellers
              </h2>
              <p className="text-text-medium mt-1">Loved by thousands of happy customers</p>
            </div>
            <Link to="/collections/best-sellers" className="hidden md:inline-block text-primary font-medium hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / USP Section */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text-dark mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Why Choose GlowNaturals?
            </h2>
            <p className="text-text-medium max-w-2xl mx-auto">
              We believe in the power of nature, backed by science
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌿',
                title: 'Pure Ingredients',
                desc: 'Every product is formulated with at least 95% natural ingredients. No parabens, sulfates, or synthetic fragrances — ever.'
              },
              {
                icon: '🔬',
                title: 'Science-Backed Formulas',
                desc: 'Developed with dermatologists and cosmetic chemists. Clinically tested for safety and efficacy on all skin types.'
              },
              {
                icon: '🌍',
                title: 'Sustainably Made',
                desc: 'Recyclable packaging, ethically sourced ingredients, and carbon-neutral shipping. Beauty that doesn\'t cost the earth.'
              }
            ].map(benefit => (
              <div key={benefit.title} className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-4xl mb-4 block">{benefit.icon}</span>
                <h3 className="text-xl font-bold text-text-dark mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  {benefit.title}
                </h3>
                <p className="text-text-medium text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                Featured Products
              </h2>
              <p className="text-text-medium mt-1">Handpicked favorites for your skincare routine</p>
            </div>
            <Link to="/collections" className="hidden md:inline-block text-primary font-medium hover:underline text-sm">
              Shop All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text-dark mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              What Our Customers Say
            </h2>
            <p className="text-text-medium">Real reviews from real people</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', review: "I've been using the Vitamin C Serum for 3 months and my dark spots have visibly faded. My skin looks brighter and more even. Worth every penny!", rating: 5, product: 'Vitamin C Serum' },
              { name: 'Emily W.', review: "This Rose Moisturizer smells divine and keeps my skin hydrated all day. The rose scent is subtle and natural. My dry skin finally feels happy!", rating: 5, product: 'Rose Moisturizer' },
              { name: 'Catherine D.', review: "I was afraid to try retinol because of sensitivity, but this night cream is so gentle! After 6 weeks, my fine lines are visibly reduced.", rating: 5, product: 'Retinol Night Cream' }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-star" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-medium text-sm mb-3 italic">&ldquo;{testimonial.review}&rdquo;</p>
                <div>
                  <p className="font-semibold text-text-dark text-sm">{testimonial.name}</p>
                  <p className="text-text-light text-xs">Verified Buyer — {testimonial.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Highlights Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Complete Skincare Routine
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Cleanse, treat, and moisturize with our complete natural skincare system. Designed to work together for maximum results.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {['Step 1: Cleanse', 'Step 2: Treat (Serum)', 'Step 3: Moisturize', 'Step 4: Night Care'].map((step, i) => (
              <div key={i} className="bg-white/10 rounded-lg px-6 py-3 backdrop-blur-sm">
                <p className="font-medium text-sm">{step}</p>
              </div>
            ))}
          </div>
          <Link to="/collections" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent-dark transition-colors">
            Build Your Routine
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
