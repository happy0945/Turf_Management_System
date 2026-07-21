import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // swap for host/port + secure if you're not using Gmail
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // Gmail App Password — NOT your normal login password
  },
});

interface BookingEmailPayload {
  to: string;
  userName: string;
  turfName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  amount: number;
  bookingId: string;
}

export const sendBookingConfirmationEmail = async (
  payload: BookingEmailPayload
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: `"Turf Booking" <${process.env.SMTP_EMAIL}>`,
      to: payload.to,
      subject: "Your turf booking is confirmed ✅",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Booking Confirmed</h2>
          <p>Hi ${payload.userName},</p>
          <p>Your slot at <strong>${payload.turfName}</strong> is confirmed.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px 0;">Date</td><td>${payload.bookingDate}</td></tr>
            <tr><td style="padding: 6px 0;">Time</td><td>${payload.startTime} - ${payload.endTime}</td></tr>
            <tr><td style="padding: 6px 0;">Amount Paid</td><td>₹${payload.amount}</td></tr>
            <tr><td style="padding: 6px 0;">Booking ID</td><td>${payload.bookingId}</td></tr>
          </table>
          <p>See you on the turf!</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
};