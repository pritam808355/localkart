const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: 0
    },
    discount: {
      type: String,
      default: "0% OFF"
    },
    discountNum: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    storeId: {
      type: String,
      required: [true, "Store ID is required"],
      index: true
    },
    storeName: {
      type: String,
      required: [true, "Store name is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"]
    },
    categorySlug: {
      type: String,
      required: true
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    },
    image: {
      type: String,
      required: [true, "Product image is required"]
    },
    gallery: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      required: [true, "Product description is required"]
    },
    features: {
      type: [String],
      default: []
    },
    specs: {
      type: Map,
      of: String,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", ProductSchema);
