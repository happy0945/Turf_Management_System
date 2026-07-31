import axiosInstance from "../lib/axios";

export interface CreateBookingData {
  turfId: string;
  bookingDate: string;
  startTime: string;
}

export interface VerifyPaymentData {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface Booking {
  _id: string;
  turf: {
    _id: string;
    turfName: string;
    location: { address: string; city: string };
    images: { url: string; public_id: string }[];
  };
  user: string;
  owner: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "expired" | "failed";
  payment: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    amount: number;
    currency: string;
    status: "created" | "paid" | "failed" | "refunded";
  };
  createdAt: string;
}

export interface RazorpayOrderData {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const bookingService = {
  async createBooking(data: CreateBookingData): Promise<{
    booking: Booking;
    razorpayOrder: RazorpayOrderData;
  }> {
    const res = await axiosInstance.post("/booking", data);
    return res.data.data;
  },

  async verifyPayment(data: VerifyPaymentData): Promise<Booking> {
    const res = await axiosInstance.post("/booking/verify", data);
    return res.data.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const res = await axiosInstance.get("/booking/my");
    return res.data.data;
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    const res = await axiosInstance.patch(`/booking/${bookingId}/cancel`);
    return res.data.data;
  },

  async getTurfBookings(turfId: string): Promise<Booking[]> {
    const res = await axiosInstance.get(`/booking/turf/${turfId}`);
    return res.data.data;
  },
};
