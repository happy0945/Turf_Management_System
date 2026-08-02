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
    console.warn("⚠️ SMTP credentials (SMTP_EMAIL / SMTP_PASSWORD) not configured in environment variables. Skipping confirmation email.");
    return false;
  }

  // Gmail SMTP Transport with TLS fallback for cloud hosting environments (Render / AWS / Vercel)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpEmail.trim(),
      pass: smtpPassword.trim().replace(/\s+/g, ""), // Strip all spaces in 16-character App Password
    },
    tls: {
      rejectUnauthorized: false, // Prevents cloud self-signed cert handshake blocks
    },
  });

  try {
    await transporter.sendMail({
      from: `"TurfHub Bookings" <${smtpEmail}>`,
      to: payload.to,
      subject: "Your Turf Booking is Confirmed! ✅",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #22c55e; margin: 0;">Turf Booking Confirmed! 🎉</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Get ready for your match!</p>
          </div>

          <p style="font-size: 15px; color: #1e293b;">Hi <strong>${payload.userName}</strong>,</p>
          <p style="font-size: 14px; color: #475569; leading: 1.5;">Your slot reservation at <strong>${payload.turfName}</strong> has been successfully confirmed.</p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Venue:</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #0f172a;">${payload.turfName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Date:</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #0f172a;">${payload.bookingDate}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Time Slot:</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #22c55e;">${payload.startTime} – ${payload.endTime}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Amount Paid:</td>
                <td style="padding: 6px 0; font-weight: bold; text-align: right; color: #0f172a;">₹${payload.amount}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Booking ID:</td>
                <td style="padding: 6px 0; font-family: monospace; font-size: 12px; text-align: right; color: #475569;">${payload.bookingId}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 24px;">Thank you for booking with TurfHub!</p>
        </div>
      `,
    });
    console.log(`✅ Confirmation email sent to ${payload.to}`);
    return true;
  } catch (error: any) {
    if (error?.code === "EAUTH" || error?.responseCode === 535) {
      console.warn(
        "⚠️ Email skipped: Gmail App Password invalid (EAUTH 535).\n" +
        "👉 REASON: Gmail requires a 16-character App Password (without spaces), NOT your normal password.\n" +
        "👉 FIX: Generate App Password at https://myaccount.google.com/apppasswords and set it in Render Env Vars as SMTP_PASSWORD."
      );
    } else {
      console.error("Failed to send confirmation email:", error?.message || error);
    }
    return false;
  }
};