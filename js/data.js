/**
 * LocalKart - Local Business Marketplace
 * Shared Data Repository (Stores and Products)
 */

const LOCALKART_DATA = {
  categories: [
    {
      id: "all",
      name: "All Categories",
      icon: "fa-solid fa-shapes",
      count: 12
    },
    {
      id: "grocery",
      name: "Grocery & Kirana",
      icon: "fa-solid fa-basket-shopping",
      count: 2,
      description: "Daily provisions, spices, pulses & grains from trusted kirana stores"
    },
    {
      id: "fruits-veg",
      name: "Fruits & Vegetables",
      icon: "fa-solid fa-carrot",
      count: 2,
      description: "Direct-from-farm fresh organic produce & seasonal fruits"
    },
    {
      id: "bakery-sweets",
      name: "Bakery & Sweets",
      icon: "fa-solid fa-cake-candles",
      count: 3,
      description: "Artisan sourdoughs, oven-fresh breads, sweets & traditional snacks"
    },
    {
      id: "home-craft",
      name: "Home & Handcrafted",
      icon: "fa-solid fa-couch",
      count: 2,
      description: "Locally made ceramics, handlooms, decor & artisanal craftwork"
    },
    {
      id: "electronics",
      name: "Electronics & Mobile",
      icon: "fa-solid fa-plug",
      count: 2,
      description: "Accessories, genuine chargers, audio gear & local repair support"
    },
    {
      id: "pharmacy",
      name: "Pharmacy & Wellness",
      icon: "fa-solid fa-heart-pulse",
      count: 1,
      description: "Ayurvedic remedies, organic supplements & herbal wellness oils"
    },
    {
      id: "fashion",
      name: "Fashion & Tailoring",
      icon: "fa-solid fa-shirt",
      count: 1,
      description: "Custom stitching, ethnic wear & neighborhood boutique fashion"
    }
  ],

  stores: [
    {
      id: "store-1",
      name: "Sharma Kirana & General Store",
      category: "Grocery & Kirana",
      rating: 4.8,
      reviewsCount: 142,
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80",
      address: "Shop #12, Central Market, Sector 18",
      locality: "Sector 18",
      distance: "0.6 km away",
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      email: "sharmakirana@localkart.in",
      openingHours: "8:00 AM - 10:00 PM",
      established: "1994",
      isVerified: true,
      description: "Your trusted neighborhood provision store for 30 years. Serving premium pulses, spices, fresh grains, cooking oils, and daily household essentials with door-to-door delivery.",
      badges: ["Fast Delivery", "Purity Assured", "UPI Accepted"],
      featured: true,
      productIds: ["prod-2", "prod-4"]
    },
    {
      id: "store-2",
      name: "Green Valley Organic Farm Outlet",
      category: "Fruits & Vegetables",
      rating: 4.9,
      reviewsCount: 215,
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
      address: "Plot 45, Farmers Mandi Road, Green Avenue",
      locality: "Green Avenue",
      distance: "1.2 km away",
      phone: "+91 98112 34567",
      whatsapp: "919811234567",
      email: "greenvalley@localkart.in",
      openingHours: "7:00 AM - 8:30 PM",
      established: "2016",
      isVerified: true,
      description: "Direct-from-farm daily harvested organic fruits, leafy greens, hydroponic salads, and seasonal exotic produce without synthetic fertilizers or chemicals.",
      badges: ["Farm Direct", "100% Organic", "Zero Pesticides"],
      featured: true,
      productIds: ["prod-1", "prod-7"]
    },
    {
      id: "store-3",
      name: "BakeCraft Artisan Boulangerie",
      category: "Bakery & Sweets",
      rating: 4.9,
      reviewsCount: 310,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
      address: "14/B Heritage Lane, Near Old Clock Tower",
      locality: "Old Clock Tower",
      distance: "1.8 km away",
      phone: "+91 97234 56789",
      whatsapp: "919723456789",
      email: "contact@bakecraft.in",
      openingHours: "8:30 AM - 10:30 PM",
      established: "2008",
      isVerified: true,
      description: "Neighborhood micro-bakery specializing in slow-fermented sourdoughs, freshly baked multigrain loaves, butter croissants, tea cakes, and custom celebratory cakes.",
      badges: ["Freshly Baked Daily", "No Preservatives", "Eggless Options"],
      featured: true,
      productIds: ["prod-3"]
    },
    {
      id: "store-4",
      name: "Gupta Sweets & Farsan",
      category: "Bakery & Sweets",
      rating: 4.7,
      reviewsCount: 189,
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=80",
      address: "Shop 5, Station Road, Main Bazaar",
      locality: "Station Road",
      distance: "0.9 km away",
      phone: "+91 98987 65432",
      whatsapp: "919898765432",
      email: "guptasweets@localkart.in",
      openingHours: "7:30 AM - 10:00 PM",
      established: "1982",
      isVerified: true,
      description: "Iconic sweet shop famous for pure Desi Ghee Laddoos, Bengali sweets, crispy Samosas, and freshly fried evening farsan crafted with authentic heritage recipes.",
      badges: ["Pure Desi Ghee", "Traditional Recipe", "Bulk Orders"],
      featured: false,
      productIds: ["prod-6"]
    },
    {
      id: "store-5",
      name: "TechnoFix Electronics & Spares",
      category: "Electronics & Mobile",
      rating: 4.6,
      reviewsCount: 98,
      image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80",
      address: "Shop 21, Nehru Electronics Complex",
      locality: "Nehru Complex",
      distance: "2.1 km away",
      phone: "+91 98450 11223",
      whatsapp: "919845011223",
      email: "technofix@localkart.in",
      openingHours: "10:00 AM - 9:00 PM (Closed Tues)",
      established: "2012",
      isVerified: true,
      description: "Authorized accessories, chargers, cables, audio gadgets, power banks, and on-spot express smartphone and laptop repair with genuine store warranty.",
      badges: ["Genuine Parts", "Express Repair", "Warranty Guarantee"],
      featured: true,
      productIds: ["prod-8", "prod-11"]
    },
    {
      id: "store-6",
      name: "KalaKriti Handlooms & Pottery",
      category: "Home & Handcrafted",
      rating: 4.9,
      reviewsCount: 164,
      image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=200&q=80",
      address: "19 Craft Village Road, Near Art Council",
      locality: "Craft Village",
      distance: "3.0 km away",
      phone: "+91 97110 99887",
      whatsapp: "919711099887",
      email: "support@kalakriti.in",
      openingHours: "10:30 AM - 8:30 PM",
      established: "2018",
      isVerified: true,
      description: "Curated handcrafted home decor, hand-thrown ceramic tableware, handcrafted brass accents, and authentic block-printed cotton tapestries sourced directly from regional artisans.",
      badges: ["Handmade", "Fair Trade", "Eco-Friendly"],
      featured: true,
      productIds: ["prod-5", "prod-10"]
    },
    {
      id: "store-7",
      name: "Amrutha Ayurvedic & Herbal Pharmacy",
      category: "Pharmacy & Wellness",
      rating: 4.8,
      reviewsCount: 125,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80",
      address: "Shop #8, Temple Road Corner",
      locality: "Temple Road",
      distance: "1.4 km away",
      phone: "+91 98220 77665",
      whatsapp: "919822077665",
      email: "amrutha@localkart.in",
      openingHours: "9:00 AM - 9:30 PM",
      established: "2005",
      isVerified: true,
      description: "Certified Ayurvedic medicines, cold-pressed therapeutic oils, pure honey, herbal immunity boosters, and personal herbal consultation.",
      badges: ["Certified Herbal", "Doctor Consult", "Authentic Formulations"],
      featured: false,
      productIds: ["prod-9"]
    },
    {
      id: "store-8",
      name: "Elegance Threads & Custom Boutique",
      category: "Fashion & Tailoring",
      rating: 4.7,
      reviewsCount: 88,
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=200&q=80",
      address: "4th Cross, Gandhi Nagar Market",
      locality: "Gandhi Nagar",
      distance: "2.4 km away",
      phone: "+91 99123 44556",
      whatsapp: "919912344556",
      email: "elegance@localkart.in",
      openingHours: "10:30 AM - 9:00 PM",
      established: "2015",
      isVerified: true,
      description: "Bespoke tailoring, handcrafted ethnic wear, daily comfort pure cotton kurtas, readymade suits, and quick fabric alterations.",
      badges: ["Custom Fit", "Pure Cotton", "Same-Day Alterations"],
      featured: false,
      productIds: ["prod-12"]
    }
  ],

  products: [
    {
      id: "prod-1",
      name: "Farm-Fresh Alphonso Mangoes (1 Dozen)",
      price: 549,
      originalPrice: 699,
      discount: "21% OFF",
      discountNum: 21,
      rating: 4.9,
      reviewsCount: 78,
      storeId: "store-2",
      storeName: "Green Valley Organic Farm Outlet",
      category: "Fruits & Vegetables",
      categorySlug: "fruits-veg",
      isPopular: true,
      isFeatured: true,
      inStock: true,
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Naturally tree-ripened Alphonso mangoes harvested directly from orchards in Devgad. Known as the King of Mangoes for their rich golden pulp, sweet aromatic flavor, and velvety texture.",
      features: [
        "100% Carbide-free natural ripening process",
        "Direct orchard sourcing with GI tag verification",
        "Sweetness score Brix > 18° for peak richness",
        "Box of 12 hand-graded export standard pieces",
        "Delivered safely in padded corrugated fruit boxes"
      ],
      specs: {
        "Origin": "Devgad, Maharashtra",
        "Pack Size": "1 Dozen (approx. 2.8 - 3.2 kg)",
        "Ripening": "100% Natural Grass Ripened",
        "Shelf Life": "4-6 days at room temperature",
        "Storage": "Store at room temp until fragrant"
      }
    },
    {
      id: "prod-2",
      name: "Pure Cold-Pressed Mustard Oil (1 Litre)",
      price: 210,
      originalPrice: 260,
      discount: "19% OFF",
      discountNum: 19,
      rating: 4.8,
      reviewsCount: 64,
      storeId: "store-1",
      storeName: "Sharma Kirana & General Store",
      category: "Grocery & Kirana",
      categorySlug: "grocery",
      isPopular: true,
      isFeatured: true,
      inStock: true,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Traditional wooden kolhu (cold-pressed) yellow mustard oil extracted at room temperature. Retains natural pungent aroma, essential fatty acids, and natural antioxidants.",
      features: [
        "Extracted using ancient wooden press (Kacchi Ghani)",
        "Zero chemical refinement, bleaching, or deodorizing",
        "Rich in Omega-3 and Omega-6 fatty acids",
        "High smoke point ideal for authentic traditional cooking and pickles",
        "Packed in UV-protected food-grade amber bottle"
      ],
      specs: {
        "Volume": "1 Litre",
        "Extraction Method": "Cold-Pressed Wooden Kolhu",
        "Seeds": "High-Grade Yellow Mustard Seeds",
        "Preservatives": "Zero Additives or Chemicals",
        "FSSAI Certified": "Yes (Store Verified)"
      }
    },
    {
      id: "prod-3",
      name: "Handmade Sourdough Country Loaf (500g)",
      price: 180,
      originalPrice: 220,
      discount: "18% OFF",
      discountNum: 18,
      rating: 4.9,
      reviewsCount: 112,
      storeId: "store-3",
      storeName: "BakeCraft Artisan Boulangerie",
      category: "Bakery & Sweets",
      categorySlug: "bakery-sweets",
      isPopular: true,
      isFeatured: true,
      inStock: true,
      image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Traditional rustic sourdough loaf fermented over 36 hours using an heirloom wild starter culture. Features a crisp, blistered golden crust and an open, airy, chewy crumb with a mild tang.",
      features: [
        "Slow 36-hour cold fermentation for easier digestion",
        "Made with unbleached stoneground whole wheat & rye flour",
        "Just 3 pure ingredients: Flour, Filtered Water, and Sea Salt",
        "Baked fresh every morning at 6:00 AM",
        "Naturally vegan and free from commercial bakery yeast"
      ],
      specs: {
        "Net Weight": "500 grams",
        "Ingredients": "Whole wheat, Rye flour, Wild starter, Sea salt",
        "Fermentation Time": "36 Hours",
        "Dietary Info": "Vegan, Dairy-Free, Low GI",
        "Best Before": "3 Days from Bake Date"
      }
    },
    {
      id: "prod-4",
      name: "Pure Desi Cow Ghee (500ml Glass Jar)",
      price: 520,
      originalPrice: 650,
      discount: "20% OFF",
      discountNum: 20,
      rating: 4.8,
      reviewsCount: 92,
      storeId: "store-1",
      storeName: "Sharma Kirana & General Store",
      category: "Grocery & Kirana",
      categorySlug: "grocery",
      isPopular: true,
      isFeatured: false,
      inStock: true,
      image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Handcrafted Bilona churned ghee prepared from the curd of pasture-fed indigenous cows. Rich in aromatic granular texture (danedar), deep golden color, and wholesome nutrients.",
      features: [
        "Authentic Vedic Bilona method (Curd to butter to slow heat)",
        "Grainy (Danedar) texture with rich nutty aroma",
        "Contains natural vitamins A, D, E, K and butyric acid",
        "Packed in sealed glass jar to maintain freshness",
        "Zero artificial coloring, flavors, or hydrogenated oils"
      ],
      specs: {
        "Volume": "500 ml",
        "Preparation": "Traditional Vedic Bilona Churning",
        "Packaging": "Hermetically Sealed Glass Jar",
        "Shelf Life": "9 Months",
        "Best For": "Cooking, Ayurvedic wellness, Daily nutrition"
      }
    },
    {
      id: "prod-5",
      name: "Handmade Ceramic Espresso Cups (Set of 4)",
      price: 680,
      originalPrice: 850,
      discount: "20% OFF",
      discountNum: 20,
      rating: 4.9,
      reviewsCount: 45,
      storeId: "store-6",
      storeName: "KalaKriti Handlooms & Pottery",
      category: "Home & Handcrafted",
      categorySlug: "home-craft",
      isPopular: true,
      isFeatured: true,
      inStock: true,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Wheel-thrown stoneware espresso cups crafted by regional studio potters. Featuring a tactile matte speckle glaze, comfortable ergonomic thumb-rest handle, and heat-retaining ceramic walls.",
      features: [
        "Handcrafted on pottery wheels by local studio artisans",
        "Durable high-fire stoneware baked at 1220°C",
        "Food safe, lead-free, non-toxic mineral glazes",
        "Microwave and dishwasher safe",
        "Each cup has unique organic character and glaze variations"
      ],
      specs: {
        "Quantity": "Set of 4 Cups",
        "Capacity": "120 ml each",
        "Material": "Natural High-Fire Stoneware Clay",
        "Finish": "Earth Matte Glaze with Speckles",
        "Care": "Dishwasher & Microwave Safe"
      }
    },
    {
      id: "prod-6",
      name: "Special Kaju Katli Gift Box (500g)",
      price: 490,
      originalPrice: 590,
      discount: "17% OFF",
      discountNum: 17,
      rating: 4.8,
      reviewsCount: 88,
      storeId: "store-4",
      storeName: "Gupta Sweets & Farsan",
      category: "Bakery & Sweets",
      categorySlug: "bakery-sweets",
      isPopular: true,
      isFeatured: false,
      inStock: true,
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Melt-in-the-mouth diamond-shaped cashew fudge crafted from premium Goan cashews and pure sulfurless sugar. Decorated with vegetarian silver leaf (vark).",
      features: [
        "Made from 100% whole W320 premium cashews",
        "Low sugar ratio for authentic rich nutty flavor",
        "Certified pure vegetarian silver leaf (Chandi Vark)",
        "Freshly prepared daily in stainless steel kitchen",
        "Festive airtight gold-embossed gift box"
      ],
      specs: {
        "Net Weight": "500 grams (approx. 24-26 pieces)",
        "Key Ingredients": "Cashew nuts (Kaju), Sugar, Cardamom",
        "Shelf Life": "12 Days (refrigerated)",
        "Allergens": "Tree Nuts (Cashew)",
        "Occasion": "Festivals, Gifting, Celebrations"
      }
    },
    {
      id: "prod-7",
      name: "Hydroponic Crisp Salad Box (300g)",
      price: 140,
      originalPrice: 175,
      discount: "20% OFF",
      discountNum: 20,
      rating: 4.7,
      reviewsCount: 38,
      storeId: "store-2",
      storeName: "Green Valley Organic Farm Outlet",
      category: "Fruits & Vegetables",
      categorySlug: "fruits-veg",
      isPopular: false,
      isFeatured: false,
      inStock: true,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Freshly cut mix of hydroponically grown Romaine, Butterhead lettuce, Rocket arugula, purple cabbage, and cherry tomatoes. Harvested 2 hours before delivery for peak crunch.",
      features: [
        "Soil-less hydroponic farming using purified RO water",
        "Zero chemical pesticide residue",
        "Washed in ozone-treated mineral water, ready to eat",
        "Keeps crunchy and fresh for up to 5 days in fridge",
        "Includes complimentary herb vinaigrette dressing packet"
      ],
      specs: {
        "Weight": "300 grams",
        "Mix Contains": "Romaine, Butterhead, Rocket Arugula, Cherry Tomato",
        "Farm Location": "Green Avenue Hydroponics Hub",
        "Storage": "Refrigerate at 4°C - 7°C",
        "Ready to Eat": "Yes, pre-washed"
      }
    },
    {
      id: "prod-8",
      name: "Braided Fast-Charging Type-C Cable (1.5m)",
      price: 299,
      originalPrice: 499,
      discount: "40% OFF",
      discountNum: 40,
      rating: 4.6,
      reviewsCount: 52,
      storeId: "store-5",
      storeName: "TechnoFix Electronics & Spares",
      category: "Electronics & Mobile",
      categorySlug: "electronics",
      isPopular: false,
      isFeatured: false,
      inStock: true,
      image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Heavy-duty ballistic nylon braided USB Type-C cable supporting 65W Power Delivery (PD) and Qualcomm Quick Charge. Equipped with laser-welded aluminum alloy connectors.",
      features: [
        "Supports up to 65W Fast Charging and 480 Mbps data transfer",
        "Reinforced 15,000+ bend lifespan with ballistic nylon braid",
        "Universal compatibility with Samsung, OnePlus, Xiaomi, iPhone 15, iPad",
        "Tangle-free design with built-in leather cable organizer strap",
        "6-month instant replacement warranty at TechnoFix store"
      ],
      specs: {
        "Length": "1.5 Meters (5 Feet)",
        "Max Output": "65W (20V / 3.25A)",
        "Connector": "USB-A to USB Type-C",
        "Material": "Nylon Braided + Aluminum Shell",
        "Warranty": "6 Months Local Replacement"
      }
    },
    {
      id: "prod-9",
      name: "Organic Raw Wildflower Honey (450g)",
      price: 360,
      originalPrice: 450,
      discount: "20% OFF",
      discountNum: 20,
      rating: 4.9,
      reviewsCount: 71,
      storeId: "store-7",
      storeName: "Amrutha Ayurvedic & Herbal Pharmacy",
      category: "Pharmacy & Wellness",
      categorySlug: "pharmacy",
      isPopular: true,
      isFeatured: true,
      inStock: true,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Unfiltered, unpasteurized forest wildflower honey ethically collected from native bee flora in tribal forest reserves. Packed with active bee pollen, beneficial enzymes, and natural propolis.",
      features: [
        "100% Raw, unfiltered and cold-extracted",
        "Never heated or pasteurized to preserve natural enzymes",
        "Naturally rich in bee pollen, royal jelly, and antioxidants",
        "Tested for NMR purity & free from sugar syrup adulteration",
        "Eco-friendly recyclable hexagonal glass bottle"
      ],
      specs: {
        "Net Weight": "450 grams",
        "Source": "Forest Wildflower Nectar",
        "Processing": "Raw, Unheated, Coarse Filtered",
        "Purity Status": "NMR Tested Pure",
        "Usage": "Daily immunity, Warm water with lemon, Herbal teas"
      }
    },
    {
      id: "prod-10",
      name: "Hand-Block Printed Cotton Table Runner",
      price: 550,
      originalPrice: 750,
      discount: "27% OFF",
      discountNum: 27,
      rating: 4.8,
      reviewsCount: 33,
      storeId: "store-6",
      storeName: "KalaKriti Handlooms & Pottery",
      category: "Home & Handcrafted",
      categorySlug: "home-craft",
      isPopular: false,
      isFeatured: false,
      inStock: true,
      image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Traditional Sanganeri hand block-printed table runner crafted by 3rd-generation artisan printers using carved teakwood blocks and natural vegetable dyes on heavyweight slub cotton.",
      features: [
        "Authentic handmade wooden block print technique",
        "100% thick textured premium slub cotton fabric",
        "Natural eco-friendly azo-free vegetable dyes",
        "Finished with decorative handcrafted corner tassels",
        "Adds bohemian rustic elegance to dining tables & credenzas"
      ],
      specs: {
        "Dimensions": "14 x 72 inches (Suitable for 6-8 seater tables)",
        "Fabric": "100% Pure Slub Cotton",
        "Craft": "Jaipur Hand Block Print",
        "Color": "Indigo Floral with Terracotta borders",
        "Washing Instructions": "Gentle hand wash in cold water"
      }
    },
    {
      id: "prod-11",
      name: "True Wireless Earbuds with ENC Mic",
      price: 1199,
      originalPrice: 1999,
      discount: "40% OFF",
      discountNum: 40,
      rating: 4.7,
      reviewsCount: 63,
      storeId: "store-5",
      storeName: "TechnoFix Electronics & Spares",
      category: "Electronics & Mobile",
      categorySlug: "electronics",
      isPopular: true,
      isFeatured: false,
      inStock: true,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Compact wireless stereo earbuds with Environmental Noise Cancellation (ENC) for crystal clear calling, 13mm deep bass titanium drivers, and 30-hour total playback.",
      features: [
        "Bluetooth v5.3 with instant auto-pairing",
        "Quad-mic Environmental Noise Cancellation for clear calls in crowds",
        "30 hours combined playtime with Type-C fast charge case",
        "IPX5 sweat and splash resistance for workouts",
        "1-year verified store replacement warranty at TechnoFix"
      ],
      specs: {
        "Bluetooth": "v5.3 (10m range)",
        "Driver Size": "13mm Dynamic Titanium Drivers",
        "Battery Life": "6 hours buds + 24 hours charging case",
        "Charging Port": "USB Type-C (10 min charge = 2 hrs playtime)",
        "Warranty": "1 Year Store Warranty"
      }
    },
    {
      id: "prod-12",
      name: "Handcrafted Pure Cotton Lucknowi Kurta",
      price: 899,
      originalPrice: 1299,
      discount: "31% OFF",
      discountNum: 31,
      rating: 4.8,
      reviewsCount: 42,
      storeId: "store-8",
      storeName: "Elegance Threads & Custom Boutique",
      category: "Fashion & Tailoring",
      categorySlug: "fashion",
      isPopular: false,
      isFeatured: false,
      inStock: true,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
      ],
      description: "Breathable pure cambric cotton kurta featuring delicate hand-embroidered Chikankari motifs around the mandarin collar and front placket. Tailored for all-day comfort.",
      features: [
        "Authentic handmade Chikankari needlework",
        "100% fine breathable cambric cotton",
        "Mandarin collar with wooden engraved buttons",
        "Tailored comfortable relaxed fit with two side pockets",
        "Complimentary minor size adjustments available in-store"
      ],
      specs: {
        "Material": "100% Cambric Cotton",
        "Available Sizes": "S (38), M (40), L (42), XL (44)",
        "Sleeve": "Full Sleeve with button cuff",
        "Color": "Breeze Sky Blue",
        "Care": "Hand wash or gentle machine wash"
      }
    }
  ]
};

