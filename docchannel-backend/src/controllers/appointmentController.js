const db = require("../config/db");
const sendEmail = require("../utils/emailService");


// ✅ Fetch available slots for a given date
exports.getSlots = async (req, res) => {
    try {
        const { date } = req.body;
        console.log("Incoming request:", req.body);

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        // Fetch available slots (not already booked)
        const [slots] = await db.execute(
            `SELECT * FROM slots WHERE status = 1 AND id NOT IN 
            (SELECT slot_id FROM appointments WHERE date = ?)`,
            [date]
        );

        console.log("Available Slots:", slots);

        res.json({ slots }); // ✅ Send slots as an object
    } catch (error) {
        console.error("Error fetching slots:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Book an appointment
exports.bookAppointment = async (req, res) => {
    const { user_id, slot_id, date, email } = req.body;

    if (!user_id || !slot_id || !date || !email) {
        console.error("Missing required fields:", { user_id, slot_id, date, email });
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Check if the slot is already booked
        const [existing] = await db.query("SELECT * FROM appointments WHERE slot_id = ? AND date = ?", [slot_id, date]);
        if (existing.length) {
            return res.status(400).json({ message: "Slot already booked!" });
        }

        // Insert the appointment into the database
        await db.query("INSERT INTO appointments (user_id, slot_id, date, status) VALUES (?, ?, ?, ?)", [user_id, slot_id, date, 1]);

        // Fetch the time slot for the email
        const [slot] = await db.query("SELECT time_slot FROM slots WHERE id = ?", [slot_id, 1]);
        const timeSlot = slot[0]?.time_slot || "Unknown Time";

        // Fetch the user's name for the email
        const [user] = await db.query("SELECT name FROM users WHERE id = ?", [user_id]);
        const userName = user[0]?.name || "User";

        console.log("time slot selected", timeSlot);

        // Email content with name, date, and time slot
        const emailSubject = "Appointment Confirmation";
        const emailBody = `
            <p>Dear ${userName},</p>
            <p>Your appointment has been successfully booked.</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${timeSlot}</p>
            <p>Thank you for using our appointment booking system!</p>
            <p>Best Regards,<br/>BookingApp Team</p>
        `;

        // Send confirmation email
        const emailSent = await sendEmail(email, emailSubject, emailBody);

        if (!emailSent) {
            console.warn("Appointment booked, but email failed to send.");
        }

        res.json({ message: "Appointment booked successfully!" });

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Error booking appointment" });
    }
};


// ✅ Get appointments for a user
exports.getAppointments = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ message: "User ID is required" });

        const [appointments] = await db.execute(
            `SELECT a.id, a.date, a.status, s.time_slot
             FROM appointments a
             JOIN slots s ON a.slot_id = s.id
             WHERE a.user_id = ?`,
            [user_id]
        );

        res.json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments" });
    }
};

// ✅ Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Step 1: Get the appointment details and user email
        const [appointment] = await db.query("SELECT * FROM appointments WHERE id = ?", [id]);
        if (!appointment.length) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const appointmentDetails = appointment[0];
        const { user_id, date, slot_id } = appointmentDetails;

        // Fetch the user email from the database (assuming you have a users table)
        const [user] = await db.query("SELECT email FROM users WHERE id = ?", [user_id]);
        const userEmail = user[0]?.email;

        if (!userEmail) {
            return res.status(400).json({ message: "User email not found" });
        }

        // Step 2: Update the appointment status to canceled (status = 4)
        await db.execute("UPDATE appointments SET status = ? WHERE id = ?", [4, id]);

        // Fetch the time slot for the email
        const [slot] = await db.query("SELECT time_slot FROM slots WHERE id = ?", [slot_id]);
        const timeSlot = slot[0]?.time_slot || "Unknown Time";
        const [username] = await db.query("SELECT name FROM users WHERE id = ?", [user_id]);
        const userName = username[0]?.name || "User";

        // Step 3: Prepare the email content
        const emailSubject = "Appointment Cancellation Confirmation";
        const emailBody = `
            <p>Dear ${userName},</p>
            <p>Your appointment scheduled for <strong>${date}</strong> at <strong>${timeSlot}</strong> has been successfully canceled.</p>
            <p>If you need further assistance, feel free to contact us.</p>
            <p>Best Regards,<br/>BookingApp Team</p>
        `;

        // Step 4: Send cancellation email
        const emailSent = await sendEmail(userEmail, emailSubject, emailBody);

        if (!emailSent) {
            console.warn("Appointment canceled, but email failed to send.");
        }

        // Step 5: Send response to client
        res.json({ message: "Appointment canceled successfully, and email notification sent." });
    } catch (error) {
        console.error("Error canceling appointment:", error);
        res.status(500).json({ message: "Error canceling appointment" });
    }
};

