import db from "../db.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, confirmPassword, role, phone, department } = req.body;

 if (!name || !email || !password || !confirmPassword || !role || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }
  if (role === "admin") {
    const adminCode = req.body.adminCode;
    if (adminCode !== process.env.ADMIN_SECRET) {
      return res.status(400).json({ message: "Invalid admin code." });
    }
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    if (results.length > 0) return res.status(409).json({ message: "Email already registered." });

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Registration failed.", error: err.message });

          if (role?.toLowerCase() === "doctor") {
            if (!department) return res.status(400).json({ message: "Department is required for doctors." });

            db.query(
              "SELECT * FROM departments WHERE department_name = ?",
              [department],
              (err, deptResults) => {
                if (err) return res.status(500).json({ message: "Error checking department.", error: err.message });
                if (deptResults.length === 0) return res.status(404).json({ message: "Invalid department." });

                const department_id = deptResults[0].department_id;

                db.query(
                  "INSERT INTO doctors (name, email, specialization, phone, department_id) VALUES (?, ?, ?, ?, ?)",
                  [name, email, department, phone, department_id],
                  (err) => {
                    if (err) return res.status(500).json({ message: "Failed to add doctor.", error: err.message });
                    return res.status(201).json({ message: "Doctor registered successfully!" });
                  }
                );
              }
            );
          } else {
            return res.status(201).json({ message: "Registration successful!" });
          }
        }
      );
    } catch (error) {
      res.status(500).json({ message: "Error hashing password." });
    }
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid email or password." });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password." });

    if (user.role?.toLowerCase() === "doctor") {
      db.query("SELECT doctor_id FROM doctors WHERE email = ?", [user.email], (err, docResults) => {
        if (err) return res.status(500).json({ message: "Database error.", error: err.message });

        const doctor_id = docResults.length > 0 ? docResults[0].doctor_id : null;

        return res.status(200).json({
          message: "Login successful!",
          user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            doctor_id
          }
        });
      });
    } else {
      return res.status(200).json({
        message: "Login successful!",
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          doctor_id: null
        }
      });
    }
  });
};

export default { register, login };
