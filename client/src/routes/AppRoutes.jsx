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
import StructuresRulesPage from '../modules/payroll/pages/StructuresRulesPage';
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.DASHBOARD} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.EMPLOYEES} />}>
            <Route path="/employees" element={<EmployeesPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.CONTRACTS} />}>
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/schedules" element={<SchedulesPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.ATTENDANCE} />}>
            <Route path="/attendance" element={<AttendancePage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.TIMEOFF} />}>
            <Route path="/time-off" element={<TimeOffPage />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.PAYROLL} />}>
            <Route path="/payroll" element={<PayrunsPage />} />
          </Route>

          {/* Admin & Manager Restricted Routes */}
          <Route element={<ProtectedRoute allowedRoles={MODULE_PERMISSIONS.REPORTS} />}>
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/payroll/structures" element={<StructuresRulesPage />} />
          </Route>

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
