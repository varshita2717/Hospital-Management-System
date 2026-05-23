import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

// Try to restore session from localStorage on first load
function getSavedUser() {
  try {
    const saved = localStorage.getItem("hms_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function App() {
  const [user, setUser] = useState(getSavedUser);
  const [view, setView] = useState(getSavedUser() ? "dashboard" : "login");

  function handleLoginSuccess(userData) {
    localStorage.setItem("hms_user", JSON.stringify(userData));
    setUser(userData);
    setView("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("hms_user");
    setUser(null);
    setView("login");
  }

  return (
    <div>
      {view === "dashboard" ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : view === "register" ? (
        <Register goToLogin={() => setView("login")} />
      ) : (
        <Login
          goToRegister={() => setView("register")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
