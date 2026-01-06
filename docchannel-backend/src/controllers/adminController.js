const db = require("../config/db");
const bcrypt = require("bcryptjs");


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email, role,email_verified, active FROM users");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Add a user
exports.addUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role]);
        res.json({ message: "User added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add user", error });
    }
};

// Edit a user
exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
        await db.query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id]);
        res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error });
    }
};


// Controller for updating user active status
exports.updateUserStatus = (req, res) => {
    const { id } = req.params;
    const { activeStatus } = req.body;

    if (activeStatus !== 0 && activeStatus !== 1) {
        return res.status(400).json({ message: "Invalid active status. Use 1 for active and 0 for inactive." });
    }

    const query = 'UPDATE users SET active = ? WHERE id = ?';
    db.query(query, [activeStatus, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User status updated successfully" });
    });
};




// Change user role
exports.changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
        res.json({ message: "User role updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update role", error });
    }
};

// src/controllers/adminController.js

// Update user active status
exports.updateUserActiveStatus = async (req, res) => {
    const { id } = req.params;
    const { active } = req.body;
    try {
        await db.query("UPDATE users SET active = ? WHERE id = ?", [active, id]);
        res.json({ message: "User active status updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user active status", error });
    }
};



// Get all default slots
exports.getDefaultSlots = async (req, res) => {
    try {
        const [slots] = await db.query("SELECT * FROM slots");
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Add a default slot
exports.addDefaultSlot = async (req, res) => {
    const { time_slot } = req.body;
    try {
        await db.query("INSERT INTO slots (time_slot) VALUES (?)", [time_slot]);
        res.json({ message: "Default slot added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add default slot", error });
    }
};

// Delete a default slot
exports.deleteDefaultSlot = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM slots WHERE id = ?", [id]);
        res.json({ message: "Default slot deleted successfully" });
    } catch (error) {
        console.error("Failed to delete default slot:", error);
        res.status(500).json({ message: "Failed to delete default slot", error });
    }
};

// Inactive a default slot
exports.activeDefaultSlot = async (req, res) => {
    const { id } = req.params;
    const { active } = req.body;

    try {
        await db.query("UPDATE slots SET status = ? WHERE id = ?", [active, id]);
        res.json({ message: "Default slot updated successfully" }); // Update the response message
    } catch (error) {
        console.error("Failed to update default slot:", error);
        res.status(500).json({ message: "Failed to update default slot", error });
    }
};

// Add a slot for a specific date
exports.addSpecificSlot = async (req, res) => {
    const { date, time_slot } = req.body;
    try {
        await db.query("INSERT INTO appointments (date, slot_id) VALUES (?, (SELECT id FROM slots WHERE time_slot = ?))", [date, time_slot]);
        res.json({ message: "Specific slot added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add specific slot", error });
    }
};

// Delete a slot for a specific date
exports.deleteSpecificSlot = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM appointments WHERE id = ?", [id]);
        res.json({ message: "Specific slot deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete specific slot", error });
    }
};



const sendEmail = require("../utils/emailService");

// ✅ Get all appointments with filters
exports.getAllAppointments = async (req, res) => {
    try {
        const { status, email, name, date } = req.query;

        let query = `
            SELECT a.id, a.date, a.status, s.time_slot, u.name, u.email
            FROM appointments a
            JOIN slots s ON a.slot_id = s.id
            JOIN users u ON a.user_id = u.id
        `;

        const conditions = [];
        const params = [];

        // Filter by status
        if (status && status !== "All") {
            conditions.push("a.status = ?");
            params.push(status);
        }

        // Filter by email
        if (email) {
            conditions.push("u.email LIKE ?");
            params.push(`%${email}%`);
        }

        // Filter by name
        if (name) {
            conditions.push("u.name LIKE ?");
            params.push(`%${name}%`);
        }

        // Filter by date
        if (date) {
            conditions.push("a.date = ?");
            params.push(date);
        }

        // Add conditions to the query
        if (conditions.length) {
            query += " WHERE " + conditions.join(" AND ");
        }

        const [appointments] = await db.execute(query, params);
        res.json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

// ✅ Cancel an appointment (Admin)
exports.cancelAppointmentAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute("UPDATE appointments SET status = ? WHERE id = ?", ["Canceled", id]);
        res.json({ message: "Appointment canceled successfully" });
    } catch (error) {
        console.error("Error canceling appointment:", error);
        res.status(500).json({ message: "Error canceling appointment" });
    }
};

// ✅ Update appointment status (Admin)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if the appointment is already canceled
        const [appointment] = await db.execute("SELECT status FROM appointments WHERE id = ?", [id]);
        if (appointment[0].status === "Canceled") {
            return res.status(400).json({ message: "Cannot update a canceled appointment" });
        }

        // Update status
        await db.execute("UPDATE appointments SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Appointment status updated successfully" });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: "Error updating appointment status" });
    }
};

