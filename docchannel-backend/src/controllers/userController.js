const db = require("../config/db");

// ✅ Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ message: "User ID is required" });

        const [user] = await db.execute("SELECT id, name, email, profile_picture, address, telephone, role FROM users WHERE id = ?", [user_id]);

        if (user.length === 0) return res.status(404).json({ message: "User not found" });

        res.json({ user: user[0] });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};

// ✅ Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { name, address, telephone } = req.body;
        let profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

        console.log("Uploaded file:", req.file); // ✅ Debug log

        const [user] = await db.execute("SELECT profile_picture FROM users WHERE id = ?", [user_id]);

        if (user.length === 0) return res.status(404).json({ message: "User not found" });

        if (!profile_picture) {
            profile_picture = user[0].profile_picture;
        }

        await db.execute(
            "UPDATE users SET name = ?, address = ?, telephone = ?, profile_picture = ? WHERE id = ?",
            [name, address, telephone, profile_picture, user_id]
        );

        res.json({ message: "Profile updated successfully", profile_picture });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Error updating profile" });
    }
};
