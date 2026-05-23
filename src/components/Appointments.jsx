import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatDate";

function Appointments({ isDoctor, doctor_id }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patient_id: "", doctor_id: "", appointment_date: "", appointment_time: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const url = isDoctor ? `/api/appointments?doctor_id=${doctor_id}` : "/api/appointments";

      const [a, p, d] = await Promise.all([
        fetch(url).then(r => r.json()),
        fetch("/api/patients").then(r => r.json()),
        fetch("/api/doctors").then(r => r.json())
      ]);
      setAppointments(a); setPatients(p); setDoctors(d);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.patient_id || !form.doctor_id) { setError("Patient and Doctor are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) { const d = await res.json(); setError(d.message || "Failed."); return; }
      setShowModal(false);
      setForm({ patient_id: "", doctor_id: "", appointment_date: "", appointment_time: "" });
      fetchAll();
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await fetch(`/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  const activeAppointments = appointments.filter(
    a => a.status !== "Completed" && a.status !== "Cancelled"
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Appointments</h2>
        {!isDoctor && <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Appointment</button>}
      </div>
      <table className="data-table">
        <thead>
          <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th>{!isDoctor && <th>Actions</th>}</tr>
        </thead>
        <tbody>
          {activeAppointments.length === 0 ? (
            <tr><td colSpan={isDoctor ? 6 : 7} className="no-data">No active appointments.</td></tr>
          ) : activeAppointments.map((a, i) => (
            <tr key={a.appointment_id} className={i % 2 === 0 ? "row-even" : "row-odd"}>
              <td>{a.appointment_id}</td>
              <td>{a.patient_name}</td>
              <td>{a.doctor_name}</td>
              <td>{formatDate(a.appointment_date)}</td>
              <td>
                {a.appointment_time
                ? new Date(`1970-01-01T${a.appointment_time}`).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                })
                : "—"}
              </td>
              <td><span className={`status-badge status-${a.status?.toLowerCase()}`}>{a.status}</span></td>
              {!isDoctor && (
                <td className="action-btns">
                  {a.status === "Scheduled" && (
                    <button className="status-btn confirm-btn" onClick={() => handleStatusUpdate(a.appointment_id, "Confirmed")}>Confirm</button>
                  )}
                  {(a.status === "Scheduled" || a.status === "Confirmed") && (
                    <button className="status-btn done-btn" onClick={() => handleStatusUpdate(a.appointment_id, "Completed")}>Done</button>
                  )}
                  {(a.status === "Scheduled" || a.status === "Confirmed") && (
                    <button className="status-btn cancel-btn" onClick={() => handleStatusUpdate(a.appointment_id, "Cancelled")}>Cancel</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Appointment</h3>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-grid">
              <div className="modal-field">
                <label>Patient *</label>
                <select name="patient_id" value={form.patient_id} onChange={handleChange}>
                  <option value="">Select Patient</option>
                  {patients.map(p => <option key={p.patient_id} value={p.patient_id}>{p.name}</option>)}
                </select>
              </div>
              <div className="modal-field">
                <label>Doctor *</label>
                <select name="doctor_id" value={form.doctor_id} onChange={handleChange}>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => <option key={d.doctor_id} value={d.doctor_id}>{d.name}</option>)}
                </select>
              </div>
              <div className="modal-field">
                <label>Date</label>
                <input name="appointment_date" type="date" value={form.appointment_date} onChange={handleChange} />
              </div>
              <div className="modal-field">
                <label>Time</label>
                <input name="appointment_time" type="time" value={form.appointment_time} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setError(""); }}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Add Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;
