import React, { useState } from "react";
import HealingTwoToneIcon from '@mui/icons-material/HealingTwoTone';

function Register({ goToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    phone: "",
    adminCode: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => goToLogin(), 1500);
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">
          <HealingTwoToneIcon sx={{ fontSize: 36, color: '#7c3aed' }} />
          <span>Good Will's Hospital</span>
        </div>

        <h2>New Employee Registration</h2>
        <p>Please fill in your details</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <select name="role" value={form.role} onChange={handleChange}>
            <option value="">Select role</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>

          {/* Phone — shown for all roles once role is selected */}
          {form.role && (
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
          )}

          {/* Admin access code */}
          {form.role === "admin" && (
            <input
              type="password"
              name="adminCode"
              placeholder="Enter Admin Access Code"
              value={form.adminCode}
              onChange={handleChange}
            />
          )}

          {/* Doctor-only: department */}
          {form.role === "doctor" && (
            <select name="department" value={form.department} onChange={handleChange}>
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="ENT">ENT</option>
              <option value="General Medicine">General Medicine</option>
              <option value="OB-GYN">OB-GYN</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Radiology">Radiology</option>
              <option value="Oncology">Oncology</option>
            </select>
          )}

          <button className="signin-btn">Register</button>
          {message && <p className="form-message">{message}</p>}
        </form>

        <p className="signup-text">
          Already a registered Employee? <span onClick={goToLogin}>Sign in</span>
        </p>
      </div>

      <div className="login-right">
        <div className="illustration">
          <img src="/images/Doctors-amico.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Register;
