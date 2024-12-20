import express from "express";
// import fs from "fs";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
import multer from "multer";
import {
  getFood,
  addFood,
  listFood,
  updateFood,
  deleteFood,
  getAllFoods,
} from "../controllers/foodController.js";
import { storage } from "../configs/cloudinary.js";

const foodRouter = express.Router();

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads";
//     const dir = path.join(__dirname, `../uploads/`); // Unable to upload image in Vercel

//     if (!fs.existsSync(dir)) {
//       try {
//         fs.mkdirSync(dir, { recursive: true });
//       } catch (err) {
//         return cb(err);
//       }
//     }

//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     return cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

const upload = multer({ storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/:id/get", getFood);
foodRouter.get("/list", listFood);
foodRouter.get("/all", getAllFoods);
foodRouter.put("/:id/update", upload.single("image"), updateFood);
foodRouter.delete("/delete/:id", deleteFood);

export default foodRouter;
