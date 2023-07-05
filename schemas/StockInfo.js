const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  technicalSpecifications: [
    {
      type: String,
      required: true,
    },
  ],
  features: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
});

const stockInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  variants: [variantSchema],
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  imageUrl: {
    type: String,
  },
});

const StockInfo = mongoose.model("StockInfo", stockInfoSchema);
const VariantInfo = mongoose.model("VariantInfo", variantSchema);

module.exports = { StockInfo, VariantInfo };
