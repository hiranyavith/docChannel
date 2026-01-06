const express = require("express");
const { register, login, forgotPassword, resetPassword, verifyEmail } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);  // ✅ Ensure this line exists
router.post("/reset-password", resetPassword);
router.post("/verify", verifyEmail);

module.exports = router;
