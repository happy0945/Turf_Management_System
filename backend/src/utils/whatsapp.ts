import axios from "axios";

interface WhatsAppBookingPayload {
  to: string; // Phone number (e.g. "8947910991" or "918947910991")
  userName: string;
  turfName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  amount: number;
  bookingId?: string;
}

export const sendBookingConfirmationWhatsapp = async (
  payload: WhatsAppBookingPayload
): Promise<boolean> => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  // Format phone number to E.164 without '+' (e.g., 918947910991 for India)
  let formattedPhone = payload.to.trim().replace(/\D/g, "");
  if (formattedPhone.length === 10) {
    formattedPhone = `91${formattedPhone}`; // India country code
  }

  const messageText =
    `⚽ *Turf Booking Confirmed!*\n\n` +
    `Hi *${payload.userName}*,\n` +
    `Your reservation at *${payload.turfName}* is confirmed.\n\n` +
    `📅 *Date:* ${payload.bookingDate}\n` +
    `⏰ *Time:* ${payload.startTime} - ${payload.endTime}\n` +
    `💰 *Amount Paid:* ₹${payload.amount}\n` +
    (payload.bookingId ? `🆔 *Booking ID:* ${payload.bookingId}\n` : "") +
    `\nThank you for booking with TurfHub! See you on the field. 🏆`;

  // Always log a wa.me link in backend console (useful for testing / manual fallback)
  const waWebUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;
  console.log(`📱 WhatsApp Message Preview Link: ${waWebUrl}`);

  if (!phoneNumberId || !accessToken) {
    console.warn(
      "⚠️  WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN not set in .env.\n" +
      "    Skipping automated WhatsApp notification."
    );
    return false;
  }

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  try {
    const res = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "text",
        text: {
          preview_url: false,
          body: messageText,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      `✅ WhatsApp message sent to ${formattedPhone}. Message ID: ${res.data?.messages?.[0]?.id}`
    );
    return true;

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data?.error;
      const code = errData?.code || error.response?.status;
      const msg = errData?.message || error.message;

      // Provide specific fix hints for the most common errors
      if (code === 190 || errData?.error_subcode === 463) {
        console.warn(
          `⚠️  WhatsApp access token has EXPIRED (code 190).\n` +
          `    ✏️  Fix: Generate a new Permanent Token:\n` +
          `    1. Go to https://developers.facebook.com/tools/explorer/\n` +
          `    2. Select your app → Generate a long-lived / permanent token\n` +
          `    3. Update WHATSAPP_ACCESS_TOKEN in backend/.env and restart the server.`
        );
      } else if (code === 131030 || code === 100) {
        console.warn(
          `⚠️  WhatsApp recipient ${formattedPhone} is not in the test sandbox allowlist (code ${code}).\n` +
          `    ✏️  Fix:\n` +
          `    1. Go to Meta Developer Dashboard → WhatsApp → API Setup\n` +
          `    2. Under "To", add ${formattedPhone} as a verified test number.\n` +
          `    3. That phone must reply to the "join <sandbox>" invitation message.`
        );
      } else {
        console.warn(`⚠️  WhatsApp API error (${code}): ${msg}`);
      }
    } else {
      console.error("Failed to send WhatsApp notification:", error.message || error);
    }
    return false;
  }
};