require("dotenv").config();
const mongoose = require("mongoose");
const Store = require("./models/Store");
const Product = require("./models/Product");
const Category = require("./models/Category");
const { readLocalDB } = require("./db");

async function seedDatabase() {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/localkart";

  console.log("🌱 LocalKart Database Seeder");
  console.log(`Connecting to: ${mongoURI}`);

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ Connected to MongoDB!");

    const rawData = readLocalDB();

    console.log("🧹 Clearing old collections...");
    await Store.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log(`📥 Inserting ${rawData.stores.length} Stores...`);
    await Store.insertMany(rawData.stores);

    console.log(`📥 Inserting ${rawData.products.length} Products...`);
    await Product.insertMany(rawData.products);

    console.log(`📥 Inserting ${rawData.categories.length} Categories...`);
    await Category.insertMany(rawData.categories);

    console.log("==================================================");
    console.log("🎉 MongoDB Seeding Complete!");
    console.log(`✅ Stores: ${rawData.stores.length}`);
    console.log(`✅ Products: ${rawData.products.length}`);
    console.log(`✅ Categories: ${rawData.categories.length}`);
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    console.warn("💡 Tip: Ensure your MongoDB server is running or update MONGODB_URI in your .env file.");
    process.exit(1);
  }
}

seedDatabase();
