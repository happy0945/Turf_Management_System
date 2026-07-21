import mongoose, { Schema, Types, Document } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "expired" | "failed";
export type PaymentStatus = "created" | "paid" | "failed" | "refunded";

interface IPayment {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

interface INotifications {
  emailSent: boolean;
  whatsappSent: boolean;
}

export interface IBooking extends Document {
  turf: Types.ObjectId;
  user: Types.ObjectId;
  owner: Types.ObjectId;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  slotDuration: number;
  totalAmount: number;
  status: BookingStatus;
  payment: IPayment;
  notifications: INotifications;
  expiresAt?: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    turf: { type: Schema.Types.ObjectId, ref: "Turf", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },

    bookingDate: { type: Date, required: true },

    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    slotDuration: { type: Number, required: true },
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired", "failed"],
      default: "pending",
    },

    payment: {
      razorpayOrderId: { type: String },
      razorpayPaymentId: { type: String },
      razorpaySignature: { type: String },
      amount: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      status: {
        type: String,
        enum: ["created", "paid", "failed", "refunded"],
        default: "created",
      },
    },

    notifications: {
      emailSent: { type: Boolean, default: false },
      whatsappSent: { type: Boolean, default: false },
    },

    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index(
  { turf: 1, bookingDate: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } },
  }
);

bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ owner: 1, bookingDate: -1 });

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;