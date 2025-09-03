import nodemailer from "nodemailer";
import CustomErrorHandler from "./errorHandler.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log(`Email sent to ${to}, MessageID: ${info.messageId}`);
    return info;
  } catch (err) {
    throw new CustomErrorHandler(500, "Failed to send email!");
  }
}
