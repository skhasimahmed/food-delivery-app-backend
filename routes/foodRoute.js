import express from "express";
import fs from "fs";
import multer from "multer";
import {
  getFood,
  addFood,
  listFood,
  editFood,
  deleteFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

// Image upload
const storage = multer.diskStorage({
  // destination: "uploads",

  destination: (req, file, cb) => {
    const dir = "uploads";

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/:id/get", getFood);
foodRouter.get("/list", listFood);
foodRouter.put("/:id/edit", upload.single("image"), editFood);
foodRouter.delete("/delete/:id", deleteFood);

export default foodRouter;
