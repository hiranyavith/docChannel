const express = require("express");
const {
  getSlots,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  GetUserAppointments,
  getBookingDetails,
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  paymentNotify,
  initiatePayment,
  verifyPayment,
} = require("../controllers/appointmentController");
const { authenticateUser } = require("../middleware/authMiddleware");
const {
  searchDoctors,
  getSpecializations,
} = require("../controllers/doctorCOntroller");

const router = express.Router();

// router.post("/slots", getSlots);
// router.post("/appointments", bookAppointment);
// router.get("/appointments", getAppointments);
// router.put("/appointments/:id", cancelAppointment);
router.post("/payment-notify", paymentNotify);
router.get("/user-appointments", authenticateUser, GetUserAppointments);
router.get("/search", searchDoctors);
router.get("/specializations", getSpecializations);
router.get("/booking-details", getBookingDetails);
// router.post("/create",authenticateUser, createAppointment);
router.post("/initiate-payment",authenticateUser, initiatePayment);
router.get("/verify-payment/:orderId",authenticateUser, verifyPayment);

router.get("/my-appointments", getUserAppointments);
router.get("/:appointmentId", getAppointmentById);
router.put("/:appointmentId/cancel", cancelAppointment);

module.exports = router;
