import { useEffect, useState } from "react";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", specialization: "", phone: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name) { setError("Name is required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, department: form.specialization })
      });
      if (!res.ok) { const d = await res.json(); setError(d.message || "Failed."); return; }
      setShowModal(false);
      setForm({ name: "", specialization: "", phone: "", email: "" });
      fetchDoctors();
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Doctors</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Doctor</button>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Phone</th><th>Email</th></tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr><td colSpan="5" className="no-data">No doctors found.</td></tr>
          ) : doctors.map((d, i) => (
            <tr key={d.doctor_id} className={i % 2 === 0 ? "row-even" : "row-odd"}>
              <td>{d.doctor_id}</td><td>{d.name}</td><td>{d.specialization}</td>
              <td>{d.phone}</td><td>{d.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Doctor</h3>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-grid">
              <div className="modal-field">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
              </div>
              <div className="modal-field">
                <label>Specialization</label>
                <select name="specialization" value={form.specialization} onChange={handleChange}>
                  <option value="">Select Specialization</option>
                  {["Cardiology","Neurology","Orthopedics","Pediatrics","Dermatology","ENT","General Medicine","OB-GYN","Psychiatry","Radiology","Oncology"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
              </div>
              <div className="modal-field">
                <label>Email</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setError(""); }}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Add Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;