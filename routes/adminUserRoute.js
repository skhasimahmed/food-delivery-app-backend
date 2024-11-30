import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  changePassword
} from "../controllers/adminUserController.js";

import { storage } from "../configs/cloudinary.js";
import multer from "multer";
const upload = multer({ storage });

const adminUserRouter = express.Router();

adminUserRouter.get("/", getAllUsers);
adminUserRouter.get("/:id", getUser);
adminUserRouter.put("/update/:id", updateUser);
adminUserRouter.delete("/delete/:id", deleteUser);
adminUserRouter.put("/change-password/:id", changePassword);
adminUserRouter.put("/update-profile/:id", upload.single("image"), updateProfile);
export default adminUserRouter;
