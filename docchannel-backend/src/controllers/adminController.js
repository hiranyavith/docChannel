const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
// const { stat } = require("original-fs");

// // Get all users
// exports.getAllUsers = async (req, res) => {
//     try {
//         const [users] = await db.query("SELECT id, name, email, role,email_verified, active FROM users");
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

// // Add a user
// exports.addUser = async (req, res) => {
//     const { name, email, password, role } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     try {
//         await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role]);
//         res.json({ message: "User added successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add user", error });
//     }
// };

// // Edit a user
// exports.editUser = async (req, res) => {
//     const { id } = req.params;
//     const { name, email, role } = req.body;
//     try {
//         await db.query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id]);
//         res.json({ message: "User updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to update user", error });
//     }
// };

// // Controller for updating user active status
// exports.updateUserStatus = (req, res) => {
//     const { id } = req.params;
//     const { activeStatus } = req.body;

//     if (activeStatus !== 0 && activeStatus !== 1) {
//         return res.status(400).json({ message: "Invalid active status. Use 1 for active and 0 for inactive." });
//     }

//     const query = 'UPDATE users SET active = ? WHERE id = ?';
//     db.query(query, [activeStatus, id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: "Database error", error: err });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         return res.status(200).json({ message: "User status updated successfully" });
//     });
// };

// // Change user role
// exports.changeUserRole = async (req, res) => {
//     const { id } = req.params;
//     const { role } = req.body;
//     try {
//         await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
//         res.json({ message: "User role updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to update role", error });
//     }
// };

// // src/controllers/adminController.js

// // Update user active status
// exports.updateUserActiveStatus = async (req, res) => {
//     const { id } = req.params;
//     const { active } = req.body;
//     try {
//         await db.query("UPDATE users SET active = ? WHERE id = ?", [active, id]);
//         res.json({ message: "User active status updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to update user active status", error });
//     }
// };

// // Get all default slots
// exports.getDefaultSlots = async (req, res) => {
//     try {
//         const [slots] = await db.query("SELECT * FROM slots");
//         res.json(slots);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

// // Add a default slot
// exports.addDefaultSlot = async (req, res) => {
//     const { time_slot } = req.body;
//     try {
//         await db.query("INSERT INTO slots (time_slot) VALUES (?)", [time_slot]);
//         res.json({ message: "Default slot added successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add default slot", error });
//     }
// };

// // Delete a default slot
// exports.deleteDefaultSlot = async (req, res) => {
//     const { id } = req.params;
//     try {
//         await db.query("DELETE FROM slots WHERE id = ?", [id]);
//         res.json({ message: "Default slot deleted successfully" });
//     } catch (error) {
//         console.error("Failed to delete default slot:", error);
//         res.status(500).json({ message: "Failed to delete default slot", error });
//     }
// };

// // Inactive a default slot
// exports.activeDefaultSlot = async (req, res) => {
//     const { id } = req.params;
//     const { active } = req.body;

//     try {
//         await db.query("UPDATE slots SET status = ? WHERE id = ?", [active, id]);
//         res.json({ message: "Default slot updated successfully" }); // Update the response message
//     } catch (error) {
//         console.error("Failed to update default slot:", error);
//         res.status(500).json({ message: "Failed to update default slot", error });
//     }
// };

// // Add a slot for a specific date
// exports.addSpecificSlot = async (req, res) => {
//     const { date, time_slot } = req.body;
//     try {
//         await db.query("INSERT INTO appointments (date, slot_id) VALUES (?, (SELECT id FROM slots WHERE time_slot = ?))", [date, time_slot]);
//         res.json({ message: "Specific slot added successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to add specific slot", error });
//     }
// };

// // Delete a slot for a specific date
// exports.deleteSpecificSlot = async (req, res) => {
//     const { id } = req.params;
//     try {
//         await db.query("DELETE FROM appointments WHERE id = ?", [id]);
//         res.json({ message: "Specific slot deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to delete specific slot", error });
//     }
// };

// const sendEmail = require("../utils/emailService");

// // ✅ Get all appointments with filters
// exports.getAllAppointments = async (req, res) => {
//     try {
//         const { status, email, name, date } = req.query;

