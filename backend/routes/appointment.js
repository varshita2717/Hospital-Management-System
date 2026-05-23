import express from "express";
import appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", appointmentController.getAppointments);
router.post("/", appointmentController.addAppointment);
router.get("/:id", appointmentController.getAppointmentById);
router.patch("/:id/status", appointmentController.updateAppointmentStatus);

export default router;