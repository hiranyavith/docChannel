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

  static async getStats() {
    const [totalUsers] = await db.query("SELECT COUNT(*) as count FROM users");
    const [activeUsers] = await db.query(
      'SELECT COUNT(*) as count FROM users u JOIN status sts ON u.status_status_id = sts.status_id WHERE sts.status_type = "Active"',
    );
    const [verifiedUsers] = await db.query(
      "SELECT COUNT(*) as count FROM users u WHERE u.isVerified = 1",
    );
    const [roleStats] = await db.query(
      "SELECT rl.role_type, COUNT(*) as count FROM users u JOIN role rl ON u.role_role_id = rl.role_id GROUP BY role_role_id",
    );

    return {
      totalUsers: totalUsers[0].count,
      activeUsers: activeUsers[0].count,
      inactiveUsers: totalUsers[0].count - activeUsers[0].count,
      verifiedUsers: verifiedUsers[0].count,
      unverifiedUsers: totalUsers[0].count - verifiedUsers[0].count,
      roleBreakdown: roleStats.reduce((acc, curr) => {
        acc[curr.role_type] = curr.count;
        return acc;
      }, {}),
    };
  }

  static async findAll(filters = {}) {
   let query = `SELECT u.user_id AS id,u.f_name AS first_name,u.s_name,u.l_name AS last_name,u.email AS email,rl.role_type AS role,u.mobile AS mobile_number,u.nic_no AS nic_no,u.isVerified,DATE_FORMAT(u.created_At, "%Y-%m-%d") AS joined,CONCAT(LEFT(u.f_name,1), LEFT(u.l_name,1)) AS avatar,st.status_type AS Status_Type  FROM users u JOIN role rl ON u.role_role_id = rl.role_id JOIN status st ON u.status_status_id = st.status_id WHERE 1=1 `;
    const params = [];
  
    if (filters.search) {
      query += ` AND (u.f_name LIKE ? OR u.l_name LIKE ? OR u.email LIKE ?) ORDER BY u.created_At ASC`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
  
    if (filters.role && filters.role !== "All") {
      query += ` AND rl.role_type = ? ORDER BY u.created_At ASC `;
      params.push(filters.role);
    }
  
    if (filters.Status_Type && filters.Status_Type !== "All") {
      query += ` AND u.status_status_id = (SELECT status_id FROM status WHERE status_type = ?) ORDER BY u.created_At ASC`;
      params.push(filters.Status_Type);
    }
  
    const [rows] = await db.execute(query, params);
    return rows;
  }
}

module.exports = User;
