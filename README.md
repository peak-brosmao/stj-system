# STJ Management & Attendance System
**Senior Teaching Junior (STJ) — Institute of Technology of Cambodia (ITC)**

A production-ready web application and attendance monitoring system designed for the STJ peer-tutoring initiative at the Institute of Technology of Cambodia.

---

## 1. Project Overview

STJ (Senior Teaching Junior) is an educational program at the Institute of Technology of Cambodia where senior engineering students mentor junior students across engineering disciplines. The STJ Management System centralizes attendance records, member registries, course syllabi, and public verification reports into a unified, secure platform.

### Core Modules
1. **Public STJ Information Website:** Homepage, About STJ, Academic Programs, Activities & Workshops, Announcements & News, Contact, Privacy Policy, and Terms of Use.
2. **Dedicated Course Leader Portal:** Course information, assigned member rosters, read-only attendance records, teaching timetables, course reports, and secure public sharing links generator with QR codes.
3. **Central System Administration Portal:** Super Admin & STJ Admin dashboard, centralized attendance marking terminal, member CRUD and archival, teaching session scheduler, leader assignments, department and academic year registries, role-based access control, security audit logs, and global settings.
4. **Public Shareable Attendance Verification:** Secure, tokenized, read-only attendance reports accessible via `/share/[token]` with optional passcode protection, expiration dates, immediate revocation, and QR code sharing.
5. **Internationalization (i18n):** Native support for Khmer (`km`, default), English (`en`), and French (`fr`) with persistent preference and Khmer Unicode rendering using Noto Sans Khmer.
6. **Smooth Theme Engine:** Seamless dark and light mode transitions powered by `next-themes` and CSS variable interpolation.

---

## 2. Technology Stack & Hostinger Compatibility

This application is built for deployment on **Hostinger Business/Unlimited Web Hosting** using its native Node.js Web App feature:

- **Framework:** Next.js (App Router) on Node.js 22 LTS runtime.
- **Language:** TypeScript with strict type checking.
- **Styling & UI:** Tailwind CSS, shadcn/ui components, Lucide React icons (zero emoji throughout the platform).
- **ORM & Database:** Prisma ORM connecting to **MySQL** (`mysql://USER:PASSWORD@HOST:PORT/DB`).
- **State & Data Visualization:** React Hook Form, Zod validation, TanStack Table, Recharts.
- **Security:** HTTP-only sameSite session cookies, bcrypt password hashing, cryptographically signed Jose JWT tokens, and SHA-256 token hashing for public share links.
- **Zero External Daemon Dependencies:** No Redis, no Docker, no inbound WebSockets or Socket.IO required. Live dashboard data updates via HTTP polling and manual refresh.

---

## 3. Strict Role-Based Access Control (RBAC)

| Role | Attendance Permissions | Member & Course Management | Public Sharing Links | System Settings & Audit Logs |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Full marking, modification, and finalization | Full CRUD, archival, and assignments | Full create, view, and revocation | Full control |
| **STJ Admin** | Mark and save attendance for assigned sessions | Manage members, courses, and sessions | Full create and view | Read / Configurable |
| **Course Leader** | **STRICTLY READ-ONLY** (Cannot mark, edit, or delete) | View assigned members only | Generate links for assigned courses | Forbidden |
| **Member** | **STRICTLY READ-ONLY** (Self attendance only) | View enrolled courses & schedule | None | Forbidden |

> [!IMPORTANT]
> **Strict Non-Mutation Policy for Leaders:** Course leaders possess **zero mutation privileges** on the attendance records table. Any direct mutation request sent to the server from a leader account is rejected with HTTP `403 Forbidden`. If an attendance record requires modification, leaders can submit an audited `AttendanceCorrection` request to STJ Administrators.

---

## 4. Attendance Calculation Formula

To guarantee consistency across leader cards, administration dashboards, public shared lists, and Excel exports, attendance rate is computed using the following formula:

$$\text{Attendance Rate} = \frac{\text{Present Count} + \text{Late Count}}{\text{Total Sessions} - \text{Excused Count}} \times 100\%$$

