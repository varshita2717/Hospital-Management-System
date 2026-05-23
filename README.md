# 🏥 Good Will's Hospital Management System

A full-stack Hospital Management System built with **React**, **Node.js (Express)**, and **MySQL**. Designed to streamline hospital operations including patient management, doctor scheduling, appointments, room allocation, billing, and medical records — with role-based access for Admins and Doctors.

---

## ✨ Features

### 👤 Authentication & Role-Based Access
- Secure registration and login with **bcrypt** password hashing
- Two roles: **Admin** and **Doctor**
- Admins access all modules; Doctors see only their own appointments, patients, and medical records
- Session persistence via **localStorage**

### 📊 Dashboard
- Real-time stats cards fetched from the database
- Admin view: Total Patients, Doctors, Appointments, Available Rooms, Pending Billing, Admissions, Medical Records
- Doctor view: My Patients, My Appointments, Scheduled, Completed, My Medical Records

### 🧑‍⚕️ Patients
- Register new patients with personal and medical details
- View room allocation status per patient
- Navigate directly to a patient's medical records
- View patient address on demand

### 👨‍⚕️ Doctors
- Add doctors with specialization, department, phone, and email
- Doctors are automatically linked to their user account on registration

### 📅 Appointments
- Schedule appointments between patients and doctors
- Update statuses: Scheduled → Confirmed → Completed
- Cancel appointments (status updated, record preserved)
- Date formatted as `Mon, 19 May 2026`; time shown in 12-hour format

### 🛏️ Rooms
- Add rooms with type (General, Private, ICU, Emergency, Operation Theatre)
- Allocate patients to available rooms
- Discharge patients and free up rooms
- Live summary: Available / Occupied / Total count

### 💳 Billing
- Generate bills linked to patients
- Track payment status: Pending → Paid / Cancelled
- Auto-set payment date when marked as Paid
- Reopen cancelled bills

### 🗂️ Medical Records
- Create and view medical records per patient
- Records linked to both patient and doctor
- Doctors can only see and add their own records

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Material UI Icons |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Auth | bcryptjs, localStorage sessions |
| Dev Tools | Nodemon, Vite HMR |

---

## 📁 Project Structure

```
hospital/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   ├── roomController.js
│   │   ├── billController.js
│   │   ├── medicalRecordsController.js
│   │   └── dashStatController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   ├── rooms.js
│   │   ├── billing.js
│   │   ├── medical.js
│   │   └── dashStat.js
│   ├── db.js
│   ├── server.js
│   └── .env
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Patients.jsx
│   │   ├── Doctors.jsx
│   │   ├── Appointments.jsx
│   │   ├── Rooms.jsx
│   │   ├── Billing.jsx
│   │   └── MedicalRecords.jsx
│   └── utils/
│       └── formatDate.js
├── public/
│   └── images/
├── vite.config.js
└── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL 8+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/hospital-management-system.git
cd hospital-management-system
```

### 2. Set up the database
```sql
CREATE DATABASE hospital;
USE hospital;

-- Run your schema SQL file or create tables manually
```

### 3. Configure environment variables
Create a `.env` file inside the `backend/` folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital
PORT=5000
ADMIN_SECRET=your_admin_secret_code
```

### 4. Install backend dependencies
```bash
cd backend
npm install
npx nodemon server.js
```

### 5. Install frontend dependencies
```bash
cd ..
npm install
npm run dev
```

### 6. Open in browser
```
http://localhost:5173
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host (usually `localhost`) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `PORT` | Express server port (default 5000) |
| `ADMIN_SECRET` | Secret code required to register as Admin |

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 🚀 Usage

### Registering Users
- **Doctors** — select Doctor role, choose department, enter phone
- **Admins** — select Admin role, enter the Admin Access Code set in `.env`


## Report

A whole report with the funcitonal requirements and the data requirements of relevant frs and ui/ux, available features screenshots can be accessed with this link-  [Good Will's HMS Report](https://drive.google.com/drive/folders/1WLXDe38F2B71R-blalSiK-ZT97gO9Kct?usp=sharing)

---

## 👩‍💻 Author

Built by **Varshita** as part of a Database Management Systems project.

---

## 📄 License

This project is for academic purposes.
