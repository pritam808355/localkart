const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: "fa-solid fa-shapes"
    },
    count: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Category", CategorySchema);
