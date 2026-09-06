# PeoplePay360 — HR & Payroll Management System

> A full-stack HR and Payroll Management System designed to streamline employee management, attendance, leave management, salary configuration, payroll processing, payslip generation, dashboards, and administrative operations in one centralized platform.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/API-Express.js-000000?logo=express\&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-06B6D4?logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)

---

## Overview

**PeoplePay360** is an integrated HR and Payroll Management System that brings the complete employee lifecycle into a single platform.

The application connects:

**Employees → Contracts → Working Schedules → Attendance → Time Off → Salary Structures → Payroll → Payslips → Reports**

The system is designed around role-based access control so that employees, HR teams, payroll users, payroll managers, and administrators can access only the functionality relevant to their responsibilities.

The application is implemented using a **PERN-style architecture** with PostgreSQL accessed directly through the Node.js PostgreSQL driver. **Prisma ORM is not used.**

---

## Problem Statement

Traditional HR and payroll workflows often require multiple disconnected systems for:

* Employee records
* Contracts
* Attendance
* Leave management
* Salary configuration
* Payroll processing
* Payslips
* Reports
* User permissions

This creates duplicated data, manual work, inconsistent records, and increased chances of payroll errors.

### Our Solution

PeoplePay360 provides a centralized HR and payroll platform where employee information flows through the entire payroll lifecycle.

This allows organizations to:

* Manage employee information centrally
* Track attendance and working hours
* Manage leave requests and approvals
* Configure salary structures and salary rules
* Process payroll systematically
* Generate payslips
* Deliver payslips
* Monitor HR and payroll information through dashboards
* Control access through roles and permissions

---

# Key Features

## Authentication & Authorization

* User authentication
* JWT-based authentication
* Login/logout
* Current-user information
* Token refresh
* Password change
* Password reset
* Role-based access control
* Permission-based authorization

---

## Employee Management

Manage the complete employee profile and employment information.

### Features

* Employee profiles
* Employee status
* Department assignment
* Job position
* Manager assignment
* Working schedule
* Employee history
* Employee-related contracts
* Employee attendance
* Employee time-off records
* Employee payslips

---

## Contract Management

Manage employee employment contracts from a centralized interface.

### Features

* Create contracts
* Update contracts
* Contract start/end dates
* Wage information
* Department
* Job position
* Salary structure
* Contract status
* Active contract management
* Contract history
* Contract activation/termination

---

## Working Schedule Management

Configure employee working schedules according to organizational requirements.

### Features

* Weekly working patterns
* Working days
* Start/end times
* Break periods
* Weekly working hours
* Schedule assignment
* Employee schedule management

---

## Attendance Management

Track employee attendance and working hours.

### Features

* Check-in
* Check-out
* Worked hours
* Attendance status
* Attendance history
* Manual attendance correction
* Attendance summaries
* Employee attendance records

---

## Time-Off / Leave Management

Manage employee leave throughout its lifecycle.

### Features

* Time-off types
* Leave allocations
* Leave requests
* Leave balances
* Approval/refusal workflow
* Validity periods
* Automatic balance deduction after approval
* Employee leave history

### Workflow

```text
Employee
   ↓
Leave Request
   ↓
HR Review
   ↓
Approve / Refuse
   ↓
Leave Balance Updated
```

---

## Salary Structure Management

Create configurable salary structures that determine how employee salaries are calculated.

### Features

* Salary structure creation
* Salary structure editing
* Structure activation
* Salary rule assignment
* Multiple salary components

---

## Salary Rules Engine

Salary rules define how individual salary components are calculated.

Supported calculation concepts include:

* Fixed amounts
* Percentage-based calculations
* Formula-based calculations
* Calculation sequencing

Typical salary components include:

```text
Rule 10 Basic Salary
      ↓
Rule 20 Allowances
      ↓
Rule 30 Gross Salary
      ↓
Rule 40 Deductions
      ↓
Rule 50 Net Salary
```

---

# Payroll Management

PeoplePay360 provides a structured payroll processing workflow.

### Payroll Workflow

```text
Select Salary Structure
          ↓
Select Payroll Period
          ↓
Select Eligible Employees
          ↓
Create Payrun
          ↓
Compute Payroll
          ↓
Review Warnings
          ↓
Validate
          ↓
Mark as Paid
          ↓
Generate / Send Payslips
```

### Payroll Features

* Payrun creation
* Payroll period management
* Employee selection
* Salary calculation
* Payroll computation
* Payroll warnings
* Payrun validation
* Mark payroll as paid
* Payslip generation
* Payslip delivery

---

# Payslip Management

Generate and manage employee payslips with detailed salary breakdowns.

### Features

* Payslip creation
* Payslip calculation
* Payslip lines
* Salary breakdown
* Gross salary
* Deductions
* Net salary
* PDF generation
* Email delivery
* Bulk payslip email delivery

---

# Dashboard & Analytics

Role-specific dashboards provide an overview of important HR and payroll information.

Dashboard information can include:

