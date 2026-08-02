import { Request, Response } from "express";
import Booking from "../models/booking.model.js";
import Turf from "../models/turf.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApirResponse.js";
import { ApiError } from "../utils/ApiError.js";
import razorpay, {
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
} from "../utils/razorpay.js";
import { sendBookingConfirmationEmail } from "../utils/email.js";
import { sendBookingConfirmationWhatsapp } from "../utils/whatsapp.js";
import { generateSlots, timeToMinutes, minutesToTime } from "../utils/slot.js";
import { CreateBookingInput, VerifyPaymentInput } from "../utils/validator/booking.validator.js";

const PENDING_BOOKING_TTL_MINUTES = 10;

// Helper to parse date string into strict UTC range for timezone-agnostic matching
const getUTCDateRange = (dateStr: string) => {
  const cleanDate = dateStr.split("T")[0];
  const [year, month, day] = cleanDate.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return { start, end, bookingDate: start };
};

// =============== getAvailableSlots ===============
const getAvailableSlots = asyncHandler(async (req: Request, res: Response) => {
  const { turfId } = req.params;
  const { date } = req.query as { date?: string };

  if (!turfId || !date) {
    throw new ApiError(400, "turfId and date are required");
  }

  const turf = await Turf.findOne({ _id: turfId, status: "active" }).lean();
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  const { start, end, bookingDate } = getUTCDateRange(date);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (bookingDate < today) {
    throw new ApiError(400, "Cannot fetch slots for a past date");
  }

  const allSlots = generateSlots(turf.openingTime, turf.closingTime, turf.slotDuration);

  const bookedSlots = await Booking.find({
    turf: turfId,
    bookingDate: { $gte: start, $lte: end },
    status: { $in: ["pending", "confirmed"] },
  })
    .select("startTime")
    .lean();

  const bookedSet = new Set(bookedSlots.map((b) => b.startTime));

  const slots = allSlots.map((startTime) => ({
    startTime,
    isAvailable: !bookedSet.has(startTime),
  }));

  return res.status(200).json(new ApiResponse(200, slots, "Slots fetched successfully"));
});

// =============== createBooking ===============
const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateBookingInput;

  const turf = await Turf.findOne({ _id: body.turfId, status: "active" });
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  const { start, end, bookingDate } = getUTCDateRange(body.bookingDate);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (bookingDate < today) {
    throw new ApiError(400, "Cannot book a slot in the past");
  }

  // Check if slot is already booked for this date range & start time
  const existingBooking = await Booking.findOne({
    turf: turf._id,
    bookingDate: { $gte: start, $lte: end },
    startTime: body.startTime,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existingBooking) {
    throw new ApiError(409, "This slot is already booked or awaiting payment");
  }

  const validSlots = generateSlots(turf.openingTime, turf.closingTime, turf.slotDuration);
  if (!validSlots.includes(body.startTime)) {
    throw new ApiError(400, "Invalid slot for this turf");
  }

  const duration = body.slotDuration || turf.slotDuration || 60;
  const baseDuration = turf.slotDuration || 60;
  const priceRatio = duration / baseDuration;
  const totalAmount = Math.round(turf.pricePerSlot * priceRatio);

  const endTime = minutesToTime(timeToMinutes(body.startTime) + duration);

  let booking;
  try {
    booking = await Booking.create({
      turf: turf._id,
      user: req.user!._id,
      owner: turf.owner,
      bookingDate,
      startTime: body.startTime,
      endTime,
      slotDuration: duration,
      totalAmount,
      status: "pending",
      payment: {
        amount: totalAmount,
        currency: "INR",
        status: "created",
      },
      expiresAt: new Date(Date.now() + PENDING_BOOKING_TTL_MINUTES * 60 * 1000),
    });
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new ApiError(409, "This slot is already booked or awaiting payment");
    }
    throw error;
  }

  const order = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100), // paise
    currency: "INR",
    receipt: String(booking._id),
    notes: {
      bookingId: String(booking._id),
      turfId: String(turf._id),
    },
  });

  booking.payment.razorpayOrderId = order.id;
  await booking.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        booking,
        razorpayOrder: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      },
      "Booking created, proceed to payment"
    )
  );
});

