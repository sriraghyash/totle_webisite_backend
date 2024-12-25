const express = require("express");
const { googleAuth, googleCallback, logout } = require("../controllers/authController");

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);

module.exports = router;
