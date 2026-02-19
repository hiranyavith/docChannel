const db = require("../config/db");

class Doctor {
  static async findAll(filters = {}) {
    let query = `
    SELECT 
      u.user_id       AS id,
      CONCAT(u.f_name, ' ', u.l_name) AS name,
      u.f_name        AS first_name,
      u.l_name        AS last_name,
      u.email         AS email,
      u.mobile        AS phone,
      spec.speciality_type AS specialty,
      d.years_in_experience    AS experience,
      d.isActive AS availability,
      d.slmc_number     AS slmc_number,
      d.specialNote     AS Note,
      st.status_type  AS status,
      DATE_FORMAT(u.created_At, "%Y-%m-%d") AS joined,
      CONCAT(LEFT(u.f_name,1), LEFT(u.l_name,1)) AS avatar
    FROM users u
    JOIN role r        ON u.role_role_id = r.role_id
    JOIN doctor d     ON u.user_id = d.users_user_id
    JOIN specialization spec ON d.specialization_specialization_id = spec.specialization_id
    JOIN status st     ON u.status_status_id = st.status_id
    WHERE r.role_type = 'Doctor'
    `;

    const params = [];

    if (filters.search && filters.search.trim()) {
      query += ` AND (
  u.f_name LIKE ? 
  OR u.l_name LIKE ? 
  OR u.email LIKE ?
  OR spec.speciality_type LIKE ?
)`;
      const term = `%${filters.search}%`;
      params.push(term, term, term, term);
    }

    if (filters.specialty && filters.specialty !== "All") {
      query += ` AND spec.speciality_type = ?`;
      params.push(filters.specialty);
    }

    query += ` ORDER BY u.created_At DESC`;

    const [rows] = await db.execute(query, params);
    return rows;
  }
}

module.exports = Doctor;