//         let query = `
//             SELECT a.id, a.date, a.status, s.time_slot, u.name, u.email
//             FROM appointments a
//             JOIN slots s ON a.slot_id = s.id
//             JOIN users u ON a.user_id = u.id
//         `;

//         const conditions = [];
//         const params = [];

//         // Filter by status
//         if (status && status !== "All") {
//             conditions.push("a.status = ?");
//             params.push(status);
//         }

//         // Filter by email
//         if (email) {
//             conditions.push("u.email LIKE ?");
//             params.push(`%${email}%`);
//         }

//         // Filter by name
//         if (name) {
//             conditions.push("u.name LIKE ?");
//             params.push(`%${name}%`);
//         }

//         // Filter by date
//         if (date) {
//             conditions.push("a.date = ?");
//             params.push(date);
//         }

//         // Add conditions to the query
//         if (conditions.length) {
//             query += " WHERE " + conditions.join(" AND ");
//         }

//         const [appointments] = await db.execute(query, params);
//         res.json({ appointments });
//     } catch (error) {
//         console.error("Error fetching appointments:", error);
//         res.status(500).json({ message: "Error fetching appointments" });
//     }
// };

// // ✅ Cancel an appointment (Admin)
// exports.cancelAppointmentAdmin = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.execute("UPDATE appointments SET status = ? WHERE id = ?", ["Canceled", id]);
//         res.json({ message: "Appointment canceled successfully" });
//     } catch (error) {
//         console.error("Error canceling appointment:", error);
//         res.status(500).json({ message: "Error canceling appointment" });
//     }
// };

// // ✅ Update appointment status (Admin)
// exports.updateAppointmentStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         // Check if the appointment is already canceled
//         const [appointment] = await db.execute("SELECT status FROM appointments WHERE id = ?", [id]);
//         if (appointment[0].status === "Canceled") {
//             return res.status(400).json({ message: "Cannot update a canceled appointment" });
//         }

//         // Update status
//         await db.execute("UPDATE appointments SET status = ? WHERE id = ?", [status, id]);
//         res.json({ message: "Appointment status updated successfully" });
//     } catch (error) {
//         console.error("Error updating appointment status:", error);
//         res.status(500).json({ message: "Error updating appointment status" });
//     }
// };

// // ✅ Book an appointment on behalf of a user (Admin)
// exports.bookAppointmentAdmin = async (req, res) => {
//     const { user_id, slot_id, date, email } = req.body;

//     if (!user_id || !slot_id || !date || !email) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }

//     try {
//         // Check if the slot is already booked
//         const [existing] = await db.query("SELECT * FROM appointments WHERE slot_id = ? AND date = ?", [slot_id, date]);
//         if (existing.length) {
//             return res.status(400).json({ message: "Slot already booked!" });
//         }

//         // Insert the appointment
//         await db.query("INSERT INTO appointments (user_id, slot_id, date, status) VALUES (?, ?, ?, ?)", [
//             user_id,
//             slot_id,
//             date,
//             "Pending", // Default status
//         ]);

//         // Fetch the time slot for the email
//         const [slot] = await db.query("SELECT time_slot FROM slots WHERE id = ?", [slot_id]);
//         const timeSlot = slot[0]?.time_slot || "Unknown Time";

//         // Send confirmation email
//         const emailSubject = "Appointment Confirmation";
//         const emailBody = `
//             <p>Dear User,</p>
//             <p>Your appointment has been successfully booked by the admin.</p>
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>Time:</strong> ${timeSlot}</p>
//             <p>Thank you for using our appointment booking system!</p>
//             <p>Best Regards,<br/>Appointment System Team</p>
//         `;

//         await sendEmail(email, emailSubject, emailBody);

//         res.json({ message: "Appointment booked successfully!" });
//     } catch (error) {
//         console.error("Error booking appointment:", error);
//         res.status(500).json({ message: "Error booking appointment" });
//     }
// };

// // ✅ Get Booking Trend (Number of appointments per day)
// exports.getBookingTrend = async (req, res) => {
//     const { date } = req.query; // Optional filter by specific date

//     try {
//         let query = `
//             SELECT DATE(a.date) AS date, COUNT(*) AS count
//             FROM appointments a
//             GROUP BY DATE(a.date)
//             ORDER BY DATE(a.date)
//         `;
//         const params = [];

