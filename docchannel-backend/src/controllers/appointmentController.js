const db = require("../config/db");
const User = require("../models/User");
const crypto = require("crypto");

const sendEmail = require("../utils/emailService");

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET;
const PAYHERE_MODE = process.env.PAYHERE_MODE || "sandbox";

const generatePayhereHash = (merchantId, orderId, amount, currency) => {
  const merchantSecret = PAYHERE_MERCHANT_SECRET;
  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const amountFormatted = parseFloat(amount).toFixed(2);

  const hashString =
    merchantId + orderId + amountFormatted + currency + hashedSecret;

  console.log("Hash Generation Debug:");
  console.log("- Merchant ID:", merchantId);
  console.log("- Order ID:", orderId);
  console.log("- Amount:", amountFormatted);
  console.log("- Currency:", currency);
  console.log("- Hashed Secret:", hashedSecret);
  console.log("- Hash String:", hashString);

  const hash = crypto
    .createHash("md5")
    .update(hashString)
    .digest("hex")
    .toUpperCase();
  console.log("- Final Hash:", hash);
  return hash;
};

// ✅ Fetch available slots for a given date
// exports.getSlots = async (req, res) => {
//   try {
//     const { date } = req.body;
//     console.log("Incoming request:", req.body);

//     if (!date) {
//       return res.status(400).json({ message: "Date is required" });
//     }

//     // Fetch available slots (not already booked)
//     const [slots] = await db.execute(
//       `SELECT * FROM slots WHERE status = 1 AND id NOT IN
//             (SELECT slot_id FROM appointments WHERE date = ?)`,
//       [date],
//     );

//     console.log("Available Slots:", slots);

//     res.json({ slots }); // ✅ Send slots as an object
//   } catch (error) {
//     console.error("Error fetching slots:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Book an appointment
// exports.bookAppointment = async (req, res) => {
//   const { user_id, slot_id, date, email } = req.body;

//   if (!user_id || !slot_id || !date || !email) {
//     console.error("Missing required fields:", {
//       user_id,
//       slot_id,
//       date,
//       email,
//     });
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Check if the slot is already booked
//     const [existing] = await db.query(
//       "SELECT * FROM appointments WHERE slot_id = ? AND date = ?",
//       [slot_id, date],
//     );
//     if (existing.length) {
//       return res.status(400).json({ message: "Slot already booked!" });
//     }

//     // Insert the appointment into the database
//     await db.query(
//       "INSERT INTO appointments (user_id, slot_id, date, status) VALUES (?, ?, ?, ?)",
//       [user_id, slot_id, date, 1],
//     );

//     // Fetch the time slot for the email
//     const [slot] = await db.query("SELECT time_slot FROM slots WHERE id = ?", [
//       slot_id,
//       1,
//     ]);
//     const timeSlot = slot[0]?.time_slot || "Unknown Time";

//     // Fetch the user's name for the email
//     const [user] = await db.query("SELECT name FROM users WHERE id = ?", [
//       user_id,
//     ]);
//     const userName = user[0]?.name || "User";

//     console.log("time slot selected", timeSlot);

//     // Email content with name, date, and time slot
//     const emailSubject = "Appointment Confirmation";
//     const emailBody = `
//             <p>Dear ${userName},</p>
//             <p>Your appointment has been successfully booked.</p>
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>Time:</strong> ${timeSlot}</p>
//             <p>Thank you for using our appointment booking system!</p>
//             <p>Best Regards,<br/>BookingApp Team</p>
//         `;

//     // Send confirmation email
//     const emailSent = await sendEmail(email, emailSubject, emailBody);

//     if (!emailSent) {
//       console.warn("Appointment booked, but email failed to send.");
//     }

//     res.json({ message: "Appointment booked successfully!" });
//   } catch (error) {
//     console.error("Error booking appointment:", error);
//     res.status(500).json({ message: "Error booking appointment" });
//   }
// };

