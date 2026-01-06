const db = require("../config/db");

class User {
    static async create(name, email, hashedPassword, profilePicture, address, telephone, role = "user") {
        const [result] = await db.execute(
            "INSERT INTO users (name, email, password, profile_picture, address, telephone, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, email, hashedPassword, profilePicture, address, telephone, role]
        );
        return result;
    }
    static async findByEmail(email) {
        const [rows] = await db.execute("SELECT id, name, email, password, role, email_verified,active FROM users WHERE email = ?", [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async updateProfile(userId, name, profilePicture, address, telephone) {
        await db.execute(
            "UPDATE users SET name = ?, profile_picture = ?, address = ?, telephone = ? WHERE id = ?",
            [name, profilePicture, address, telephone, userId]
        );
    }

}

module.exports = User;