//         // If a specific date filter is provided, add the filter
//         if (date) {
//             query = `
//                 SELECT DATE(a.date) AS date, COUNT(*) AS count
//                 FROM appointments a
//                 WHERE DATE(a.date) = ?
//                 GROUP BY DATE(a.date)
//                 ORDER BY DATE(a.date)
//             `;
//             params.push(date);
//         }

//         const [trends] = await db.query(query, params);
//         res.json({ data: trends });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch booking trends", error });
//     }
// };
// // ✅ Get Popular Time Slots
// exports.getPopularTimeSlots = async (req, res) => {
//     try {
//         const query = `
//             SELECT s.time_slot, COUNT(*) AS count
//             FROM appointments a
//             JOIN slots s ON a.slot_id = s.id
//             GROUP BY s.time_slot
//             ORDER BY count DESC
//         `;

//         const [slots] = await db.query(query);
//         res.json({ data: slots });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to fetch popular time slots", error });
//     }
// };

// // Get user counts: total users, email verified, email not verified, new users (last 7 days)
// exports.getUserCounts = async (req, res) => {
//     try {
//         // Query to get the total count of users
//         const [totalUsers] = await db.query("SELECT COUNT(*) AS count FROM users");

//         // Query to get the count of email verified users
//         const [emailVerifiedUsers] = await db.query("SELECT COUNT(*) AS count FROM users WHERE email_verified = 1");

//         // Query to get the count of email not verified users
//         const [emailNotVerifiedUsers] = await db.query("SELECT COUNT(*) AS count FROM users WHERE email_verified = 0");

//         // Query to get the count of users created in the last 7 days
//         const [newUsers] = await db.query(`
//             SELECT COUNT(*) AS count
//             FROM users
//             WHERE created_at >= NOW() - INTERVAL 7 DAY
//         `);

//         // Send response with all counts
//         res.json({
//             totalUsers: totalUsers[0].count,
//             emailVerifiedUsers: emailVerifiedUsers[0].count,
//             emailNotVerifiedUsers: emailNotVerifiedUsers[0].count,
//             newUsers: newUsers[0].count
//         });
//     } catch (error) {
//         console.error("Error fetching user counts:", error);
//         res.status(500).json({ message: "Error fetching user counts", error });
//     }
// };

// // Get appointment insights
// exports.getAppointmentInsights = async (req, res) => {
//     try {
//         // Get total count of appointments
//         const [totalAppointments] = await db.execute("SELECT COUNT(*) as total FROM appointments");

//         // Get count of appointments with each status
//         const [pendingAppointments] = await db.execute("SELECT COUNT(*) as pending FROM appointments WHERE status = 'Pending'");
//         const [paidAppointments] = await db.execute("SELECT COUNT(*) as paid FROM appointments WHERE status = 'Paid'");
//         const [canceledAppointments] = await db.execute("SELECT COUNT(*) as canceled FROM appointments WHERE status = 'Canceled'");
//         const [completedAppointments] = await db.execute("SELECT COUNT(*) as completed FROM appointments WHERE status = 'Completed'");

//         // Find upcoming appointments (for tomorrow)
//         const tomorrow = new Date();
//         tomorrow.setDate(tomorrow.getDate() + 1);
//         const tomorrowDate = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD

//         const [upcomingAppointments] = await db.execute(`
//             SELECT COUNT(*) as upcoming FROM appointments
//             WHERE date = ? AND status IN ('Pending', 'Paid')
//         `, [tomorrowDate]);

