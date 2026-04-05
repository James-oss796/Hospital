# AfyaFlow — Hospital Management System

**AfyaFlow** is a full-stack, role-based Hospital Management System (HMS) built for modern clinical workflows in Kenya. It features a Spring Boot REST backend and a React/Vite frontend with a premium Material Design-inspired UI.

---

## 🏥 Key Modules

### 🔐 Authentication & Authorization
- JWT-based authentication with role enforcement at every route
- Google OAuth 2.0 single sign-on integration
- Secure staff registration (Admin-only: Doctor & Receptionist roles)
- Token stored in `localStorage`; claims decoded on the frontend for role context

### 📋 Reception Dashboard
- Live patient queue with token system (`AFY-XXX`)
- Priority triage (Standard · Urgent · Emergency) with colour coding
- Department filter chips for clinical area–specific queue views
- New admission modal with dynamic department selection

### 🩺 Doctor Dashboard
- **Department-isolated** patient queue — doctors only see their own department
- Patient consultation workflow: vitals recording → diagnosis → prescriptions → referrals
- Real-time queue statistics scoped to the authenticated doctor's department
- Prescription and referral modals auto-populate the doctor's name from the session

### 👨‍💼 Admin Dashboard
- Hospital-wide overview with patient volume trend charts
- Dynamic **Department Management** — create or delete clinical areas (no hardcoded lists)
- On-call specialist directory with status indicators
- Revenue and capacity KPI cards
- Staff registration access

### 🏨 Wards & Bed Management *(New)*
- Visual bed occupancy grid per ward (General, ICU, Maternity, Surgical, HDU)
- Real-time colour-coded bed status: Available / Occupied / Maintenance
- Clickable bed tiles to view patient details and discharge workflow
- Add new wards with custom type, department, and bed count
- Capacity utilisation bars with colour-coded thresholds (green → amber → red)

### 🗂 Patient EMR — Electronic Medical Records *(New)*
- Searchable patient list (name, National ID, token)
- Longitudinal **Visit History** timeline with diagnosis, notes, and prescriptions per consultation
- **Vitals** history with all recorded measurements (temperature, BP, SpO₂, etc.)
- **Prescriptions** tab showing all medications ever issued
- **Referrals** tab showing all specialist referrals with urgency levels
- Patient banner card with full demographics and current status

### 📊 Reports & Analytics *(New)*
- **Patient Volume** — 7-day line chart of admissions and walk-ins
- **Department Load** — horizontal bar chart of patient distribution per clinical area
- **Clinical KPIs** — metrics grid: avg wait time, bed occupancy, discharge rate, referral rate
- **Morbidity Report** — donut chart of top diagnoses with ranked case counts
- Date range selector (Today / This Week / This Month / Last Month)
- **CSV Export** — one-click download for each report type

### 🔍 Audit Logs *(New)*
- Searchable, filterable compliance log of all user actions
- Captures: LOGIN, LOGOUT, PATIENT_VIEWED, PRESCRIPTION_ADDED, DEPARTMENT_DELETED, REFERRAL_CREATED, REPORT_GENERATED, etc.
- Filter by role (Admin / Doctor / Receptionist) and action type
- Shows actor username, role, entity, details, timestamp, and IP address
- CSV export for monthly compliance submissions

### ⚙️ Settings *(New)*
- **Profile** tab — update display name, email, department, phone, and bio
- **Security** tab — change password with validation; view and revoke active sessions
- **Notifications** tab — toggleable in-app notification preferences per event type
- **Duty Roster** tab — manage staff shift schedule grouped by date; add/delete shifts

### 📅 Appointments
- Book scheduled, follow-up, and walk-in appointments
- Real-time status transitions (Upcoming → In Progress → Completed / Cancelled)
- Live walk-in queue panel alongside the calendar view

### 💊 Inventory Management
- Track medical supplies with stock levels and reorder thresholds
- Status badges: In Stock / Low Stock / Out of Stock

---

## 🏗 Architecture

```
AfyaFlow/
├── AfyaFlow-Backend/          # Spring Boot REST API
│   └── src/main/java/com/AfyaFlow/demo/
│       ├── controller/        # REST endpoints
│       ├── model/             # JPA entities
│       ├── repository/        # Spring Data repositories
│       ├── service/           # Business logic
│       └── security/          # JWT, OAuth2 config
│
└── afyaflow-react/            # React + Vite Frontend
    └── src/
        ├── pages/             # Full page views
        ├── components/        # Reusable UI components & modals
        ├── context/           # AuthContext, DataContext, NotificationContext
        └── services/          # Axios API client
```

---

## 👥 Roles & Access Control

| Feature                 | Admin | Doctor | Receptionist |
|-------------------------|:-----:|:------:|:------------:|
| Admin Dashboard         | ✅    |        |              |
| Reception Dashboard     | ✅    |        | ✅            |
| Doctor Dashboard        |       | ✅     |              |
| Patient EMR             | ✅    | ✅     |              |
| Wards & Beds            | ✅    |        |              |
| Appointments            | ✅    |        |              |
| Patients List           | ✅    |        |              |
| Doctors List            | ✅    |        |              |
| Inventory               | ✅    |        |              |
| Reports & Analytics     | ✅    |        |              |
| Audit Logs              | ✅    |        |              |
| Settings                | ✅    | ✅     | ✅            |
| Register Staff          | ✅    |        |              |
| Manage Departments      | ✅    |        |              |

---

## 🛠 Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | React 18 · TypeScript · Vite · Recharts      |
| Styling    | Vanilla CSS with Material Design tokens       |
| Auth       | JWT · Google OAuth 2.0 (via Spring Security) |
| Backend    | Spring Boot 3 · Spring Security · Spring Data JPA |
| Database   | MySQL (see `DATABASE_SETUP_README.md`)       |
| Icons      | Google Material Symbols · Lucide React       |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Java 21+
- MySQL 8.0+

### 1. Backend
```bash
cd AfyaFlow-Backend
# Configure application.properties with your DB credentials
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### 2. Frontend
```bash
cd afyaflow-react
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

### 3. Initial Setup
1. Navigate to `http://localhost:5173/register`
2. Create your first **Admin** account
3. Log in → navigate to **Admin Dashboard** → create clinical departments
4. Register doctors and receptionists under **Register Staff**

For database setup, see [`DATABASE_SETUP_README.md`](./DATABASE_SETUP_README.md).

---

## 🌅 Starting Your Day (Quick Start)

To resume development tomorrow, follow these two steps:

### 1. Start the Backend (Spring Boot)
Open a terminal in the root and run:
```powershell
cd AfyaFlow-Backend
.\mvnw.cmd spring-boot:run
```
*The server will automatically sync your clinical staff and initialize ward beds.*

### 2. Start the Frontend (Vite)
Open a second terminal in the root and run:
```powershell
cd afyaflow-react
npm run dev
```

### 🔗 Access Points
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **API Health Check**: [http://localhost:8080/api/auth/health](http://localhost:8080/api/auth/health)

---

## 🔒 Security Notes
- All routes are protected via `ProtectedRoute` component with role-based gating
- JWT claims include `role` and `department` for fine-grained access control
- Doctors are isolated to their department's patient queue only
- Audit logging records every sensitive user action for HIPAA/compliance readiness

---

*© 2026 AfyaFlow Health Systems. Built for modern clinical environments.*
