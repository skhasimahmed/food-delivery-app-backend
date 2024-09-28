import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentIntentId: { type: String, default: null },
    paymentMethodId: { type: String, default: null },
    status: { type: String, default: null }, // processing, succeeded, canceled
    chargeId: { type: String, default: null },
    chargeStatus: { type: String, default: null }, // pending, succeeded, failed
  },
  { timestamps: true, minimize: false }
);

const paymentModel =
  mongoose.models.payment || mongoose.model("payment", paymentSchema);

export default paymentModel;
