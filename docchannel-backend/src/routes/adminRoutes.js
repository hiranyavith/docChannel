const express = require("express");
const {
    getAllUsers, addUser, editUser, changeUserRole,
    getDefaultSlots, addDefaultSlot, deleteDefaultSlot,
    addSpecificSlot, deleteSpecificSlot, getAllAppointments,
    cancelAppointmentAdmin,
    updateAppointmentStatus, getUserCounts,
    bookAppointmentAdmin, getBookingTrend, getPopularTimeSlots, getAppointmentInsights,
    updateUserActiveStatus,
    activeDefaultSlot,

} = require("../controllers/adminController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// User management routes
router.get("/users", authenticateUser, isAdmin, getAllUsers);
router.post("/users", authenticateUser, isAdmin, addUser);
router.put("/users/:id", authenticateUser, isAdmin, editUser);
router.put("/users/:id/role", authenticateUser, isAdmin, changeUserRole);
router.put("/users/:id/active", authenticateUser, isAdmin, updateUserActiveStatus);

// Slot management routes
router.get("/slots", authenticateUser, isAdmin, getDefaultSlots);
router.post("/slots", authenticateUser, isAdmin, addDefaultSlot);
router.delete("/slots/:id", authenticateUser, isAdmin, deleteDefaultSlot);
router.post("/slots/specific", authenticateUser, isAdmin, addSpecificSlot);
router.delete("/slots/specific/:id", authenticateUser, isAdmin, deleteSpecificSlot);
router.put("/slots/:id/active", authenticateUser, isAdmin, activeDefaultSlot);


// Appointment Management Routes
router.get("/appointments", authenticateUser, isAdmin, getAllAppointments);
router.put("/appointments/:id/cancel", authenticateUser, isAdmin, cancelAppointmentAdmin);
router.put("/appointments/:id/status", authenticateUser, isAdmin, updateAppointmentStatus);
router.post("/appointments/book", authenticateUser, isAdmin, bookAppointmentAdmin);

router.get("/analytics/booking-trends", authenticateUser, isAdmin, getBookingTrend);
router.get("/analytics/popular-time-slots", authenticateUser, isAdmin, getPopularTimeSlots);

// Get user counts (Total users, Email verified, Email not verified, New users in last 7 days)
router.get("/analytics/user-counts", authenticateUser, isAdmin, getUserCounts);

// Appointment Insights Route
router.get('/appointment-insights', authenticateUser, isAdmin, getAppointmentInsights);


module.exports = router;