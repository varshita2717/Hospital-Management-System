import db from "../db.js";

export const getDashboardStats = (req, res) => {
  const { doctor_id } = req.query;
  const isDoctor = !!doctor_id;

  let query;

  if (isDoctor) {
    query = `
      SELECT
        (SELECT COUNT(DISTINCT patient_id) FROM appointments WHERE doctor_id = ${db.escape(doctor_id)}) AS totalPatients,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ${db.escape(doctor_id)}) AS totalAppointments,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ${db.escape(doctor_id)} AND status = 'Scheduled') AS scheduled,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ${db.escape(doctor_id)} AND status = 'Confirmed') AS confirmed,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ${db.escape(doctor_id)} AND status = 'Completed') AS completed,
        (SELECT COUNT(*) FROM medical_records WHERE doctor_id = ${db.escape(doctor_id)}) AS totalMedicalRecords,
        (SELECT COUNT(*) FROM appointments WHERE doctor_id = ${db.escape(doctor_id)} AND DATE(appointment_date) = CURDATE()) AS appointmentsToday
    `;
  } else {
    query = `
      SELECT
        (SELECT COUNT(*) FROM patients) AS totalPatients,
        (SELECT COUNT(*) FROM doctors) AS totalDoctors,
        (SELECT COUNT(*) FROM rooms WHERE status = 'Available') AS availableRooms,
        (SELECT COUNT(*) FROM billing WHERE payment_status = 'Pending') AS pendingBilling,
        (SELECT COUNT(*) FROM appointments WHERE status = 'Scheduled') AS scheduled,
        (SELECT COUNT(*) FROM appointments WHERE status = 'Confirmed') AS confirmed,
        (SELECT COUNT(*) FROM appointments WHERE status = 'Completed') AS completed,
        (SELECT COUNT(*) FROM appointments WHERE status = 'Cancelled') AS cancelled,
        (SELECT COUNT(*) FROM rooms WHERE patient_id IS NOT NULL) AS totalAdmissions,
        (SELECT COUNT(*) FROM medical_records) AS totalMedicalRecords
    `;
  }

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};
