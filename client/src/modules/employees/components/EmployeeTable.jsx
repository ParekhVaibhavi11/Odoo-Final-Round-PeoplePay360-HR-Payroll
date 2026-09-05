import React from 'react';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeeTable = ({ employees, pagination, onPageChange, onSelectEmployee }) => {
  const getInitials = (first, last) => {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || 'EM';
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-4 px-6">Employee</th>
              <th className="py-4 px-6">Work Email</th>
              <th className="py-4 px-6">Job Position</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6">Manager</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                onClick={() => onSelectEmployee(emp)}
                className="hover:bg-plum-50/40 transition-colors cursor-pointer group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-plum-100 text-plum-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {getInitials(emp.first_name, emp.last_name)}
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-plum-700">
                      {emp.first_name} {emp.last_name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-600 font-medium">{emp.email}</td>
                <td className="py-4 px-6 text-slate-600 font-medium">{emp.job_position}</td>
                <td className="py-4 px-6 text-slate-600 font-medium">{emp.department}</td>
                <td className="py-4 px-6 text-slate-500 font-medium">{emp.manager_name || 'Administrator'}</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {emp.status || 'Active'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Bar matching Screenshot 3 */}
      {pagination && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {employees.length} of {pagination.total} employees
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="w-7 h-7 rounded-lg bg-plum-700 text-white font-bold flex items-center justify-center">
              {pagination.page}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 font-semibold"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
