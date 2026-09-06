import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';

const EmployeeKanban = ({ employees, onSelectEmployee }) => {
  const getInitials = (first, last) => {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase() || 'EM';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
      {employees.map((emp) => (
        <div
          key={emp.id}
          onClick={() => onSelectEmployee(emp)}
          className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-plum-100 text-plum-800 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                {getInitials(emp.first_name, emp.last_name)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-plum-700 transition-colors">
                  {emp.first_name} {emp.last_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{emp.job_position}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-plum-700 transition-colors shrink-0" />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{emp.department}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-semibold">{emp.status || 'Active'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeKanban;
