import express from "express";
import patientController from "../controllers/patientController.js";

const router = express.Router();

router.get("/", patientController.getPatients);
router.get("/:id", patientController.getPatientById);
router.post("/", patientController.addPatient);
export default router;