import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
    required: [true, "Delivery address is required"],
    trim: true,
  },
  products: {
    type: [orderProductSchema],
    required: true,
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: "An order must contain at least one product",
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "pending", "paid", "failed"],
    default: "unpaid",
  },
    checkoutRequestId: { type: String },
    mpesaReceipt: { type: String },
    paidAt: { type: Date },
    paymentFailReason: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
