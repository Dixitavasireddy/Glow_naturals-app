const path = require('path');
const fs = require('fs');
const { getDatabase, closeDatabase } = require('./database');
const Product = require('./models/Product');
const Collection = require('./models/Collection');
const Review = require('./models/Review');
const Page = require('./models/Page');
const Discount = require('./models/Discount');
const StoreSettings = require('./models/StoreSettings');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = getDatabase();
const productModel = new Product(db);
const collectionModel = new Collection(db);
const reviewModel = new Review(db);
const pageModel = new Page(db);
const discountModel = new Discount(db);
const settingsModel = new StoreSettings(db);

console.log('Seeding GlowNaturals store database...');

// Clear existing data
db.exec('DELETE FROM product_collections');
db.exec('DELETE FROM reviews');
db.exec('DELETE FROM cart_items');
db.exec('DELETE FROM orders');
db.exec('DELETE FROM products');
db.exec('DELETE FROM collections');
db.exec('DELETE FROM pages');
db.exec('DELETE FROM discount_codes');
db.exec('DELETE FROM newsletter_subscribers');
db.exec('DELETE FROM store_settings');

// ==================== STORE SETTINGS ====================
settingsModel.set('store_name', 'GlowNaturals');
settingsModel.set('store_tagline', 'Pure Beauty, Naturally Radiant');
settingsModel.set('store_email', 'hello@glownaturals.com');
settingsModel.set('store_phone', '+1 (888) 456-7890');
settingsModel.set('currency', 'USD');
settingsModel.set('timezone', 'America/New_York');
settingsModel.set('free_shipping_threshold', '50');
settingsModel.set('tax_rate', '0.08');
settingsModel.set('announcement_text', 'FREE SHIPPING on orders over $50 | Use code GLOW15 for 15% off your first order');
settingsModel.set('social_links', JSON.stringify({
  instagram: 'https://instagram.com/glownaturals',
  facebook: 'https://facebook.com/glownaturals',
  twitter: 'https://twitter.com/glownaturals',
  pinterest: 'https://pinterest.com/glownaturals',
  tiktok: 'https://tiktok.com/@glownaturals'
}));
settingsModel.set('brand_colors', JSON.stringify({
  primary: '#2D5016',
  secondary: '#F5E6D3',
  accent: '#D4A574',
  text: '#1A1A1A',
  background: '#FFFAF5'
}));

console.log('Store settings created.');

// ==================== COLLECTIONS ====================
const collections = [
  {
    title: 'Best Sellers',
    slug: 'best-sellers',
    description: 'Our most loved products, chosen by thousands of happy customers. Discover what makes GlowNaturals the go-to brand for natural skincare.',
    image: '/images/collections/best-sellers.jpg',
    sort_order: 1,
    meta_title: 'Best Sellers | GlowNaturals Natural Skincare',
    meta_description: 'Shop our best-selling natural skincare products. Loved by thousands for their pure, effective ingredients.'
  },
  {
    title: 'Moisturizers',
    slug: 'moisturizers',
    description: 'Deep hydration meets natural ingredients. Our moisturizers lock in moisture while nourishing your skin with botanical extracts.',
    image: '/images/collections/moisturizers.jpg',
    sort_order: 2,
    meta_title: 'Natural Moisturizers | GlowNaturals',
    meta_description: 'Hydrate and nourish your skin with our natural moisturizers. Formulated with botanical extracts for lasting moisture.'
  },
  {
    title: 'Serums & Treatments',
    slug: 'serums-treatments',
    description: 'Targeted treatments powered by nature. Our serums deliver concentrated active ingredients for visible results.',
    image: '/images/collections/serums.jpg',
    sort_order: 3,
    meta_title: 'Natural Serums & Treatments | GlowNaturals',
    meta_description: 'Transform your skin with our natural serums and targeted treatments. Powerful botanical actives for visible results.'
  },
  {
    title: 'Cleansers',
    slug: 'cleansers',
    description: 'Gentle yet effective cleansing for every skin type. Remove impurities while preserving your skin\'s natural barrier.',
    image: '/images/collections/cleansers.jpg',
    sort_order: 4,
    meta_title: 'Natural Cleansers | GlowNaturals',
    meta_description: 'Gentle, effective natural cleansers for every skin type. Clean beauty that respects your skin barrier.'
  },
  {
    title: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Fresh additions to our collection. Be the first to try our latest natural skincare innovations.',
    image: '/images/collections/new-arrivals.jpg',
    sort_order: 5,
    meta_title: 'New Arrivals | GlowNaturals Natural Skincare',
    meta_description: 'Discover our latest natural skincare products. Fresh innovations in clean beauty.'
  }
];

