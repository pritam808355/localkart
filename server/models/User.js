const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    role: {
      type: String,
      enum: ["customer", "merchant", "admin"],
      default: "customer"
    },
    storeName: {
      type: String,
      default: ""
    },
    storeCategory: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    locality: {
      type: String,
      default: "Sector 18"
    },
    avatar: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