//         // Send response
//         res.status(200).json({
//             data: {
//                 totalAppointments: totalAppointments[0].total,
//                 pendingAppointments: pendingAppointments[0].pending,
//                 paidAppointments: paidAppointments[0].paid,
//                 canceledAppointments: canceledAppointments[0].canceled,
//                 completedAppointments: completedAppointments[0].completed,
//                 upcomingAppointments: upcomingAppointments[0].upcoming,
//             }
//         });
//     } catch (error) {
//         console.error("Error fetching appointment insights:", error);
//         res.status(500).json({ message: "Failed to fetch appointment insights" });
//     }
// };

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const [admins] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND password = ? AND role_role_id = 3",
      [email, password],
    );
    if (admins.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = admins[0];
    const token = generateToken(admin.user_id);
    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.user_id,
        email: admin.email,
        role: admin.role_role_id,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

exports.GetStatics = async (req, res) => {
  try {
    const [statsResults] = await db.execute(`SELECT 
(
    SELECT COUNT(*) 
    FROM users u
    WHERE MONTH(u.created_At) = MONTH(CURRENT_DATE())
    AND YEAR(u.created_At) = YEAR(CURRENT_DATE())
) AS userCount,

(
    SELECT COUNT(*) 
    FROM appointment a
    WHERE MONTH(a.created_At) = MONTH(CURRENT_DATE())
    AND YEAR(a.created_At) = YEAR(CURRENT_DATE())
) AS appointmentCount`);

    res.json({
      success: true,
      data: statsResults[0],
    });
  } catch (error) {
    console.error("Error fetching static data:", error);
    res.status(500).json({ message: "Failed to retrieve static data" });
  }
};

exports.getRecentAppointments = async (req, res) => {
  try {
    const [appointments] =
      await db.execute(`SELECT a.appointment_id,a.orderId, a.updateAt,a.created_At,a.payment_status, a.appointmnetStatus, u.f_name, u.l_name,du.f_name AS doctor_fname,du.l_name AS doctorlname,
 u.email
FROM appointment a
JOIN patients p ON a.patients_patient_id = p.patient_id
JOIN users u ON p.users_user_id = u.user_id
JOIN doctor d ON a.doctor_doctor_id = d.doctor_id
JOIN users du ON d.users_user_id = du.user_id
ORDER BY a.created_At DESC
LIMIT 5`);
    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching recent appointments:", error);
    res.status(500).json({ message: "Failed to retrieve recent appointments" });
  }
};

exports.getUserStatics = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;

    const users = await User.findAll({ search, role, status });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      s_name,
      last_name,
      email,
      role,
      mobile_number,
      nic_no,
      isVerified,
      Status_Type,
    } = req.body;

    await db.execute(
      `
      UPDATE users u 
      JOIN role r ON r.role_type = ?
      JOIN status st ON st.status_type = ?
SET 
u.f_name = ?, 
u.l_name = ?, 
u.s_name = ?, 
u.email = ? , 
u.role_role_id = r.role_id, 
u.status_status_id = st.status_id,
u.mobile = ?, 
u.nic_no = ?,
u.isVerified = ?,
u.update_At = NOW()
WHERE u.user_id = ?
      `,
      [
        role ?? null,
        Status_Type ?? null,
        first_name ?? null,
        last_name ?? null,
        s_name ?? null,
        email ?? null,
        mobile_number ?? null,
        nic_no ?? null,
        isVerified ? 1 : 0,
        id,
      ],
    );

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

exports.getDoctorStatics = async (req, res) => {
  try {
    const [[stats]] = await db.execute(`
      SELECT
        COUNT(*)                                          AS totalDoctors,
        SUM(CASE WHEN u.status_status_id = 
            (SELECT status_id FROM status WHERE status_type = 'Active') 
            THEN 1 ELSE 0 END)                           AS activeDoctors,
            SUM(CASE WHEN u.status_status_id = 
            (SELECT status_id FROM status WHERE status_type = 'Inactive') 
            THEN 1 ELSE 0 END)                           AS inactiveDoctors,
        COUNT(DISTINCT d.specialization_specialization_id)                 AS totalSpecialties
      FROM users u
      JOIN role r ON u.role_role_id = r.role_id
      JOIN doctor d ON u.user_id = d.users_user_id
      WHERE r.role_type = 'Doctor'
      `);
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching doctor statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor statistics",
      error: error.message,
    });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const { search, specialty, status } = req.query;
    const doctors = await Doctor.findAll({ search, specialty, status });
    res.json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctor list:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctor list",
      error: error.message,
    });
  }
};

exports.getDoctorSpecializations = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT specialization_id AS id, speciality_type AS name FROM specialization ORDER BY specialization_id ASC",
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching specializations",
      error: error.message,
    });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT status_id AS id, status_type AS name FROM status ORDER BY status_id ASC",
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Happend when fetch status",
      error: err.message,
    });
  }
};

exports.getProvice = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT province_id AS id, province_name AS name FROM province ORDER BY province_id ASC",
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Happend when fetch province",
      error: err.message,
    });
  }
};

