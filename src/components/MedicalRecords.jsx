import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatDate";

function MedicalRecords({ selectedPatientId, setActiveNav, isDoctor, doctor_id }) {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patient_id: selectedPatientId || "", doctor_id: "", diagnosis: "", treatment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const url = isDoctor ? `/api/medical-records?doctor_id=${doctor_id}` : "/api/medical-records";

      const [r, p, d] = await Promise.all([
        fetch(url).then(r => r.json()),
        fetch("/api/patients").then(r => r.json()),
        fetch("/api/doctors").then(r => r.json())
      ]);
      setRecords(r); setPatients(p); setDoctors(d);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.patient_id || !form.doctor_id) { setError("Patient and Doctor are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) { const d = await res.json(); setError(d.message || "Failed."); return; }
      setShowModal(false);
      setForm({ patient_id: "", doctor_id: "", diagnosis: "", treatment: "" });
      fetchAll();
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Medical Records</h2>
        {!isDoctor && <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Record</button>}
      </div>
      {selectedPatientId && (
        <p className="highlight-note">Patient ID {selectedPatientId} highlighted</p>
      )}
      <table className="data-table">
        <thead>
          <tr><th>Record ID</th><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Treatment</th><th>Date</th></tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr><td colSpan="6" className="no-data">No records found.</td></tr>
          ) : records.map((r, i) => (
            <tr key={r.record_id} className={
              String(r.patient_id) === String(selectedPatientId) ? "row-highlighted"
              : i % 2 === 0 ? "row-even" : "row-odd"
            }>
              <td>{r.record_id}</td><td>{r.patient_name}</td><td>{r.doctor_name}</td>
              <td>{r.diagnosis}</td><td>{r.treatment}</td>
              <td>{formatDate(r.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Medical Record</h3>
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
              <div className="modal-field modal-field-full">
                <label>Diagnosis</label>
                <input name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Diagnosis" />
              </div>
              <div className="modal-field modal-field-full">
                <label>Treatment</label>
                <input name="treatment" value={form.treatment} onChange={handleChange} placeholder="Treatment" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setError(""); }}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Add Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecords;