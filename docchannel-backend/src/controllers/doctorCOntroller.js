const db = require("../config/db");

exports.searchDoctors = async (req, res) => {
  try {
    const { doctorName, specialization, date } = req.query;
    let query = `
    SELECT 
  d.doctor_id,
  d.specialNote,
  d.specialization_specialization_id,
  spec.speciality_type,
  u.initial_with_name,
  u.f_name,
  u.l_name,
  ds.scheduler_id,
  dshdow.starting_time,
  dshdow.end_time,
  dow.days_of_week_name,
  dshdow.appointmentDate,
  ds.max_patients,
  ds.isAvailable,
  (ds.max_patients - COALESCE(COUNT(a.appointment_id), 0)) AS slots_available
FROM doctor d


LEFT JOIN doctor_scheduler ds 
  ON d.doctor_id = ds.doctor_doctor_id

LEFT JOIN doctor_scheduler_has_days_of_week dshdow 
  ON ds.scheduler_id = dshdow.doctor_scheduler_scheduler_id

LEFT JOIN days_of_week dow 
  ON dshdow.days_of_week_days_of_week_id = dow.days_of_week_id


LEFT JOIN users u 
  ON d.users_user_id = u.user_id

LEFT JOIN specialization spec 
  ON d.specialization_specialization_id = spec.specialization_id      

LEFT JOIN appointment a 
  ON ds.scheduler_id = a.doctor_scheduler_scheduler_id
  AND a.schedule_status_schedule_status_id != 0

WHERE d.isActive = 1
    `;

    const params = [];

    if (doctorName) {
      query += ` AND (u.initial_with_name LIKE ? OR u.f_name LIKE ? OR u.l_name LIKE ?)`;
      params.push(`%${doctorName}%`, `%${doctorName}%`, `%${doctorName}%`);
    }

    if (specialization) {
      query += ` AND d.specialization_specialization_id = ?`;
      params.push(specialization);
    }

    if (date) {
      query += ` AND dshdow.appointmentDate = ?`;
      params.push(date);
    } else {
      query += ` AND dshdow.appointmentDate >= CURDATE()`;
    }

    query += ` GROUP BY d.doctor_id, ds.scheduler_id
      ORDER BY dshdow.appointmentDate, dshdow.starting_time`;

    const [doctors] = await db.execute(query, params);

    const doctorsMap = {};
    doctors.forEach((row) => {
      if (!doctorsMap[row.doctor_id]) {
        doctorsMap[row.doctor_id] = {
          doctor_id: row.doctor_id,
          doctor_full_name: row.initial_with_name,
          doctor_first_name: row.f_name,
          doctor_last_name: row.l_name,
          specialization: row.speciality_type,
          special_note: row.specialNote,
          schedules: [],
        };
      }

      if (row.scheduler_id && row.appointmentDate) {
        doctorsMap[row.doctor_id].schedules.push({
          schedule_id: row.scheduler_id,
          available_date: row.appointmentDate,
          start_time: row.starting_time,
          end_time: row.end_time,
          slots_available: row.slots_available,
          max_appointments: row.max_patients,
        });
      }
    });
    const result = Object.values(doctorsMap);

    res.json({
      success: true,
      count: result.length,
      doctors: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to search doctors" });
  }
};

exports.getSpecializations = async (req, res) => {
  try {
    const [specialization] = await db.execute(
      `SELECT * FROM specialization ORDER BY specialization_id`,
    );

    res.json({
      success: true,
      specialization: specialization.map((s) => s.speciality_type),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch specializations" });
  }
};
