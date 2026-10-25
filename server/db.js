const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "..", "data", "db.json");

let isMongoConnected = false;

// Read local JSON database
function readLocalDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { stores: [], products: [], categories: [], inquiries: [] };
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading local db.json:", err);
    return { stores: [], products: [], categories: [], inquiries: [] };
  }
}

// Write local JSON database
function writeLocalDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local db.json:", err);
  }
}

// Initialize database connection
async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/localkart";

  try {
    console.log(`⏳ Attempting connection to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Fast failover to fallback if local mongod is not started
    });

    isMongoConnected = true;
    console.log("=================================================");
    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log("=================================================");
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn("=================================================");
    console.warn("⚠️  MongoDB could not be connected directly.");
    console.warn(`Reason: ${error.message}`);
    console.warn("💡 Don't worry! LocalKart active hybrid mode:");
    console.warn("📁 Using persistent data store: data/db.json");
    console.warn("🚀 To connect MongoDB Atlas or local mongod, update MONGODB_URI in .env");
    console.warn("=================================================");
    return false;
  }
}

module.exports = {
  connectDB,
  isMongoConnected: () => isMongoConnected,
  readLocalDB,
  writeLocalDB
};
