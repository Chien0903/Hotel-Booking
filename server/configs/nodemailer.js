import nodemailer from "nodemailer";

// Create a transporter object using Gmail SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail", // Sử dụng service Gmail
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports (587 uses STARTTLS)
  requireTLS: true, // Force TLS
  auth: {
    user: process.env.SMTP_USER, // Email Gmail của bạn
    pass: process.env.SMTP_PASS, // App Password (không phải mật khẩu thông thường)
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Configuration Error:", error);
  } else {
    console.log("Gmail SMTP Server is ready to send messages");
  }
});

// Export the transporter
export default transporter;
