import express from "express";

import multer from "multer";

import { storage } from "../configs/cloudinary.js";

import {
  listCategories,
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { get } from "mongoose";

const upload = multer({ storage });

const categoryRouter = express.Router();

categoryRouter.get("/", listCategories);
categoryRouter.post("/add", upload.single("image"), addCategory);
categoryRouter.get("/:id", getCategory);
categoryRouter.put("/:id/update", upload.single("image"), updateCategory);
categoryRouter.delete("/delete/:id", deleteCategory);

export default categoryRouter;
