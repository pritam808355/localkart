require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB, isMongoConnected, readLocalDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend files
const publicDir = path.join(__dirname, "..");
app.use(express.static(publicDir));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/stores", require("./routes/stores"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/inquiries", require("./routes/inquiries"));

// Health & Status Check Endpoint
app.get("/api/health", (req, res) => {
  const db = readLocalDB();
  res.json({
    status: "ok",
    service: "LocalKart Marketplace API",
    database: {
      driver: isMongoConnected() ? "MongoDB (Active)" : "Hybrid Local Store (data/db.json)",
      isConnectedToMongo: isMongoConnected(),
      totalStores: (db.stores || []).length,
      totalProducts: (db.products || []).length,
      totalInquiries: (db.inquiries || []).length
    },
    timestamp: new Date().toISOString()
  });
});

// Fallback route for frontend HTML5 routing
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(publicDir, "index.html"));
});

// Start Server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log("==================================================");
    console.log(`🚀 LocalKart Server is running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/`);
    console.log(`🛍️ Frontend UI accessible at http://localhost:${PORT}/`);
    console.log("==================================================");
  });
}

startServer();
