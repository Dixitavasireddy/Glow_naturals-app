# GlowNaturals — Natural Skincare E-Commerce Store

🔗🚀Live Demo: https://glow-naturals-app-yezb.vercel.app/

> **Pure Beauty, Naturally Radiant** — A fully functional, professional e-commerce store built with React, Express.js, and SQLite.

## Brand Overview

- **Niche**: Natural Skincare
- **Target Customer**: Women 25–45 interested in clean, science-backed skincare
- **Products**: 5 premium skincare products across 5 collections
- **Color Palette**: Forest Green (#2D5016), Cream (#F5E6D3), Gold (#D4A574)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS 4 |
| Backend | Express.js 5 (REST API) |
| Database | SQLite (via better-sqlite3) |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Seed the Database

```bash
cd backend
npm run seed
```

### 3. Start the Application

```bash
# Terminal 1 — Backend (port 3001)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Run Tests

```bash
# Backend tests (57 tests)
cd backend
npm test

# Frontend tests (26 tests)
cd frontend
npm test
```

## Project Structure

```
glownaturals-store/
├── backend/
│   ├── src/
│   │   ├── models/          # 8 data models (Product, Collection, Cart, Order, etc.)
│   │   ├── routes/          # 9 API route groups
│   │   ├── database.js      # SQLite setup with 9 tables
│   │   ├── seed.js          # Comprehensive seed data
│   │   ├── app.js           # Express app config
│   │   └── server.js        # Server entry point
│   ├── __tests__/
│   │   └── api.test.js      # 57 API tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # 10 page components
│   │   ├── context/         # Cart state management
│   │   ├── utils/           # API client & helpers
│   │   ├── __tests__/       # 26 component tests
│   │   ├── App.jsx          # Router setup
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Tailwind theme & custom styles
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Features

### Store Pages
- **Homepage** — Hero banner, trust badges, featured collections, best sellers, benefits, testimonials, newsletter
- **Shop / Collections** — Browse by category with sorting options
- **Product Detail** — Image gallery, variants, reviews, sticky add-to-cart, tabs (description, ingredients, how to use)
- **Cart** — Full cart management with quantity controls, order summary, free shipping progress
- **Checkout** — 2-step checkout with discount codes, order summary, test payment mode
- **Order Confirmation** — Order details and tracking link
- **Track Order** — Order status tracking with progress visualization
- **Search** — Product search functionality
- **Static Pages** — About, Contact, FAQ, Shipping & Returns, Privacy Policy, Terms of Service

### E-Commerce Features
- **Cart System** — Session-based cart with add, update, remove, clear
- **Discount Codes** — Percentage off, fixed amount, and free shipping types
  - `GLOW15` — 15% off (first order)
  - `WELCOME10` — $10 off orders over $50
  - `SAVE5` — $5 off any order
  - `FREESHIP` — Free shipping
- **Product Variants** — Multiple sizes with different pricing
- **Reviews & Ratings** — Customer reviews with star ratings
- **Newsletter Signup** — Email collection with popup and footer form
- **Free Shipping** — Automatic on orders over $50
- **Tax Calculation** — 8% tax rate

### UX Features
- **Announcement Bar** — Promotional banner with close button
- **Email Popup** — Newsletter capture with 15% off incentive
- **Trust Badges** — 6 trust signals (Natural, Cruelty-Free, Sustainable, etc.)
- **Sticky Add-to-Cart** — Mobile sticky button on product pages
- **Cart Drawer** — Slide-out cart panel
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Loading States** — Spinner animations during data fetching

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (with search) |
| GET | `/api/products/slug/:slug` | Get product by slug |
| GET | `/api/collections` | List all collections |
| GET | `/api/collections/slug/:slug` | Get collection with products |
| GET | `/api/cart/:sessionId` | Get cart items |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove cart item |
| POST | `/api/orders` | Create order from cart |
| GET | `/api/orders/:orderNumber` | Get order details |
| POST | `/api/orders/track` | Track order by number + email |
| GET | `/api/reviews/product/:id` | Get product reviews |
| POST | `/api/reviews` | Create review |
| POST | `/api/newsletter` | Subscribe to newsletter |
| GET | `/api/pages` | List all pages |
| GET | `/api/pages/slug/:slug` | Get page by slug |
| POST | `/api/discounts/validate` | Validate discount code |
| GET | `/api/settings` | Get store settings |

## Products

| Product | Price | Type |
|---------|-------|------|
| Radiance Vitamin C Serum | $38 | Serum |
| Hydra-Bloom Rose Moisturizer | $42 | Moisturizer |
| Gentle Glow Cleanser | $28 | Cleanser |
| Renewal Retinol Night Cream | $48 | Moisturizer |
| Golden Glow Face Oil | $56 | Serum |

## Testing

- **Backend**: 57 tests covering all API endpoints and database operations
- **Frontend**: 26 tests covering components, helpers, and user interactions
- **Total**: 83 tests, all passing with zero errors

## Build for Production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## License

MIT