// =============== verifyPayment ===============
// Called by your frontend from Razorpay checkout's handler() callback,
// right after a successful payment.
const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as VerifyPaymentInput;

  const booking = await Booking.findOne({
    _id: body.bookingId,
    "payment.razorpayOrderId": body.razorpay_order_id,
  })
    .populate("turf", "turfName")
    .populate("user", "fullName emailId contactNumber");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status === "confirmed") {
    return res.status(200).json(new ApiResponse(200, booking, "Booking already confirmed"));
  }

  if (booking.status !== "pending") {
    throw new ApiError(400, `Booking is ${booking.status}, cannot verify payment`);
  }

  const isValid = verifyRazorpaySignature(
    body.razorpay_order_id,
    body.razorpay_payment_id,
    body.razorpay_signature
  );

  if (!isValid) {
    booking.payment.status = "failed";
    await booking.save();
    throw new ApiError(400, "Payment verification failed");
  }

  booking.status = "confirmed";
  booking.payment.status = "paid";
  booking.payment.razorpayPaymentId = body.razorpay_payment_id;
  booking.payment.razorpaySignature = body.razorpay_signature;
  booking.expiresAt = undefined; // unsets the TTL field on save
  await booking.save();

  const turf: any = booking.turf;
  const user: any = booking.user;

  // Send HTTP response IMMEDIATELY so the user UI updates instantly to SUCCESS!
  res.status(200).json(new ApiResponse(200, booking, "Booking confirmed successfully"));

  // Fire-and-forget background notifications (does not block HTTP response)
  setImmediate(async () => {
    try {
      const [emailSent, whatsappSent] = await Promise.all([
        sendBookingConfirmationEmail({
          to: user.emailId,
          userName: user.fullName,
          turfName: turf.turfName,
          bookingDate: booking.bookingDate.toDateString(),
          startTime: booking.startTime,
          endTime: booking.endTime,
          amount: booking.totalAmount,
          bookingId: String(booking._id),
        }).catch(() => false),
        sendBookingConfirmationWhatsapp({
          to: user.contactNumber,
          userName: user.fullName,
          turfName: turf.turfName,
          bookingDate: booking.bookingDate.toDateString(),
          startTime: booking.startTime,
          endTime: booking.endTime,
          amount: booking.totalAmount,
          bookingId: String(booking._id),
        }).catch(() => false),
      ]);

      booking.notifications = { emailSent, whatsappSent };
      await booking.save();
    } catch (bgError) {
      console.error("Background notification error:", bgError);
    }
  });
});

const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;
  const rawBody = req.body.toString();

  const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
  if (!isValid) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const orderId = event.payload.payment.entity.order_id;
    const paymentId = event.payload.payment.entity.id;

    const booking = await Booking.findOne({ "payment.razorpayOrderId": orderId });

    if (booking && booking.status === "pending") {
      booking.status = "confirmed";
      booking.payment.status = "paid";
      booking.payment.razorpayPaymentId = paymentId;
      booking.expiresAt = undefined;
      await booking.save();
      // Notifications aren't re-sent here to avoid double-sending in the
      // common case where /bookings/verify already handled it.
    }
  }

  return res.status(200).json({ received: true });
});

// =============== cancelBooking ===============
const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.user.toString() !== req.user!._id.toString()) {
    throw new ApiError(403, "You are not allowed to cancel this booking");
  }

  if (!["pending", "confirmed"].includes(booking.status)) {
    throw new ApiError(400, `Booking is already ${booking.status}`);
  }

  const bookingDateTime = new Date(booking.bookingDate);
  const [h, m] = booking.startTime.split(":").map(Number);
  bookingDateTime.setHours(h, m, 0, 0);

  if (bookingDateTime.getTime() - Date.now() < 2 * 60 * 60 * 1000) {
    throw new ApiError(400, "Bookings can only be cancelled at least 2 hours before the slot");
  }

  booking.status = "cancelled";

  // If payment was already captured, refund it before saving:
  // if (booking.payment.status === "paid" && booking.payment.razorpayPaymentId) {
  //   await razorpay.payments.refund(booking.payment.razorpayPaymentId, {
  //     amount: Math.round(booking.totalAmount * 100),
  //   });
  //   booking.payment.status = "refunded";
  // }

  await booking.save();

  return res.status(200).json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

// =============== getMyBookings ===============
const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({ user: req.user!._id })
    .populate("turf", "turfName location images")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

// =============== getTurfBookings (owner/admin) ===============
const getTurfBookings = asyncHandler(async (req: Request, res: Response) => {
  const { turfId } = req.params;

  const turf = await Turf.findById(turfId).select("owner").lean();
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  const isOwner = turf.owner.toString() === req.user!._id.toString();
  const isAdmin = req.user!.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You are not allowed to view these bookings");
  }

  const bookings = await Booking.find({ turf: turfId })
    .populate("user", "fullName emailId contactNumber")
    .sort({ bookingDate: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, bookings, "Turf bookings fetched successfully"));
});

export {
  getAvailableSlots,
  createBooking,
  verifyPayment,
  razorpayWebhook,
  cancelBooking,
  getMyBookings,
  getTurfBookings,
};