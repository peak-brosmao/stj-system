# STJ Management & Attendance System
**Senior Teaching Junior (STJ) — Institute of Technology of Cambodia (ITC)**

A secure web application and attendance monitoring system designed for the STJ peer-tutoring initiative at the Institute of Technology of Cambodia.

---

## 1. Project Overview

STJ (Senior Teaching Junior) is an educational program at the Institute of Technology of Cambodia where senior engineering students mentor junior students across engineering disciplines. The STJ Management System centralizes attendance records, member registries, course curricula, and public verification reports into a unified, secure platform.

### Core Modules
1. **Public Information Portal:** Institutional overview, mission, academic programs, activities, official announcements, contact liaison, privacy policy, and terms of use.
2. **Dedicated Course Leader Portal:** Course information, assigned member rosters, read-only attendance records, teaching timetables, course reports, and secure public sharing links generator with QR codes.
3. **Central System Administration Portal:** Centralized attendance marking terminal, member directory and archival, teaching session scheduler, leader assignments, department and academic year registries, role-based access control, security audit logs, and system settings.
4. **Member Self-Service Portal:** Personal attendance history, course schedules, profile review, and official correction request submission.
5. **Public Shareable Attendance Verification:** Secure, tokenized, read-only attendance reports accessible via `/share/[token]` with optional passcode protection, expiration dates, immediate revocation, and QR code sharing.
6. **Internationalization (i18n):** Native support for Khmer (`km`, default), English (`en`), and French (`fr`) with persistent preference and pure Khmer rendering.
7. **Theme Engine:** Dark and light mode transitions powered by `next-themes` and CSS variable interpolation.

---

## 2. Architecture & Deployment

The system is engineered for deployment on **Hostinger Web Hosting**:

- **Frontend Application:** Next.js (App Router) on Node.js 22 LTS runtime.
- **Language:** TypeScript with strict type checking.
- **Styling & UI:** Tailwind CSS, custom UI components, Lucide icons (strictly zero emoji throughout the platform).
- **Backend Architecture:**
  - Standalone REST API backend for persistent MySQL management.
  - Next.js server actions and API handlers for real-time frontend delivery.
- **Database:** MySQL on Hostinger, managed via migrations and seeders.
- **Data Validation & Sanitization:** Zod schema validation and XSS/injection sanitization on all entry points.
- **Security:** HTTP-only sameSite session cookies, bcrypt password hashing, cryptographically signed JWT tokens, sliding-window rate limiting, and HTTP security headers (HSTS, X-Content-Type-Options, X-Frame-Options).

---

## 3. Security & Privacy Safeguards

In accordance with institutional privacy standards:

- **Zero Credential Exposure:** No production credentials, personal phone numbers, student ID mappings, or cryptographic keys are stored in version control.
- **Cryptographic Password Hashing:** All user passwords are salted and hashed using bcrypt. Plaintext fallback passwords and master backdoors are strictly prohibited.
- **Insecure Direct Object Reference (IDOR) Mitigation:** Every read, modification, and deletion endpoint strictly verifies that the authenticated user owns or has explicit administrative authorization over the requested resource.
- **Abuse & Bot Protection:** Sliding-window rate limiting is enforced on authentication attempts, public share link queries, profile change submissions, and attendance corrections.
- **Audit Logging:** Security-sensitive events (authentication attempts, password updates, profile requests, attendance alterations) are recorded in an audit trail with timestamp, IP address, and user agent metadata.
- **Environment Isolation:** Secrets (`JWT_SECRET`, database credentials, API keys) are restricted to server-side environment variables and are never bundled into client-side scripts.

---

## 4. Role-Based Access Control (RBAC)

| Role | Attendance Permissions | Member & Course Management | Public Sharing Links | System Settings & Audit Logs |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Full marking, modification, and finalization | Full CRUD, archival, and assignments | Full create, view, and revocation | Full control |
| **STJ Admin** | Mark and save attendance for assigned sessions | Manage members, courses, and sessions | Full create and view | Read / Configurable |
| **Course Leader** | Strictly Read-Only (Cannot mark or edit) | View assigned members only | Generate links for assigned courses | Forbidden |
| **Member** | Strictly Read-Only (Self attendance only) | View enrolled courses & schedule | None | Forbidden |

