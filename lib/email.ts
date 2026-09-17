import "server-only";
import nodemailer from "nodemailer";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendInterviewerSetupLink({
  to,
  regNo,
  actionLink,
}: {
  to: string;
  regNo: string;
  actionLink: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return { error: "SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD." };

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#1a6b1a; margin-bottom: 4px;">TNV Leadership Selection Portal</h2>
      <p style="color:#555; font-size: 13px; margin-top: 0;">Interviewer Account Invitation</p>
      <p>Hello,</p>
      <p>You've been invited to join the TNV Leadership Selection Portal as an interviewer. Click below to set up your account — you'll choose your own password and provide your name and mobile number.</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding:4px 12px 4px 0; color:#555;">Registration No.</td><td style="font-weight:bold;">${regNo}</td></tr>
        <tr><td style="padding:4px 12px 4px 0; color:#555;">Email</td><td style="font-weight:bold;">${to}</td></tr>
      </table>
      <p>
        <a href="${actionLink}" style="background:#1a6b1a;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;display:inline-block;">
          Set Up Your Account
        </a>
      </p>
      <p style="color:#888; font-size: 12px;">This link is one-time use and will sign you in directly. If you did not expect this invitation, contact the TNV Admin.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: "You're invited — TNV Leadership Selection Portal",
      html,
    });
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to send invitation email." };
  }
}
