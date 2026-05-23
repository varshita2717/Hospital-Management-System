import db from "../db.js";

export const getMedicalRecords = (req, res) => {
  const { doctor_id } = req.query;
  let query = `SELECT m.*, p.name AS patient_name, d.name AS doctor_name
               FROM medical_records m
               LEFT JOIN patients p ON m.patient_id = p.patient_id
               LEFT JOIN doctors d ON m.doctor_id = d.doctor_id`;
  const params = [];

  if (doctor_id) {
    query += ` WHERE m.doctor_id = ?`;
    params.push(doctor_id);
  }
  
  query += ` ORDER BY m.date DESC`;

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    res.json(results);
  });
};

export const addMedicalRecord = (req, res) => {
  const { patient_id, doctor_id, diagnosis, treatment } = req.body;
  if (!patient_id || !doctor_id) return res.status(400).json({ message: "Patient and Doctor are required." });
  db.query(
    "INSERT INTO medical_records (patient_id, doctor_id, diagnosis, treatment) VALUES (?, ?, ?, ?)",
    [patient_id, doctor_id, diagnosis || null, treatment || null],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      res.status(201).json({ message: "Record added successfully!" });
    }
  );
};
export default { getMedicalRecords, addMedicalRecord };