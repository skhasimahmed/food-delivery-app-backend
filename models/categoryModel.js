import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true, minimize: false }
);

const categoryModel =
  mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;
