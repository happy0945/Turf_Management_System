import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    turfId: z.string().min(1, "turfId is required"),
    bookingDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "startTime must be in HH:mm format"),
    slotDuration: z.coerce
      .number()
      .refine((val) => [30, 60, 90, 120].includes(val), "slotDuration must be 30, 60, 90, or 120")
      .optional(),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1),
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
  }),
  params: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>["body"];
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>["body"];