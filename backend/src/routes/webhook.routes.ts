import { Router } from "express";
import express from "express";
import { razorpayWebhook } from "../controllers/booking.controller.js";

const router = Router();

// IMPORTANT: Razorpay signs the RAW request body, so this route must
// receive it as a raw Buffer, not JSON-parsed. Mount this router in
// app.ts BEFORE your global app.use(express.json()) call — otherwise
// express.json() will consume and parse the body first, and the raw
// bytes needed for signature verification will be gone.
//
// In app.ts:
//   import webhookRouter from "./routes/webhook.routes.js";
//   app.use("/api/v1/webhooks", webhookRouter);   // <-- before express.json()
//   app.use(express.json());                       // existing line, stays after

router.post("/razorpay", express.raw({ type: "application/json" }), razorpayWebhook);

export default router;