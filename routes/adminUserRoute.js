import express from "express";
import { getAllUsers, deleteUser } from "../controllers/adminUserController.js";

const adminUserRouter = express.Router();

adminUserRouter.get("/", getAllUsers);
adminUserRouter.delete("/delete/:id", deleteUser);

export default adminUserRouter;
