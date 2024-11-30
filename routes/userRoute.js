import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { changePassword, updateProfile } from "../controllers/adminUserController.js";
import { storage } from "../configs/cloudinary.js";
import multer from "multer";

const userRouter = express.Router();
const upload = multer({ storage });

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.put("/change-password/:id", changePassword);
userRouter.put("/update-profile/:id", upload.single("image"), updateProfile);

export default userRouter;
