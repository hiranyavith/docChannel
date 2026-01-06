const express = require("express");
const {
    getSlots,
    bookAppointment,
    getAppointments,
    cancelAppointment
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/slots", getSlots);
router.post("/appointments", bookAppointment);
router.get("/appointments", getAppointments);
router.put("/appointments/:id", cancelAppointment);

module.exports = router;
