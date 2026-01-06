const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");


const router = express.Router();

router.get("/profile", getUserProfile);
router.put("/profile/:user_id", upload.single("profile_picture"), updateUserProfile);

module.exports = router;
