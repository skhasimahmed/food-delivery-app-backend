import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" }, // Pending, Processing, Shipped, Delivered, Cancelled
    // paymentMethod: { type: String, default: "COD" },
    date: { type: Date, default: Date.now },
    address: { type: Object, required: true },
    paymentStatus: { type: String, default: "pending" },
  },
  { timestamps: true, minimize: false }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