// // ✅ Get appointments for a user
// exports.getAppointments = async (req, res) => {
//   try {
//     const { user_id } = req.query;
//     if (!user_id)
//       return res.status(400).json({ message: "User ID is required" });

//     const [appointments] = await db.execute(
//       `SELECT a.id, a.date, a.status, s.time_slot
//              FROM appointments a
//              JOIN slots s ON a.slot_id = s.id
//              WHERE a.user_id = ?`,
//       [user_id],
//     );

//     res.json({ appointments });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     res.status(500).json({ message: "Error fetching appointments" });
//   }
// };

// // ✅ Cancel an appointment
// exports.cancelAppointment = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Step 1: Get the appointment details and user email
//     const [appointment] = await db.query(
//       "SELECT * FROM appointments WHERE id = ?",
//       [id],
//     );
//     if (!appointment.length) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     const appointmentDetails = appointment[0];
//     const { user_id, date, slot_id } = appointmentDetails;

//     // Fetch the user email from the database (assuming you have a users table)
//     const [user] = await db.query("SELECT email FROM users WHERE id = ?", [
//       user_id,
//     ]);
//     const userEmail = user[0]?.email;

//     if (!userEmail) {
//       return res.status(400).json({ message: "User email not found" });
//     }

//     // Step 2: Update the appointment status to canceled (status = 4)
//     await db.execute("UPDATE appointments SET status = ? WHERE id = ?", [
//       4,
//       id,
//     ]);

//     // Fetch the time slot for the email
//     const [slot] = await db.query("SELECT time_slot FROM slots WHERE id = ?", [
//       slot_id,
//     ]);
//     const timeSlot = slot[0]?.time_slot || "Unknown Time";
//     const [username] = await db.query("SELECT name FROM users WHERE id = ?", [
//       user_id,
//     ]);
//     const userName = username[0]?.name || "User";

//     // Step 3: Prepare the email content
//     const emailSubject = "Appointment Cancellation Confirmation";
//     const emailBody = `
//             <p>Dear ${userName},</p>
//             <p>Your appointment scheduled for <strong>${date}</strong> at <strong>${timeSlot}</strong> has been successfully canceled.</p>
//             <p>If you need further assistance, feel free to contact us.</p>
//             <p>Best Regards,<br/>BookingApp Team</p>
//         `;

//     // Step 4: Send cancellation email
//     const emailSent = await sendEmail(userEmail, emailSubject, emailBody);

//     if (!emailSent) {
//       console.warn("Appointment canceled, but email failed to send.");
//     }

//     // Step 5: Send response to client
//     res.json({
//       message:
//         "Appointment canceled successfully, and email notification sent.",
//     });
//   } catch (error) {
//     console.error("Error canceling appointment:", error);
//     res.status(500).json({ message: "Error canceling appointment" });
//   }
// };

