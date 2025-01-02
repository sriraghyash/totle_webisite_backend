const nodemailer = require("nodemailer");
const Otp = require("../models/userModels/Otp");

const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const existingOtp = await Otp.findOne({ where: { email } });
    if (existingOtp) {
      await existingOtp.update({ otp, expiry, isVerified: false });
    } else {
      await Otp.create({ email, otp, expiry, isVerified: false });
    }

    await sendOtpEmail(email, otp);
    return { message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { error: true, message: "Failed to send OTP." };
  }
};

const verifyOtp = async (email, otp) => {
  try {
    const otpRecord = await Otp.findOne({ where: { email, otp, isVerified: false } });
    if (!otpRecord) return { error: true, message: "Invalid OTP." };

    if (new Date() > otpRecord.expiry) return { error: true, message: "OTP expired." };

    otpRecord.isVerified = true;
    await otpRecord.save();
    return { message: "OTP verified successfully." };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { error: true, message: "Failed to verify OTP." };
  }
};

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"T0TLE" <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Your OTP for Signup",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtp, verifyOtp };
