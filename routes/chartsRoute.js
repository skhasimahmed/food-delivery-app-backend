import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { getAllChartsData } from "../controllers/chartsController.js";

const chartsRouter = express.Router();

// Get all orders
chartsRouter.get("/", authMiddleware, getAllChartsData);

export default chartsRouter;
