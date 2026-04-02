import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { formatPrice, getSessionId, renderStars, truncateText, getPlaceholderImage } from '../utils/helpers';
import AnnouncementBar from '../components/AnnouncementBar';
import TrustBadges from '../components/TrustBadges';
import Newsletter from '../components/Newsletter';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import App from '../App';

// Wrapper for components that need Router + Cart context
function Wrapper({ children }) {
  return (
    <BrowserRouter>
      <CartProvider>
        {children}
      </CartProvider>
    </BrowserRouter>
  );
}

// ============ HELPER FUNCTIONS ============

describe('Helper Functions', () => {
  describe('formatPrice', () => {
    it('formats price correctly', () => {
      expect(formatPrice(29.99)).toBe('$29.99');
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(100)).toBe('$100.00');
      expect(formatPrice(1234.5)).toBe('$1,234.50');
    });
  });

  describe('getSessionId', () => {
    it('generates and stores session ID', () => {
      const id = getSessionId();
      expect(id).toBeTruthy();
      expect(id.startsWith('sess_')).toBe(true);
    });

    it('returns same session ID on subsequent calls', () => {
      const id1 = getSessionId();
      const id2 = getSessionId();
      expect(id1).toBe(id2);
    });
  });

  describe('renderStars', () => {
    it('renders correct number of stars', () => {
      const stars = renderStars(3.5);
      expect(stars).toHaveLength(5);
      expect(stars.filter(s => s === 'full')).toHaveLength(3);
      expect(stars.filter(s => s === 'half')).toHaveLength(1);
      expect(stars.filter(s => s === 'empty')).toHaveLength(1);
    });

    it('renders all full stars for rating 5', () => {
      const stars = renderStars(5);
      expect(stars.filter(s => s === 'full')).toHaveLength(5);
    });

    it('renders all empty stars for rating 0', () => {
      const stars = renderStars(0);
      expect(stars.filter(s => s === 'empty')).toHaveLength(5);
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
    });

    it('returns short text unchanged', () => {
      expect(truncateText('Hi', 10)).toBe('Hi');
    });

    it('handles null/undefined', () => {
      expect(truncateText(null, 10)).toBeNull();
      expect(truncateText(undefined, 10)).toBeUndefined();
    });
  });

  describe('getPlaceholderImage', () => {
    it('generates SVG data URI', () => {
      const img = getPlaceholderImage('Product');
      expect(img).toContain('data:image/svg+xml');
      expect(img).toContain('Product');
    });
  });
});

// ============ COMPONENTS ============

describe('AnnouncementBar', () => {
  it('renders announcement text', () => {
    render(<AnnouncementBar />);
    expect(screen.getByText(/FREE SHIPPING/i)).toBeInTheDocument();
    expect(screen.getByText(/GLOW15/i)).toBeInTheDocument();
  });

  it('closes when X is clicked', () => {
    render(<AnnouncementBar />);
    const closeBtn = screen.getByLabelText('Close announcement');
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/FREE SHIPPING/i)).not.toBeInTheDocument();
  });
});

describe('TrustBadges', () => {
  it('renders all badges in full mode', () => {
    render(<TrustBadges />);
    expect(screen.getByText('100% Natural')).toBeInTheDocument();
    expect(screen.getByText('Cruelty-Free')).toBeInTheDocument();
    expect(screen.getByText('Sustainable')).toBeInTheDocument();
    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
    expect(screen.getByText('30-Day Returns')).toBeInTheDocument();
    expect(screen.getByText('Science-Backed')).toBeInTheDocument();
  });

  it('renders compact version with fewer badges', () => {
    render(<TrustBadges compact />);
    expect(screen.getByText('100% Natural')).toBeInTheDocument();
    expect(screen.queryByText('Free Shipping')).not.toBeInTheDocument();
  });
});

describe('Newsletter', () => {
  it('renders newsletter form', () => {
    render(<Newsletter />);
    expect(screen.getByText('Join the Glow Community')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your email address')).toBeInTheDocument();
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });

  it('shows success message on subscribe', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Subscribed successfully!' }),
    });

    render(<Newsletter />);
    const input = screen.getByPlaceholderText('Your email address');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Subscribe'));

    await waitFor(() => {
      expect(screen.getByText('Subscribed successfully!')).toBeInTheDocument();
    });
  });
});

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Serum',
    slug: 'test-serum',
    price: 39.99,
    compare_price: 49.99,
    product_type: 'Serum',
    short_description: 'A great serum',
    images: [],
    best_seller: true,
    tags: ['natural'],
  };

  beforeEach(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], subtotal: 0, itemCount: 0 }),
    });
  });

  it('renders product information', () => {
    render(
      <Wrapper>
        <ProductCard product={mockProduct} />
      </Wrapper>
    );
    expect(screen.getByText('Test Serum')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByText('A great serum')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('shows discount badge when compare price exists', () => {
    render(
      <Wrapper>
        <ProductCard product={mockProduct} />
      </Wrapper>
    );
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('shows best seller badge', () => {
    render(
      <Wrapper>
        <ProductCard product={mockProduct} />
      </Wrapper>
    );
    expect(screen.getByText('Best Seller')).toBeInTheDocument();
  });

  it('does not show discount badge without compare price', () => {
    const product = { ...mockProduct, compare_price: null };
    render(
      <Wrapper>
        <ProductCard product={product} />
      </Wrapper>
    );
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders footer sections', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText('GlowNaturals')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });
});

describe('Navbar', () => {
  beforeEach(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], subtotal: 0, itemCount: 0 }),
    });
  });

  it('renders brand name', () => {
    render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    );
    expect(screen.getByText('GlowNaturals')).toBeInTheDocument();
  });

  it('renders nav links', () => {
    render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(
      <Wrapper>
        <Navbar />
      </Wrapper>
    );
    const menuBtn = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuBtn);
    // Mobile menu should show all links again
    const homeLinks = screen.getAllByText('Home');
    expect(homeLinks.length).toBeGreaterThanOrEqual(2);
  });
});

describe('App', () => {
  beforeEach(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        products: [],
        collections: [],
        items: [],
        subtotal: 0,
        itemCount: 0,
      }),
    });
  });

  it('renders the app with navbar and footer', async () => {
    render(
      <Wrapper>
        <App />
      </Wrapper>
    );
    // Should render brand name in navbar
    await waitFor(() => {
      expect(screen.getAllByText('GlowNaturals').length).toBeGreaterThanOrEqual(1);
    });
  });
});
