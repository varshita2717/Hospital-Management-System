import db from "../db.js";

export const getPatients = (req, res) => {
  const query = `
    SELECT p.*, r.room_number
    FROM patients p
    LEFT JOIN rooms r ON r.patient_id = p.patient_id
    ORDER BY p.date_registered DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    res.json(results);
  });
};

export const getPatientById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM patients WHERE patient_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Patient not found." });
    res.json(results[0]);
  });
};

export const addPatient = (req, res) => {
  const { name, age, gender, phone, address, blood_group } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });

  db.query(
    "INSERT INTO patients (name, age, gender, phone, address, blood_group) VALUES (?, ?, ?, ?, ?, ?)",
    [name, age || null, gender || null, phone || null, address || null, blood_group || null],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      res.status(201).json({ message: "Patient added successfully!" });
    }
  );
};

export default { getPatients, getPatientById, addPatient };
