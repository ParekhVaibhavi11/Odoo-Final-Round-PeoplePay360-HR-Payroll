import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { FileText, Download, Printer, Loader2, Users, DollarSign, Clock, Search } from 'lucide-react';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('payroll');
  const [payrollData, setPayrollData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      if (activeTab === 'payroll') {
        const res = await api.get('/reports/payroll-summary');
        if (res.data) setPayrollData(res.data);
      } else if (activeTab === 'employees') {
        const res = await api.get('/reports/employee-salary');
        if (res.data) setEmployeeData(res.data);
      } else if (activeTab === 'attendance') {
        const res = await api.get('/reports/attendance-summary');
        if (res.data) setAttendanceData(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const handlePrint = () => {
    window.print();
  };

  const filteredEmployees = employeeData.filter((emp) =>
    `${emp.first_name} ${emp.last_name} ${emp.department} ${emp.employee_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">HR & Payroll Reports</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Real-time analytics across departmental salary expenditure, employee wages, and attendance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('payroll')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'payroll'
              ? 'border-plum-700 text-plum-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Payroll Summary
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'employees'
              ? 'border-plum-700 text-plum-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          Employee Salary Directory
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'attendance'
              ? 'border-plum-700 text-plum-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          Attendance Metrics
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Generating analytics report...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
          {/* Payroll Summary View */}
          {activeTab === 'payroll' && (
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
                {payrollData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      No payroll data found.
                    </td>
                  </tr>
                ) : (
                  payrollData.map((r, idx) => (
                    <tr key={idx} className="hover:bg-plum-50/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">{r.department}</td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">{r.headcount} Staff</td>
                      <td className="py-4 px-6 text-slate-700">${parseFloat(r.total_basic || 0).toLocaleString()}</td>
                      <td className="py-4 px-6 text-slate-700">${parseFloat(r.total_gross || 0).toLocaleString()}</td>
                      <td className="py-4 px-6 text-rose-600">-${parseFloat(r.total_deductions || 0).toLocaleString()}</td>
                      <td className="py-4 px-6 font-extrabold text-plum-800">${parseFloat(r.total_net || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Employee Salary View */}
          {activeTab === 'employees' && (
            <div>
              <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by employee name or department..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-plum-700/20"
                  />
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase">
                    <th className="py-4 px-6">Employee</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Position</th>
                    <th className="py-4 px-6">Basic Wage</th>
                    <th className="py-4 px-6">Gross Est.</th>
                    <th className="py-4 px-6">Net Est.</th>
                    <th className="py-4 px-6">Contract</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                        No employees found matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-plum-50/40 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800">{emp.first_name} {emp.last_name}</div>
                          <div className="text-xs text-slate-400">{emp.employee_number}</div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{emp.department}</td>
                        <td className="py-4 px-6 text-slate-600">{emp.job_position}</td>
                        <td className="py-4 px-6 font-semibold text-slate-700">${parseFloat(emp.basic_wage || 0).toLocaleString()}</td>
                        <td className="py-4 px-6 text-slate-700">${parseFloat(emp.gross_estimate || 0).toLocaleString()}</td>
                        <td className="py-4 px-6 font-extrabold text-plum-800">${parseFloat(emp.net_estimate || 0).toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-lg ${
                              emp.contract_status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {emp.contract_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Attendance Metrics View */}
          {activeTab === 'attendance' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase">
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Headcount</th>
                  <th className="py-4 px-6">Present Entries</th>
                  <th className="py-4 px-6">Worked Hours</th>
                  <th className="py-4 px-6">Overtime Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((att, idx) => (
                    <tr key={idx} className="hover:bg-plum-50/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">{att.department}</td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">{att.headcount} Staff</td>
                      <td className="py-4 px-6 font-semibold text-emerald-600">{att.present_days} Days</td>
                      <td className="py-4 px-6 text-slate-700">{parseFloat(att.total_worked_hours || 0).toFixed(1)} hrs</td>
                      <td className="py-4 px-6 font-bold text-plum-800">{parseFloat(att.total_overtime_hours || 0).toFixed(1)} hrs</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