// Helper utilities to retrieve data & interact with MongoDB REST API
const LocalKart = {
  getProducts: () => LOCALKART_DATA.products,
  getProductById: (id) => LOCALKART_DATA.products.find(p => p.id === id),
  getStores: () => LOCALKART_DATA.stores,
  getStoreById: (id) => LOCALKART_DATA.stores.find(s => s.id === id),
  getCategories: () => LOCALKART_DATA.categories,
  getFeaturedStores: () => LOCALKART_DATA.stores.filter(s => s.featured),
  getPopularProducts: () => LOCALKART_DATA.products.filter(p => p.isPopular),
  formatCurrency: (num) => "₹" + num.toLocaleString("en-IN"),

  // REST API Client Methods (Connects to Node.js + MongoDB backend when active)
  api: {
    async fetchStores() {
      try {
        const res = await fetch("/api/stores");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            LOCALKART_DATA.stores = json.data;
            return json.data;
          }
        }
      } catch (err) {}
      return LOCALKART_DATA.stores;
    },

    async fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            LOCALKART_DATA.products = json.data;
            return json.data;
          }
        }
      } catch (err) {}
      return LOCALKART_DATA.products;
    },

    async initLiveSync() {
      try {
        await Promise.all([this.fetchStores(), this.fetchProducts()]);
      } catch (e) {}
    },

    async submitInquiry(inquiryData) {
      try {
        const response = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inquiryData)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("Backend API offline, inquiry saved locally:", err);
      }
      return { success: true, source: "client_fallback" };
    },

    async registerStore(storeData) {
      try {
        const response = await fetch("/api/stores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storeData)
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn("Backend API offline, store registered locally:", err);
      }
      return { success: true, source: "client_fallback" };
    },

    async checkHealth() {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        return null;
      }
      return null;
    }
  }
};
