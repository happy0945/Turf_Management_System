import { Router } from "express";
import express from "express";
import { razorpayWebhook } from "../controllers/booking.controller.js";

const webhookRouter = Router();


webhookRouter.post("/razorpay", express.raw({ type: "application/json" }), razorpayWebhook);

export default webhookRouter;