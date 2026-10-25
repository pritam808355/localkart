const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const { isMongoConnected, readLocalDB, writeLocalDB } = require("../db");

// GET /api/stores - List all stores with optional filtering
router.get("/", async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    if (isMongoConnected()) {
      const query = {};
      if (category && category !== "all") {
        query.category = new RegExp(category, "i");
      }
      if (search) {
        query.$or = [
          { name: new RegExp(search, "i") },
          { locality: new RegExp(search, "i") },
          { address: new RegExp(search, "i") },
          { description: new RegExp(search, "i") }
        ];
      }
      if (featured === "true") {
        query.featured = true;
      }

      const stores = await Store.find(query).sort({ rating: -1 });
      return res.json({ success: true, count: stores.length, source: "mongodb", data: stores });
    }

    // Local JSON fallback
    const db = readLocalDB();
    let stores = db.stores || [];

    if (category && category !== "all") {
      stores = stores.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      stores = stores.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.locality.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
      );
    }

    if (featured === "true") {
      stores = stores.filter(s => s.featured);
    }

    return res.json({ success: true, count: stores.length, source: "local_db", data: stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/stores/:id - Get store by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const store = await Store.findOne({ id });
      if (!store) {
        return res.status(404).json({ success: false, message: "Store not found" });
      }
      return res.json({ success: true, source: "mongodb", data: store });
    }

    const db = readLocalDB();
    const store = (db.stores || []).find(s => s.id === id);
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    return res.json({ success: true, source: "local_db", data: store });
  } catch (error) {
    console.error("Error fetching store:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// POST /api/stores - Register a new local store
router.post("/", async (req, res) => {
  try {
    const { name, category, address, phone, locality, description, email, openingHours } = req.body;

    if (!name || !category || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide store name, category, physical address, and phone number."
      });
    }

    const newId = `store-${Date.now()}`;
    const newStoreData = {
      id: newId,
      name,
      category,
      address,
      phone,
      locality: locality || "Central City",
      distance: "Nearby (< 1.5 km)",
      description: description || "Neighborhood shop registered on LocalKart.",
      email: email || "",
      whatsapp: phone.replace(/[^0-9]/g, ""),
      openingHours: openingHours || "9:00 AM - 9:00 PM",
      rating: 5.0,
      reviewsCount: 1,
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80",
      isVerified: true,
      badges: ["New Local Merchant", "Direct Contact"],
      featured: false
    };

    if (isMongoConnected()) {
      const store = await Store.create(newStoreData);
      return res.status(201).json({
        success: true,
        message: "Store registered successfully in MongoDB!",
        source: "mongodb",
        data: store
      });
    }

    // Local JSON fallback
    const db = readLocalDB();
    db.stores = db.stores || [];
    db.stores.unshift(newStoreData);
    writeLocalDB(db);

    return res.status(201).json({
      success: true,
      message: "Store registered successfully!",
      source: "local_db",
      data: newStoreData
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// PUT /api/stores/:id - Update store details
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected()) {
      const store = await Store.findOneAndUpdate({ id }, { $set: updates }, { new: true });
      if (!store) {
        return res.status(404).json({ success: false, message: "Store not found" });
      }
      return res.json({ success: true, message: "Store updated successfully in MongoDB!", data: store });
    }

    const db = readLocalDB();
    const index = (db.stores || []).findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    db.stores[index] = { ...db.stores[index], ...updates };
    writeLocalDB(db);

    return res.json({ success: true, message: "Store updated successfully!", data: db.stores[index] });
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// DELETE /api/stores/:id - Delete a store
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const store = await Store.findOneAndDelete({ id });
      if (!store) {
        return res.status(404).json({ success: false, message: "Store not found" });
      }
      return res.json({ success: true, message: "Store deleted from MongoDB!" });
    }

    const db = readLocalDB();
    const initialLen = (db.stores || []).length;
    db.stores = (db.stores || []).filter(s => s.id !== id);

    if (db.stores.length === initialLen) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    writeLocalDB(db);
    return res.json({ success: true, message: "Store deleted successfully!" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
