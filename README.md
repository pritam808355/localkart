# LocalKart – Local Business Marketplace

> **"Your Neighborhood, Now Online"**  
> A modern, responsive marketplace interface developed with HTML5, CSS3, and JavaScript to empower small shops, local artisans, and neighborhood vendors with digital visibility, direct customer inquiries, and transparent local commerce.

---

## 📌 Project Overview

**LocalKart** connects conscious shoppers with neighborhood stores, local artisans, fresh produce outlets, and trusted service providers in their immediate area. The platform focuses on bridging the digital divide for small mom-and-pop shops and Kirana stores by giving them an online presence with zero marketplace commission fees and direct phone/WhatsApp inquiries.

**Assignment by:** AI & Coding Institute | Contact: 9113170895

---

## 🎯 Real-World Problem & Solution

### The Challenge
Many local businesses have high-quality, authentic products (e.g. tree-ripened Alphonso mangoes, wooden cold-pressed mustard oil, slow-fermented artisan sourdough, hand-thrown pottery) but have limited online visibility. In contrast, large e-commerce platforms charge 20%–35% commissions and prioritize industrial warehouses over neighborhood stores.

Customers struggle to find:
- Nearby stores within walking or short driving distance
- Real-time product availability and authentic local pricing
- Store operating hours and direct shopkeeper contact information
- Verified local artisans and specialized services

### The LocalKart Solution
- **Hyperlocal Discovery:** Discover shops within 1–3 km by locality or pincode.
- **Direct Merchant Connection:** Inquire and order directly via WhatsApp or phone with zero middlemen.
- **Transparent Local Pricing:** Real-time prices with discount badges and savings breakdowns.
- **Empower Community Commerce:** 100% of purchase money stays within the local neighborhood.

---

## 📄 Pages Included

1. **Home Page (`index.html`)**
   - **Navbar:** Sticky header with brand logo, interactive location selector, navigation links, and "+ List Your Store" CTA.
   - **Hero Section:** Headline, subtitle, product search bar with category filter, quick search tags, and floating verified badges.
   - **Trust Highlights Bar:** 4 core value props (Hyperlocal discovery, Direct store prices, Fast pickup/delivery, Community empowerment).
   - **Categories Section:** 7 category cards (Grocery & Kirana, Fruits & Vegetables, Bakery & Sweets, Home & Handcrafted, Electronics, Pharmacy, Fashion).
   - **Featured Stores Section:** Cards showcasing top verified local merchants with ratings and operating hours.
   - **Popular Products Section:** Product cards displaying pricing, discounts, store names, and "View Product" actions.
   - **Local Business Spotlight:** Value comparison explaining why buying local matters for the community.
   - **Call To Action (CTA):** High-converting merchant onboarding banner.
   - **Footer:** Marketplace links, category shortcuts, helpdesk contact information, and institute attribution.

2. **Products Page (`products.html`)**
   - **Breadcrumb Navigation**
   - **Interactive Filters Sidebar:**
     - Live search filter (product name, description, shop name)
     - Category radio buttons with count indicators
     - Dynamic price range slider (up to ₹2,000)
     - One-click "Reset All Filters"
   - **Catalog Toolbar:** Live matching product counter, mobile filters toggle, and sort dropdown (Featured, Price: Low to High, Price: High to Low, Highest Rated, Biggest Discount).
   - **Responsive Product Grid:** Displays product cards with images, discounts, store links, ratings, prices, and "View Product" buttons.
   - **Empty State:** Friendly fallback when search filters match zero items.

3. **Product Details Page (`product-details.html`)**
   - **Dynamic Query Loading:** Reads `?id=prod-x` from URL (with seamless fallback).
   - **Interactive Gallery:** High-resolution main image with interactive thumbnail strip.
   - **Product Metadata:** Category badge, discount tag, rating, current price, original strikethrough price, and calculated savings amount.
   - **Description & Features:** Rich overview and verified checklist (freshness guarantees, organic certifications).
   - **Specifications Table:** Structured key-value specs (origin, net weight, shelf life, dietary info, warranty).
   - **Store Information Box:** Store logo, name, verified merchant icon, physical address, distance, operating hours, and "Contact Store" button.
   - **Similar / Related Products Grid:** Dynamic recommendations from similar categories.

