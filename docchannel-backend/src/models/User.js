const db = require("../config/db");

class User {
  static async create(
    name,
    email,
    hashedPassword,
    profilePicture,
    address,
    telephone,
    role = "user",
  ) {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, profile_picture, address, telephone, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, profilePicture, address, telephone, role],
    );
    return result;
  }
  static async findByEmail(email) {
    const [rows] = await db.execute(
      "SELECT id, name, email, password, role, email_verified,active FROM users WHERE email = ?",
      [email],
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async updateProfile(userId, name, profilePicture, address, telephone) {
    await db.execute(
      "UPDATE users SET name = ?, profile_picture = ?, address = ?, telephone = ? WHERE id = ?",
      [name, profilePicture, address, telephone, userId],
    );
  }

  static async findById(userId) {
    const [rows] = await db.execute(`SELECT * FROM users WHERE user_id = ?`, [
      userId,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByIdAndUpdate(userId, profileData) {
    const connection = await db.getConnection();
    try {
      const {
        firstName,
        lastName,
        mobile,
        nicNo,
        address,
        city,
        district,
        province,
        gender,
        dob,
      } = profileData;

      await db.execute(
        `UPDATE users SET f_name = ?, l_name = ?, mobile = ?, nic_no = ?,isProfileComplete=1, update_At=NOW()  WHERE user_id = ?`,
        [firstName, lastName, mobile, nicNo, userId],
      );

      const [addressResult] = await db.execute(
        `INSERT INTO user_address (address,city_city_id,district_district_id,province_province_id)
        VALUES(?,?,?,?)`,
        [address, city, district, province],
      );

      const addressId = addressResult.insertId;

      await db.execute(`UPDATE users SET user_address_id = ? WHERE user_id=?`, [
        addressId,
        userId,
      ]);

      await db.execute(
        `INSERT INTO patients (nic_number,date_of_birth,users_user_id,gender_gender_id) VALUES (?,?,?,?)`,
        [nicNo, dob, userId, gender],
      );
      await connection.commit();
      return await this.findById(userId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  static async findPatientIdFromUserId(userId) {
    const [rows] = await db.execute(
      `SELECT pts.patient_id FROM patients pts WHERE users_user_id = ?`,
      [userId],
    );
    return rows.length > 0 ? rows[0].patient_id : null;
  }
}

module.exports = User;
