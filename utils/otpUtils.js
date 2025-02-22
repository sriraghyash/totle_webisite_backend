const nodemailer = require("nodemailer");
const { models } = require("../models");
const { Otp } = models;


const sassyMessages = [
  "Chill out! Your OTP is valid for another ${minutes}m ${seconds}s. It’s not going anywhere—just check your ${email} inbox!",
  "Slow down, superstar. That OTP sent to ${email} is still valid for ${minutes}m ${seconds}s. No need to rush it!",
  "Take a deep breath! Your OTP is hanging out in your ${email} inbox, good for another ${minutes}m ${seconds}s. Give it some love!",
  "You’ve already got an OTP in ${email} inbox, and it’s still valid for ${minutes}m ${seconds}s.",
  "Hey, your OTP is waiting in ${email} inbox. It’s valid for ${minutes}m ${seconds}s. No need to break up with it just yet!",
  "Relax, Totler! That OTP we sent to ${email} is good for ${minutes}m ${seconds}s. Stop stressing my server and check your inbox.",
  "Your OTP is alive and well in ${email} inbox, valid for ${minutes}m ${seconds}s. Don’t abandon it like yesterday’s leftovers!",
  "Whoa, hold up! Your OTP is valid for another ${minutes}m ${seconds}s. Just check your ${email}",
  "Bro, your OTP is still valid for ${minutes}m ${seconds}s. Check your ${email} inbox, it’s waiting for you like a Brother from another mother.",
  "Your OTP is hanging in ${email} inbox, valid for ${minutes}m ${seconds}s. Don’t give it the cold shoulder!"
];

const otpSentMessages=[
  "An OTP has been sent! It’s probably sitting in ${email} inbox, waiting for you to notice.",
  "Boom! OTP sent. It’s now living rent-free in your  ${email} inbox—check it out!",
  "Congrats, your OTP is flying its way to your  ${email} inbox.",
  "All set! Your OTP is heading to your  ${email} inbox. Give it a warm welcome when it arrives!",
  "Your OTP has been delivered to ${email}. Hope, it might not end up in your spam folder.",
  "Your OTP has been delivered to ${email}. Now, let’s see if you can find it before it expires!",
  "We’ve sent your OTP. If it’s not in your ${email} inbox, it might be taking a quick vacation in your spam folder.",
  "Good news: your OTP is sent to ${email}. Bad news: it might get jealous if you ignore it for too long.",
  "Your OTP is delivered to ${email}. If you don’t see it, perhaps your spam folder is offering it a temporary home."
]

const failedOtpMessages = [
  "Sending the OTP failed. Technology isn’t perfect, but we’re sure you’ll give it another chance.",
  "Oops, the OTP didn’t make it out the door. Let’s blame the server for now—try resending it.",
  "The OTP didn’t make it. Maybe it got stuck in a digital traffic jam. Hit resend to give it another shot.",
  "Failed to send OTP. It happens to the best of systems. Give it another go—third time’s the charm, maybe?",
  "Sending the OTP didn’t work this time. It’s like the server pressed snooze. Wake it up by trying again!",
  "We tried sending the OTP, but it didn’t cooperate. Don’t give up—resend and show it who’s boss!",
  "Your OTP didn’t make it. Let’s give it another chance to shine—hit resend and we’ll cheer it on."
]

const invalidEmailMessages  = [
  "That doesn’t look right. Double-check your email—maybe your keyboard slipped.",
  "Invalid email address. If that was a creative attempt, I’m impressed—but let’s stick to standard email formats.",
  "Oops, we can’t send anything to that. Double-check your email address before we both get embarrassed.",
  "Email address invalid. Let’s give it another shot—this time, with fewer typos.",
  "Hmm, that doesn’t look like an email address. Maybe double-check before we blame autocorrect?",
  "Invalid email address. Let’s pretend that was a practice run and go for the real thing this time.",
  "Hmm, your email seems to be missing some essentials. Maybe an @ symbol or, you know, logic?",
  "We’re unable to process this email address. Please confirm it’s correctly formatted and try again."
]

