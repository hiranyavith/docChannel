const db = require("../config/db");

class Appointment {
    static async book(userId, slotId) {
        const query = "INSERT INTO appointments (user_id, slot_id) VALUES (?, ?)";
        return db.execute(query, [userId, slotId]);
    }

    static async getUserAppointments(userId) {
        const query = `
      SELECT a.id, s.date, s.time 
      FROM appointments a
      JOIN slots s ON a.slot_id = s.id
      WHERE a.user_id = ?
    `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    }

    static async cancel(appointmentId, userId) {
        const query = "DELETE FROM appointments WHERE id = ? AND user_id = ?";
        return db.execute(query, [appointmentId, userId]);
    }

    static async getAllWithUserDetails() {
        const query = `
      SELECT a.id, u.full_name, u.email, s.date, s.time
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN slots s ON a.slot_id = s.id
      ORDER BY s.date ASC, s.time ASC
    `;
        const [rows] = await db.execute(query);
        return rows;
    }
}

module.exports = Appointment;