// ✅ Book an appointment on behalf of a user (Admin)
exports.bookAppointmentAdmin = async (req, res) => {
    const { user_id, slot_id, date, email } = req.body;

    if (!user_id || !slot_id || !date || !email) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Check if the slot is already booked
        const [existing] = await db.query("SELECT * FROM appointments WHERE slot_id = ? AND date = ?", [slot_id, date]);
        if (existing.length) {
            return res.status(400).json({ message: "Slot already booked!" });
        }

        // Insert the appointment
        await db.query("INSERT INTO appointments (user_id, slot_id, date, status) VALUES (?, ?, ?, ?)", [
            user_id,
            slot_id,
            date,
            "Pending", // Default status
        ]);

        // Fetch the time slot for the email
        const [slot] = await db.query("SELECT time_slot FROM slots WHERE id = ?", [slot_id]);
        const timeSlot = slot[0]?.time_slot || "Unknown Time";

        // Send confirmation email
        const emailSubject = "Appointment Confirmation";
        const emailBody = `
            <p>Dear User,</p>
            <p>Your appointment has been successfully booked by the admin.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${timeSlot}</p>
            <p>Thank you for using our appointment booking system!</p>
            <p>Best Regards,<br/>Appointment System Team</p>
        `;

        await sendEmail(email, emailSubject, emailBody);

        res.json({ message: "Appointment booked successfully!" });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Error booking appointment" });
    }
};


// ✅ Get Booking Trend (Number of appointments per day)
exports.getBookingTrend = async (req, res) => {
    const { date } = req.query; // Optional filter by specific date

    try {
        let query = `
            SELECT DATE(a.date) AS date, COUNT(*) AS count
            FROM appointments a
            GROUP BY DATE(a.date)
            ORDER BY DATE(a.date)
        `;
        const params = [];

        // If a specific date filter is provided, add the filter
        if (date) {
            query = `
                SELECT DATE(a.date) AS date, COUNT(*) AS count
                FROM appointments a
                WHERE DATE(a.date) = ?
                GROUP BY DATE(a.date)
                ORDER BY DATE(a.date)
            `;
            params.push(date);
        }

        const [trends] = await db.query(query, params);
        res.json({ data: trends });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch booking trends", error });
    }
};
// ✅ Get Popular Time Slots
exports.getPopularTimeSlots = async (req, res) => {
    try {
        const query = `
            SELECT s.time_slot, COUNT(*) AS count
            FROM appointments a
            JOIN slots s ON a.slot_id = s.id
            GROUP BY s.time_slot
            ORDER BY count DESC
        `;

        const [slots] = await db.query(query);
        res.json({ data: slots });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular time slots", error });
    }
};


// Get user counts: total users, email verified, email not verified, new users (last 7 days)
exports.getUserCounts = async (req, res) => {
    try {
        // Query to get the total count of users
        const [totalUsers] = await db.query("SELECT COUNT(*) AS count FROM users");

        // Query to get the count of email verified users
        const [emailVerifiedUsers] = await db.query("SELECT COUNT(*) AS count FROM users WHERE email_verified = 1");

        // Query to get the count of email not verified users
        const [emailNotVerifiedUsers] = await db.query("SELECT COUNT(*) AS count FROM users WHERE email_verified = 0");

        // Query to get the count of users created in the last 7 days
        const [newUsers] = await db.query(`
            SELECT COUNT(*) AS count 
            FROM users 
            WHERE created_at >= NOW() - INTERVAL 7 DAY
        `);

        // Send response with all counts
        res.json({
            totalUsers: totalUsers[0].count,
            emailVerifiedUsers: emailVerifiedUsers[0].count,
            emailNotVerifiedUsers: emailNotVerifiedUsers[0].count,
            newUsers: newUsers[0].count
        });
    } catch (error) {
        console.error("Error fetching user counts:", error);
        res.status(500).json({ message: "Error fetching user counts", error });
    }
};


// Get appointment insights
exports.getAppointmentInsights = async (req, res) => {
    try {
        // Get total count of appointments
        const [totalAppointments] = await db.execute("SELECT COUNT(*) as total FROM appointments");

        // Get count of appointments with each status
        const [pendingAppointments] = await db.execute("SELECT COUNT(*) as pending FROM appointments WHERE status = 'Pending'");
        const [paidAppointments] = await db.execute("SELECT COUNT(*) as paid FROM appointments WHERE status = 'Paid'");
        const [canceledAppointments] = await db.execute("SELECT COUNT(*) as canceled FROM appointments WHERE status = 'Canceled'");
        const [completedAppointments] = await db.execute("SELECT COUNT(*) as completed FROM appointments WHERE status = 'Completed'");

        // Find upcoming appointments (for tomorrow)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDate = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        const [upcomingAppointments] = await db.execute(`
            SELECT COUNT(*) as upcoming FROM appointments
            WHERE date = ? AND status IN ('Pending', 'Paid')
        `, [tomorrowDate]);

        // Send response
        res.status(200).json({
            data: {
                totalAppointments: totalAppointments[0].total,
                pendingAppointments: pendingAppointments[0].pending,
                paidAppointments: paidAppointments[0].paid,
                canceledAppointments: canceledAppointments[0].canceled,
                completedAppointments: completedAppointments[0].completed,
                upcomingAppointments: upcomingAppointments[0].upcoming,
            }
        });
    } catch (error) {
        console.error("Error fetching appointment insights:", error);
        res.status(500).json({ message: "Failed to fetch appointment insights" });
    }
};
