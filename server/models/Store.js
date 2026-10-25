const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Store name is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
    },
    logo: {
      type: String,
      default: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80"
    },
    address: {
      type: String,
      required: [true, "Physical address is required"]
    },
    locality: {
      type: String,
      default: "Sector 18"
    },
    distance: {
      type: String,
      default: "1.0 km away"
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"]
    },
    whatsapp: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      default: ""
    },
    openingHours: {
      type: String,
      default: "9:00 AM - 9:00 PM"
    },
    established: {
      type: String,
      default: "2020"
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      required: [true, "Store description is required"]
    },
    badges: {
      type: [String],
      default: ["Verified Merchant", "Local Pickup"]
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Store", StoreSchema);
