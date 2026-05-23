import db from "../db.js";

export const getAppointments = (req, res) => {
  const { doctor_id } = req.query;
  let query = `SELECT a.*, p.name AS patient_name, d.name AS doctor_name 
               FROM appointments a
               LEFT JOIN patients p ON a.patient_id = p.patient_id
               LEFT JOIN doctors d ON a.doctor_id = d.doctor_id`;
  const params = [];
  
  if (doctor_id) {
    query += ` WHERE a.doctor_id = ?`;
    params.push(doctor_id);
  }
  
  query += ` ORDER BY a.appointment_date DESC`;

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    res.json(results);
  });
};

export const addAppointment = (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;
  if (!patient_id || !doctor_id) return res.status(400).json({ message: "Patient and Doctor are required." });
  db.query(
    "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",
    [patient_id, doctor_id, appointment_date || null, appointment_time || null, status || "Scheduled"],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      res.status(201).json({ message: "Appointment added successfully!" });
    }
  );
};

export const getAppointmentById = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT a.*, p.name AS patient_name, d.name AS doctor_name
     FROM appointments a
     LEFT JOIN patients p ON a.patient_id = p.patient_id
     LEFT JOIN doctors d ON a.doctor_id = d.doctor_id
     WHERE a.appointment_id = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Appointment not found." });
      res.json(results[0]);
    }
  );
};

export const updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ["Scheduled", "Confirmed", "Completed", "Cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status." });
  db.query(
    "UPDATE appointments SET status = ? WHERE appointment_id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Appointment not found." });
      res.json({ message: "Status updated successfully." });
    }
  );
};

export default { getAppointments, addAppointment, getAppointmentById, updateAppointmentStatus };