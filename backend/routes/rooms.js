import express from "express";
import roomController from "../controllers/roomController.js";

const router = express.Router();

router.get("/", roomController.getRooms);
router.post("/", roomController.addRoom);
router.patch("/:room_id/allocate", roomController.allocateRoom);
export default router;