4. **Stores Directory Page (`stores.html`)**
   - **Locality & Name Search Bar**
   - **Category Filter Pills:** All Stores, Grocery, Produce, Bakery, Handcrafted, Electronics, Pharmacy, Fashion.
   - **Responsive Store Cards:**
     - Store cover photo & brand logo avatar
     - Verified badge & star ratings
     - Locality and precise distance (e.g. `0.6 km away`)
     - Business description & specialty badges
     - Live status dot (Open / Operating hours)
     - "View Store" button with direct inquiry trigger

5. **Contact / About Page (`contact.html`)**
   - **About LocalKart:** Mission statement, vision, and real-world problem breakdown.
   - **How It Works:** 3-step illustrated walkthrough (Discover > Browse Inventories > Connect Direct).
   - **Benefits Comparison Grid:** Side-by-side breakdown of benefits for customers vs benefits for local business owners.
   - **Interactive Dual-Mode Form:**
     - Mode 1: Customer general inquiry and feedback
     - Mode 2: "Register My Store" with additional business fields (store name, category, shop address)
   - **Contact Channels:** Phone hotline, WhatsApp link, physical neighborhood trade center address, and email.
   - **FAQ Accordion:** Interactive expand/collapse answers to common customer and merchant questions.

---

## ⭐ Important UI Components

- **Product Cards:** Image with hover zoom, discount badge, store link, product title, star rating, current/original price, savings badge, and "View Product" button.
- **Store Cards:** Cover image, circular logo badge, verified merchant icon, star ratings, category tag, distance, description, and "View Store" action.
- **Category Cards:** Soft color icons, hover scale animations, and category counters.
- **Search Interfaces:**
  - Hero search box with category selector
  - Products catalog live client-side search input
  - Stores directory live filter
- **Price Badges & Discount Badges:** High-contrast tags highlighting percentage savings and discount amounts.
- **Direct Store Contact Modal:** Allows customers to reach merchants instantly via WhatsApp, direct phone call, or an inquiry message.
- **Neighborhood Location Selector Modal:** Switch localities or enter a pincode, persisting choice in `localStorage`.
- **Toast Alert System:** Responsive floating feedback alerts for inquiry dispatches and filter actions.

---

## 🗄️ Full-Stack Backend & MongoDB Database Integration

LocalKart is equipped with a complete **Node.js, Express, and MongoDB (Mongoose)** backend architecture with smart hybrid persistence.

### 1. Database Architecture & Models (Mongoose Schemas)
- **`Store` (`server/models/Store.js`):**
  - Schema: `id`, `name`, `category`, `rating`, `reviewsCount`, `image`, `logo`, `address`, `locality`, `distance`, `phone`, `whatsapp`, `email`, `openingHours`, `established`, `isVerified`, `description`, `badges`, `featured`, `timestamps`.
- **`Product` (`server/models/Product.js`):**
  - Schema: `id`, `name`, `price`, `originalPrice`, `discount`, `discountNum`, `rating`, `reviewsCount`, `storeId`, `storeName`, `category`, `categorySlug`, `isPopular`, `isFeatured`, `inStock`, `image`, `gallery`, `description`, `features`, `specs`, `timestamps`.
- **`Inquiry` (`server/models/Inquiry.js`):**
  - Schema: `customerName`, `customerPhone`, `customerEmail`, `message`, `storeId`, `storeName`, `productName`, `type`, `status`, `timestamps`.
- **`Category` (`server/models/Category.js`):**
  - Schema: `id`, `name`, `icon`, `count`, `description`, `timestamps`.