const createdCollections = {};
for (const col of collections) {
  const created = collectionModel.create(col);
  createdCollections[col.slug] = created;
  console.log(`Collection created: ${col.title}`);
}

// ==================== PRODUCTS ====================
const products = [
  {
    title: 'Radiance Vitamin C Serum',
    slug: 'radiance-vitamin-c-serum',
    description: `<p>Unlock your skin's natural radiance with our bestselling Vitamin C Serum. This lightweight, fast-absorbing formula combines 20% L-Ascorbic Acid with Hyaluronic Acid and Vitamin E for maximum brightening and anti-aging benefits.</p>
<h3>Key Benefits</h3>
<ul>
<li>Brightens dull, uneven skin tone</li>
<li>Reduces the appearance of dark spots and hyperpigmentation</li>
<li>Boosts collagen production for firmer, younger-looking skin</li>
<li>Protects against environmental damage and free radicals</li>
<li>Hydrates and plumps with Hyaluronic Acid</li>
</ul>
<h3>Why You'll Love It</h3>
<p>Formulated with 98% natural ingredients, this serum is free from parabens, sulfates, and synthetic fragrances. The amber glass bottle preserves the potency of Vitamin C, ensuring maximum effectiveness with every drop.</p>`,
    short_description: 'A powerful 20% Vitamin C serum that brightens, firms, and protects for visibly radiant skin.',
    price: 38.00,
    compare_price: 52.00,
    sku: 'GN-VCS-001',
    inventory_quantity: 150,
    product_type: 'Serum',
    vendor: 'GlowNaturals',
    tags: ['vitamin c', 'brightening', 'anti-aging', 'serum', 'best seller'],
    images: [
      '/images/products/vitamin-c-serum-1.jpg',
      '/images/products/vitamin-c-serum-2.jpg',
      '/images/products/vitamin-c-serum-3.jpg'
    ],
    variants: [
      { name: '30ml', price: 38.00, sku: 'GN-VCS-30', inventory: 100 },
      { name: '50ml', price: 54.00, sku: 'GN-VCS-50', inventory: 50 }
    ],
    featured: true,
    best_seller: true,
    meta_title: 'Radiance Vitamin C Serum | GlowNaturals Natural Skincare',
    meta_description: 'Brighten and protect your skin with our 20% Vitamin C Serum. Natural, effective, and loved by thousands.',
    shipping_info: 'Free shipping on orders over $50. Ships within 1-2 business days.',
    ingredients: 'Water, L-Ascorbic Acid (20%), Hyaluronic Acid, Vitamin E (Tocopherol), Ferulic Acid, Aloe Vera Extract, Jojoba Oil, Rosehip Seed Oil, Glycerin, Citrus Aurantium Dulcis (Orange) Peel Oil',
    how_to_use: 'Apply 3-4 drops to clean, dry skin morning and evening. Follow with moisturizer and SPF during the day. Allow serum to absorb for 1-2 minutes before layering other products.'
  },
  {
    title: 'Hydra-Bloom Rose Moisturizer',
    slug: 'hydra-bloom-rose-moisturizer',
    description: `<p>Immerse your skin in luxury with our Hydra-Bloom Rose Moisturizer. This rich yet lightweight cream blends organic rose water, shea butter, and squalane to deliver 72-hour hydration that leaves skin soft, supple, and glowing.</p>
<h3>Key Benefits</h3>
<ul>
<li>72-hour deep hydration with time-release moisture technology</li>
<li>Soothes and calms sensitive or irritated skin</li>
<li>Strengthens the skin barrier with ceramide complex</li>
<li>Organic rose water tones and refreshes</li>
<li>Non-comedogenic — won't clog pores</li>
</ul>
<h3>Why You'll Love It</h3>
<p>Our signature rose moisturizer is the perfect everyday hydrator. Suitable for all skin types, it melts into skin without any greasy residue, making it ideal under makeup or as a nourishing night cream.</p>`,
    short_description: 'A luxurious rose-infused moisturizer delivering 72-hour hydration for soft, glowing skin.',
    price: 42.00,
    compare_price: 58.00,
    sku: 'GN-HRM-001',
    inventory_quantity: 200,
    product_type: 'Moisturizer',
    vendor: 'GlowNaturals',
    tags: ['moisturizer', 'rose', 'hydrating', 'sensitive skin', 'best seller'],
    images: [
      '/images/products/rose-moisturizer-1.jpg',
      '/images/products/rose-moisturizer-2.jpg',
      '/images/products/rose-moisturizer-3.jpg'
    ],
    variants: [
      { name: '50ml', price: 42.00, sku: 'GN-HRM-50', inventory: 120 },
      { name: '100ml', price: 72.00, sku: 'GN-HRM-100', inventory: 80 }
    ],
    featured: true,
    best_seller: true,
    meta_title: 'Hydra-Bloom Rose Moisturizer | GlowNaturals',
    meta_description: 'Experience 72-hour hydration with our organic rose moisturizer. Lightweight, non-comedogenic, and perfect for all skin types.',
    shipping_info: 'Free shipping on orders over $50. Ships within 1-2 business days.',
    ingredients: 'Aqua, Rosa Damascena (Rose) Water, Butyrospermum Parkii (Shea Butter), Squalane, Ceramide NP, Ceramide AP, Glycerin, Aloe Barbadensis Leaf Juice, Jojoba Esters, Tocopherol (Vitamin E), Rosa Centifolia Flower Extract',
    how_to_use: 'After cleansing and applying serum, take a small amount and gently massage into face and neck using upward motions. Use morning and evening for best results.'
  },
  {
    title: 'Gentle Glow Cleanser',
    slug: 'gentle-glow-cleanser',
    description: `<p>Start your skincare routine right with our Gentle Glow Cleanser. This cloud-like gel cleanser removes makeup, dirt, and impurities without stripping your skin of its natural oils. Enriched with chamomile and green tea extracts for a soothing, refreshing cleanse.</p>
<h3>Key Benefits</h3>
<ul>
<li>Removes makeup and impurities without harsh stripping</li>
<li>pH-balanced formula respects your skin's acid mantle</li>
<li>Chamomile extract soothes and reduces redness</li>
<li>Green tea antioxidants protect against environmental stress</li>
<li>Suitable for sensitive, dry, and combination skin</li>
</ul>
<h3>Why You'll Love It</h3>
<p>Say goodbye to tight, dry skin after cleansing. Our gentle formula lathers into a soft foam that leaves skin clean, calm, and comfortably hydrated. Perfect for the double-cleanse method.</p>`,
    short_description: 'A gentle gel cleanser with chamomile and green tea for a soothing, effective cleanse.',
    price: 28.00,
    compare_price: 36.00,
    sku: 'GN-GGC-001',
    inventory_quantity: 180,
    product_type: 'Cleanser',
    vendor: 'GlowNaturals',
    tags: ['cleanser', 'gentle', 'sensitive skin', 'chamomile', 'green tea'],
    images: [
      '/images/products/gentle-cleanser-1.jpg',
      '/images/products/gentle-cleanser-2.jpg',
      '/images/products/gentle-cleanser-3.jpg'
    ],
    variants: [
      { name: '150ml', price: 28.00, sku: 'GN-GGC-150', inventory: 100 },
      { name: '250ml', price: 42.00, sku: 'GN-GGC-250', inventory: 80 }
    ],
    featured: true,
    best_seller: false,
    meta_title: 'Gentle Glow Cleanser | GlowNaturals Natural Skincare',
    meta_description: 'Cleanse gently with our pH-balanced gel cleanser. Chamomile and green tea soothe while removing impurities.',
    shipping_info: 'Free shipping on orders over $50. Ships within 1-2 business days.',
    ingredients: 'Aqua, Cocamidopropyl Betaine, Glycerin, Chamomilla Recutita (Chamomile) Extract, Camellia Sinensis (Green Tea) Leaf Extract, Aloe Barbadensis Leaf Juice, Panthenol (Vitamin B5), Sodium Cocoyl Glutamate, Citric Acid',
    how_to_use: 'Wet face with lukewarm water. Apply a small amount to fingertips and gently massage in circular motions. Rinse thoroughly. Use morning and evening.'
  },
  {
    title: 'Renewal Retinol Night Cream',
    slug: 'renewal-retinol-night-cream',
    description: `<p>Wake up to younger-looking skin with our Renewal Retinol Night Cream. This advanced formula combines encapsulated retinol with bakuchiol (a natural retinol alternative) for powerful anti-aging benefits without irritation.</p>
<h3>Key Benefits</h3>
<ul>
<li>Reduces fine lines and wrinkles with encapsulated retinol</li>
<li>Bakuchiol provides gentle, plant-based retinol benefits</li>
<li>Promotes cell turnover for smoother, more even skin</li>
<li>Niacinamide minimizes pores and strengthens skin barrier</li>
<li>Rich night formula deeply nourishes while you sleep</li>
</ul>
<h3>Why You'll Love It</h3>
<p>Unlike harsh retinol products, our night cream uses encapsulated retinol technology for gradual release, minimizing irritation while maximizing results. Wake up to visibly smoother, firmer skin.</p>`,
    short_description: 'An advanced retinol night cream with bakuchiol for gentle yet powerful anti-aging results.',
    price: 48.00,
    compare_price: 65.00,
    sku: 'GN-RNC-001',
    inventory_quantity: 120,
    product_type: 'Moisturizer',
    vendor: 'GlowNaturals',
    tags: ['retinol', 'anti-aging', 'night cream', 'bakuchiol', 'wrinkles'],
    images: [
      '/images/products/retinol-night-cream-1.jpg',
      '/images/products/retinol-night-cream-2.jpg',
      '/images/products/retinol-night-cream-3.jpg'
    ],
    variants: [
      { name: '50ml', price: 48.00, sku: 'GN-RNC-50', inventory: 80 },
      { name: '75ml', price: 68.00, sku: 'GN-RNC-75', inventory: 40 }
    ],
    featured: true,
    best_seller: true,
    meta_title: 'Renewal Retinol Night Cream | GlowNaturals',
    meta_description: 'Transform your skin overnight with our gentle retinol + bakuchiol night cream. Anti-aging without irritation.',
    shipping_info: 'Free shipping on orders over $50. Ships within 1-2 business days.',
    ingredients: 'Aqua, Encapsulated Retinol (0.5%), Bakuchiol, Niacinamide, Squalane, Shea Butter, Ceramide Complex, Peptide Complex, Hyaluronic Acid, Jojoba Oil, Lavandula Angustifolia (Lavender) Oil, Tocopherol (Vitamin E)',
    how_to_use: 'Apply a pea-sized amount to clean, dry skin every evening. Start with 2-3 nights per week and gradually increase frequency. Always wear SPF during the day when using retinol products.'
  },
  {
    title: 'Golden Glow Face Oil',
    slug: 'golden-glow-face-oil',
    description: `<p>Experience the golden touch of luxury with our signature face oil. This fast-absorbing blend of 9 precious botanical oils delivers instant radiance and deep nourishment for a lit-from-within glow.</p>
<h3>Key Benefits</h3>
<ul>
<li>9 precious botanical oils for complete skin nourishment</li>
<li>Rosehip and argan oils repair and renew</li>
<li>Marula and jojoba oils provide lightweight hydration</li>
<li>24K gold-infused for instant luminosity</li>
<li>Fast-absorbing, non-greasy formula</li>
</ul>
<h3>Why You'll Love It</h3>
<p>This multi-tasking face oil can be used alone, mixed with moisturizer, or as a primer for a dewy makeup look. The golden shimmer gives an instant healthy glow while the oils work to improve skin texture over time.</p>`,
    short_description: 'A luxurious 9-oil blend with 24K gold for instant radiance and deep nourishment.',
    price: 56.00,
    compare_price: 75.00,
    sku: 'GN-GFO-001',
    inventory_quantity: 90,
    product_type: 'Serum',
    vendor: 'GlowNaturals',
    tags: ['face oil', 'luxury', 'radiance', 'anti-aging', 'gold', 'new arrival'],
    images: [
      '/images/products/golden-face-oil-1.jpg',
      '/images/products/golden-face-oil-2.jpg',
      '/images/products/golden-face-oil-3.jpg'
    ],
    variants: [
      { name: '30ml', price: 56.00, sku: 'GN-GFO-30', inventory: 60 },
      { name: '50ml', price: 82.00, sku: 'GN-GFO-50', inventory: 30 }
    ],
    featured: true,
    best_seller: false,
    meta_title: 'Golden Glow Face Oil | GlowNaturals Natural Skincare',
    meta_description: 'Get instant radiance with our 9-oil face oil blend. 24K gold-infused luxury for a lit-from-within glow.',
    shipping_info: 'Free shipping on orders over $50. Ships within 1-2 business days.',
    ingredients: 'Rosa Canina (Rosehip) Seed Oil, Argania Spinosa (Argan) Oil, Sclerocarya Birrea (Marula) Seed Oil, Simmondsia Chinensis (Jojoba) Oil, Camellia Japonica Seed Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Vitis Vinifera (Grape) Seed Oil, Helianthus Annuus (Sunflower) Seed Oil, Cannabis Sativa (Hemp) Seed Oil, Gold (24K), Tocopherol, Lavandula Angustifolia Oil',
    how_to_use: 'Warm 3-5 drops between palms and press gently into clean skin. Use as the last step of your skincare routine or mix with foundation for a dewy finish. Suitable for morning and evening use.'
  }
];

