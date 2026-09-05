import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from '../modules/auth/pages/LoginPage';
import ForgotPasswordPage from '../modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../modules/auth/pages/ResetPasswordPage';

// Module Pages
import EmployeesPage from '../modules/employees/pages/EmployeesPage';
import ContractsPage from '../modules/contracts/pages/ContractsPage';
import SchedulesPage from '../modules/workingSchedules/pages/SchedulesPage';
import AttendancePage from '../modules/attendance/pages/AttendancePage';
import TimeOffPage from '../modules/timeOff/pages/TimeOffPage';
import PayrunsPage from '../modules/payroll/pages/PayrunsPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import ReportsPage from '../modules/reports/pages/ReportsPage';
import UserManagementPage from '../modules/admin/pages/UserManagementPage';

// Role Permissions
import { MODULE_PERMISSIONS } from './roleRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/time-off" element={<TimeOffPage />} />
          <Route path="/payroll" element={<PayrunsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reports" element={<ReportsPage />} />

          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.ADMIN} />}>
            <Route path="/admin/users" element={<UserManagementPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