let radIndex= Math.floor(Math.random() * invalidEmailMessages.length);

const sendOtp = async (email, mobile) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    console.error("Invalid email provided:", email);
    const invalidMailmsg = invalidEmailMessages[radIndex];
    return { error: true, message: invalidMailmsg };
  }

  const randomIndex = Math.floor(Math.random() * otpSentMessages.length);
  const failedIndex = Math.floor(Math.random() * failedOtpMessages.length);
  let sentMessage = otpSentMessages[randomIndex];
  const failedSentMessage = failedOtpMessages[failedIndex]

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const existingOtp = await Otp.findOne({ where: { email } });

    if (existingOtp) {
      if (new Date() < existingOtp.expiry) {
        const timeRemaining = Math.round((existingOtp.expiry - new Date()) / 1000); // Time remaining in seconds
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        //made changes here

        const randomIndex = Math.floor(Math.random() * sassyMessages.length);
        const selectedMessage = sassyMessages[randomIndex].replace("${minutes}", minutes).replace("${seconds}", seconds).replace("${email}", email);

        return { 
          error: true,
          message: selectedMessage, 
          expiry: existingOtp.expiry,
          status: "already-sent" 
        };
      }else {
        // Existing OTP has expired; generate a new one
        await existingOtp.update({ otp, expiry, isVerified: false });
        await sendOtpEmail(email, otp);
        return { error: false, message: sentMessage.replace("${email}", email) };
      }
    } else {
      // Create a new OTP if none exists
      await Otp.create({ email, otp, expiry, isVerified: false });
      // console.log('entered send otp email')
      await sendOtpEmail(email, otp);
      return { error: false, message: sentMessage };
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { error: true, message: failedSentMessage };
  }
};

const failureMessages = [
  "Oops! That OTP isn’t it. Double-check and try again, Totler.",
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

const otpSuccess=[
  "Success! OTP verified. TOTLE appreciates those who persevere, and you nailed it!",
  "OTP verified! Looks like TOTLE’s spirit of Endeavour worked its magic on you.",
  "Verified! At TOTLE, we’re all about growth, and you’ve just leveled up with that OTP.",
  "Well done! OTP verified. TOTLE inspires progress, and you’re clearly moving forward.",
  "Well done! OTP verified. TOTLE thrives on Endeavour, and you’ve just proven it’s worth it.",
  "OTP verified! TOTLE inspires action, and you’re clearly someone who gets things done.",
  "OTP verified successfully! TOTLE knows effort matters, and this moment proves it’s always worth it.",
  "Verified! At TOTLE, we celebrate wins—big or small. And this is definitely a win for you!"
]
const verifyOtp = async (email, otp) => {
  const randomFailureMessage = failureMessages[Math.floor(Math.random() * failureMessages.length)];
  const otpSuccessMessage = otpSuccess[Math.floor(Math.random() * otpSuccess.length)]
  try {
    const otpRecord = await Otp.findOne({ where: { email, otp, isVerified: false } });
    if (!otpRecord){
      return { error: true, message: randomFailureMessage };
    } 

    if (new Date() > otpRecord.expiry) {
      console.log('enter 1')
      const randomExpiredMessage = expiredMessages[Math.floor(Math.random() * expiredMessages.length)];
      if (otpRecord.otp !== otp) {
        return { error: true, message: randomFailureMessage };
      }
      return { error: true, message: randomExpiredMessage };
    }

    otpRecord.isVerified = true;
    console.log('enter 2')
    await otpRecord.save();
    return { message: otpSuccessMessage };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { error: true, message: randomFailureMessage };
  }
};

const sendOtpEmail = async (email, otp) => {
  console.log('entered send otp email')
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId }; // Return success and message ID
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error.message);
    return { success: false, error: error.message }; // Return failure and error message
  }
};

module.exports = { sendOtp, verifyOtp, sendOtpEmail };
