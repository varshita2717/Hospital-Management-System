import express from "express";
import doctorsController from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", doctorsController.getDoctors);
router.post("/", doctorsController.addDoctor);

export default router;