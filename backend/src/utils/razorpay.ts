import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export default razorpay;

// Verifies the signature Razorpay's checkout returns to your frontend
// after a successful payment. This is what the /bookings/verify route uses.
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const secret = process.env.RAZORPAY_KEY_SECRET as string;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
};

// Verifies the signature on Razorpay Webhook calls (server-to-server).
// Uses a SEPARATE secret you set when configuring the webhook in the
// Razorpay dashboard — not your key_secret.
export const verifyRazorpayWebhookSignature = (
  rawBody: string,
  signature: string
): boolean => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  return expected === signature;
};