exports.GetUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const patientId = await User.findPatientIdFromUserId(userId);
    if (!patientId) {
      return res.status(404).json({
        success: false,
        message: "Patient not found for this user",
      });
    }
    const sql = `SELECT usr.f_name,usr.l_name, spec.speciality_type, slt.slot_number, app.appointment_id,app.queue_number,app.created_At,app.updateAt,
UPPER(DATE_FORMAT(app.created_At, '%M %d, %Y')) AS date_part,
  UPPER(DATE_FORMAT(app.created_At, '%a %h:%i %p')) AS time_part FROM appointment app 
INNER JOIN doctor_scheduler ds ON ds.scheduler_id = app.doctor_scheduler_scheduler_id
INNER JOIN doctor doc ON doc.doctor_id = app.doctor_doctor_id
INNER JOIN users usr ON usr.user_id = doc.users_user_id
INNER JOIN specialization spec ON spec.specialization_id = doc.specialization_specialization_id
LEFT JOIN slots slt 
ON slt.appointment_appointment_id = app.appointment_id
WHERE patients_patient_id =? ORDER BY app.created_At ASC`;

    const [appointments] = await db.execute(sql, [patientId]);

    res.json({
      success: true,
      appointments: appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

// const db = require("../config/db");

exports.getBookingDetails = async (req, res) => {
  try {
    const { doctorId, scheduleId } = req.query;

    if (!doctorId || !scheduleId) {
      return res
        .status(400)
        .json({ message: "Doctor ID and Schedule ID are required" });
    }

    const [doctorData] = await db.execute(
      `SELECT 
d.doctor_id,
        u.initial_with_name,
        u.f_name,
        u.l_name,
        d.specialization_specialization_id,
        spec.speciality_type,
        d.years_in_experience,
        d.consultation_fee,
        d.specialNote
      FROM doctor d
      LEFT JOIN users u ON d.users_user_id = u.user_id
      LEFT JOIN specialization spec ON d.specialization_specialization_id = spec.specialization_id
      WHERE d.doctor_id = ? AND d.isActive = 1`,
      [doctorId],
    );

    if (doctorData.length === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const [scheduleData] = await db.execute(
      `SELECT 
        ds.scheduler_id,
        dsdw.appointmentDate,
        dsdw.starting_time,
        dsdw.end_time,
        ds.max_patients,
        d.consultation_fee,
        (ds.max_patients - COALESCE(COUNT(a.appointment_id), 0)) as slots_available,
        COALESCE(COUNT(a.appointment_id), 0) as active_appointments
      FROM doctor_scheduler ds
      LEFT JOIN appointment a ON ds.scheduler_id = a.doctor_scheduler_scheduler_id 
      LEFT JOIN doctor d ON ds.doctor_doctor_id = d.doctor_id
      LEFT JOIN doctor_scheduler_has_days_of_week dsdw ON ds.scheduler_id = dsdw.doctor_scheduler_scheduler_id
      LEFT JOIN schedule_status st ON a.schedule_status_schedule_status_id = st.schedule_status_id
		  AND st.schedule_status IN ('pending', 'confirmed')
      WHERE ds.scheduler_id = ? AND ds.isAvailable = 1
      GROUP BY ds.scheduler_id`,
      [scheduleId],
    );

    if (scheduleData.length === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (scheduleData[0].slots_available <= 0) {
      return res
        .status(400)
        .json({ message: "No slots available for this schedule" });
    }

    res.json({
      success: true,
      data: {
        doctor: doctorData[0],
        schedule: scheduleData[0],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booking details" });
  }
};

// exports.createAppointment = async (req, res) => {
//   const connection = await db.getConnection();

//   try {
//     await connection.beginTransaction();
//     const { scheduleId } = req.body;

//     if (!req.user || !req.user.id) {
//       await connection.rollback();
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     const userId = req.user.id;

//     if (!scheduleId) {
//       await connection.rollback();
//       return res.status(400).json({ message: "Schedule ID is required" });
//     }

//     const [scheduleCheck] = await connection.execute(
//       `SELECT
//         ds.scheduler_id,
//         ds.doctor_doctor_id,
//         dsdw.appointmentDate,
//         dsdw.starting_time,
//         dsdw.end_time,
//         ds.max_patients,
//         d.consultation_fee,
//         (ds.max_patients - COALESCE(COUNT(a.appointment_id), 0)) as slots_available
//       FROM doctor_scheduler ds
//       LEFT JOIN doctor_scheduler_has_days_of_week dsdw ON ds.scheduler_id = dsdw.doctor_scheduler_scheduler_id
//       LEFT JOIN doctor d ON ds.doctor_doctor_id = d.doctor_id
// 		LEFT JOIN appointment a ON ds.scheduler_id = a.doctor_scheduler_scheduler_id

//         AND a.appointmnetStatus IN ('pending', 'confirmed')
//       WHERE ds.scheduler_id = ? AND ds.isAvailable = 1
//       GROUP BY ds.scheduler_id
//       FOR UPDATE`,
//       [scheduleId],
//     );

//     if (scheduleCheck.length === 0) {
//       await connection.rollback();
//       return res
//         .status(404)
//         .json({ message: "Schedule not found or not available" });
//     }

//     if (scheduleCheck[0].slots_available <= 0) {
//       await connection.rollback();
//       return res
//         .status(400)
//         .json({ message: "No slots available for this schedule" });
//     }

//     const [existingAppointment] = await connection.execute(
//       `SELECT a.appointment_id
// FROM appointment a
// INNER JOIN doctor_scheduler ds
//   ON a.doctor_scheduler_scheduler_id = ds.scheduler_id
//   INNER JOIN patients p ON a.patients_patient_id = p.patient_id
// WHERE p.users_user_id = ?
//   AND ds.scheduler_id = ? AND a.appointmnetStatus IN ('pending', 'confirmed');`,
//       [userId, scheduleId],
//     );

//     if (existingAppointment.length > 0) {
//       await connection.rollback();
//       return res
//         .status(400)
//         .json({ message: "You already have an appointment for this schedule" });
//     }

//     const appointmentNumber = `APT${Date.now()}${Math.floor(Math.random() * 1000)}`;

//     const [queueCount] = await connection.execute(
//       `SELECT COUNT(*) as count FROM appointment a
//        WHERE a.doctor_scheduler_scheduler_id = ? AND a.appointmnetStatus IN ('pending', 'confirmed')`,
//       [scheduleId],
//     );

//     const queueNumber = queueCount[0].count + 1;

//     const [patient] = await connection.execute(
//       `SELECT patient_id FROM patients WHERE users_user_id = ?`,
//       [userId],
//     );

//     if (!patient || patient.length === 0) {
//       await connection.rollback();
//       return res.status(404).json({
//         message: "Patient record not found for this user",
//       });
//     }

//     const patientId = patient[0].patient_id;

//     const [result] = await connection.execute(
//       `INSERT INTO appointment
//        (patients_patient_id, doctor_scheduler_scheduler_id, doctor_doctor_id, appointmentNumber, queue_number, appointment_fee, appointmnetStatus, created_At,schedule_status_schedule_status_id)
//        VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(),1)`,
//       [
//         patientId,
//         scheduleId,
//         scheduleCheck[0].doctor_doctor_id,
//         appointmentNumber,
//         queueNumber,
//         scheduleCheck[0].consultation_fee,
//       ],
//     );

//     await connection.commit();
//     const [appointmentDetails] = await connection.execute(
//       `SELECT
//         a.*,
//         u.initial_with_name,
//         u.f_name,
//         u.l_name,
//         d.specialization_specialization_id,
//         spc.speciality_type,
//         dsdw.appointmentDate,
//         dsdw.starting_time,
//         dsdw.end_time
//       FROM appointment a
//       JOIN doctor d ON a.doctor_doctor_id = d.doctor_id
//       JOIN doctor_scheduler ds ON a.doctor_scheduler_scheduler_id = ds.scheduler_id
//       JOIN users u ON d.users_user_id = u.user_id
//       JOIN doctor_scheduler_has_days_of_week dsdw ON ds.scheduler_id = dsdw.doctor_scheduler_scheduler_id
//       JOIN specialization spc ON d.specialization_specialization_id = spc.specialization_id
//       WHERE a.appointment_id = ?`,
//       [result.insertId],
//     );

//     res.status(201).json({
//       success: true,
//       message: "Appointment booked successfully",
//       appointment: appointmentDetails[0],
//     });
//   } catch (error) {
//     await connection.rollback();
//     console.error(error);
//     res.status(500).json({ message: "Failed to create appointment" });
//   } finally {
//     connection.release();
//   }
// };

exports.initiatePayment = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { scheduleId } = req.body;

    if (!PAYHERE_MERCHANT_ID || !PAYHERE_MERCHANT_SECRET) {
      console.error("PayHere credentials missing!");
      await connection.rollback();
      return res.status(500).json({
        success: false,
        message: "Payment gateway configuration error. Please contact support.",
      });
    }

    if (!req.user || !req.user.id) {
      await connection.rollback();
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const userId = req.user.id;

    // Validate required fields
    if (!scheduleId) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Check if schedule exists and has available slots
    const [scheduleCheck] = await connection.execute(
      `SELECT 
         ds.scheduler_id,
         ds.doctor_doctor_id,
         u.initial_with_name,
         dsdw.appointmentDate,
         dsdw.starting_time,
         dsdw.end_time,
         ds.max_patients,
         d.consultation_fee,
         (ds.max_patients - COALESCE(COUNT(a.appointment_id), 0)) as slots_available
       FROM doctor_scheduler ds
       LEFT JOIN doctor_scheduler_has_days_of_week dsdw ON ds.scheduler_id = dsdw.doctor_scheduler_scheduler_id
       LEFT JOIN doctor d ON ds.doctor_doctor_id = d.doctor_id
       LEFT JOIN users u ON d.users_user_id = u.user_id
 		LEFT JOIN appointment a ON ds.scheduler_id = a.doctor_scheduler_scheduler_id 
		
         AND a.appointmnetStatus IN ('pending', 'confirmed')
       WHERE ds.scheduler_id = ? AND ds.isAvailable = 1
       GROUP BY ds.scheduler_id
       FOR UPDATE`,
      [scheduleId],
    );

    if (scheduleCheck.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ message: "Schedule not found or not available" });
    }

    if (scheduleCheck[0].slots_available <= 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "No slots available for this schedule" });
    }

    const [existingAppointment] = await connection.execute(
      `SELECT a.appointment_id
 FROM appointment a
 INNER JOIN doctor_scheduler ds
  ON a.doctor_scheduler_scheduler_id = ds.scheduler_id
   INNER JOIN patients p ON a.patients_patient_id = p.patient_id
 WHERE p.users_user_id = ?
   AND ds.scheduler_id = ? AND a.appointmnetStatus IN ('pending', 'confirmed')`,
      [userId, scheduleId],
    );

    if (existingAppointment.length > 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ message: "You already have an appointment for this schedule" });
    }

    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const appointmentNumber = `APT${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const [queueCount] = await connection.execute(
      `SELECT COUNT(*) as count FROM appointment a 
        WHERE a.doctor_scheduler_scheduler_id = ? AND a.appointmnetStatus IN ('pending', 'confirmed')`,
      [scheduleId],
    );
    const queueNumber = queueCount[0].count + 1;

    const [patient] = await connection.execute(
      `SELECT patient_id FROM patients WHERE users_user_id = ?`,
      [userId],
    );

    if (!patient || patient.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        message: "Patient record not found for this user",
      });
    }
    const patientId = patient[0].patient_id;

    const [result] = await connection.execute(
      `INSERT INTO appointment
    (patients_patient_id, doctor_scheduler_scheduler_id, doctor_doctor_id, appointmentNumber, queue_number, appointment_fee, appointmnetStatus, created_At, schedule_status_schedule_status_id, orderId)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW(), ?, ?)`,
      [
        patientId,
        scheduleId,
        scheduleCheck[0].doctor_doctor_id,
        appointmentNumber,
        queueNumber,
        scheduleCheck[0].consultation_fee,
        1,
        orderId,
      ],
    );

    const appointmentId = result.insertId;

    // Generate PayHere hash
    const amount = parseFloat(scheduleCheck[0].consultation_fee).toFixed(2);
    const currency = "LKR";
    const hash = generatePayhereHash(
      PAYHERE_MERCHANT_ID,
      orderId,
      amount,
      currency,
    );

    // Prepare PayHere payment data

    const [patientD] = await connection.execute(
      `SELECT 
    p.patient_id, 
    u.initial_with_name, 
    u.email, 
    u.mobile, 
    u.f_name, 
    u.l_name, 
    ua.address,
    ct.city_name
FROM patients p
JOIN users u ON p.users_user_id = u.user_id
JOIN user_address ua ON u.user_address_id = ua.iduser_address
JOIN city ct ON ua.city_city_id = ct.city_id
WHERE p.users_user_id = ?
`,
      [userId],
    );

    const patientRecord = patientD[0];
    if (!patientRecord) {
      await connection.rollback();
      return res.status(404).json({ message: "Patient details not found" });
    }

    if (!patientRecord.email || !patientRecord.mobile) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message:
          "Please update your profile with email and phone number before booking",
      });
    }

    const paymentData = {
      sandbox: true,
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: undefined,
      cancel_url: undefined,
      notify_url: `${process.env.BACKEND_URL}/api/appointments/payment-notify`,
      order_id: orderId,
      items: `Appointment with Dr. ${scheduleCheck[0].initial_with_name}`,
      amount: amount,
      currency: currency,
      first_name: patientRecord.f_name.split(" ")[0],
      last_name: patientRecord.l_name.split(" ")[0],
      email: patientRecord.email,
      phone: patientRecord.mobile,
      address: patientRecord.address,
      city: patientRecord.city_name,
      country: "Sri Lanka",
      hash: hash,
      custom_1: appointmentId.toString(), // Store appointment ID for reference
      custom_2: userId.toString(),
    };
    console.log("Payment data prepared:", {
      ...paymentData,
      hash: hash.substring(0, 10) + "...",
    });
    await connection.commit();

    res.json({
      success: true,
      message: "Payment initiated",
      paymentData,
      appointmentId,
      orderId,
      payhereMode: PAYHERE_MODE,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Payment initiation failed:", error);
    res.status(500).json({ message: "Failed to initiate payment" });
  } finally {
    connection.release();
  }
};

exports.paymentNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1, // appointment_id
      custom_2, // user_id
      status_message,
      method,
    } = req.body;

    console.log("PayHere Notification Received:", req.body);

    // Verify the signature
    const merchantSecret = PAYHERE_MERCHANT_SECRET;
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const localHash = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          payhere_amount +
          payhere_currency +
          status_code +
          hashedSecret,
      )
      .digest("hex")
      .toUpperCase();

    if (localHash !== md5sig) {
      console.error("Invalid payment signature");
      return res.status(400).send("Invalid signature");
    }

    const appointmentId = parseInt(custom_1);

    // Update appointment based on payment status
    if (status_code === "2") {
      // Payment successful
      await db.execute(
        `UPDATE appointment 
         SET appointmnetStatus = 'confirmed', 
             updateAt = NOW()
         WHERE appointment_id = ? AND orderId = ?`,
        [appointmentId, order_id],
      );

      await db.execute(
        `INSERT INTO payment(doctor_amount,transaction_ref,paid_At,appointment_appointment_id,payment_status_payment_status_id,payment_method_payment_method_id)
        VALUES (?,?,NOW(),?,?,?)`,
        [payhere_amount, order_id, appointmentId, 1, 3],
      );

      console.log(`Payment successful for appointment ${appointmentId}`);
    } else if (status_code === "0") {
      // Payment pending
      await db.execute(
        `UPDATE appointment 
         SET payment_status = 'pending'
         WHERE appointment_id = ? AND orderId = ?`,
        [appointmentId, order_id],
      );

      await db.execute(
        `INSERT INTO payment(doctor_amount,transaction_ref,paid_At,appointment_appointment_id,payment_status_payment_status_id,payment_method_payment_method_id)
        VALUES (?,?,NOW(),?,?,?)`,
        [payhere_amount, order_id, appointmentId, 2, 3],
      );
    } else {
      // Payment failed or cancelled
      await db.execute(
        `UPDATE appointment
         SET payment_status = 'failed',
             updateAt = NOW()
         WHERE appointment_id = ? AND orderId = ?`,
        [appointmentId, order_id],
      );
      await db.execute(
        `INSERT INTO payment(doctor_amount,transaction_ref,paid_At,appointment_appointment_id,payment_status_payment_status_id,payment_method_payment_method_id)
        VALUES (?,?,NOW(),?,?,?)`,
        [payhere_amount, order_id, appointmentId, 2, 3],
      );

      console.log(
        `Payment failed for appointment ${appointmentId}: ${status_message}`,
      );
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Payment notification processing failed:", error);
    res.status(500).send("Error processing notification");
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const [appointment] = await db.execute(
      `SELECT 
        a.*,
        u.initial_with_name,
        u.f_name,
        u.l_name,
        spc.speciality_type,
        dsdw.appointmentDate,
        dsdw.starting_time,
        dsdw.end_time,
        u.user_id
      FROM appointment a
      JOIN doctor d ON a.doctor_doctor_id = d.doctor_id
      JOIN patients p ON a.patients_patient_id = p.patient_id
      JOIN users u ON p.users_user_id = u.user_id
      JOIN doctor_scheduler ds ON a.doctor_scheduler_scheduler_id = ds.scheduler_id
      JOIN specialization spc ON d.specialization_specialization_id = spc.specialization_id
      JOIN doctor_scheduler_has_days_of_week dsdw ON ds.scheduler_id = dsdw.doctor_scheduler_scheduler_id
		WHERE a.orderId = ? AND u.user_id  = ?`,
      [orderId, userId],
    );

    if (appointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      success: true,
      appointment: appointment[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { status } = req.query;

    let query = `
      SELECT 
        a.*,
        u.initial_with_name,
        u.f_name,
        u.l_name,
        spc.speciality_type,
        dsdw.appointmentDate,
        dsdw.starting_time,
        dsdw.end_time,
        u.user_id
      FROM appointment a
      JOIN doctor d ON a.doctor_doctor_id = d.doctor_id
      JOIN users u ON d.users_user_id = u.user_id
      JOIN doctor_scheduler ds ON a.doctor_scheduler_scheduler_id = ds.scheduler_id
      JOIN specialization spc ON d.specialization_specialization_id = spc.specialization_id
      JOIN doctor_scheduler_has_days_of_week dsdw ON ds.scheduler_id = dsdw.doctor_scheduler_scheduler_id
		WHERE u.user_id = ?
    `;

    const params = [userId];

    if (status) {
      query += ` AND a.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY ds.available_date DESC, ds.start_time DESC`;

    const [appointments] = await db.execute(query, params);

    res.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.user_id;

    const [patient] = await db.execute(
      `SELECT patient_id 
   FROM patients 
   WHERE users_user_id = ?`,
      [userId],
    );

    if (!patient) {
      throw new Error("Patient record not found for this user");
    }

    const patientId = patient.patient_id;

    const [appointment] = await db.execute(
      `SELECT * FROM appointment a WHERE a.appointment_id = ? AND a.patients_patient_id = ?`,
      [appointmentId, patientId],
    );

    if (appointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      appointment[0].status === "cancelled" ||
      appointment[0].status === "completed"
    ) {
      return res
        .status(400)
        .json({ message: "Cannot cancel this appointment" });
    }

    // Update appointment status
    await db.execute(
      `UPDATE appointment SET appointmnetStatus = 'cancelled', updateAt = NOW() WHERE appointment_id = ?`,
      [appointmentId],
    );

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.user_id;

    const [appointment] = await db.execute(
      `SELECT 
        a.*,
        u.initial_with_name,
        u.f_name,
        u.l_name,
        spc.speciality_type,
        dsdw.appointmentDate,
        dsdw.starting_time,
        dsdw.end_time,
        p.users_user_id
      FROM appointment a
      JOIN doctor d ON a.doctor_doctor_id = d.doctor_id
      JOIN specialization spc ON d.specialization_specialization_id = spc.specialization_id
      JOIN doctor_scheduler ds ON a.doctor_scheduler_scheduler_id = ds.scheduler_id
      JOIN doctor_scheduler_has_days_of_week dsdw ON ds.scheduler_id = dsdw.doctor_scheduler_scheduler_id
      JOIN patients p ON a.patients_patient_id = p.patient_id
      JOIN users u ON d.users_user_id = u.user_id
      WHERE a.appointment_id = ? AND p.users_user_id = ?`,
      [appointmentId, userId],
    );

    if (appointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      success: true,
      appointment: appointment[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch appointment" });
  }
};
