import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatDate";

function Patients({ setActiveNav, setSelectedPatientId }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "", age: "", gender: "", phone: "", address: "", blood_group: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name) { setError("Name is required."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) { const d = await res.json(); setError(d.message || "Failed."); return; }
      setShowModal(false);
      setForm({ name: "", age: "", gender: "", phone: "", address: "", blood_group: "" });
      fetchPatients();
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Patients</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Patient</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Age</th><th>Gender</th>
            <th>Phone</th><th>Blood Group</th><th>Date Registered</th><th>Room</th><th>Records</th><th>Address</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr><td colSpan="9" className="no-data">No patients found.</td></tr>
          ) : (
            patients.map((p, i) => (
              <tr key={p.patient_id} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                <td>{p.patient_id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
                <td>{p.blood_group}</td>
                <td>{formatDate(p.date_registered)}</td>
                <td>                              
                  {p.room_number
                    ? <span className="status-badge status-occupied">Room {p.room_number}</span>
                    : <span className="status-badge status-available">Not Admitted</span>
                  }
                </td>
                <td>
                  <button className="records-btn" onClick={() => {
                    setSelectedPatientId(p.patient_id);
                    setActiveNav("Medical Records");
                  }}>
                    View Records
                  </button>
                </td>
                <td>
                  <button
                    className="address-btn"
                    onClick={() => alert(p.address || "No address on record")}
                    title={p.address || "No address"}
                  >
                    📍 Address
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Patient</h3>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-grid">
              <div className="modal-field">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" />
              </div>
              <div className="modal-field">
                <label>Age</label>
                <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" />
              </div>
              <div className="modal-field">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
              </div>
              <div className="modal-field">
                <label>Blood Group</label>
                <select name="blood_group" value={form.blood_group} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field modal-field-full">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setError(""); }}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;