### 2. Smart Hybrid Database Engine (`server/db.js`)
- **Direct MongoDB & Atlas Support:** Connects automatically to local MongoDB (`mongodb://127.0.0.1:27017/localkart`) or MongoDB Atlas cloud via the connection string in `.env`.
- **Graceful File-Store Fallback:** If MongoDB is not yet running or configured, it automatically switches to a persistent local JSON store (`data/db.json`), ensuring zero-crash availability and full functionality right out of the box!
- **Auto-Sync:** Submitting new store registrations or customer inquiries persists them immediately.

### 3. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (Customer or Merchant with Store) |
| `POST` | `/api/auth/login` | Login with email and password (returns user profile & session token) |
| `GET` | `/api/auth/users` | List registered users (for Admin dashboard) |
| `GET` | `/api/health` | Database connection status, driver info, and collection metrics |
| `GET` | `/api/stores` | Get all stores (supports `?category=`, `?search=`, `?featured=`) |
| `GET` | `/api/stores/:id` | Get store profile by unique ID |
| `POST` | `/api/stores` | Register a new local merchant (Seller Onboarding) |
| `GET` | `/api/products` | Get products catalog (supports `?category=`, `?search=`, `?maxPrice=`, `?sort=`) |
| `GET` | `/api/products/:id` | Get single product with full specifications and gallery |
| `POST` | `/api/products` | Add a new product to store inventory |
| `GET` | `/api/categories` | Retrieve all market categories and counts |
| `POST` | `/api/inquiries` | Submit customer product inquiry or store contact message |
| `GET` | `/api/inquiries` | List received inquiries (supports `?storeId=`) |

### 4. Authentication & User Roles (`login.html`)
- **Customer Role:** Browse items, place inquiries, and save neighborhood favorites.
- **Merchant Role:** Create a store profile, manage product inventories, and receive direct inquiries.
- **Admin Role:** Full platform control via `admin.html`.
- **Default Seeded Accounts:**
  - **Customer:** `priya@example.com` / `customer123`
  - **Merchant:** `sharma@kirana.com` / `customer123`
  - **Administrator:** `admin@localkart.in` / `admin123`

### 4. Database Seeder Script
Seed the MongoDB database with all 8 verified neighborhood stores and 12 products:
```bash
npm run seed
```

---

## 💻 Tech Stack & Architecture

- **Backend:** Node.js, Express.js REST API
- **Database:** MongoDB & Mongoose ODM (with local JSON fallback)
- **Frontend:** HTML5 (Semantic elements), CSS3 (Custom design system, CSS variables, Grid, Flexbox), Vanilla JavaScript (ES6+ modular data layer, asynchronous API client)
- **Icons & Typography:** Font Awesome 6.5.1 CDN & Google Fonts (*Plus Jakarta Sans*)

---

## 🚀 How to Run the Project

### Option A: Run Full-Stack with Node.js & Database API (Recommended)
1. Install dependencies (if not already done):
   ```bash
   npm install
   ```
2. *(Optional)* Seed MongoDB:
   ```bash
   npm run seed
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser at **`http://localhost:5000`**. The server serves both the HTML5 frontend and the `/api/` endpoints!

### Option B: Standalone Frontend
You can also open `index.html` directly or serve via:
```bash
python -m http.server 8000
```

---

## 🔮 Future Scope

Later, LocalKart can be expanded into a full-stack e-commerce marketplace:
- **User Authentication:** JWT-based login/signup for customers and merchants.
- **Seller Portal:** Merchant dashboard to add, edit, and track inventory and incoming orders.
- **Cart & Checkout:** Shopping cart, order tracking, and integrated UPI payment gateway (Razorpay / Stripe).
- **Database & Backend:** Node.js / Express backend with MongoDB database to store live stores and product catalogs.
- **Live Geolocation:** HTML5 Geolocation API integration to automatically detect user latitude/longitude and calculate driving distance via map APIs.

---

## 💼 Resume Description

> **LocalKart – Local Business Marketplace:** Developed a responsive marketplace interface using HTML5, CSS3, and JavaScript to showcase local businesses and products through categorized listings, product cards, store profiles, search UI, and responsive layouts.
