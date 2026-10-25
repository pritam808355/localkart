const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: ""
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },
    customerPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    customerEmail: {
      type: String,
      trim: true,
      default: ""
    },
    message: {
      type: String,
      required: [true, "Inquiry message is required"]
    },
    storeId: {
      type: String,
      default: ""
    },
    storeName: {
      type: String,
      default: "General Marketplace"
    },
    productName: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      enum: ["customer_inquiry", "store_registration", "product_inquiry"],
      default: "customer_inquiry"
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "completed"],
      default: "new"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Inquiry", InquirySchema);