const createdProducts = [];
for (const prod of products) {
  const created = productModel.create(prod);
  createdProducts.push(created);
  console.log(`Product created: ${prod.title} — $${prod.price}`);
}

// ==================== PRODUCT-COLLECTION MAPPING ====================
const collectionMapping = {
  'best-sellers': [0, 1, 3],
  'moisturizers': [1, 3],
  'serums-treatments': [0, 4],
  'cleansers': [2],
  'new-arrivals': [4, 3]
};

for (const [colSlug, productIndices] of Object.entries(collectionMapping)) {
  const collection = createdCollections[colSlug];
  for (const idx of productIndices) {
    collectionModel.addProduct(collection.id, createdProducts[idx].id);
  }
  console.log(`Mapped ${productIndices.length} products to ${colSlug}`);
}

// ==================== REVIEWS ====================
const reviewsData = [
  // Vitamin C Serum reviews
  { product_idx: 0, author: 'Sarah M.', email: 'sarah@example.com', rating: 5, title: 'Absolute game changer!', body: 'I\'ve been using this serum for 3 months and my dark spots have visibly faded. My skin looks brighter and more even. Worth every penny!', verified: true },
  { product_idx: 0, author: 'Jessica L.', email: 'jessica@example.com', rating: 5, title: 'Best vitamin C serum I\'ve tried', body: 'After trying many expensive brands, this one actually delivers results. Absorbs quickly without any stickiness. Love the amber bottle too.', verified: true },
  { product_idx: 0, author: 'Mia K.', email: 'mia@example.com', rating: 4, title: 'Really effective', body: 'Great serum that has noticeably improved my skin tone. Taking off one star because I wish it came in a bigger size. Will definitely repurchase!', verified: true },
  { product_idx: 0, author: 'Amanda R.', email: 'amanda@example.com', rating: 5, title: 'My skin has never looked better', body: 'I get compliments on my skin all the time now. This serum has transformed my complexion. The vitamin C is very potent but gentle.', verified: true },
  // Rose Moisturizer reviews
  { product_idx: 1, author: 'Emily W.', email: 'emily@example.com', rating: 5, title: 'So hydrating and luxurious', body: 'This moisturizer smells divine and keeps my skin hydrated all day. The rose scent is subtle and natural. My dry skin finally feels happy!', verified: true },
  { product_idx: 1, author: 'Olivia P.', email: 'olivia@example.com', rating: 5, title: 'Perfect for sensitive skin', body: 'I have very reactive skin and this is one of the few moisturizers that doesn\'t cause any irritation. Hydrating without being heavy. Love it!', verified: true },
  { product_idx: 1, author: 'Rachel T.', email: 'rachel@example.com', rating: 4, title: 'Lovely texture', body: 'Beautiful cream that melts right into the skin. The rose water gives a lovely fresh feel. Works great under makeup too.', verified: true },
  // Gentle Cleanser reviews
  { product_idx: 2, author: 'Lisa C.', email: 'lisa@example.com', rating: 5, title: 'Finally, a cleanser that doesn\'t strip!', body: 'My skin used to feel tight after cleansing. This gel cleanser removes everything without any dryness. The chamomile scent is so calming.', verified: true },
  { product_idx: 2, author: 'Nina S.', email: 'nina@example.com', rating: 4, title: 'Great gentle cleanser', body: 'Does exactly what it promises — gentle yet effective cleansing. Good for my combination skin. The green tea extract is a nice touch.', verified: true },
  // Retinol Night Cream reviews
  { product_idx: 3, author: 'Catherine D.', email: 'catherine@example.com', rating: 5, title: 'Gentle retinol that actually works', body: 'I was afraid to try retinol because of sensitivity, but this cream is so gentle! After 6 weeks, my fine lines are visibly reduced. Amazing formula.', verified: true },
  { product_idx: 3, author: 'Patricia H.', email: 'patricia@example.com', rating: 5, title: 'Love waking up to smooth skin', body: 'This night cream has become my holy grail product. My skin looks smoother and more youthful every morning. The bakuchiol makes it so gentle.', verified: true },
  { product_idx: 3, author: 'Diana F.', email: 'diana@example.com', rating: 4, title: 'Great anti-aging cream', body: 'Really seeing improvement in my skin texture after using this for a month. No irritation at all, which is rare for retinol products.', verified: true },
  // Golden Face Oil reviews
  { product_idx: 4, author: 'Sophia G.', email: 'sophia@example.com', rating: 5, title: 'Liquid gold for your face', body: 'This oil is incredible! My skin drinks it up and looks so luminous. I mix a few drops with my foundation for a gorgeous dewy finish.', verified: true },
  { product_idx: 4, author: 'Isabella M.', email: 'isabella@example.com', rating: 5, title: 'My favorite luxury product', body: 'The golden glow this gives is unreal. It absorbs so fast and doesn\'t feel greasy at all. My skin has never been more radiant.', verified: true },
];

