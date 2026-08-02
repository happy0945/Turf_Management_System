import nodemailer from "nodemailer";
import dns from "dns";

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

export const sendBookingConfirmationEmail = async (
  payload: BookingEmailPayload
): Promise<boolean> => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpEmail = process.env.SMTP_EMAIL;
  const smtpPassword = process.env.SMTP_PASSWORD;

  const htmlContent = `
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
  `;

  // 🌟 METHOD 1: Resend HTTP API (Port 443 HTTPS — 100% Cloud Firewall Proof)
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "TurfHub <onboarding@resend.dev>",
          to: [payload.to],
          subject: "Your Turf Booking is Confirmed! ✅",
          html: htmlContent,
        }),
      });

      const resData: any = await res.json();
      if (res.ok && resData.id) {
        console.log(`✅ Confirmation email delivered via Resend API to ${payload.to} [ID: ${resData.id}]`);
        return true;
      } else {
        console.error("❌ Resend API Error:", resData);
      }
    } catch (apiErr: any) {
      console.error("❌ Resend API Fetch Error:", apiErr?.message || apiErr);
    }
  }

  // 🌟 METHOD 2: Nodemailer Standard SMTP
  if (!smtpEmail || !smtpPassword) {
    console.warn("⚠️ Neither RESEND_API_KEY nor SMTP credentials found in environment variables. Skipping email.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpEmail.trim(),
      pass: smtpPassword.trim().replace(/\s+/g, ""),
    },
    family: 4,
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 5000,
  } as any);

  try {
    const info = await transporter.sendMail({
      from: `"TurfHub Bookings" <${smtpEmail.trim()}>`,
      to: payload.to,
      subject: "Your Turf Booking is Confirmed! ✅",
      html: htmlContent,
    });
    console.log(`✅ Confirmation email sent via SMTP to ${payload.to} [MessageID: ${info.messageId}]`);
    return true;
  } catch (error: any) {
    console.error("❌ SMTP Error on Cloud Server:", {
      code: error?.code,
      message: error?.message,
    });
    return false;
  }
};