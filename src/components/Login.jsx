import React, { useState } from "react";
import HealingTwoToneIcon from '@mui/icons-material/HealingTwoTone';

function Login({ goToRegister, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("hms_user", JSON.stringify(data.user));

        setMessage("Login successful!");
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 600);
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">
          <HealingTwoToneIcon sx={{ fontSize: 42, color: '#7c3aed' }} />
          <span>Good Will's Hospital</span>
        </div>
        <h2>Welcome back</h2>
        <p>Please enter your details</p>

        <form onSubmit={handleSubmit}>
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
          <div className="login-options">
            <span className="forgot">Forgot password</span>
          </div>
          <button className="signin-btn">Sign in</button>
          {message && <p className="form-message">{message}</p>}
        </form>
        <p className="signup-text">
          New Employee? <span onClick={goToRegister}>Register</span>
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

export default Login;