exports.getDistrict = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT district_id AS id, district_name AS name FROM district ORDER BY district_id ASC",
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Happend when fetch district",
      error: err.message,
    });
  }
};

exports.getCity = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT city_id AS id, city_name AS name FROM city ORDER BY city_id ASC",
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Happend when fetch city",
      error: err.message,
    });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      email,
      phone,
      nic,
      address,
      province_name,
      district_name,
      city_name,
      experience,
      slmc_number,
      Fee,
      Note,
      status = "Active",
      availability = 1,
      patients = 0,
      rating = 5.0,
    } = req.body;

    if (!name || !email || !phone || !experience) {
      return res.status(400).json({
        message: "Name, email, phone and experience are required",
      });
    }

    const [existingUser] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const { firstName, middleName, lastName } = splitName(name);

    const [spec_row] = await db.execute(
      "SELECT specialization_id FROM specialization WHERE speciality_type = ?",
      [specialty],
    );

    const spec = spec_row[0];

    if (!spec) throw new Error(`Specialization "${specialty}" not found`);

    const [stat_row] = await db.execute(
      "SELECT status_id FROM status WHERE status_type = ?",
      [status],
    );

    const stat = stat_row[0];

    if (!stat) throw new Error(`Status "${status}" not found`);

    const [prov_row] = await db.execute(
      "SELECT province_id FROM province WHERE province_name = ?",
      [province_name],
    );

    const prov = prov_row[0];

    if (!prov) throw new Error(`Province "${province_name}" not found`);

    const [dist_row] = await db.execute(
      "SELECT district_id FROM district WHERE district_name = ?",
      [district_name],
    );

    const dist = dist_row[0];

    if (!dist) throw new Error(`District "${district_name}" not found`);

    const [city_row] = await db.execute(
      "SELECT city_id FROM city WHERE city_name = ?",
      [city_name],
    );

    const city = city_row[0];

    if (!city) throw new Error(`City "${city_name}" not found`);

    // await db.beginTransaction();

    const [addeResult] = await db.execute(
      "INSERT INTO user_address (address,city_city_id,district_district_id,province_province_id) VALUES (?,?,?,?)",
      [address, city.city_id, dist.district_id, prov.province_id],
    );

    const address_id = addeResult.insertId;

    const [userResult] = await db.execute(
      "INSERT INTO users (initial_with_name,f_name,s_name,l_name,email,mobile,nic_no,created_At,role_role_id,status_status_id,user_address_id) VALUES (?,?,?,?,?,?,?,NOW(),2,?,?)",
      [
        name,
        firstName,
        middleName,
        lastName,
        email,
        phone,
        nic,
        stat.status_id,
        address_id,
      ],
    );

    const userId = userResult.insertId;

    const [doctorResult] = await db.execute(
      "INSERT INTO doctor (slmc_number, consultation_fee, years_in_experience, specialization_specialization_id, users_user_id, isActive, specialNote) VALUES (?,?,?,?,?,?,?)",
      [slmc_number, Fee, experience, spec.specialization_id, userId, 1, Note],
    );

    // await db.commit();
    res.status(201).json({
      message: "Doctor added successfully",
      id: doctorResult.insertId,
    });
  } catch (err) {
    // await db.rollback();
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to add doctor" });
  }
};

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);

  let firstName = null;
  let middleName = null;
  let lastName = null;

  if (parts.length === 1) {
    firstName = parts[0];
  } else if (parts.length === 2) {
    firstName = parts[0];
    lastName = parts[1];
  } else if (parts.length === 3) {
    firstName = parts[0];
    middleName = parts[1];
    lastName = parts[2];
  } else if (parts.length > 3) {
    firstName = parts[0];
    middleName = parts[1];
    lastName = parts.slice(2).join(" ");
  }

  return { firstName, middleName, lastName };
}

