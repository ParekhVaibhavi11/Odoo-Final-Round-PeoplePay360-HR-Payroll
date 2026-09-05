import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { DollarSign, FileText, Calendar, Activity, AlertTriangle, TrendingUp, Users, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard');
      if (res.data) setData(res.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch live dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading live HR & Payroll dashboard analytics...</span>
      </div>
    );
  }

  const kpis = data?.kpis || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll & HR Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Live real-time operational insights, payments, staffing impact, and payroll alerts.
        </p>
      </div>

      {/* Operational Warning Alerts */}
      {data?.operationalAlerts && data.operationalAlerts.length > 0 && (
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
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Net Paid</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">${kpis.totalNetPaid?.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">Finalized payruns</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Payslips Generated</span>
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
            <div className="text-xs text-amber-600 font-medium mt-1">Consumed allocations</div>
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

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Salary Cost */}
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

        {/* Monthly Net Salary Trend */}
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
    </div>
  );
};

export default DashboardPage;
