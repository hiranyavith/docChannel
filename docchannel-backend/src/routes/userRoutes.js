const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  completeUserProfile,
  sendVerificationOTP,
  VerifyAccount,
  UploadProfileImage,
} = require("../controllers/userController");

const { authenticateUser } = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");
const { upload } = require("../middleware/multerStorage");

const router = express.Router();

router.get("/profile", authenticateUser, getUserProfile);
// router.put(
//   "/profile/:user_id",
//   upload.single("profile_picture"),
//   updateUserProfile,
// );
router.post("/complete-profile", completeUserProfile);
router.post("/send-verification-otp", sendVerificationOTP);
router.post("/verify-account", VerifyAccount);
router.put(
  "/update-profile-image",
  authenticateUser,
  upload.single("image"),
  UploadProfileImage,
);

module.exports = router;
