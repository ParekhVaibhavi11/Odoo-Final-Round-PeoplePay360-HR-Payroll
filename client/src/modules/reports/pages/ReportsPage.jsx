import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { FileText, Download, Loader2 } from 'lucide-react';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/payroll-summary');
      if (res.data) setReports(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Summary Report</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Aggregated department salary breakdown, headcount, deductions, and total expenditure.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase">
                <th className="py-4 px-6">Department</th>
                <th className="py-4 px-6">Headcount</th>
                <th className="py-4 px-6">Basic Total</th>
                <th className="py-4 px-6">Gross Total</th>
                <th className="py-4 px-6">Deductions Total</th>
                <th className="py-4 px-6">Net Expenditure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reports.map((r, idx) => (
                <tr key={idx} className="hover:bg-plum-50/40">
                  <td className="py-4 px-6 font-bold text-slate-800">{r.department}</td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">{r.headcount} Staff</td>
                  <td className="py-4 px-6 text-slate-700">${parseFloat(r.total_basic || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 text-slate-700">${parseFloat(r.total_gross || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 text-rose-600">-${parseFloat(r.total_deductions || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 font-extrabold text-plum-800">${parseFloat(r.total_net || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
