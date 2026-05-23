import { useEffect, useState } from "react";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [allocatePatientId, setAllocatePatientId] = useState("");
  const [form, setForm] = useState({ room_number: "", room_type: "", status: "Available" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const [r, p] = await Promise.all([
        fetch("/api/rooms").then(res => res.json()),
        fetch("/api/patients").then(res => res.json())
      ]);
      setRooms(r); setPatients(p);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.room_number) { setError("Room number is required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) { const d = await res.json(); setError(d.message || "Failed."); return; }
      setShowModal(false);
      setForm({ room_number: "", room_type: "", status: "Available" });
      fetchAll();
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleAllocate = async () => {
    if (!allocatePatientId) { setError("Please select a patient."); return; }
    setSubmitting(true); setError("");
    try {
      await fetch(`/api/rooms/${selectedRoom.room_id}/allocate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: allocatePatientId, status: "Occupied" })
      });
      setShowAllocateModal(false);
      setAllocatePatientId("");
      setSelectedRoom(null);
      fetchAll();
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleDischarge = async (roomId) => {
    if (!window.confirm("Discharge patient from this room?")) return;
    try {
      await fetch(`/api/rooms/${roomId}/allocate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: null, status: "Available" })
      });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const availableCount = rooms.filter(r => r.status === "Available").length;
  const occupiedCount = rooms.filter(r => r.status === "Occupied").length;

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Rooms</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Room</button>
      </div>


      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room Number</th>
            <th>Type</th>
            <th>Status</th>
            <th>Patient</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr><td colSpan="6" className="no-data">No rooms found.</td></tr>
          ) : rooms.map((r, i) => (
            <tr key={r.room_id} className={i % 2 === 0 ? "row-even" : "row-odd"}>
              <td>{r.room_id}</td>
              <td>{r.room_number}</td>
              <td>{r.room_type}</td>
              <td>
                <span className={`status-badge status-${r.status?.toLowerCase()}`}>
                  {r.status}
                </span>
              </td>
              <td>{r.patient_name || "—"}</td>
              <td className="action-btns">
                {r.status === "Available" ? (
                  <button
                    className="status-btn confirm-btn"
                    onClick={() => { setSelectedRoom(r); setShowAllocateModal(true); setError(""); }}
                  >
                    Allocate
                  </button>
                ) : (
                  <button
                    className="status-btn cancel-btn"
                    onClick={() => handleDischarge(r.room_id)}
                  >
                    Discharge
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Room Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Room</h3>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-grid">
              <div className="modal-field">
                <label>Room Number *</label>
                <input name="room_number" value={form.room_number} onChange={handleChange} placeholder="e.g. 101" />
              </div>
              <div className="modal-field">
                <label>Room Type</label>
                <select name="room_type" value={form.room_type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  {["General", "Private", "ICU", "Emergency", "Operation Theatre"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field modal-field-full">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setError(""); }}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Add Room"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allocate Patient Modal */}
      {showAllocateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Allocate Room {selectedRoom?.room_number}</h3>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-grid">
              <div className="modal-field modal-field-full">
                <label>Select Patient *</label>
                <select value={allocatePatientId} onChange={e => setAllocatePatientId(e.target.value)}>
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowAllocateModal(false); setError(""); }}>Cancel</button>
              <button className="modal-submit" onClick={handleAllocate} disabled={submitting}>
                {submitting ? "Allocating..." : "Confirm Allocation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
