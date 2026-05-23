import { useEffect, useState } from "react";
import { formatDate } from "../utils/formatDate";

function Billing() {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patient_id: "", total_amount: "", payment_status: "Pending", payment_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      const [b, p] = await Promise.all([
        fetch("/api/billing").then(r => r.json()),
        fetch("/api/patients").then(r => r.json())
      ]);
      setBills(b); setPatients(p);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.patient_id || !form.total_amount) { setError("Patient and amount are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) { const d = await res.json(); setError(d.message || "Failed."); return; }
      setShowModal(false);
      setForm({ patient_id: "", total_amount: "", payment_status: "Pending", payment_date: "" });
      fetchAll();
    } catch { setError("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const payment_date = newStatus === "Paid"
        ? new Date().toISOString().split("T")[0]  // auto-set today's date when paid
        : null;

      await fetch(`/api/billing/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status: newStatus, payment_date })
      });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Billing</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Bill</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Patient</th>
            <th>Total Amount</th>
            <th>Payment Status</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.length === 0 ? (
            <tr><td colSpan="6" className="no-data">No bills found.</td></tr>
          ) : bills.map((b, i) => (
            <tr key={b.bill_id} className={i % 2 === 0 ? "row-even" : "row-odd"}>
              <td>{b.bill_id}</td>
              <td>{b.patient_name}</td>
              <td>₹{Number(b.total_amount).toLocaleString()}</td>
              <td>
                <span className={`status-badge status-${b.payment_status?.toLowerCase()}`}>
                  {b.payment_status}
                </span>
              </td>
              <td>{b.payment_date ? formatDate(b.payment_date) : "—"}</td>
              <td className="action-btns">
                {b.payment_status === "Pending" && (
                  <>
                    <button className="status-btn confirm-btn" onClick={() => handleStatusChange(b.bill_id, "Paid")}>
                      Mark Paid
                    </button>
                    <button className="status-btn cancel-btn" onClick={() => handleStatusChange(b.bill_id, "Cancelled")}>
                      Cancel
                    </button>
                  </>
                )}
                {b.payment_status === "Paid" && (
                  <span className="paid-label">✓ Paid</span>
                )}
                {b.payment_status === "Cancelled" && (
                  <button className="status-btn confirm-btn" onClick={() => handleStatusChange(b.bill_id, "Pending")}>
                    Reopen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Add Bill</h3>
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
                <label>Total Amount *</label>
                <input name="total_amount" type="number" value={form.total_amount} onChange={handleChange} placeholder="Amount" />
              </div>
              <div className="modal-field">
                <label>Payment Status</label>
                <select name="payment_status" value={form.payment_status} onChange={handleChange}>
                  {["Pending", "Paid", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="modal-field">
                <label>Payment Date</label>
                <input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => { setShowModal(false); setError(""); }}>Cancel</button>
              <button className="modal-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : "Add Bill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Billing;
