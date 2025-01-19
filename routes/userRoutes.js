const express = require("express");
const { loginUser, signupUser, verifySignup, getUserById, updateUser, resetUser,resetPassword, otpVerification } = require("../controllers/userController");
// const { sendOtp, verifyOtp } = require("../utils/otpUtils");
const { loginLimiter, signupLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", signupLimiter, signupUser);
router.post("/signup/verify", signupLimiter, verifySignup);
router.post("/login", loginLimiter, loginUser);
router.post('/resetUser', resetUser);
router.post('/resetPassword', resetPassword)
router.post('/verifyOtp', otpVerification);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);

module.exports = router;
