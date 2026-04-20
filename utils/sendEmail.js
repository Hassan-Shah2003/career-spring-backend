import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (toEmail, token) => {
  const verifyLink = `${process.env.BACKEND_URL}/api/auth/confirm-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verify Your Email - Job Portal",
    html: `
      <h2>Welcome to Job Portal! 🎉</h2>
      <p>Please click the button below to verify your account:</p>
      <a href="${verifyLink}" style="background:#4F46E5;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
        Verify Email
      </a>
      <p>This link will expire in <b>24 hours</b>.</p>
    `,
  });
};
