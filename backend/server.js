import express from "express";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import dashStat from "./routes/dashStat.js";
import patientsRoutes from "./routes/patients.js";
import doctorsRoutes from "./routes/doctors.js";
import appointmentRoutes from "./routes/appointment.js";
import roomRoutes from "./routes/rooms.js";
import billRoutes from "./routes/billing.js";
import medicalRoutes from "./routes/medical.js";

dotenv.config();

const app = express();
const PORT =process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/dashboard-stats", dashStat);
app.use("/api/patients", patientsRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/billing", billRoutes);
app.use("/api/medical-records", medicalRoutes);




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
