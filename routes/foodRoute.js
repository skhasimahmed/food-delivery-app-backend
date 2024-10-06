import express from "express";
// import fs from "fs";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
import multer from "multer";
import {
  getFood,
  addFood,
  listFood,
  editFood,
  deleteFood,
} from "../controllers/foodController.js";
import { storage } from "../configs/cloudinary.js";

const foodRouter = express.Router();

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // const dir = "uploads";
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
foodRouter.put("/:id/edit", upload.single("image"), editFood);
foodRouter.delete("/delete/:id", deleteFood);

export default foodRouter;
