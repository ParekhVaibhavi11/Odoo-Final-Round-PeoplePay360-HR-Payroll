# PeoplePay360 — HR & Payroll

PeoplePay360 is a modular, integrated HR and Payroll management system designed to manage employees, contracts, working schedules, attendance, time off, salary structures, payroll processing, payslips, dashboards, and reports.

The system follows a **role-based access control (RBAC)** model with five roles:

- Employee
- HR Manager
- HR Payroll User
- HR Payroll Manager
- Admin

The project uses a **Modular Architecture** for both frontend and backend and uses **PostgreSQL directly** as the database. Prisma is **not used**.

---

## Table of Contents

- [Project Goals](#project-goals)
- [Core Modules](#core-modules)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Main Workflow](#main-workflow)
- [API Structure](#api-structure)
- [Database](#database)
- [Payroll Workflow](#payroll-workflow)
- [Security and Permissions](#security-and-permissions)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Development](#development)
- [Project Roadmap](#project-roadmap)

---

## Project Goals

PeoplePay360 aims to provide:

1. A unified HR workflow from employee management to payroll.
2. Employee profile and employment history management.
3. Contract and working schedule management.
4. Attendance tracking and corrections.
5. Time-off types, allocations, requests, and approvals.
6. Configurable salary structures and salary rules.
7. A two-step payrun creation and processing workflow.
8. Payslip generation with salary breakdowns.
9. Payslip PDF generation and email delivery.
10. Role-based access control.
11. Live dashboards and reporting.

---

## Core Modules

### 1. Authentication

Handles:

- Login
- Logout
- Current user
- Token refresh
- Password change
- Password reset

### 2. Employees

Handles:

- Employee profiles
- Department
- Manager
- Job position
- Working schedule
- Employee status
- Employee history
- Links to contracts, attendance, time off, and payslips

### 3. Contracts

Handles:

- Employee contracts
- Start and end dates
- Wage
- Department
- Job position
- Salary structure
- Contract status
- Historical contracts
- Active contract validation

### 4. Working Schedules

Handles:

- Weekly working patterns
- Working days
- Start/end times
- Breaks
- Weekly working hours
- Employee/contract schedule assignment

### 5. Attendance

Handles:

- Check-in
- Check-out
- Worked hours
- Attendance status
- Manual corrections
- Attendance history
- Attendance summaries

### 6. Time Off

Contains three main areas:

- Time Off Types
- Allocations
- Requests

Handles:

- Leave requests
- Leave balances
- Allocations
- Approval/refusal
- Automatic deduction after approval
- Validity periods

### 7. Salary Structures

A salary structure contains salary rules used during payroll calculation.

Handles:

- Structure creation
- Structure editing
- Structure activation
- Rules assigned to a structure

### 8. Salary Rules

Salary rules define how individual salary components are calculated.

Examples of categories:

- Basic
- Allowances
- Gross
- Deductions
- Net

Rules can use:

- Fixed calculations
- Percentage calculations
- Formula-based calculations

Rules are executed according to their sequence.

### 9. Payroll

Handles:

- Payruns
- Payslips
- Salary calculation
- Payroll warnings
- Payrun computation
- Payrun validation
- Marking payroll as paid
- Payslip delivery

### 10. Dashboard

Provides role-specific live information such as:

- Employee counts
- Attendance
- Leave
- Payroll status
- Salary costs
- Warnings
- Department/period filters

### 11. Reports

Provides reports for:

- Employees
- Attendance
- Time off
- Payroll
- Payslips

### 12. Admin

Handles:

- Users
- Roles
- Permissions
- Administrative controls

---

# Technology Stack

## Frontend

Recommended frontend stack:

- React
- React Router
- Axios
- State management as required
- CSS/Tailwind/UI library as selected by the team

## Backend

- Node.js
- Express.js
- REST API
- JWT-based authentication
- `pg` PostgreSQL driver
- Validation middleware
- Role/permission middleware

## Database

- PostgreSQL
- SQL migrations
- SQL seed files

> **Prisma is not used in this project.**

The backend follows:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

SQL/database access should stay inside the repository/database layer rather than being written directly inside controllers.

---

# Architecture

```text
                    PEOPLEPAY360
                         |
          +--------------+--------------+
          |                             |
       FRONTEND                      BACKEND
       React                       Node + Express
          |                             |
          | REST API                    |
          +-----------------------------+
                         |
                    PostgreSQL
```

## Modular Backend Architecture

```text
Request
   |
   v
Route
   |
   v
Middleware
   |
   v
Controller
   |
   v
Service
   |
   v
Repository
   |
   v
PostgreSQL
```

## Example

```text
POST /api/v1/employees
        |
        v
employee.routes.js
        |
        v
auth + permission middleware
        |
        v
employee.controller.js
        |
        v
employee.service.js
        |
        v
employee.repository.js
        |
        v
PostgreSQL
```

---

# Project Structure

```text
PeoplePay360/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── charts/
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── employees/
│   │   │   ├── contracts/
│   │   │   ├── attendance/
│   │   │   ├── timeOff/
│   │   │   ├── workingSchedules/
│   │   │   ├── salaryStructures/
│   │   │   ├── salaryRules/
│   │   │   ├── payroll/
│   │   │   ├── reports/
│   │   │   └── admin/
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   │
│   │   ├── middleware/
│   │   ├── utils/
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── employees/
│   │   │   ├── contracts/
│   │   │   ├── workingSchedules/
│   │   │   ├── attendance/
│   │   │   ├── timeOff/
│   │   │   ├── salaryStructures/
│   │   │   ├── salaryRules/
│   │   │   ├── payroll/
│   │   │   ├── dashboard/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   └── admin/
│   │   │
│   │   └── routes/
│   │
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

---

# User Roles

## 1. Employee

Access:

- Own employee details
- Own attendance
- Own time off
- Attendance creation/check-in/check-out
- Time-off requests

Employee does not have HR administration or payroll management access.

## 2. HR Manager

Access:

- Employees
- Contracts
- Working Schedules
- Attendance
- Time Off
- Time-off approval/refusal

HR Manager does not have payroll features.

## 3. HR Payroll User

Has HR Manager permissions plus:

- Create/read/update Payruns
- Create/read/update Payslips
- Read-only Salary Structures
- Read-only Salary Rules

## 4. HR Payroll Manager

Has HR Payroll User permissions plus:

- Full Payrun management
- Full Payslip management
- Full Salary Structure management
- Full Salary Rule management
- Full HR/payroll records and configuration

## 5. Admin

Has access to:

- All modules
- All models
- User management
- Role management
- Permission management
- Full administrative access

---

# Main Workflow

The complete business flow is:

```text
Employee
    |
    +---- Contract
    |
    +---- Working Schedule
    |
    +---- Attendance
    |
    +---- Time Off
    |
    v
Salary Structure
    |
    +---- Salary Rules
    |
    v
Payrun
    |
    +---- Payroll Period
    +---- Salary Structure
    +---- Selected Employees
    |
    v
Salary Calculation
    |
    +---- Basic
    +---- Allowances
    +---- Gross
    +---- Deductions
    +---- Net
    |
    v
Payslip
    |
    +---- PDF
    +---- Email
```

---

# API Structure

Base URL:

```text
/api/v1
```

## Authentication

```http
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
PUT    /api/v1/auth/change-password
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

## Employees

```http
GET     /api/v1/employees
GET     /api/v1/employees/:id
POST    /api/v1/employees
PUT     /api/v1/employees/:id
DELETE  /api/v1/employees/:id

GET     /api/v1/employees/:id/contracts
GET     /api/v1/employees/:id/attendance
GET     /api/v1/employees/:id/time-off
GET     /api/v1/employees/:id/payslips
GET     /api/v1/employees/:id/dashboard
```

## Contracts

```http
GET     /api/v1/contracts
GET     /api/v1/contracts/:id
POST    /api/v1/contracts
PUT     /api/v1/contracts/:id
DELETE  /api/v1/contracts/:id

GET     /api/v1/employees/:employeeId/contracts
GET     /api/v1/employees/:employeeId/contracts/active

PATCH   /api/v1/contracts/:id/activate
PATCH   /api/v1/contracts/:id/terminate
```

## Working Schedules

```http
GET     /api/v1/working-schedules
GET     /api/v1/working-schedules/:id
POST    /api/v1/working-schedules
PUT     /api/v1/working-schedules/:id
DELETE  /api/v1/working-schedules/:id

PATCH   /api/v1/working-schedules/:id/assign
PATCH   /api/v1/employees/:employeeId/schedule
```

## Attendance

```http
GET     /api/v1/attendance
GET     /api/v1/attendance/:id
POST    /api/v1/attendance
PUT     /api/v1/attendance/:id
DELETE  /api/v1/attendance/:id

POST    /api/v1/attendance/check-in
POST    /api/v1/attendance/check-out
PATCH   /api/v1/attendance/:id/correct

GET     /api/v1/employees/:employeeId/attendance
GET     /api/v1/attendance/summary
```

## Time Off Types

```http
GET     /api/v1/time-off/types
GET     /api/v1/time-off/types/:id
POST    /api/v1/time-off/types
PUT     /api/v1/time-off/types/:id
DELETE  /api/v1/time-off/types/:id
```

## Time Off Allocations

```http
GET     /api/v1/time-off/allocations
GET     /api/v1/time-off/allocations/:id
POST    /api/v1/time-off/allocations
PUT     /api/v1/time-off/allocations/:id
DELETE  /api/v1/time-off/allocations/:id

GET     /api/v1/employees/:employeeId/time-off/allocations
```

## Time Off Requests

```http
GET     /api/v1/time-off/requests
GET     /api/v1/time-off/requests/:id
POST    /api/v1/time-off/requests
PUT     /api/v1/time-off/requests/:id
DELETE  /api/v1/time-off/requests/:id

PATCH   /api/v1/time-off/requests/:id/approve
PATCH   /api/v1/time-off/requests/:id/refuse

GET     /api/v1/employees/:employeeId/time-off/requests
```

## Salary Structures

```http
GET     /api/v1/salary-structures
GET     /api/v1/salary-structures/:id
POST    /api/v1/salary-structures
PUT     /api/v1/salary-structures/:id
DELETE  /api/v1/salary-structures/:id

GET     /api/v1/salary-structures/:id/rules
POST    /api/v1/salary-structures/:id/rules
```

## Salary Rules

```http
GET     /api/v1/salary-rules
GET     /api/v1/salary-rules/:id
POST    /api/v1/salary-rules
PUT     /api/v1/salary-rules/:id
DELETE  /api/v1/salary-rules/:id

POST    /api/v1/salary-rules/:id/test
```

## Payruns

```http
GET     /api/v1/payruns
GET     /api/v1/payruns/:id
POST    /api/v1/payruns
PUT     /api/v1/payruns/:id
DELETE  /api/v1/payruns/:id

GET     /api/v1/payruns/:id/employees
GET     /api/v1/payruns/:id/warnings

POST    /api/v1/payruns/:id/compute
POST    /api/v1/payruns/:id/validate
POST    /api/v1/payruns/:id/mark-paid
POST    /api/v1/payruns/:id/send-payslips
```

## Payslips

```http
GET     /api/v1/payslips
GET     /api/v1/payslips/:id
POST    /api/v1/payslips
PUT     /api/v1/payslips/:id
DELETE  /api/v1/payslips/:id

GET     /api/v1/payslips/:id/lines
POST    /api/v1/payslips/:id/compute

GET     /api/v1/payslips/:id/pdf
POST    /api/v1/payslips/:id/send-email
POST    /api/v1/payslips/bulk-send-email

GET     /api/v1/employees/:employeeId/payslips
```

## Dashboard

```http
GET /api/v1/dashboard
GET /api/v1/dashboard/employee
GET /api/v1/dashboard/hr
GET /api/v1/dashboard/payroll
GET /api/v1/dashboard/payroll-manager
GET /api/v1/dashboard/admin
```

Dashboard filters can include:

```text
period
department
employeeType
employee
```

## Reports

```http
GET /api/v1/reports/employees
GET /api/v1/reports/attendance
GET /api/v1/reports/time-off
GET /api/v1/reports/payroll
GET /api/v1/reports/payslips

GET /api/v1/reports/employees/export
GET /api/v1/reports/attendance/export
GET /api/v1/reports/payroll/export
```

## Admin

### Users

```http
GET     /api/v1/admin/users
GET     /api/v1/admin/users/:id
POST    /api/v1/admin/users
PUT     /api/v1/admin/users/:id
DELETE  /api/v1/admin/users/:id
```

### Roles

```http
GET     /api/v1/admin/roles
GET     /api/v1/admin/roles/:id
POST    /api/v1/admin/roles
PUT     /api/v1/admin/roles/:id
DELETE  /api/v1/admin/roles/:id
```

### Permissions

```http
GET /api/v1/admin/permissions
GET /api/v1/admin/roles/:id/permissions
PUT /api/v1/admin/roles/:id/permissions
```

---

# Database

PostgreSQL is the primary database.

No ORM such as Prisma is required.

Recommended database tables:

```text
users
roles
permissions
role_permissions

employees
departments
job_positions

contracts
working_schedules
working_schedule_days

attendance

time_off_types
time_off_allocations
time_off_requests

salary_structures
salary_rules
salary_structure_rules

payruns
payrun_employees

payslips
payslip_lines

notifications
```

## High-Level Relationships

```text
users
  |
  v
employees
  |
  +---- contracts
  |
  +---- attendance
  |
  +---- time_off_allocations
  |
  +---- time_off_requests
  |
  +---- working_schedules
  |
  +---- payslips
             |
             v
          payruns
             |
             v
       salary structure
             |
             v
        salary rules
```

---

# Payroll Workflow

Payroll should follow this sequence:

```text
1. Select Salary Structure
             |
             v
2. Select Payroll Period
             |
             v
3. Select Eligible Employees
             |
             v
4. Create Payrun
             |
             v
5. Compute
             |
             v
6. Review Warnings
             |
             v
7. Validate
             |
             v
8. Mark Paid
             |
             v
9. Generate/Send Payslips
```

## Payroll calculation

The calculation engine should consider:

```text
Applicable Employee Contract
          +
Payroll Period
          +
Selected Salary Structure
          +
Salary Rules
          +
Worked/Attendance Data
          +
Applicable Time Off
          |
          v
     Payslip Lines
          |
          v
      Gross Salary
          |
          v
      Deductions
          |
          v
       Net Salary
```

Salary rules must actively drive the payslip calculation.

---

# Security and Permissions

The application uses role-based access control.

Every protected API should follow:

```text
Request
   ↓
JWT Authentication
   ↓
User Identification
   ↓
Role/Permission Check
   ↓
Controller
```

Frontend permissions control what the user sees.

Backend permissions control what the user is actually allowed to perform.

> **Never rely only on hiding frontend buttons for authorization.**

For example:

```text
HR Manager
    |
    X POST /api/v1/payruns
```

Even if the Payroll menu is hidden in the frontend, the backend must reject unauthorized payroll requests.

---

# Environment Variables

## Backend `.env`

```env
NODE_ENV=development

PORT=5000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=peoplepay360
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=no-reply@example.com
```

## Frontend `.env`

For Vite:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Do not commit `.env` files containing real credentials.

---

# Installation

## 1. Clone the repository

```bash
git clone <repository-url>
cd PeoplePay360
```

## 2. Setup PostgreSQL

Create a PostgreSQL database:

```sql
CREATE DATABASE peoplepay360;
```

Create a PostgreSQL user if required and grant the necessary permissions.

---

## 3. Setup Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add the required PostgreSQL and JWT configuration.

Run database migrations using the project's SQL migration process.

Then start the backend:

```bash
npm run dev
```

---

## 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will connect to the backend through:

```text
VITE_API_BASE_URL
```

---

# Development Guidelines

## Backend

Follow:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

### Controller

Responsible for:

- Receiving HTTP requests
- Calling services
- Returning HTTP responses

### Service

Responsible for:

- Business logic
- Validation beyond request validation
- Workflow processing
- Payroll calculations
- Transaction coordination

### Repository

Responsible for:

- SQL queries
- PostgreSQL access
- CRUD database operations

---

# Important Payroll Rules

The payroll engine must:

1. Identify the employee's applicable contract for the payroll period.
2. Use the salary structure selected for the payrun.
3. Execute salary rules in sequence.
4. Calculate salary components.
5. Generate payslip lines.
6. Calculate gross salary.
7. Apply deductions.
8. Calculate net salary.
9. Detect payroll warnings before finalization.
10. Preserve finalized payroll records as historical records.

---

# Git Branching Recommendation

Recommended branches:

```text
main
develop

feature/auth
feature/employees
feature/contracts
feature/attendance
feature/time-off
feature/working-schedules
feature/salary-structures
feature/salary-rules
feature/payroll
feature/dashboard
feature/reports
feature/admin
```

Example:

```bash
git checkout -b feature/employees
```

---

# Project Roadmap

## Phase 1 — Foundation

- [ ] Repository setup
- [ ] PostgreSQL setup
- [ ] Database migrations
- [ ] Authentication
- [ ] JWT
- [ ] Users
- [ ] Roles
- [ ] Permissions
- [ ] Protected routes

## Phase 2 — HR Core

- [ ] Employees
- [ ] Contracts
- [ ] Working Schedules
- [ ] Attendance
- [ ] Time Off

## Phase 3 — Payroll Configuration

- [ ] Salary Structures
- [ ] Salary Rules
- [ ] Salary calculation engine

## Phase 4 — Payroll

- [ ] Payrun creation wizard
- [ ] Employee selection
- [ ] Payrun computation
- [ ] Payroll warnings
- [ ] Payrun validation
- [ ] Mark as paid
- [ ] Payslips
- [ ] Payslip PDF
- [ ] Payslip email

## Phase 5 — Dashboard & Reports

- [ ] Employee dashboard
- [ ] HR dashboard
- [ ] Payroll dashboard
- [ ] Admin dashboard
- [ ] Reports
- [ ] Filters
- [ ] Export

## Phase 6 — Finalization

- [ ] Role-based sidebar
- [ ] Permission testing
- [ ] Error handling
- [ ] API testing
- [ ] UI testing
- [ ] End-to-end payroll scenario
- [ ] Leave allocation/request scenario
- [ ] Demo preparation

---

# End-to-End Demo Scenarios

The project should support at least these two complete scenarios.

## Scenario 1 — Employee to Payslip

```text
Create Employee
      ↓
Create Contract
      ↓
Assign Working Schedule
      ↓
Record Attendance
      ↓
Configure Salary Structure
      ↓
Configure Salary Rules
      ↓
Create Payrun
      ↓
Select Employee
      ↓
Compute
      ↓
Review Warnings
      ↓
Validate
      ↓
Mark Paid
      ↓
Generate Payslip
      ↓
PDF / Email
```

## Scenario 2 — Leave Allocation to Request

```text
Create Time Off Type
      ↓
Create Employee Allocation
      ↓
Employee Creates Request
      ↓
HR Reviews Request
      ↓
Approve
      ↓
Allocation Deducted
      ↓
Remaining Balance Updated
```

---

# Important Notes

- PostgreSQL is used directly; **Prisma is not part of this project**.
- Keep business logic inside services.
- Keep SQL queries inside repositories.
- Use transactions for operations that modify multiple related payroll records.
- Use role/permission checks on the backend.
- Do not expose unauthorized modules only by hiding frontend menu items.
- Payroll records should remain historically traceable after validation/payment.
- Salary rules must actually affect payslip calculations.
- Payroll warnings should be shown before finalization.
- Dashboard values should be based on current database information.

---

## License

This project is developed as part of the PeoplePay360 HR & Payroll project.

---

## Project Status

🚧 **Under Development**

Current architecture:

```text
React Frontend
      ↓
Node.js + Express Backend
      ↓
Modular Services
      ↓
PostgreSQL
```

No Prisma ORM is used.
