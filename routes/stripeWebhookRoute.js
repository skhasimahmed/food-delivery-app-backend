import express from "express";
import { stripeWebhook } from "../controllers/stripeWebhookController.js";

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default stripeWebhookRouter;
