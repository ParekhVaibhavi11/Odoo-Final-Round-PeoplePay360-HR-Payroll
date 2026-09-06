import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { DollarSign, FileText, Calendar, Activity, AlertTriangle, Loader2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [myPayslips, setMyPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard');
      if (res.data) setData(res.data);

      if (user?.role === 'EMPLOYEE' || res.data?.isEmployeeView) {
        const slipRes = await api.get('/payroll/my-payslips');
        if (slipRes.data) setMyPayslips(slipRes.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch live dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDownloadPdf = async (payslipId) => {
    try {
      const token = localStorage.getItem('peoplepay360_token');
      const response = await fetch(`/api/payroll/payslips/${payslipId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslip_${payslipId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Payslip PDF downloaded successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to download PDF', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading live HR & Payroll dashboard analytics...</span>
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const isEmployeeView = data?.isEmployeeView || user?.role === 'EMPLOYEE';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isEmployeeView ? 'Employee Self-Service Dashboard' : 'Payroll & HR Dashboard'}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          {isEmployeeView
            ? 'Personalized HR overview of your net salary, leave balances, and attendance health.'
            : 'Live real-time operational insights, payments, staffing impact, and payroll alerts.'}
        </p>
      </div>

      {/* Operational Warning Alerts (For Admin/HR) */}
      {!isEmployeeView && data?.operationalAlerts && data.operationalAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Operational Payroll Alerts ({data.operationalAlerts.length})</span>
          </div>
          <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
            {data.operationalAlerts.map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {isEmployeeView ? 'My Total Net Received' : 'Total Net Paid'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">${kpis.totalNetPaid?.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Paid payslips</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              {isEmployeeView ? 'My Payslips' : 'Payslips Generated'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-plum-50 text-plum-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">{kpis.payslipsGenerated}</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Avg ${kpis.avgSalary?.toLocaleString()} / slip</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Approved Time Off</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">{kpis.approvedLeaveDays} Days</div>
            <div className="text-xs text-amber-600 font-medium mt-1">Approved leave</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Attendance Health</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">{kpis.attendanceHealth}%</div>
            <div className="text-xs text-indigo-600 font-medium mt-1">Presence compliance</div>
          </div>
        </div>
      </div>

      {/* Employee Self-Service: My Payslips & PDF Download Section */}
      {isEmployeeView && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">My Payslips & Salary Statements</h3>
            <span className="text-xs font-semibold text-slate-500">{myPayslips.length} Statements Found</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase">
                  <th className="py-3 px-4">Payrun Batch</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Basic Wage</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Salary Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {myPayslips.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                      No payslips generated for your profile yet.
                    </td>
                  </tr>
                ) : (
                  myPayslips.map((slip) => (
                    <tr key={slip.id} className="hover:bg-plum-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">{slip.payrun_name}</td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {new Date(slip.period_start).toLocaleDateString()} - {new Date(slip.period_end).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">${parseFloat(slip.basic_wage || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-rose-600">-${parseFloat(slip.deduction_amount || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-extrabold text-plum-800">${parseFloat(slip.net_amount || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {slip.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDownloadPdf(slip.id)}
                          className="px-3 py-1.5 bg-plum-700 hover:bg-plum-800 text-white rounded-xl shadow-sm text-xs font-bold flex items-center gap-1.5 ml-auto"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin / Manager Analytics Charts */}
      {!isEmployeeView && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Salary Expenditure by Department</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.departmentCosts || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `$${parseFloat(value).toLocaleString()}`} />
                  <Bar dataKey="total_salary" fill="#5D3A5B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Monthly Net Salary Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.salaryTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month_label" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `$${parseFloat(value).toLocaleString()}`} />
                  <Line type="monotone" dataKey="total_paid" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
