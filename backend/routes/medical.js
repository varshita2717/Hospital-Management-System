import express from "express";
import medicalRecordsController from "../controllers/medicalRecordsController.js";

const router = express.Router();

router.get("/", medicalRecordsController.getMedicalRecords);
router.post("/", medicalRecordsController.addMedicalRecord);
export default router;