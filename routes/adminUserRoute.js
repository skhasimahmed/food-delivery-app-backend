import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController.js";

const adminUserRouter = express.Router();

adminUserRouter.get("/", getAllUsers);
adminUserRouter.get("/:id", getUser);
adminUserRouter.put("/update/:id", updateUser);
adminUserRouter.delete("/delete/:id", deleteUser);

export default adminUserRouter;