- **Present:** Attended on time.
- **Late:** Attended late (counted as participating, included in numerator).
- **Absent:** Unexcused absence (penalizes rate).
- **Excused:** Approved absence for exams, illness, or official ITC duties (exempt from denominator).
- If $\text{Total Sessions} - \text{Excused Count} \le 0$, the rate returns $100\%$.

---

## 5. Website Route Map

### Public Portal
- `/` — Homepage (Hero, statistics, programs, mission, contact)
- `/about` — About STJ at ITC
- `/programs` — Course directory
- `/programs/[slug]` — Course details (Programming, Mathematics, Physics, Chemistry)
- `/activities` — Workshops, competitions, and seminars
- `/news` — Announcements and news
- `/news/[slug]` — News detail
- `/contact` — Campus liaison and contact form
- `/privacy` — Privacy policy
- `/terms` — Terms of use

### Public Attendance Sharing
- `/share/[token]` — Verified, read-only attendance report with QR code and print support

### Leader Portal
- `/leader/login` — Course leader authentication
- `/leader/dashboard` — Assigned courses KPI dashboard and attendance trends
- `/leader/members` — Assigned members roster and attendance history
- `/leader/attendance` — Read-only session attendance ledger and correction request modal
- `/leader/sessions` — Teaching schedule and room allocations
- `/leader/reports` — Course-level attendance report & Excel export
- `/leader/share-links` — Create, inspect, and revoke public sharing links
- `/leader/announcements` — Official STJ announcements
- `/leader/profile` — Leader account security and password management

### System Administration Portal
- `/system/login` — Administrator authentication
- `/system/dashboard` — Executive command center and institutional KPI charts
- `/system/attendance` — Fast attendance marking sheet and session finalizer
- `/system/sessions` — Teaching session creator and room scheduler
- `/system/members` — Member directory, add member, filter, search, archive, CSV export
- `/system/leaders` — Leader directory and course assignment matrix
- `/system/courses` — Academic curriculum management
- `/system/departments` — ITC engineering departments registry (GIC, AMS, GIM, GCA, GEE)
- `/system/academic-years` — Engineering academic levels (I1, I2, I3, I4, I5)
- `/system/reports` — Consolidated reports, Excel (.xlsx) and CSV exporter
- `/system/share-links` — Organization-wide share links auditor and revocation
- `/system/announcements` — Global announcement publisher
- `/system/roles` — Granular RBAC permission matrix
- `/system/audit-logs` — Tamper-evident security and activity audit logs
- `/system/settings` — Global configuration and attendance formula parameters
- `/system/profile` — Administrator credentials and profile

---

## 6. Local Development Setup

### Prerequisites
- Node.js 20+ or 22 LTS
- npm 10+
- MySQL 8.0+ (or local MySQL server running on 127.0.0.1:3306)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your local MySQL credentials:
```env
DATABASE_URL="mysql://root:password@127.0.0.1:3306/stj_database"
JWT_SECRET="stj_jwt_secret_production_key_itc_cambodia_random_secure_hex_2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_DEFAULT_LOCALE="km"
TIMEZONE="Asia/Phnom_Penh"
```

### Step 3: Initialize Database & Seed Sample Data
```bash
# Push schema to MySQL database
npx prisma db push

# Seed initial roles, departments, academic years, courses, members, and default accounts
npm run prisma:seed
```