exports.updatedoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      specialty,
      email,
      phone,
      nic,
      address,
      province_name,
      district_name,
      city_name,
      experience,
      slmc_number,
      Fee,
      Note,
      status,
      availability,
    } = req.body;

    const { firstName, middleName, lastName } = splitName(name);
    if (!name || !email || !phone || !experience) {
      return res.status(400).json({
        message: "Name, email, phone and experience are required items",
      });
    }

    const [doctorRows] = await db.execute(
      `SELECT u.user_id, u.user_address_id, d.doctor_id
       FROM users u
       JOIN doctor d ON d.users_user_id = u.user_id
       WHERE u.user_id = ?`,
      [id],
    );
    if (doctorRows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { user_address_id, doctor_id } = doctorRows[0];

    const [emailCheck] = await db.execute(
      "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
      [email, id],
    );
    if (emailCheck.length > 0) {
      return res
        .status(400)
        .json({ message: "Email already used by another user" });
    }

    const [spec_row] = await db.execute(
      "SELECT specialization_id FROM specialization WHERE speciality_type = ?",
      [specialty],
    );

    const spec = spec_row[0];

    if (!spec) throw new Error(`Specialization "${specialty}" not found`);

    const [stat_row] = await db.execute(
      "SELECT status_id FROM status WHERE status_type = ?",
      [status],
    );

    const stat = stat_row[0];

    if (!stat) throw new Error(`Status "${status}" not found`);

    const [prov_row] = await db.execute(
      "SELECT province_id FROM province WHERE province_name = ?",
      [province_name],
    );

    const prov = prov_row[0];

    if (!prov) throw new Error(`Province "${province_name}" not found`);

    const [dist_row] = await db.execute(
      "SELECT district_id FROM district WHERE district_name = ?",
      [district_name],
    );

    const dist = dist_row[0];

    if (!dist) throw new Error(`District "${district_name}" not found`);

    const [city_row] = await db.execute(
      "SELECT city_id FROM city WHERE city_name = ?",
      [city_name],
    );

    const city = city_row[0];

    if (!city) throw new Error(`City "${city_name}" not found`);

    let availableId = null;
    if (availability === "Available") {
      availableId = 1;
    } else if (availability === "Not Available") {
      availableId = 0;
    }

    await db.execute(
      `UPDATE user_address 
       SET address = ?, city_city_id = ?, district_district_id = ?, province_province_id = ?
       WHERE iduser_address = ?`,
      [
        address,
        city.city_id,
        dist.district_id,
        prov.province_id,
        user_address_id,
      ],
    );

    await db.execute(
      `UPDATE users 
       SET initial_with_name=?, f_name=?, s_name=?, l_name=?,mobile=?, nic_no=?, status_status_id=?,update_At=NOW()
       WHERE user_id = ?`,
      [name, firstName, middleName, lastName, phone, nic, stat.status_id, id],
    );

    await db.execute(
      `UPDATE doctor 
       SET slmc_number=?, consultation_fee=?, years_in_experience=?, 
           specialization_specialization_id=?, isActive=?, specialNote=?
       WHERE doctor_id = ?`,
      [
        slmc_number,
        Fee,
        experience,
        spec.specialization_id,
        availableId,
        Note,
        doctor_id,
      ],
    );
    res.json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to update doctor" });
  }
};

exports.GetAppointmentDoctor = async (req, res) => {
  try {
    const { search = "", available } = req.query;

    let sql = `
     SELECT 
  u.user_id              AS id,
  u.initial_with_name    AS name,
  s.speciality_type      AS specialty,
  d.isActive             AS available
FROM users u
JOIN doctor d        ON u.user_id = d.users_user_id
JOIN specialization s ON d.specialization_specialization_id = s.specialization_id
JOIN status st       ON u.status_status_id = st.status_id
WHERE 1=1
    `;
    let params = [];

    if (search) {
      sql +=
        " AND (u.initial_with_name LIKE ? OR u.f_name LIKE ? OR u.l_name LIKE ? OR s.speciality_type LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (available === "true") {
      sql += " AND d.isActive = 1";
    }

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to get doctors" });
  }
};

