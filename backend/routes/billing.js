import express from "express";
import billController from "../controllers/billController.js";

const router = express.Router();

router.get("/", billController.getBills);
router.post("/", billController.addBill);
router.patch("/:id/status", billController.updateBillingStatus);
export default router;