### Step 4: Run the Verification Test Suite
```bash
npm test
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 7. Official STJ 2026-2027 Evaluation Credentials

| Role | Name | Portal URL | Email / Student ID | Default Password |
| :--- | :--- | :--- | :--- | :--- |
| **STJ President (ប្រធាន STJ)** | ផល ដាវីត (PHAL David) | `/system/login` | `e20221334@itc.edu.kh` | `e20221334@ITC!` |
| **Student Association** | សុខ សេងលី (SOK SENGLY) | `/system/login` | `e20230969@itc.edu.kh` | `e20230969@ITC!` |
| **Course Leader (Programming)** | លាង ជីងហេង (LEANG JINGHENG) | `/leader/login` | `e20240704@itc.edu.kh` | `e20240704@ITC!` |
| **Course Leader (Mathematics)** | គឹម រតនៈ (KIM Ratanak) | `/leader/login` | `e20221423@itc.edu.kh` | `e20221423@ITC!` |
| **Senior Tutor Member (STJ033)** | ពៀក ប្រុសម៉ៅ (PEAK BROSMAO) | `/portal/login` | `e20251455@itc.edu.kh` | `e20251455@ITC!` |

All 39 official senior tutors follow the standard pattern:
- **Email:** `e202xxxxx@itc.edu.kh` (or Student ID `e202xxxxx`)
- **Default Password:** `e202xxxxx@ITC!`

---

## 8. Hostinger Deployment Guide (Node.js & MySQL)

Follow these step-by-step instructions to deploy on Hostinger Business or Unlimited Web Hosting:

### 1. Create MySQL Database on Hostinger hPanel
1. Log in to your Hostinger hPanel.
2. Navigate to **Databases** > **Management**.
3. Create a new MySQL database:
   - **Database Name:** e.g., `u123456789_stj`
   - **Username:** e.g., `u123456789_stjuser`
   - **Password:** Generate a strong password.
4. Note your database connection string:
   ```env
   DATABASE_URL="mysql://u123456789_stjuser:YOUR_PASSWORD@127.0.0.1:3306/u123456789_stj"
   ```

### 2. Set Up Node.js Web App in hPanel
1. Navigate to **Advanced** > **Node.js**.
2. Click **Create Application**.
3. Select configuration:
   - **Node.js version:** `22.x` (LTS)
   - **Application mode:** `Production`
   - **Application root:** `/home/u123456789/domains/yourdomain.com/public_html`
   - **Application startup file:** `node_modules/next/dist/bin/next` with argument `start` (or `npm start`)
4. In **Environment Variables**, add:
   - `DATABASE_URL`: Your Hostinger MySQL connection string.
   - `JWT_SECRET`: A secure 32+ character random secret string.
   - `NEXT_PUBLIC_APP_URL`: `https://yourdomain.com`
   - `NEXT_PUBLIC_DEFAULT_LOCALE`: `km`
   - `TIMEZONE`: `Asia/Phnom_Penh`
   - `NODE_ENV`: `production`

### 3. Deploy Files & Build
1. Upload the project files to your domain directory via Git deployment or File Manager (exclude `node_modules` and `.next`).
2. Open the **SSH Terminal** in hPanel and run:
   ```bash
   cd /home/u123456789/domains/yourdomain.com/public_html
   npm install --production=false
   npx prisma db push
   node prisma/seed.js
   npm run build
   ```
3. In hPanel Node.js section, click **Restart Application**.

### 4. Scheduled Tasks (Hostinger Cron Jobs)
To schedule periodic tasks (such as expiring old share links or cleaning stale audit logs), configure a Cron Job in hPanel:
- **Interval:** Daily at 02:00 AM (`0 2 * * *`)
- **Command:**
  ```bash
  cd /home/u123456789/domains/yourdomain.com/public_html && node scripts/cleanup-cron.js
  ```

---

## 9. Database Backup & Recovery

### Automated Backup Procedure via mysqldump
Run the following command via SSH or configure as a cron task:
```bash
mysqldump -u u123456789_stjuser -p -h 127.0.0.1 u123456789_stj > backup_stj_$(date +%Y%m%d_%H%M%S).sql
```

### Restoration Procedure
To restore the database from a backup file:
```bash
mysql -u u123456789_stjuser -p -h 127.0.0.1 u123456789_stj < backup_stj_20261030_120000.sql
```

---

## 10. Verification & Quality Assurance

- **TypeScript Compilation:** Zero errors under `strict: true`.
- **Next.js Production Build:** `✓ Generating static pages (31/31)` completed successfully.
- **Automated Test Suite:** 6/6 test categories passed (Attendance calculation, Bcrypt hashing, Cryptographic token generation, RBAC isolation, Multilingual dictionaries integrity, Hostinger compatibility).
- **Zero-Emoji Policy:** Fully compliant across UI, translations, buttons, and notices.
- **Smooth Dark & Light Mode:** Fully verified with zero layout shift.

