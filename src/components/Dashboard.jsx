import React, { useState } from "react";
import HealingTwoToneIcon from "@mui/icons-material/HealingTwoTone";
import DashboardTwoToneIcon from "@mui/icons-material/DashboardTwoTone";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import LocalHospitalTwoToneIcon from "@mui/icons-material/LocalHospitalTwoTone";
import EventNoteTwoToneIcon from "@mui/icons-material/EventNoteTwoTone";
import MeetingRoomTwoToneIcon from "@mui/icons-material/MeetingRoomTwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import FolderSharedTwoToneIcon from "@mui/icons-material/FolderSharedTwoTone";
import MonitorHeartTwoToneIcon from "@mui/icons-material/MonitorHeartTwoTone";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

import Home from "./Home";
import Patients from "./Patients";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import Rooms from "./Rooms";
import Billing from "./Billing";
import MedicalRecords from "./MedicalRecords";



function Dashboard({ user, onLogout }) {
const isDoctor = user?.role?.toLowerCase() === "doctor";

const navItems = [
  { icon: <DashboardTwoToneIcon />,     label: "Dashboard" },
  { icon: <EventNoteTwoToneIcon />,     label: "Appointments" },
  { icon: <FolderSharedTwoToneIcon />,  label: "Medical Records" },
  
  ...(!isDoctor ? [
    { icon: <PeopleAltTwoToneIcon />,     label: "Patients" },
    { icon: <LocalHospitalTwoToneIcon />, label: "Doctors" },
    { icon: <MeetingRoomTwoToneIcon />,   label: "Rooms" },
    { icon: <ReceiptLongTwoToneIcon />,   label: "Billing" },
  ] : [])
];
  const [activeNav, setActiveNav] = useState(() => {
    return sessionStorage.getItem("hms_activeNav") || "Dashboard";
  });
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  React.useEffect(() => {
    sessionStorage.setItem("hms_activeNav", activeNav);
  }, [activeNav]);

  const displayName = user?.name || user?.email?.split("@")[0] || "Staff";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const renderPage = () => {
  switch (activeNav) {
    case "Dashboard":       return <Home displayName={displayName} />;
    case "Patients":        return <Patients setActiveNav={setActiveNav} setSelectedPatientId={setSelectedPatientId} />;
    case "Doctors":         return <Doctors />;
    case "Appointments":    return <Appointments isDoctor={isDoctor} doctor_id={user?.doctor_id} />;
    case "Rooms":           return <Rooms />;
    case "Billing":         return <Billing />;
    case "Medical Records": return <MedicalRecords highlightId={selectedPatientId} isDoctor={isDoctor} doctor_id={user?.doctor_id} />;
    default:                return <Home displayName={displayName} />;
  }
};

  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <HealingTwoToneIcon sx={{ fontSize: 22, color: "#fff" }} />
          </div>
          <div>
            <div className="navbar-title">Good Will's Hospital</div>
            <div className="navbar-sub">Healthcare &amp; Wellness</div>
          </div>
        </div>

        <div className="navbar-actions">
          <button className="nav-icon-btn" aria-label="Search">
            <SearchTwoToneIcon fontSize="small" />
          </button>
          <button className="nav-icon-btn" aria-label="Notifications">
            <NotificationsNoneTwoToneIcon fontSize="small" />
          </button>
          <div className="navbar-divider" />
          <div className="navbar-avatar" title={displayName}>
            {initials}
          </div>
        </div>
      </nav>

      <div className="dashboard-body">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-item ${activeNav === item.label ? "nav-item-active" : ""}`}
                onClick={() => setActiveNav(item.label)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button className="logout-btn" onClick={onLogout}>
            <LogoutTwoToneIcon />
            <span>Logout</span>
          </button>
        </aside>

        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;