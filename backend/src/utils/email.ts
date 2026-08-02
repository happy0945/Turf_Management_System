import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js DNS resolution to prioritize IPv4 addresses over IPv6.
// Fixes 'ENETUNREACH 2404:6800:...' socket errors on Render/AWS cloud containers where IPv6 routing is disabled.
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch {
  // Ignored if unsupported in older Node versions
}

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

// Create cloud-optimized transporter helper forcing IPv4 resolution
const createCloudTransporter = (smtpEmail: string, smtpPassword: string) => {
  const cleanEmail = smtpEmail.trim();
  const cleanPass = smtpPassword.trim().replace(/\s+/g, "");

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    requireTLS: true,
    family: 4, // 👈 CRITICAL FIX: Force IPv4 lookup (bypasses ENETUNREACH on Render containers)
    auth: {
      user: cleanEmail,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  } as any);
};

export const sendBookingConfirmationEmail = async (
  payload: BookingEmailPayload
): Promise<boolean> => {
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpEmail || !smtpPassword) {
    console.warn(
      "⚠️ SMTP credentials (SMTP_EMAIL / SMTP_PASSWORD) not configured in environment variables. Skipping confirmation email."
    );
    return false;
  }

  const transporter = createCloudTransporter(smtpEmail, smtpPassword);

  try {
    const info = await transporter.sendMail({
      from: `"TurfHub Bookings" <${smtpEmail.trim()}>`,
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
    console.log(`✅ Confirmation email sent successfully to ${payload.to} [MessageID: ${info.messageId}]`);
    return true;
  } catch (error: any) {
    console.error("❌ Email Delivery Error on Cloud Server:", {
      code: error?.code,
      responseCode: error?.responseCode,
      message: error?.message,
    });

    if (error?.code === "EAUTH" || error?.responseCode === 535) {
      console.warn(
        "⚠️ Gmail App Password Auth Error (535).\n" +
        "👉 Make sure 2-Step Verification is ON in Google Account, then generate App Password at https://myaccount.google.com/apppasswords"
      );
    }
    return false;
  }
};