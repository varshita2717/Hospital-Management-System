import db from "../db.js";

export const getDoctors = (req, res) => {
  db.query(
    `SELECT d.*, dept.department_name 
     FROM doctors d 
     LEFT JOIN departments dept ON d.department_id = dept.department_id`,
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      res.json(results);
    }
  );
};

export const addDoctor = (req, res) => {
  const { name, specialization, phone, email, department } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required." });
  db.query(
    "SELECT * FROM departments WHERE department_name = ?", [department],
    (err, deptResults) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      if (deptResults.length === 0) return res.status(404).json({ message: "Department not found." });
      const department_id = deptResults[0].department_id;
      db.query(
        "INSERT INTO doctors (name, specialization, phone, email, department_id) VALUES (?, ?, ?, ?, ?)",
        [name, specialization || null, phone || null, email || null, department_id],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error.", error: err.message });
          res.status(201).json({ message: "Doctor added successfully!" });
        }
      );
    }
  );
};
export default { getDoctors, addDoctor };