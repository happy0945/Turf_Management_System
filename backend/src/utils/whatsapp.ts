import axios from "axios";

interface WhatsAppBookingPayload {
  to: string; // E.164 without '+', e.g. "919876543210"
  userName: string;
  turfName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  amount: number;
}

const WHATSAPP_API_URL =
`https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

export const sendBookingConfirmationWhatsapp = async (
  payload: WhatsAppBookingPayload
): Promise<boolean> => {
  try {
    await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: payload.to,
        type: "text",
        text: {
          body:
            `Hi ${payload.userName}, your booking at ${payload.turfName} is confirmed.\n` +
            `Date: ${payload.bookingDate}\n` +
            `Time: ${payload.startTime} - ${payload.endTime}\n` +
            `Amount paid: ₹${payload.amount}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return false;
  }
};