---

## 5. Attendance Calculation Formula

To ensure mathematical precision across dashboards, reports, and exports:

$$\text{Attendance Rate} = \frac{\text{Present Count} + \text{Late Count}}{\text{Total Sessions} - \text{Excused Count}} \times 100\%$$

- **Present:** Attended on time.
- **Late:** Attended late (counted as participating, included in numerator).
- **Absent:** Unexcused absence (penalizes rate).
- **Excused:** Approved absence for official academic obligations (exempt from denominator).
- If $\text{Total Sessions} - \text{Excused Count} \le 0$, the rate returns $100\%$.

---

## 6. Route Structure

### Public Portal
- `/` — Homepage
- `/about` — About STJ at ITC
- `/programs` — Course curricula directory
- `/programs/[slug]` — Course details
- `/activities` — Workshops and academic seminars
- `/news` — Institutional bulletins
- `/contact` — Campus liaison and inquiries
- `/privacy` — Privacy policy
- `/terms` — Terms of use

### Public Attendance Verification
- `/share/[token]` — Verified, read-only attendance report with print and QR support

### Course Leader Portal
- `/leader/login` — Authentication
- `/leader/dashboard` — Course metrics and attendance analytics
- `/leader/members` — Assigned student roster
- `/leader/attendance` — Session attendance inspection
- `/leader/sessions` — Timetable and room assignments
- `/leader/reports` — Course-level attendance summaries
- `/leader/share-links` — Verification link management
- `/leader/announcements` — Official notifications
- `/leader/profile` — Account security

### Member Portal
- `/portal/login` — Member authentication
- `/portal/member` — Personal attendance dashboard
- `/portal/attendance` — Detailed attendance history
- `/portal/courses` — Enrolled course schedules
- `/portal/correction-requests` — Attendance discrepancy appeals
- `/portal/profile` — Student profile
- `/portal/security` — Password change

### System Administration Portal
- `/system/login` — Administrator authentication
- `/system/dashboard` — Executive command center
- `/system/attendance` — Attendance marking terminal
- `/system/sessions` — Teaching session scheduler
- `/system/members` — Member registry
- `/system/leaders` — Leader assignments
- `/system/courses` — Academic courses
- `/system/departments` — Engineering departments registry
- `/system/academic-years` — Academic level management
- `/system/reports` — Consolidated reports and CSV exports
- `/system/share-links` — Organization-wide share link audit
- `/system/announcements` — Announcement broadcaster
- `/system/profile-requests` — Member profile update reviews
- `/system/audit-logs` — Tamper-evident security logs
- `/system/settings` — System parameters

---

## 7. Configuration & Environment Setup

Configure environment variables in your server configuration or `.env`:

```env
# Database Connection
DATABASE_URL="mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:3306/<DB_NAME>"

# Security & Authentication
JWT_SECRET="<SECURE_RANDOM_SECRET_KEY_MIN_32_CHARS>"
NODE_ENV="production"

# Application Settings
NEXT_PUBLIC_APP_URL="https://stj.peakbrosmao.me"
NEXT_PUBLIC_DEFAULT_LOCALE="km"
TIMEZONE="Asia/Phnom_Penh"

# API Integration
NEXT_PUBLIC_API_URL="https://datastj.peakbrosmao.me/api"
LARAVEL_API_URL="https://datastj.peakbrosmao.me/api"
```

---

## 8. Verification & Quality Assurance

- **Strict Type Checking:** Zero TypeScript errors across all components and API handlers.
- **Production Build:** Static page generation (48/48 routes) verified with optimized build traces.
- **Automated Test Suite:** 6/6 test categories passed (attendance formulas, bcrypt hashing, cryptographic tokens, RBAC rules, language dictionaries, database compatibility).
- **Zero-Emoji Compliance:** Standardized institutional typography across all interfaces and communications.
- **Privacy Assurance:** All student identities, contacts, and institutional accounts are protected behind authenticated role-based access.
