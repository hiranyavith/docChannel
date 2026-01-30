// const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// const { comparePassword, generateToken } = require("../utils/authHelper");
// const sendEmail = require("../utils/emailService");
// const { use } = require("react");

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  if (fullName.trim().length < 2) {
    return res.status(400).json({
      message: "Full name must be at least 2 characters",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address",
    });
  }

  try {
    // Check if user exists
    const [existingUser] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email.toLowerCase()],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const query =
      "INSERT INTO users (initial_with_name, email, password,created_At,role_role_id,status_status_id,isProfileComplete,isVerified) VALUES (?, ?, ?, NOW(),?,?,?,?)";
    const [result] = await db.execute(query, [
      fullName.trim(),
      email.toLowerCase(),
      hashedPassword,
      1,
      1,
      0,
      0,
    ]);

    const userId = result.insertId;
    // Generate verification token
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase() },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Send verification email
    // const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    // const emailContent = `<h3>Welcome ${full_name}!</h3>
    //                         <p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`;
    // await sendEmail(email, "Verify Your Email", emailContent);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        fullName: fullName.trim(),
        email: email.toLowerCase(),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const [users] = await db.execute(query, [email.toLowerCase()]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid Email or password",
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id,
        fullName: user.initial_with_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ message: "Email not found!" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const emailContent = `<h3>Reset Your Password</h3>
                            <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;

    await sendEmail(email, "Reset Your Password", emailContent);

    res.json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending password reset email", error });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ message: "Invalid token!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token!" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  console.log("Verifying token:", token);

  if (!token) {
    return res.status(400).json({ message: "Token is required!" });
  }

  try {
    // Decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const email = decoded.email; // Extract email from token

    if (!email) {
      return res.status(400).json({ message: "Invalid token!" });
    }

    // Update the user's email verification status
    const [result] = await db.execute(
      "UPDATE users SET email_verified = ?, active = ? WHERE email = ?",
      [true, 1, email],
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "User not found or already verified!" });
    }

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(400).json({ message: "Invalid or expired token!" });
    console.log(error);
  }
};
