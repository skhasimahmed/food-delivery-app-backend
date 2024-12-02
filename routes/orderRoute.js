import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { paymentInfo, placeOrder, getAllOrders, getTotanRevenue } from "../controllers/orderController.js";

const orderRouter = express.Router();

// Placing user order
orderRouter.post("/place", authMiddleware, placeOrder);

// Get payment data by order id
orderRouter.get("/payment-info", authMiddleware, paymentInfo);

// Get all orders
orderRouter.get("/all", authMiddleware, getAllOrders);

// Get all orders
orderRouter.get("/revenue", authMiddleware, getTotanRevenue);

export default orderRouter;
