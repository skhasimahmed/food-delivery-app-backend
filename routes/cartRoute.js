import express from "express";

import {
  addToCart,
  removeFromCart,
  getUserCart,
} from "../controllers/cartController.js";

import authMiddleware from "../middlewares/auth.js";

const cartRouter = express.Router();

// Add to cart
cartRouter.post("/add", authMiddleware, addToCart);

// Remove from cart
cartRouter.post("/remove", authMiddleware, removeFromCart);

// Get user cart
cartRouter.get("/get", authMiddleware, getUserCart);

export default cartRouter;
