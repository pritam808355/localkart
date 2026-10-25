const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { isMongoConnected, readLocalDB } = require("../db");

// GET /api/categories - List all categories
router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const categories = await Category.find();
      if (categories && categories.length > 0) {
        return res.json({ success: true, count: categories.length, source: "mongodb", data: categories });
      }
    }

    const db = readLocalDB();
    return res.json({ success: true, count: (db.categories || []).length, source: "local_db", data: db.categories || [] });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
