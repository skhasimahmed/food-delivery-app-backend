import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, unique: true },
    cartData: { type: Object, default: {} },
    isAdmin: { type: Boolean, default: false },
    image: { type: String, default: null },
    stripeCustomerId: { type: String, default: null },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
