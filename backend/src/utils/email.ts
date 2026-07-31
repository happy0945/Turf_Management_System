import nodemailer from "nodemailer";

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
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpEmail || !smtpPassword) {
    console.warn("⚠️ SMTP credentials not found in .env. Skipping confirmation email.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpEmail,
      pass: smtpPassword, // Must be a 16-character Gmail App Password
    },
  });

  try {
    await transporter.sendMail({
      from: `"Turf Booking" <${smtpEmail}>`,
      to: payload.to,
      subject: "Your turf booking is confirmed ✅",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 16px;">
          <h2 style="color: #22c55e;">Booking Confirmed 🎉</h2>
          <p>Hi <strong>${payload.userName}</strong>,</p>
          <p>Your slot at <strong>${payload.turfName}</strong> is confirmed.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px 0; color: #64748b;">Date</td><td style="font-weight: bold;">${payload.bookingDate}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Time</td><td style="font-weight: bold; color: #22c55e;">${payload.startTime} - ${payload.endTime}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Amount Paid</td><td style="font-weight: bold;">₹${payload.amount}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Booking ID</td><td style="font-family: monospace;">${payload.bookingId}</td></tr>
          </table>
          <p>See you on the turf!</p>
        </div>
      `,
    });
    console.log(`✅ Confirmation email sent to ${payload.to}`);
    return true;
  } catch (error: any) {
    if (error?.code === "EAUTH" || error?.responseCode === 535) {
      console.warn(
        "⚠️ Email sending skipped: Gmail authentication failed (EAUTH 535).\n" +
        "👉 REASON: Gmail requires a 16-character App Password, NOT your standard account password.\n" +
        "👉 HOW TO FIX: Go to https://myaccount.google.com/apppasswords to generate an App Password and set it as SMTP_PASSWORD in backend/.env"
      );
    } else {
      console.error("Failed to send confirmation email:", error.message || error);
    }
    return false;
  }
};