for (const rev of reviewsData) {
  reviewModel.create({
    product_id: createdProducts[rev.product_idx].id,
    author: rev.author,
    email: rev.email,
    rating: rev.rating,
    title: rev.title,
    body: rev.body,
    verified: rev.verified
  });
}
console.log(`${reviewsData.length} reviews created.`);

// ==================== PAGES ====================
const pagesData = [
  {
    title: 'About Us',
    slug: 'about',
    content: `<div class="page-content">
<h1>Our Story</h1>
<p>Founded in 2020, GlowNaturals was born from a simple belief: your skincare should be as pure as nature intended. We saw an industry filled with harsh chemicals, questionable ingredients, and inflated promises — and knew there had to be a better way.</p>

<h2>Our Mission</h2>
<p>We're on a mission to make clean, effective skincare accessible to everyone. Every product in our line is formulated with at least 95% natural ingredients, backed by science, and never tested on animals.</p>

<h2>What Sets Us Apart</h2>
<ul>
<li><strong>Clean Ingredients:</strong> No parabens, sulfates, phthalates, or synthetic fragrances</li>
<li><strong>Science-Backed:</strong> Every formula is developed with dermatologists and cosmetic chemists</li>
<li><strong>Sustainable:</strong> Recyclable packaging, carbon-neutral shipping, and ethically sourced ingredients</li>
<li><strong>Cruelty-Free:</strong> Leaping Bunny certified — we never test on animals</li>
<li><strong>Results-Driven:</strong> Clinically tested formulas that deliver visible results</li>
</ul>

<h2>Our Values</h2>
<p>Transparency is at our core. We believe you have the right to know exactly what goes on your skin. That's why we list every ingredient, explain its purpose, and never hide behind vague terms like "fragrance" or "proprietary blend."</p>

<h2>Our Promise</h2>
<p>We promise to always choose the purest, most effective ingredients. To be honest about what our products can and can't do. And to keep pushing the boundaries of what natural skincare can achieve.</p>

<p><em>Here's to your most radiant skin yet.</em></p>
<p>— The GlowNaturals Team</p>
</div>`,
    meta_title: 'About Us | GlowNaturals Natural Skincare',
    meta_description: 'Learn about GlowNaturals — our mission to make clean, effective skincare accessible to everyone. 95% natural ingredients, science-backed, cruelty-free.'
  },
  {
    title: 'Contact Us',
    slug: 'contact',
    content: `<div class="page-content">
<h1>Get In Touch</h1>
<p>We'd love to hear from you! Whether you have a question about our products, need skincare advice, or just want to say hello — our team is here to help.</p>

<h2>Customer Support</h2>
<ul>
<li><strong>Email:</strong> hello@glownaturals.com</li>
<li><strong>Phone:</strong> +1 (888) 456-7890</li>
<li><strong>Hours:</strong> Monday – Friday, 9AM – 6PM EST</li>
<li><strong>Response Time:</strong> We typically respond within 24 hours</li>
</ul>

<h2>Business Inquiries</h2>
<p>For wholesale, press, or partnership opportunities, please email: partnerships@glownaturals.com</p>

<h2>Visit Us</h2>
<p>GlowNaturals HQ<br>
123 Beauty Lane<br>
New York, NY 10001<br>
United States</p>

<h2>Follow Us</h2>
<p>Stay connected and get skincare tips, behind-the-scenes content, and exclusive offers on our social channels.</p>
</div>`,
    meta_title: 'Contact Us | GlowNaturals',
    meta_description: 'Get in touch with GlowNaturals. We\'re here to help with product questions, skincare advice, and more.'
  },
  {
    title: 'FAQ',
    slug: 'faq',
    content: `<div class="page-content">
<h1>Frequently Asked Questions</h1>

<h3>Are GlowNaturals products cruelty-free?</h3>
<p>Yes! We are Leaping Bunny certified and never test on animals. All our products are 100% cruelty-free.</p>

<h3>Are your products suitable for sensitive skin?</h3>
<p>Most of our products are formulated with sensitive skin in mind. We use gentle, non-irritating ingredients and avoid common allergens. However, we always recommend doing a patch test before trying any new product.</p>

<h3>What is your return policy?</h3>
<p>We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, return it within 30 days for a full refund. See our Returns page for details.</p>

<h3>How long does shipping take?</h3>
<p>Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) is available at checkout. International shipping takes 7-14 business days.</p>

<h3>Do you offer free shipping?</h3>
<p>Yes! We offer free standard shipping on all orders over $50 within the US.</p>

<h3>Are your products vegan?</h3>
<p>The majority of our products are vegan. Products that contain beeswax or honey are clearly labeled. Check individual product pages for details.</p>

<h3>How should I store my products?</h3>
<p>Store products in a cool, dry place away from direct sunlight. Our Vitamin C Serum should be kept in its amber bottle and used within 3 months of opening for maximum potency.</p>

<h3>Can I use multiple GlowNaturals products together?</h3>
<p>Absolutely! Our products are designed to work together as a complete skincare system. We recommend: Cleanser → Serum → Moisturizer → SPF (daytime) or Night Cream (evening).</p>

<h3>Do you ship internationally?</h3>
<p>Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination.</p>

<h3>How can I track my order?</h3>
<p>Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order on our Track Order page.</p>
</div>`,
    meta_title: 'FAQ | GlowNaturals Natural Skincare',
    meta_description: 'Find answers to common questions about GlowNaturals products, shipping, returns, and more.'
  },
  {
    title: 'Shipping & Returns',
    slug: 'shipping-returns',
    content: `<div class="page-content">
<h1>Shipping & Returns</h1>

<h2>Shipping Policy</h2>
<h3>Domestic Shipping (United States)</h3>
<ul>
<li><strong>Standard Shipping:</strong> 3-5 business days — $5.99 (FREE on orders over $50)</li>
<li><strong>Express Shipping:</strong> 1-2 business days — $12.99</li>
<li><strong>Same-Day Delivery:</strong> Available in select metro areas — $19.99</li>
</ul>

<h3>International Shipping</h3>
<ul>
<li><strong>Canada:</strong> 5-7 business days — $9.99</li>
<li><strong>Europe:</strong> 7-10 business days — $14.99</li>
<li><strong>Rest of World:</strong> 10-14 business days — $19.99</li>
</ul>

<p>All orders are processed within 1-2 business days. You will receive a shipping confirmation email with tracking information once your order has been dispatched.</p>

<h2>Return Policy</h2>
<h3>30-Day Satisfaction Guarantee</h3>
<p>We want you to love your GlowNaturals products. If you're not completely satisfied, you may return any product within 30 days of delivery for a full refund.</p>

<h3>How to Return</h3>
<ol>
<li>Email us at returns@glownaturals.com with your order number</li>
<li>We'll send you a prepaid return label</li>
<li>Pack your items securely and drop off at any carrier location</li>
<li>Refund processed within 5-7 business days of receiving your return</li>
</ol>

<h3>Conditions</h3>
<ul>
<li>Products must be at least 50% full</li>
<li>Original packaging preferred but not required</li>
<li>Gift sets: all items must be returned together</li>
<li>Final sale items are not eligible for return</li>
</ul>

<h2>Exchanges</h2>
<p>Want a different product? We're happy to exchange! Follow the same return process and let us know what you'd like instead. Exchanges ship for free.</p>
</div>`,
    meta_title: 'Shipping & Returns | GlowNaturals',
    meta_description: 'Free shipping on orders over $50. 30-day satisfaction guarantee on all GlowNaturals products.'
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    content: `<div class="page-content">
<h1>Privacy Policy</h1>
<p><em>Last updated: January 2024</em></p>

<h2>Information We Collect</h2>
<p>When you visit our store, we collect certain information about your device, your interaction with the store, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.</p>

<h3>Personal Information</h3>
<ul>
<li>Name, email address, phone number</li>
<li>Billing and shipping address</li>
<li>Payment information (processed securely through our payment provider)</li>
<li>Order history and preferences</li>
</ul>

<h3>Automatic Information</h3>
<ul>
<li>IP address and browser type</li>
<li>Device information</li>
<li>Cookie and tracking data</li>
<li>Pages visited and time spent</li>
</ul>

<h2>How We Use Your Information</h2>
<ul>
<li>Process and fulfill your orders</li>
<li>Communicate with you about orders and promotions</li>
<li>Improve our website and product offerings</li>
<li>Prevent fraud and enhance security</li>
<li>Comply with legal obligations</li>
</ul>

<h2>Data Protection</h2>
<p>We implement industry-standard security measures to protect your personal information. Your payment data is encrypted and processed through PCI-compliant payment providers.</p>

<h2>Your Rights</h2>
<p>You have the right to access, correct, or delete your personal data. Contact us at privacy@glownaturals.com for any data-related requests.</p>

<h2>Cookies</h2>
<p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>

<h2>Contact</h2>
<p>For privacy-related questions, contact: privacy@glownaturals.com</p>
</div>`,
    meta_title: 'Privacy Policy | GlowNaturals',
    meta_description: 'Read our privacy policy to understand how GlowNaturals collects, uses, and protects your personal information.'
  },
  {
    title: 'Terms of Service',
    slug: 'terms-of-service',
    content: `<div class="page-content">
<h1>Terms of Service</h1>
<p><em>Last updated: January 2024</em></p>

<h2>Overview</h2>
<p>This website is operated by GlowNaturals. Throughout the site, the terms "we", "us" and "our" refer to GlowNaturals. By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by these terms and conditions.</p>

<h2>Online Store Terms</h2>
<ul>
<li>You must be at least 18 years of age to use this site</li>
<li>You may not use our products for any illegal or unauthorized purpose</li>
<li>A breach of any of the Terms will result in immediate termination of your services</li>
</ul>

<h2>Products & Pricing</h2>
<ul>
<li>Prices are subject to change without notice</li>
<li>We reserve the right to modify or discontinue any product without notice</li>
<li>Product colors and images may vary slightly from actual products</li>
<li>We do not guarantee that the quality of products will meet your expectations</li>
</ul>

<h2>Accuracy of Information</h2>
<p>We make every effort to display accurate product information, including descriptions, ingredients, pricing, and images. However, we do not guarantee that all information is complete, current, or error-free.</p>

<h2>Payment</h2>
<p>We accept major credit cards, PayPal, and Apple Pay. All payments are processed securely. You agree to provide current and accurate purchase and account information for all purchases.</p>

<h2>Limitation of Liability</h2>
<p>GlowNaturals shall not be liable for any injury, loss, claim, or damage arising from the use of our products or website. Individual results may vary. Always patch test new skincare products.</p>

<h2>Contact</h2>
<p>Questions about these Terms of Service? Contact us at legal@glownaturals.com</p>
</div>`,
    meta_title: 'Terms of Service | GlowNaturals',
    meta_description: 'Read our terms of service for using the GlowNaturals website and purchasing our products.'
  }
];

for (const page of pagesData) {
  pageModel.create(page);
  console.log(`Page created: ${page.title}`);
}

// ==================== DISCOUNT CODES ====================
const discounts = [
  { code: 'GLOW15', type: 'percentage', value: 15, min_order_amount: 0 },
  { code: 'WELCOME10', type: 'percentage', value: 10, min_order_amount: 25 },
  { code: 'SAVE5', type: 'fixed', value: 5, min_order_amount: 30 },
  { code: 'FREESHIP', type: 'free_shipping', value: 0, min_order_amount: 0 }
];

for (const disc of discounts) {
  discountModel.create(disc);
  console.log(`Discount code created: ${disc.code}`);
}

console.log('\nDatabase seeded successfully!');
console.log(`Products: ${createdProducts.length}`);
console.log(`Collections: ${Object.keys(createdCollections).length}`);
console.log(`Reviews: ${reviewsData.length}`);
console.log(`Pages: ${pagesData.length}`);
console.log(`Discount codes: ${discounts.length}`);

closeDatabase();
