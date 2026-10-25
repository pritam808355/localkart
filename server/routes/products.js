const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { isMongoConnected, readLocalDB, writeLocalDB } = require("../db");

// GET /api/products - Get all products with search, category, maxPrice, sort
router.get("/", async (req, res) => {
  try {
    const { category, search, maxPrice, sort, storeId, popular, featured } = req.query;

    if (isMongoConnected()) {
      const query = {};
      if (category && category !== "all") {
        query.categorySlug = category;
      }
      if (storeId) {
        query.storeId = storeId;
      }
      if (popular === "true") {
        query.isPopular = true;
      }
      if (featured === "true") {
        query.isFeatured = true;
      }
      if (maxPrice) {
        query.price = { $lte: Number(maxPrice) };
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
          { storeName: new RegExp(search, "i") },
          { category: new RegExp(search, "i") }
        ];
      }

      let sortOptions = { isFeatured: -1, createdAt: -1 };
      if (sort === "price-low") sortOptions = { price: 1 };
      else if (sort === "price-high") sortOptions = { price: -1 };
      else if (sort === "rating") sortOptions = { rating: -1 };
      else if (sort === "discount") sortOptions = { discountNum: -1 };

      const products = await Product.find(query).sort(sortOptions);
      return res.json({ success: true, count: products.length, source: "mongodb", data: products });
    }

    // Local JSON fallback
    const db = readLocalDB();
    let products = db.products || [];

    if (category && category !== "all") {
      products = products.filter(p => p.categorySlug === category);
    }
    if (storeId) {
      products = products.filter(p => p.storeId === storeId);
    }
    if (popular === "true") {
      products = products.filter(p => p.isPopular);
    }
    if (featured === "true") {
      products = products.filter(p => p.isFeatured);
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.storeName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === "price-low") products.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") products.sort((a, b) => b.price - a.price);
    else if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
    else if (sort === "discount") products.sort((a, b) => b.discountNum - a.discountNum);
    else products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));

    return res.json({ success: true, count: products.length, source: "local_db", data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const product = await Product.findOne({ id });
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.json({ success: true, source: "mongodb", data: product });
    }

    const db = readLocalDB();
    const product = (db.products || []).find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, source: "local_db", data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// POST /api/products - Create a new product (Store Inventory Management)
router.post("/", async (req, res) => {
  try {
    const { name, price, originalPrice, storeId, storeName, category, categorySlug, description, image } = req.body;

    if (!name || !price || !storeId || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide product name, price, storeId, and category."
      });
    }

    const pPrice = Number(price);
    const pOrig = Number(originalPrice || price);
    const discountNum = pOrig > pPrice ? Math.round(((pOrig - pPrice) / pOrig) * 100) : 0;
    const discountStr = discountNum > 0 ? `${discountNum}% OFF` : "Best Price";

    const newProductData = {
      id: `prod-${Date.now()}`,
      name,
      price: pPrice,
      originalPrice: pOrig,
      discount: discountStr,
      discountNum,
      rating: 4.8,
      reviewsCount: 1,
      storeId,
      storeName: storeName || "Local Merchant",
      category,
      categorySlug: categorySlug || "all",
      isPopular: false,
      isFeatured: false,
      inStock: true,
      image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
      gallery: [image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"],
      description: description || "Fresh quality product from trusted neighborhood store.",
      features: ["Guaranteed Authentic Local Product", "Inspected by Neighborhood Storekeeper"],
      specs: {
        Availability: "Ready for Pickup or Delivery"
      }
    };

    if (isMongoConnected()) {
      const product = await Product.create(newProductData);
      return res.status(201).json({
        success: true,
        message: "Product added to inventory in MongoDB!",
        source: "mongodb",
        data: product
      });
    }

    const db = readLocalDB();
    db.products = db.products || [];
    db.products.unshift(newProductData);
    writeLocalDB(db);

    return res.status(201).json({
      success: true,
      message: "Product added to inventory!",
      source: "local_db",
      data: newProductData
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// PUT /api/products/:id - Update product details or stock
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price) updates.price = Number(updates.price);
    if (updates.originalPrice) updates.originalPrice = Number(updates.originalPrice);

    if (isMongoConnected()) {
      const product = await Product.findOneAndUpdate({ id }, { $set: updates }, { new: true });
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.json({ success: true, message: "Product updated in MongoDB!", data: product });
    }

    const db = readLocalDB();
    const index = (db.products || []).findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    db.products[index] = { ...db.products[index], ...updates };
    writeLocalDB(db);

    return res.json({ success: true, message: "Product updated successfully!", data: db.products[index] });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// DELETE /api/products/:id - Delete product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const product = await Product.findOneAndDelete({ id });
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.json({ success: true, message: "Product deleted from MongoDB!" });
    }

    const db = readLocalDB();
    const initialLen = (db.products || []).length;
    db.products = (db.products || []).filter(p => p.id !== id);

    if (db.products.length === initialLen) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    writeLocalDB(db);
    return res.json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
