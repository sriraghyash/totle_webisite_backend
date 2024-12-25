const express = require("express");
const { loginUser, signupUser, verifySignup, getUserById, updateUser } = require("../controllers/userController");
const { loginLimiter, signupLimiter } = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", signupLimiter, signupUser);
router.post("/signup/verify", signupLimiter, verifySignup);
router.post("/login", loginLimiter, loginUser);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);

module.exports = router;
