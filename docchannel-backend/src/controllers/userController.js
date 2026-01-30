const cloudinary = require("../config/cloudinary");
const db = require("../config/db");
const { transporter } = require("../config/mailer");
const { upload } = require("../middleware/multerStorage");
const User = require("../models/User");
const { generateOtp } = require("../utils/otp");
require("dotenv").config();

// ✅ Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.id;
    if (!user_id)
      return res.status(400).json({ message: "User ID is required" });

    const [rows] = await db.execute(
      `SELECT 
    u.initial_with_name,
    u.f_name,
    u.l_name,
    u.email,
    u.mobile,
    u.nic_no,
    u.created_At,
    st.status_type,
    ua.address,
    ct.city_name,
    dst.district_name,
    ua.city_city_id,
    ua.district_district_id,
    prcn.province_name,
    ua.province_province_id
  FROM users u
  INNER JOIN status st 
    ON st.status_id = u.status_status_id 
  INNER JOIN user_address ua 
    ON ua.iduser_address = u.user_address_id
  INNER JOIN city ct 
    ON ct.city_id = ua.city_city_id
  INNER JOIN district dst 
    ON dst.district_id = ua.district_district_id
  INNER JOIN province prcn 
    ON prcn.province_id = ua.province_province_id
  WHERE u.user_id = ?`,
      [user_id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
    });
  }
};

// ✅ Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name, address, telephone } = req.body;
    let profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("Uploaded file:", req.file); // ✅ Debug log

    const [user] = await db.execute(
      "SELECT profile_picture FROM users WHERE id = ?",
      [user_id],
    );

    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    if (!profile_picture) {
      profile_picture = user[0].profile_picture;
    }

    await db.execute(
      "UPDATE users SET name = ?, address = ?, telephone = ?, profile_picture = ? WHERE id = ?",
      [name, address, telephone, profile_picture, user_id],
    );

    res.json({ message: "Profile updated successfully", profile_picture });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

exports.completeUserProfile = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      mobileCode,
      mobileNumber,
      nicNo,
      address,
      city,
      district,
      province,
      gender,
      dob,
    } = req.body;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        mobile: `${mobileCode}${mobileNumber}`,
        nicNo,
        address,
        city,
        district,
        province,
        gender,
        dob,
        isProfileComplete: true,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const emailTransporter = transporter;
const sendOTPEmail = async (email, otp, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Account - OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #72A6BB;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 40px 30px;
          }
          .otp-box {
            background-color: #f8f9fa;
            border: 2px dashed #72A6BB;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #72A6BB;
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #72A6BB;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Account Verification</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName || "User"}!</h2>
            <p>Thank you for completing your profile. To verify your account, please use the following One-Time Password (OTP):</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #6c757d; font-size: 12px;">Valid for 10 minutes</p>
            </div>
            
            <p>Enter this code in the verification window to complete your account setup.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              • This OTP is confidential. Do not share it with anyone.<br>
              • Our team will never ask for your OTP.<br>
              • If you didn't request this code, please ignore this email.
            </div>
            
            <p>If you have any questions or need assistance, feel free to contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>Your Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return emailTransporter.sendMail(mailOptions);
};
exports.sendVerificationOTP = async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({
      success: false,
      message: "User ID and email are required",
    });
  }

  try {
    const [users] = await db.execute(
      "SELECT user_id, f_name, l_name, email, isVerified FROM users WHERE user_id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    if (user.isVerified == 1) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.execute(
      "UPDATE users SET verificationOTP = ?, otpExpiry = ? WHERE user_id = ?",
      [otp, otpExpiry, userId],
    );

    const userName = `${user.f_name || ""} ${user.l_name || ""}`.trim();
    await sendOTPEmail(email, otp, userName);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
      error: error.message,
    });
  }
};

exports.VerifyAccount = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "User ID and OTP are required",
    });
  }

  try {
    const [users] = await db.execute(
      "SELECT user_id, verificationOTP, otpExpiry, isVerified FROM users WHERE user_id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    if (user.isVerified == 1) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    if (!user.verificationOTP) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    const currentTime = new Date();
    const expiryTime = new Date(user.otpExpiry);

    if (currentTime > expiryTime) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.verificationOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    await db.execute(
      "UPDATE users SET isVerified = 1, verificationOTP = NULL, otpExpiry = NULL, verifyAt = NOW() WHERE user_id = ?",
      [userId],
    );

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
      error: error.message,
    });
  }
};

exports.UploadProfileImage = async (req, res) => {
  try {
   if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: "Unauthorized - user not authenticated" });
    }

     if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }


    const imageUrl = req.file.path;

    
    await db.execute("UPDATE users SET profile_image = ? WHERE user_id = ?", [
      imageUrl,
      req.user.user_id,
    ]);

    
    res.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed" });
  }
};
