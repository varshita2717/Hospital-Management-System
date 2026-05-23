import db from "../db.js";

export const getBills = (req, res) => {
  db.query(
    `SELECT b.*, p.name AS patient_name 
     FROM billing b
     LEFT JOIN patients p ON b.patient_id = p.patient_id
     ORDER BY b.payment_date DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      res.json(results);
    }
  );
};

export const addBill = (req, res) => {
  const { patient_id, total_amount, payment_status, payment_date } = req.body;
  if (!patient_id || !total_amount) return res.status(400).json({ message: "Patient and amount are required." });
  db.query(
    "INSERT INTO billing (patient_id, total_amount, payment_status, payment_date) VALUES (?, ?, ?, ?)",
    [patient_id, total_amount, payment_status || "Pending", payment_date || null],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      res.status(201).json({ message: "Bill added successfully!" });
    }
  );
};
export const updateBillingStatus = async (req, res) => {
  const { id } = req.params;
  const { payment_status, payment_date } = req.body;
  try {
    await db.query(
      "UPDATE billing SET payment_status = ?, payment_date = ? WHERE bill_id = ?",
      [payment_status, payment_date, id]
    );
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export default { getBills, addBill, updateBillingStatus };