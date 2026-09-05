import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bgTint">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-plum-200 border-t-plum-700 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading PeoplePay360 session...</span>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-card max-w-md mx-auto my-12 border border-plum-100">
        <h2 className="text-xl font-bold text-rose-600 mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-600 mb-4">You do not have permission to view this module with your current assigned role ({user.role}).</p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-plum-700 text-white rounded-xl text-sm font-semibold hover:bg-plum-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
