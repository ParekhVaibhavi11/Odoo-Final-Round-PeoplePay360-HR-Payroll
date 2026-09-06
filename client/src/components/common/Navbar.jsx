import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { ROLE_LABELS } from '../../config/constants';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Employees', path: '/employees' },
    { name: 'Contracts', path: '/contracts' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Time Off', path: '/time-off' },
    { name: 'Payroll', path: '/payroll' },
    { name: 'Reports', path: '/reports' },
  ];

  if (user?.role === 'ADMIN') {
    navLinks.push({ name: 'User Management', path: '/admin/users' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : 'U';
  };

  return (
    <header className="bg-white border-b border-plum-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-plum-700 flex items-center justify-center text-white shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-plum-700 leading-none">PeoplePay360</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Human Resource & Payroll Management</p>
            </div>
          </div>

          {/* Navigation Links with Active Purple Bar */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-6 px-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-plum-700'
                      : 'text-slate-600 hover:text-plum-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-plum-700 rounded-t-md" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right User Actions */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:text-plum-700 hover:bg-plum-50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-plum-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-plum-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {getInitials()}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-bold text-slate-800 leading-tight">
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {ROLE_LABELS[user?.role] || user?.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-plum-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-600 font-medium hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
