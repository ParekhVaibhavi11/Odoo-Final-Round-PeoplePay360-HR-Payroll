import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, FileText, Clock, Calendar, DollarSign, BarChart3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Contracts', path: '/contracts', icon: FileText },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Time Off', path: '/time-off', icon: Calendar },
    { name: 'Payroll', path: '/payroll', icon: DollarSign },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  if (user?.role === 'ADMIN') {
    links.push({ name: 'User Management', path: '/admin/users', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 bg-white border-r border-plum-100 min-h-screen p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-2 pt-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</h2>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-plum-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-plum-50 hover:text-plum-700'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
