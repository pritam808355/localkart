const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const Store = require("../models/Store");
const { isMongoConnected, readLocalDB, writeLocalDB } = require("../db");

// Password hashing utility using SHA-256 with project salt
function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "localkart_secure_salt_2026").digest("hex");
}

// POST /api/auth/register - Register a new User (Customer or Merchant)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role, storeName, storeCategory, address, locality } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide Name, Email, Password, and Phone Number."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);
    const userRole = role === "merchant" ? "merchant" : "customer";
    const userId = `usr-${Date.now()}`;

    const newUserData = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone.trim(),
      role: userRole,
      storeName: storeName ? storeName.trim() : "",
      storeCategory: storeCategory || "",
      address: address ? address.trim() : "",
      locality: locality ? locality.trim() : "Sector 18",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    if (isMongoConnected()) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "An account with this email address already exists. Please log in."
        });
      }

      const createdUser = await User.create(newUserData);

      // If registered as merchant with a store name, auto-create Store in DB
      if (userRole === "merchant" && storeName) {
        const storeId = `store-${Date.now()}`;
        await Store.create({
          id: storeId,
          name: storeName.trim(),
          category: storeCategory || "Grocery & Kirana",
          address: address || "Local Market",
          locality: locality || "Sector 18",
          distance: "0.5 km away",
          phone: phone.trim(),
          whatsapp: phone.replace(/[^0-9]/g, ""),
          email: cleanEmail,
          openingHours: "9:00 AM - 9:00 PM",
          description: `${storeName} – Fresh local business on LocalKart.`,
          isVerified: true,
          badges: ["Newly Registered", "Verified Merchant"],
          featured: false
        });
      }

      // Strip password from response
      const safeUser = createdUser.toObject();
      delete safeUser.password;

      return res.status(201).json({
        success: true,
        message: `Welcome to LocalKart, ${name}! Your account has been created.`,
        source: "mongodb",
        user: safeUser,
        token: `lk_token_${userId}`
      });
    }

    // Local JSON fallback
    const db = readLocalDB();
    db.users = db.users || [];

    const existingLocal = db.users.find(u => u.email === cleanEmail);
    if (existingLocal) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please log in."
      });
    }

    db.users.unshift(newUserData);

    // Auto-create store if merchant
    if (userRole === "merchant" && storeName) {
      db.stores = db.stores || [];
      db.stores.unshift({
        id: `store-${Date.now()}`,
        name: storeName.trim(),
        category: storeCategory || "Grocery & Kirana",
        address: address || "Local Market",
        locality: locality || "Sector 18",
        distance: "0.5 km away",
        phone: phone.trim(),
        whatsapp: phone.replace(/[^0-9]/g, ""),
        email: cleanEmail,
        openingHours: "9:00 AM - 9:00 PM",
        description: `${storeName} – Fresh local business on LocalKart.`,
        isVerified: true,
        badges: ["Newly Registered", "Verified Merchant"],
        featured: false
      });
    }

    writeLocalDB(db);

    const safeUser = { ...newUserData };
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: `Welcome to LocalKart, ${name}! Your account has been created.`,
      source: "local_db",
      user: safeUser,
      token: `lk_token_${userId}`
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// POST /api/auth/login - User Login (Customer, Merchant, Admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password."
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = hashPassword(password);

    // Special Admin back-door credentials
    if (cleanEmail === "admin@localkart.in" && (password === "admin123" || password === "admin")) {
      return res.json({
        success: true,
        message: "Welcome, Administrator!",
        user: {
          id: "usr-admin-1",
          name: "LocalKart Administrator",
          email: "admin@localkart.in",
          role: "admin",
          phone: "+91 9113170895",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin"
        },
        token: "lk_token_admin_root"
      });
    }

    if (isMongoConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "No account found with this email. Please register first."
        });
      }

      if (user.password !== hashedPassword) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password. Please try again."
        });
      }

      const safeUser = user.toObject();
      delete safeUser.password;

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        source: "mongodb",
        user: safeUser,
        token: `lk_token_${user.id}`
      });
    }

    // Local JSON fallback
    const db = readLocalDB();
    const user = (db.users || []).find(u => u.email === cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please register first."
      });
    }

    if (user.password !== hashedPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again."
      });
    }

    const safeUser = { ...user };
    delete safeUser.password;

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      source: "local_db",
      user: safeUser,
      token: `lk_token_${user.id}`
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/auth/users - List users (for Admin dashboard)
router.get("/users", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find({}, "-password").sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, source: "mongodb", data: users });
    }

    const db = readLocalDB();
    const safeUsers = (db.users || []).map(u => {
      const clone = { ...u };
      delete clone.password;
      return clone;
    });

    return res.json({ success: true, count: safeUsers.length, source: "local_db", data: safeUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
