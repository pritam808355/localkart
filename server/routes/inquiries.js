const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const { isMongoConnected, readLocalDB, writeLocalDB } = require("../db");

// POST /api/inquiries - Submit an inquiry or order contact request
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, message, storeId, storeName, productName, type } = req.body;

    if (!customerName || !customerPhone || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide customer name, phone number, and message."
      });
    }

    const inqId = `inq-${Date.now()}`;
    const newInquiry = {
      id: inqId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || "",
      message,
      storeId: storeId || "",
      storeName: storeName || "General Marketplace",
      productName: productName || "",
      type: type || "customer_inquiry",
      status: "new",
      createdAt: new Date().toISOString()
    };

    if (isMongoConnected()) {
      const doc = await Inquiry.create(newInquiry);
      return res.status(201).json({
        success: true,
        message: "Inquiry saved successfully in MongoDB!",
        source: "mongodb",
        data: doc
      });
    }

    const db = readLocalDB();
    db.inquiries = db.inquiries || [];
    db.inquiries.unshift(newInquiry);
    writeLocalDB(db);

    return res.status(201).json({
      success: true,
      message: "Inquiry registered successfully!",
      source: "local_db",
      data: newInquiry
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/inquiries - List inquiries (for store dashboard / admin)
router.get("/", async (req, res) => {
  try {
    const { storeId } = req.query;

    if (isMongoConnected()) {
      const query = storeId ? { storeId } : {};
      const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: inquiries.length, source: "mongodb", data: inquiries });
    }

    const db = readLocalDB();
    let inquiries = db.inquiries || [];
    if (storeId) {
      inquiries = inquiries.filter(i => i.storeId === storeId);
    }

    return res.json({ success: true, count: inquiries.length, source: "local_db", data: inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// PATCH /api/inquiries/:id - Update status (new -> contacted -> completed)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoConnected()) {
      const doc = await Inquiry.findOneAndUpdate(
        { $or: [{ id }, { _id: id }] },
        { $set: { status } },
        { new: true }
      );
      if (!doc) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      return res.json({ success: true, message: "Inquiry status updated!", data: doc });
    }

    const db = readLocalDB();
    const item = (db.inquiries || []).find(i => i.id === id || i._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    item.status = status;
    writeLocalDB(db);

    return res.json({ success: true, message: "Inquiry status updated!", data: item });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// DELETE /api/inquiries/:id - Delete an inquiry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const doc = await Inquiry.findOneAndDelete({ $or: [{ id }, { _id: id }] });
      if (!doc) {
        return res.status(404).json({ success: false, message: "Inquiry not found" });
      }
      return res.json({ success: true, message: "Inquiry deleted successfully!" });
    }

    const db = readLocalDB();
    const initialLen = (db.inquiries || []).length;
    db.inquiries = (db.inquiries || []).filter(i => i.id !== id && i._id !== id);

    if (db.inquiries.length === initialLen) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    writeLocalDB(db);
    return res.json({ success: true, message: "Inquiry deleted successfully!" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
