import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { paymentInfo, placeOrder } from "../controllers/orderController.js";
import e from "express";

const orderRouter = express.Router();

// Placing user order
orderRouter.post("/place", authMiddleware, placeOrder);

// Get payment data by order id
orderRouter.get("/payment-info", authMiddleware, paymentInfo);

export default orderRouter;
