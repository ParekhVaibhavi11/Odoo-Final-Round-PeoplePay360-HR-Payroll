import React, { useState, useEffect, useCallback } from 'react';
import { getPayruns, createAndComputePayrun, validatePayrun, markPayrunPaid } from '../../../services/payrollService';
import { getEmployees } from '../../../services/employeeService';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { DollarSign, Plus, Download, Send, Eye, Loader2, X, FileText } from 'lucide-react';

const PayrunsPage = () => {
  const [payruns, setPayruns] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedPayrun, setSelectedPayrun] = useState(null);
  const [payslipsModal, setPayslipsModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const [wizardForm, setWizardForm] = useState({
    name: '',
    period_start: '',
    period_end: '',
    salary_structure_id: '',
    employee_ids: [],
  });

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, eRes, sRes] = await Promise.all([
        getPayruns({ limit: 50 }),
        getEmployees({ limit: 100 }),
        api.get('/salary-structures'),
      ]);
      if (pRes.data?.items) setPayruns(pRes.data.items);
      if (eRes.data?.items) setEmployees(eRes.data.items);
      if (sRes.data?.items) setStructures(sRes.data.items);
    } catch (err) {
      showToast(err.message || 'Failed to fetch payroll batches', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLaunchWizard = async (e) => {
    e.preventDefault();
    if (wizardForm.employee_ids.length === 0) {
      showToast('Please select at least one employee for the payrun batch', 'warning');
      return;
    }
    try {
      await createAndComputePayrun(wizardForm);
      showToast('Payrun created and computed successfully!', 'success');
      setWizardOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Payrun computation failed', 'error');
    }
  };

  const handleAction = async (payrunId, action) => {
    try {
      if (action === 'validate') {
        await validatePayrun(payrunId);
        showToast('Payrun validated!', 'success');
      } else if (action === 'mark-paid') {
        await markPayrunPaid(payrunId);
        showToast('Payrun marked as paid!', 'success');
      }
      fetchData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleOpenPayslips = async (payrun) => {
    try {
      const res = await api.get(`/payroll/payruns/${payrun.id}`);
      if (res.data) {
        setSelectedPayrun(res.data);
        setPayslipsModal(true);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load payrun slips', 'error');
    }
  };

  const handleDownloadPdf = (payslipId) => {
    const token = localStorage.getItem('peoplepay360_token');
    window.open(`/api/payroll/payslips/${payslipId}/pdf?token=${token}`, '_blank');
  };

  const handleSendBulkEmail = async (payrunId) => {
    try {
      const res = await api.post(`/payroll/payruns/${payrunId}/send-payslips`);
      showToast(`Dispatched payslip emails to ${res.data?.sent || 0} employees!`, 'success');
    } catch (err) {
      showToast(err.message || 'Email dispatch failed', 'error');
    }
  };

  const toggleSelectAll = (checked) => {
    setWizardForm({
      ...wizardForm,
      employee_ids: checked ? employees.map((e) => e.id) : [],
    });
  };

  const toggleEmployeeSelect = (empId) => {
    const exists = wizardForm.employee_ids.includes(empId);
    setWizardForm({
      ...wizardForm,
      employee_ids: exists
        ? wizardForm.employee_ids.filter((id) => id !== empId)
        : [...wizardForm.employee_ids, empId],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payroll Batches</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            2-Step Payrun wizard, automated salary rule computation, validation & PDF payslip delivery.
          </p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Launch Payrun Wizard
        </button>
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
                <th className="py-4 px-6">Payrun Name</th>
                <th className="py-4 px-6">Period</th>
                <th className="py-4 px-6">Structure</th>
                <th className="py-4 px-6">Slips</th>
                <th className="py-4 px-6">Total Net Paid</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {payruns.map((p) => (
                <tr key={p.id} className="hover:bg-plum-50/40 cursor-pointer" onClick={() => handleOpenPayslips(p)}>
                  <td className="py-4 px-6 font-bold text-slate-800">{p.name}</td>
                  <td className="py-4 px-6 text-slate-600">
                    {new Date(p.period_start).toLocaleDateString()} - {new Date(p.period_end).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 font-semibold text-plum-800">{p.structure_name || 'Standard'}</td>
                  <td className="py-4 px-6 text-slate-700 font-bold">{p.payslip_count || 0} Slips</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">${parseFloat(p.total_net_amount || 0).toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                      p.status === 'VALIDATED' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {p.status === 'COMPUTED' && (
                        <button
                          onClick={() => handleAction(p.id, 'validate')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold"
                        >
                          Validate
                        </button>
                      )}
                      {p.status === 'VALIDATED' && (
                        <>
                          <button
                            onClick={() => handleAction(p.id, 'mark-paid')}
                            className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => handleSendBulkEmail(p.id)}
                            className="p-1.5 text-plum-700 hover:bg-plum-50 rounded-lg"
                            title="Send Bulk Email Payslips"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payrun 2-Step Wizard Modal */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">2-Step Payrun Setup Wizard</h3>
            <form onSubmit={handleLaunchWizard} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Payrun Batch Name</label>
                <input
                  type="text"
                  required
                  value={wizardForm.name}
                  onChange={(e) => setWizardForm({ ...wizardForm, name: e.target.value })}
                  placeholder="e.g. September 2026 Monthly Payrun"
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Period Start</label>
                  <input
                    type="date"
                    required
                    value={wizardForm.period_start}
                    onChange={(e) => setWizardForm({ ...wizardForm, period_start: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Period End</label>
                  <input
                    type="date"
                    required
                    value={wizardForm.period_end}
                    onChange={(e) => setWizardForm({ ...wizardForm, period_end: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Salary Structure</label>
                <select
                  required
                  value={wizardForm.salary_structure_id}
                  onChange={(e) => setWizardForm({ ...wizardForm, salary_structure_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm"
                >
                  <option value="">Select Structure</option>
                  {structures.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              {/* Step 2: Employee Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Select Staff ({wizardForm.employee_ids.length} selected)</label>
                  <label className="text-xs text-plum-700 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="mr-1"
                    /> Select All
                  </label>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded-xl p-3 bg-slate-50 space-y-2 text-sm">
                  {employees.map((emp) => (
                    <label key={emp.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wizardForm.employee_ids.includes(emp.id)}
                        onChange={() => toggleEmployeeSelect(emp.id)}
                        className="rounded text-plum-700 focus:ring-plum-700"
                      />
                      <span>{emp.first_name} {emp.last_name} ({emp.department})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setWizardOpen(false)} className="px-4 py-2 border rounded-xl text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-plum-700 text-white rounded-xl text-sm font-semibold shadow-md">Create & Compute Payrun</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payslips Detail Modal */}
      {payslipsModal && selectedPayrun && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedPayrun.name} - Generated Payslips</h3>
                <p className="text-xs text-slate-500 font-medium">Status: {selectedPayrun.status}</p>
              </div>
              <button onClick={() => setPayslipsModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {selectedPayrun.payslips?.map((slip) => (
                <div key={slip.id} className="p-4 border rounded-2xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{slip.first_name} {slip.last_name} ({slip.employee_number})</div>
                    <div className="text-xs text-slate-500">
                      Basic: ${slip.basic_wage} | Gross: ${slip.gross_amount} | Deductions: -${slip.deduction_amount}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-extrabold text-plum-800 text-base">${parseFloat(slip.net_amount).toLocaleString()}</div>
                      <div className="text-xs text-emerald-600 font-semibold">{slip.status}</div>
                    </div>
                    <button
                      onClick={() => handleDownloadPdf(slip.id)}
                      className="p-2 bg-plum-700 hover:bg-plum-800 text-white rounded-xl shadow-sm text-xs font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrunsPage;
