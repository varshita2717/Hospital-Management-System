import React, { useEffect, useState } from "react";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import LocalHospitalTwoToneIcon from "@mui/icons-material/LocalHospitalTwoTone";
import EventNoteTwoToneIcon from "@mui/icons-material/EventNoteTwoTone";
import MeetingRoomTwoToneIcon from "@mui/icons-material/MeetingRoomTwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import MonitorHeartTwoToneIcon from "@mui/icons-material/MonitorHeartTwoTone";
import FolderSharedTwoToneIcon from "@mui/icons-material/FolderSharedTwoTone";

function Home({ displayName }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("hms_user") || "{}");
  const isDoctor = user?.role?.toLowerCase() === "doctor";
  const doctor_id = user?.doctor_id;

  useEffect(() => {
    const fetchStats = async () => {
      try {
       const url = isDoctor ? `/api/dashboard-stats?doctor_id=${doctor_id}` : "/api/dashboard-stats";
        const res = await fetch(url);
        const data = await res.json();

        if (isDoctor) {
          setStats([
            {
              label: "My Patients",
              value: data.totalPatients?.toLocaleString() ?? "—",
              sub: "unique patients seen",
              badge: "Mine",
              icon: <PeopleAltTwoToneIcon />,
              gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
            },
            {
              label: "My Appointments",
              value: data.totalAppointments?.toLocaleString() ?? "—",
              sub: `${data.appointmentsToday ?? 0} today`,
              badge: "Total",
              icon: <EventNoteTwoToneIcon />,
              gradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
            },
            {
              label: "Scheduled",
              value: data.scheduled?.toLocaleString() ?? "—",
              sub: `${data.confirmed ?? 0} confirmed`,
              badge: "Pending",
              icon: <EventNoteTwoToneIcon />,
              gradient: "linear-gradient(135deg, #0891b2, #22d3ee)",
            },
            {
              label: "Completed",
              value: data.completed?.toLocaleString() ?? "—",
              sub: "appointments done",
              badge: "Done",
              icon: <MonitorHeartTwoToneIcon />,
              gradient: "linear-gradient(135deg, #059669, #34d399)",
            },
            {
              label: "My Medical Records",
              value: data.totalMedicalRecords?.toLocaleString() ?? "—",
              sub: "records created by me",
              badge: "Total",
              icon: <FolderSharedTwoToneIcon />,
              gradient: "linear-gradient(135deg, #dc2626, #f87171)",
            },
          ]);
        } else {
          setStats([
            {
              label: "Total Patients",
              value: data.totalPatients?.toLocaleString() ?? "—",
              sub: "registered patients",
              badge: "Total",
              icon: <PeopleAltTwoToneIcon />,
              gradient: "linear-gradient(135deg, #7c3aed, #a855f7)",
            },
            {
              label: "Total Doctors",
              value: data.totalDoctors?.toLocaleString() ?? "—",
              sub: "on staff",
              badge: "Active",
              icon: <LocalHospitalTwoToneIcon />,
              gradient: "linear-gradient(135deg, #0891b2, #22d3ee)",
            },
            {
              label: "Appointments Today",
              value: data.scheduled?.toLocaleString() ?? "—",
              sub: `${data.confirmed ?? 0} confirmed, ${data.completed ?? 0} completed`,
              badge: "Today",
              icon: <EventNoteTwoToneIcon />,
              gradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
            },
            {
              label: "Available Rooms",
              value: data.availableRooms?.toLocaleString() ?? "—",
              sub: "ready for admission",
              badge: "Open",
              icon: <MeetingRoomTwoToneIcon />,
              gradient: "linear-gradient(135deg, #0d9488, #34d399)",
            },
            {
              label: "Pending Billing",
              value: data.pendingBilling?.toLocaleString() ?? "—",
              sub: "invoices unpaid",
              badge: "Pending",
              icon: <ReceiptLongTwoToneIcon />,
              gradient: "linear-gradient(135deg, #d97706, #fbbf24)",
            },
            {
              label: "Current Admissions",
              value: data.totalAdmissions?.toLocaleString() ?? "—",
              sub: "currently admitted",
              badge: "Live",
              icon: <MonitorHeartTwoToneIcon />,
              gradient: "linear-gradient(135deg, #db2777, #f472b6)",
            },
            {
              label: "Medical Records",
              value: data.totalMedicalRecords?.toLocaleString() ?? "—",
              sub: "total records",
              badge: "Total",
              icon: <FolderSharedTwoToneIcon />,
              gradient: "linear-gradient(135deg, #dc2626, #f87171)",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-content">
      <p className="home-welcome">Welcome, {displayName}!</p>
      <div className="cards-grid">
        {stats.map((card) => (
          <div key={card.label} className="stat-card" style={{ background: card.gradient }}>
            <div className="stat-card-top">
              <div className="stat-icon">{card.icon}</div>
              <span className="stat-badge">{card.badge}</span>
            </div>
            <div className="stat-card-bottom">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-sub">{card.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
