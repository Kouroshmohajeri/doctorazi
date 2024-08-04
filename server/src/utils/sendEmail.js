// utils/sendEmail.js

import nodemailer from "nodemailer";

// Create a transporter with your SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // Updated to the correct SMTP host for Gmail
  port: 587, // Correct SMTP port for Gmail
  secure: false, // Set to true if your SMTP provider requires a secure connection
  auth: {
    user: "cymoshtoo@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, text, htmlContent) => {
  const mailOptions = {
    from: { name: "My Doctor", address: "cymoshtoo@gmail.com" },
    to,
    subject,
    text,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
