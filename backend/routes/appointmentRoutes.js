// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

const {
  acceptGig,
  getAllAppointments,
  updateAppointment,
  getAppointmentsForAdmin,
} = require("../controllers/appointmentController");

// POST /api/appointments
router.post("/", acceptGig);
router.get("/", requireAuth, getAllAppointments); // GET /api/appointments of Specific User
router.patch("/:id", requireAuth, updateAppointment); // PATCH /api/appointments/:id
router.get("/admin", requireAuth, getAppointmentsForAdmin);

module.exports = router;
