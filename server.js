import express from "express";
import cors from "cors";
import { connectDB } from "./configs/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import stripeWebhookRouter from "./routes/stripeWebhookRoute.js";

// App config
const app = express();
const port = 4000;

// app.use(express.urlencoded({ extended: true }))
app.use(cors());

// DB config
connectDB();

// Stripe webhook endpoint
app.use("/api/stripe", stripeWebhookRouter);

// Middlewares
app.use(express.json());

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Test route to check if server is up and running
app.get("/", (req, res) => {
  res.send("API is working!");
});

// Listening
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
