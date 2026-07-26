import { Router } from "express";
import userMiddleware from "../middlewares/user.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  getAvailableSlots,
  createBooking,
  verifyPayment,
  cancelBooking,
  getMyBookings,
  getTurfBookings,
} from "../controllers/booking.controller.js";
import { createBookingSchema, verifyPaymentSchema } from "../utils/validator/booking.validator.js";

const bookingRouter = Router();

// Public — anyone browsing a turf should see open slots without logging in
bookingRouter.get("/turf/:turfId/slots", getAvailableSlots);

// Everything below requires auth
bookingRouter.use(userMiddleware);

bookingRouter.post("/", validateRequest(createBookingSchema), createBooking);
bookingRouter.post("/verify", validateRequest(verifyPaymentSchema), verifyPayment);
bookingRouter.get("/my", getMyBookings);
bookingRouter.get("/turf/:turfId", getTurfBookings);
bookingRouter.patch("/:id/cancel", cancelBooking);

export default bookingRouter;