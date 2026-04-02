import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>GlowNaturals</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Pure Beauty, Naturally Radiant. Premium natural skincare made with 95% natural ingredients.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Facebook', 'Twitter', 'Pinterest'].map(platform => (
                <a key={platform} href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-xs">
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/collections" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/collections/best-sellers" className="hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/collections/new-arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/collections/serums-treatments" className="hover:text-white transition-colors">Serums</Link></li>
              <li><Link to="/collections/moisturizers" className="hover:text-white transition-colors">Moisturizers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/pages/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/pages/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/pages/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/pages/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/pages/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/pages/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/60 text-sm">&copy; {new Date().getFullYear()} GlowNaturals. All rights reserved.</p>
          <div className="flex gap-4 text-white/60 text-xs">
            <span>Cruelty-Free</span>
            <span>&bull;</span>
            <span>Vegan Friendly</span>
            <span>&bull;</span>
            <span>Sustainable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
