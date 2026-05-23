import db from "../db.js";

export const getRooms = (req, res) => {
  db.query(`
    SELECT r.*, p.name AS patient_name
    FROM rooms r
    LEFT JOIN patients p ON r.patient_id = p.patient_id
    ORDER BY r.room_number
  `, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    res.json(results);
  });
};


export const addRoom = (req, res) => {
  const { room_number, room_type, status } = req.body;
  if (!room_number) return res.status(400).json({ message: "Room number is required." });
  db.query(
    "INSERT INTO rooms (room_number, room_type, status) VALUES (?, ?, ?)",
    [room_number, room_type || null, status || "Available"],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error.", error: err.message });
      res.status(201).json({ message: "Room added successfully!" });
    }
  );
};

export const allocateRoom = (req, res) => {
  const { room_id } = req.params;
  const { patient_id, status } = req.body;
  if (!patient_id && !status) return res.status(400).json({ message: "No data sent." });

  const query =
    patient_id
      ? "UPDATE rooms SET patient_id = ?, status = ? WHERE room_id = ?"
      : "UPDATE rooms SET patient_id = NULL, status = ? WHERE room_id = ?";
  const params = patient_id ? [patient_id, status, room_id] : [status, room_id];

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ message: "Database error.", error: err.message });
    res.json({ message: status === "Occupied" ? "Room allocated successfully!" : "Discharged successfully!" });
  });
};
export default { getRooms, addRoom, allocateRoom };