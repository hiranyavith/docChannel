const db = require("../config/db");

class Slot {
    static async getAll() {
        const [rows] = await db.execute("SELECT * FROM slots WHERE is_booked = FALSE");
        return rows;
    }

    static async bookSlot(slotId) {
        await db.execute("UPDATE slots SET is_booked = TRUE WHERE id = ?", [slotId]);
    }

    static async getAllAvailable(date) {
        const [rows] = await db.execute(
            "SELECT * FROM slots WHERE date = ? AND is_booked = 0 ORDER BY start_time",
            [date]
        );
        return rows;
    }

    static async create(date, start_time, end_time) {
        return db.execute(
            "INSERT INTO slots (date, start_time, end_time, is_booked) VALUES (?, ?, ?, 0)",
            [date, start_time, end_time]
        );
    }

    static async delete(slotId) {
        return db.execute("DELETE FROM slots WHERE id = ?", [slotId]);
    }
}

module.exports = Slot;
