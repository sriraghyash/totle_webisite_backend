const nodemailer = require("nodemailer");
const { models } = require("../models");
const { Otp } = models;


const sassyMessages = [
  "Chill out! Your OTP is valid for another ${minutes}m ${seconds}s. It’s not going anywhere—just check your inbox!",
  "Slow down, superstar. That OTP we sent is still valid for ${minutes}m ${seconds}s. No need to rush it!",
  "Take a deep breath! Your OTP is hanging out in your inbox, good for another ${minutes}m ${seconds}s. Give it some love!",
  "You’ve already got an OTP, and it’s still valid for ${minutes}m ${seconds}s. You’re not ghosting it, are you?",
  "Hey, your OTP is fine. It’s valid for ${minutes}m ${seconds}s. No need to break up with it just yet!",
  "Relax, bestie! That OTP we sent is good for ${minutes}m ${seconds}s. Stop stressing my server and check your inbox.",
  "Your OTP is alive and well, valid for ${minutes}m ${seconds}s. Don’t abandon it like yesterday’s leftovers!",
  "Whoa, hold up! Your OTP is valid for another ${minutes}m ${seconds}s. No need to hit resend like it owes you money.",
  "Bro, your OTP is still valid for ${minutes}m ${seconds}s. Check your inbox—it’s waiting for you like a Brother from another mother.",
  "Your OTP is hanging in there, valid for ${minutes}m ${seconds}s. Don’t give it the cold shoulder!"
];

const sendOtp = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    console.error("Invalid email provided:", email);
    return { error: true, message: "Invalid email address" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const existingOtp = await Otp.findOne({ where: { email } });

    if (existingOtp) {
      if (new Date() < existingOtp.expiry) {
        const randomIndex = Math.floor(Math.random() * sassyMessages.length);
        const selectedMessage = sassyMessages[randomIndex].replace("${minutes}", minutes).replace("${seconds}", seconds);

        const timeRemaining = Math.round((existingOtp.expiry - new Date()) / 1000); // Time remaining in seconds
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        return { 
          message: selectedMessage, 
          expiry: existingOtp.expiry 
        };
      } else {
        // Update OTP if the existing one has expired
        await existingOtp.update({ otp, expiry, isVerified: false });
      }
    } else {
      // Create a new OTP if none exists
      await Otp.create({ email, otp, expiry, isVerified: false });
    }

    await sendOtpEmail(email, otp);
    return { message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { error: true, message: "Failed to send OTP." };
  }
};

const failureMessages = [
  "Oops! That OTP isn’t it. Double-check and try again, bestie.",
  "Wrong OTP? Don’t worry, even superheroes mistype sometimes.",
  "Not quite! Looks like your OTP needs a second look.",
  "Uh-oh! That OTP didn’t pass the vibe check. Try again!",
  "Nope, that’s not it. Take a deep breath and give it another shot!"
];
const expiredMessages = [
  "Yikes! That OTP has expired. Guess it wasn’t meant to be.",
  "Oops, you waited too long! Your OTP is as expired as last week’s milk.",
  "Time’s up for that OTP! Request a new one, quick!",
  "That OTP has officially retired. Let’s get you a fresh one.",
  "Expired OTP alert! Time to hit that resend button like a champ."
];
const verifyOtp = async (email, otp) => {
  try {
    const otpRecord = await Otp.findOne({ where: { email, otp, isVerified: false } });
    if (!otpRecord){
      const randomFailureMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
      return { error: true, message: randomFailureMessage };
    } 

    if (new Date() > otpRecord.expiry) {
      const randomExpiredMessage = expiredMessages[Math.floor(Math.random() * expiredMessages.length)];
      return { error: true, message: randomExpiredMessage };
    }

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

module.exports = { sendOtp, verifyOtp, sendOtpEmail };
