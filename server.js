import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./configs/db.js";

import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import stripeWebhookRouter from "./routes/stripeWebhookRoute.js";

import foodRouter from "./routes/foodRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import adminUserRouter from "./routes/adminUserRoute.js";
import chartsRouter from "./routes/chartsRoute.js";

// App config
const app = express();
const port = process.env.APP_PORT || 5000;

// app.use(express.urlencoded({ extended: true }))
app.use(cors());

// Stripe webhook endpoint
app.use("/api/stripe", stripeWebhookRouter);

// Middlewares
app.use(express.json());

// API Endpoints
app.use("/api/categories", categoryRouter);
app.use("/api/food", foodRouter);
app.use("/api/users", adminUserRouter);

app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.use("/api/charts", chartsRouter);

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

const startServer = async () => {
  try {
    // DB config
    await connectDB();

    // Listening
    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
