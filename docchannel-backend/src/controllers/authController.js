const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const { comparePassword, generateToken } = require("../utils/authHelper");
const sendEmail = require("../utils/emailService");

exports.register = async (req, res) => {
    const { full_name, email, password } = req.body;

    try {
        // Check if user exists
        const [existingUser] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const query = "INSERT INTO users (name, email, password, email_verified,active) VALUES (?, ?, ?, ?,?)";
        await db.execute(query, [full_name, email, hashedPassword, false, 0]);

        // Generate verification token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send verification email
        const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const emailContent = `<h3>Welcome ${full_name}!</h3>
                            <p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`;
        await sendEmail(email, "Verify Your Email", emailContent);

        res.status(201).json({ message: "User registered! Check your email for verification." });
    } catch (error) {
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
        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare the provided password with stored password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Check if the user is not verified or active, and return the appropriate message
        if (!user.email_verified) {
            return res.status(400).json({ message: "Please verify your email before logging in." });
        }

        if (!user.active) {
            return res.status(400).json({ message: "Your account is inactive. Please contact support." });
        }

        // Generate JWT token with role and active status
        const token = generateToken({
            id: user.id,
            role: user.role,
            emailVerified: user.email_verified,
            active: user.active
        });

        // Return the token and user info
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.email_verified,
                active: user.active
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in", error });
    }
};





exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Email not found!" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const emailContent = `<h3>Reset Your Password</h3>
                            <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;

        await sendEmail(email, "Reset Your Password", emailContent);

        res.json({ message: "Password reset link sent to your email!" });
    } catch (error) {
        res.status(500).json({ message: "Error sending password reset email", error });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        if (!email) {
            return res.status(400).json({ message: "Invalid token!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

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
            [true, 1, email]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "User not found or already verified!" });
        }

        res.json({ message: "Email verified successfully!" });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(400).json({ message: "Invalid or expired token!" });
        console.log(error)
    }
};