* Employee counts
* Attendance
* Leave information
* Payroll status
* Salary costs
* Payroll warnings
* Department-based information
* Employee-based information
* Period-based information

---

# Reports

PeoplePay360 provides reporting capabilities across major HR and payroll modules.

### Available Reports

* Employee reports
* Attendance reports
* Time-off reports
* Payroll reports
* Payslip reports

Export functionality is also available for selected reports.

---

# Role-Based Access Control

The application supports five primary roles.

| Role                     | Main Responsibilities                                  |
| ------------------------ | ------------------------------------------------------ |
| 👤 Employee              | Personal profile, attendance, leave requests, payslips |
| 👨‍💼 HR Manager         | Employees, contracts, schedules, attendance, time off  |
| 💼 HR Payroll User       | HR functionality + payroll operations                  |
| 🧑‍💼 HR Payroll Manager | Full HR and payroll management                         |
| 🛡️ Admin                | Users, roles, permissions and complete administration  |

Authorization is enforced at the backend level rather than relying only on frontend visibility.

---

# 🏗️ System Architecture

```text
                         PEOPLEPAY360
                              │
                ┌─────────────┴─────────────┐
                │                           │
             FRONTEND                    BACKEND
              React                  Node.js + Express
                │                           │
                │        REST API           │
                └─────────────┬─────────────┘
                              │
                              ▼
                         PostgreSQL
```

### Backend Request Flow

```text
Client
  │
  ▼
Route
  │
  ▼
Middleware
  │
  ├── Authentication
  └── Authorization
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
Repository / SQL
  │
  ▼
PostgreSQL
```

This layered approach separates HTTP handling, business logic, and database operations.

---

# Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* JavaScript
* HTML5
* CSS3

The current frontend project is configured with React, Vite and Tailwind CSS.

## Backend

* Node.js
* Express.js
* REST API
* JavaScript
* PostgreSQL driver (`pg`)
* dotenv
* Nodemon

The server package uses Express, `pg`, dotenv and Nodemon.

## Database

* PostgreSQL
* SQL
* Direct PostgreSQL access
* Database migrations/seeding where applicable

**No Prisma ORM is used.**

---

# 🚀 Installation & Setup

## 1. Clone the repository

```bash
git clone https://github.com/ParekhVaibhavi11/Odoo-Final-Round-PeoplePay360-HR-Payroll.git
```

```bash
cd Odoo-Final-Round-PeoplePay360-HR-Payroll
```

---

## 2. Setup PostgreSQL

Make sure PostgreSQL is installed and running.

Create the database:

```sql
CREATE DATABASE peoplepay360;
```

Configure the database credentials in:

```text
server/.env
```

---

## 3. Setup Backend

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

For production-style execution:

```bash
npm start
```

The repository's backend package defines `dev` using Nodemon and `start` using Node.js.

---

## 4. Setup Frontend

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

The frontend uses Vite for development/build tooling.

---

# 🧪 Development

### Frontend

```bash
cd client
npm run dev
```

### Backend

```bash
cd server
npm run dev
```

### Frontend linting

```bash
cd client
npm run lint
```

---

# 🔄 Complete Business Workflow

```text
                    EMPLOYEE
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       CONTRACT     SCHEDULE    ATTENDANCE
          │                         │
          │                         │
          └────────────┬────────────┘
                       ▼
                    TIME OFF
                       │
                       ▼
              SALARY STRUCTURE
                       │
                       ▼
                 SALARY RULES
                       │
                       ▼
                    PAYRUN
                       │
                       ▼
               SALARY COMPUTATION
                       │
              ┌────────┴────────┐
              ▼                 ▼
          WARNINGS           VALIDATION
                                │
                                ▼
                             PAID
                                │
                                ▼
                           PAYSLIP
                         ┌──────┴──────┐
                         ▼             ▼
                        PDF          EMAIL
```

---


# 🎥 Demo

**Demo Video:** 
https://drive.google.com/file/d/1_oFu_ro7ebiRtg9CuJ20fCwWNz_T_zBM/view?usp=sharing

**Repository:**
https://github.com/ParekhVaibhavi11/Odoo-Final-Round-PeoplePay360-HR-Payroll

---

# 🔮 Future Enhancements

Potential future improvements include:

* Advanced payroll analytics
* AI-assisted HR insights
* Automated anomaly detection
* Advanced employee performance analytics
* Mobile application
* Cloud deployment
* Automated CI/CD pipelines
* Expanded notification workflows
* Advanced audit logging
* Multi-company payroll support

---

# 👨‍💻 Contributors

### PeoplePay360 Development Team

| Contributor     | Role      |
| --------------- | --------- |
| Vaibhavi Parekh | Team Leader |
| Ramakant Gupta | Full stack Developer |
| Purav Modi | Database |
| Falguni Thakor | Backend Developer |
> Update this section with the actual team members and their responsibilities.

---

# 📄 License

This project was developed as part of the **Odoo Final Round / Hackathon project**.

---


<p align="center">
  Built with ❤️ using React, Node.js, Express.js and PostgreSQL
</p>
