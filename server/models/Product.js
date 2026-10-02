import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    trim: true,
  },
  unit: {
    type: String,
    required: [true, "Unit is required (e.g. kg, litre, dozen)"],
    trim: true,
  },
  // Holds either an emoji/icon placeholder (used by the sample data)
  // or a real image URL once you have product photos to use instead.
  image: {
    type: String,
    default: "🌾",
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