exports.GetAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        ds.scheduler_id,
        ds.max_patients,
        ds.doctor_doctor_id        AS doctor_id, 
        dshdow.appointmentDate,
        TIME_FORMAT(dshdow.starting_time, '%H:%i') AS start_time,
        TIME_FORMAT(dshdow.end_time, '%H:%i')      AS end_time,
        d.specialNote, 
        u.initial_with_name, 
        spec.speciality_type 
      FROM doctor_scheduler ds 
      INNER JOIN doctor_scheduler_has_days_of_week dshdow 
        ON ds.scheduler_id = dshdow.doctor_scheduler_scheduler_id
      INNER JOIN doctor d   ON ds.doctor_doctor_id = d.doctor_id
      INNER JOIN users u    ON d.users_user_id = u.user_id
      INNER JOIN specialization spec 
        ON d.specialization_specialization_id = spec.specialization_id
      ORDER BY dshdow.appointmentDate ASC, dshdow.starting_time ASC
    `); // ← ORDER BY is here, not appended after

    res.json({ appointments: rows });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || "Failed to get appointments" });
  }
};

// POST create appointment
exports.CreateAppointment = async (req, res) => {
  try {
    const { patient_count, doctorId, date, time, duration, notes } = req.body;

    // ── Validate ──────────────────────────────────────────────
    if (!patient_count || !doctorId || !date || !time) {
      return res.status(400).json({
        message: "patient_count, doctorId, date and time are required",
      });
    }
    if (patient_count < 1) {
      return res
        .status(400)
        .json({ message: "Patient count must be at least 1" });
    }

    // ── Check doctor exists ───────────────────────────────────
    const [docRows] = await db.execute(
      "SELECT doctor_id FROM doctor WHERE users_user_id = ?",
      [doctorId],
    );
    console.log("DOCTOR ROWS:", docRows);
    if (docRows.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const actualDoctorId = docRows[0].doctor_id;
    // ── Check time slot not already taken ─────────────────────
    const [conflict] = await db.execute(
      `SELECT scheduler_id FROM doctor_scheduler ds INNER JOIN doctor_scheduler_has_days_of_week dshdow ON ds.scheduler_id = dshdow.doctor_scheduler_scheduler_id 
       WHERE ds.doctor_doctor_id = ? AND dshdow.appointmentDate = ? AND dshdow.starting_time = ?`,
      [actualDoctorId, date, time],
    );
    console.log("CONFLICT:", conflict);
    if (conflict.length > 0) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked for that doctor" });
    }

    // ── Insert ────────────────────────────────────────────────
    const [result] = await db.execute(
      `INSERT INTO doctor_scheduler (max_patients, doctor_doctor_id, isAvailable)
       VALUES (?, ?, ?)`,
      [patient_count, actualDoctorId, 1],
    );

    console.log("INSERT RESULT:", result);

    const sheduler_id = result.insertId;

    const dayName = getDayName(date);
    console.log("DAY NAME:", dayName);

    const [day_row] = await db.execute(
      "SELECT days_of_week_id FROM days_of_week WHERE days_of_week_name = ?",
      [dayName],
    );

    const day = day_row[0];
    console.log("DAY ROW:", day_row);

    if (!day) throw new Error(`Day "${dayName}" not found`);

    const endTime = getEndTime(time, duration);
    console.log("END TIME:", endTime);
    await db.execute(
      `INSERT INTO doctor_scheduler_has_days_of_week (doctor_scheduler_scheduler_id, days_of_week_days_of_week_id, starting_time, end_time, appointmentDate)
       VALUES (?, ?, ?, ?,?)`,
      [sheduler_id, day.days_of_week_id, time, endTime, date],
    );

    res.status(201).json({
      message: "Appointment scheduled successfully",
      appointmentId: result.insertId,
    });
  } catch (error) {
    console.error("CREATE APPOINTMENT ERROR:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to schedule appointment" });
  }
};

function getDayName(dateString) {
  const date = new Date(dateString);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[date.getDay()];
}

function getEndTime(time, durationMinutes) {
  const date = new Date(`1970-01-01T${time}:00`);
  date.setMinutes(date.getMinutes() + parseInt(durationMinutes));
  return date.toTimeString().slice(0, 5); // → "09:30"
}
// PUT update appointment
exports.UpdateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_count, doctorId, date, time, duration, notes, status } =
      req.body;

    const [result] = await db.execute(
      `UPDATE appointments
       SET patient_count = ?, doctor_id = ?, date = ?, time = ?,
           duration = ?, notes = ?, status = ?
       WHERE id = ?`,
      [patient_count, doctorId, date, time, duration, notes, status, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to update appointment" });
  }
};

// PATCH cancel
exports.CancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      `UPDATE appointments SET status = 'Cancelled' WHERE id = ?`,
      [id],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.DeleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(`DELETE FROM appointments WHERE id = ?`, [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
