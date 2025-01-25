const express = require("express");
const multer = require('multer');
const upload = multer();
const { loginUser, signupUserAndSendOtp, verifySignup, getUserById, updateUser, resetUser,resetPassword, otpVerification, upduser, completeSignup } = require("../controllers/userController");
// const { sendOtp, verifyOtp } = require("../utils/otpUtils");
const { loginLimiter, signupLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup",signupLimiter, signupUserAndSendOtp);
router.post("/signup/verifyOtp",signupLimiter, otpVerification);
router.post("/signup/complete", completeSignup);
router.post("/login", loginLimiter, loginUser);
// router.post("/sendOtp", sendOtpEndpoint);
router.post('/resetUser', resetUser);
router.post('/resetPassword', resetPassword)
router.post('/verifyOtp', otpVerification);
router.put("/updateUser/:userId", upload.single('image'), upduser)
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);

module.exports = router;
