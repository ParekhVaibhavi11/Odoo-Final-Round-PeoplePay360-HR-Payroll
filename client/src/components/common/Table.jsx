import React from 'react';

const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {headers.map((h, idx) => (
                <th key={idx} className={`py-4 px-6 ${h.align === 'right' ? 'text-right' : ''}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
