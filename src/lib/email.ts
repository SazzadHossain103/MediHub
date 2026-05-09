import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || "").replace(
  /\s/g,
  ""
);
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "MediHub";
const OTP_SUBJECT = "MediHub Account Verification OTP";

const transporter = GMAIL_USER && GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    })
  : null;

type OtpEmailPayload = {
  to: string;
  otp: string;
  name?: string;
  expiryMinutes?: number;
};

export async function sendOtpEmail({
  to,
  otp,
  name,
  expiryMinutes = 10,
}: OtpEmailPayload) {
  if (!transporter) {
    throw new Error("Gmail credentials are not configured");
  }

  const greeting = name ? `Hello ${name},` : "Hello,";
  const text = `${greeting}\n\nYour MediHub verification OTP is: ${otp}\nThis code expires in ${expiryMinutes} minutes.\n\nIf you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #102a43;">
      <p>${greeting}</p>
      <p>Your MediHub verification OTP is:</p>
      <p style="font-size: 20px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
      <p>This code expires in ${expiryMinutes} minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  const from = `${EMAIL_FROM_NAME} <${GMAIL_USER}>`;

  return transporter.sendMail({
    from,
    to,
    subject: OTP_SUBJECT,
    text,
    html,
  });
}