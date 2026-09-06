import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Clock, LogIn, LogOut, Plus, Edit2, Trash2, Loader2, Search, Calendar, UserCheck } from 'lucide-react';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const AttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in: '',
    check_out: '',
    status: 'PRESENT',
    notes: '',
  });

  // Delete Dialog State
  const [deleteId, setDeleteId] = useState(null);

  const { user } = useAuth();
  const { showToast } = useToast();

  const isAdminOrHR = ['ADMIN', 'HR_MANAGER', 'HR_PAYROLL_MANAGER'].includes(user?.role);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attendance');
      if (res.data?.items) {
        setAttendances(res.data.items);
      } else if (Array.isArray(res.data)) {
        setAttendances(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch attendance logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    if (!isAdminOrHR) return;
    try {
      const res = await api.get('/employees?limit=100');
      const empList = res.data?.items || res.data || [];
      setEmployees(empList);
      if (empList.length > 0 && !selectedEmployeeId) {
        setSelectedEmployeeId(empList[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch employee options:', err);
    }
  };

  useEffect(() => {
    fetchAttendances();
    fetchEmployees();
  }, []);

  const getTargetEmployeeId = () => {
    if (isAdminOrHR) {
      return selectedEmployeeId || (employees[0]?.id);
    }
    return user?.employee_id;
  };

  const handleCheckIn = async () => {
    const empId = getTargetEmployeeId();
    if (!empId) {
      showToast('Please select an employee to check in', 'warning');
      return;
    }

    try {
      await api.post('/attendance/check-in', { employee_id: empId });
      showToast('Check-in recorded successfully!', 'success');
      fetchAttendances();
    } catch (err) {
      showToast(err.message || 'Check-in failed', 'error');
    }
  };

  const handleCheckOut = async () => {
    const empId = getTargetEmployeeId();
    if (!empId) {
      showToast('Please select an employee to check out', 'warning');
      return;
    }

    try {
      await api.post('/attendance/check-out', { employee_id: empId });
      showToast('Check-out recorded successfully!', 'success');
      fetchAttendances();
    } catch (err) {
      showToast(err.message || 'Check-out failed', 'error');
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      employee_id: selectedEmployeeId || (employees[0]?.id || ''),
      date: new Date().toISOString().split('T')[0],
      check_in: '',
      check_out: '',
      status: 'PRESENT',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      employee_id: item.employee_id,
      date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
      check_in: item.check_in ? new Date(item.check_in).toISOString().substring(0, 16) : '',
      check_out: item.check_out ? new Date(item.check_out).toISOString().substring(0, 16) : '',
      status: item.status || 'PRESENT',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) {
      showToast('Please select an employee', 'warning');
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/attendance/${editingItem.id}`, formData);
        showToast('Attendance record updated!', 'success');
      } else {
        await api.post('/attendance', formData);
        showToast('Attendance record created!', 'success');
      }
      setIsModalOpen(false);
      fetchAttendances();
    } catch (err) {
      showToast(err.message || 'Failed to save attendance record', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/attendance/${deleteId}`);
      showToast('Attendance record deleted!', 'success');
      setDeleteId(null);
      fetchAttendances();
    } catch (err) {
      showToast(err.message || 'Failed to delete record', 'error');
    }
  };

  const filteredAttendances = attendances.filter((a) => {
    const matchesSearch = `${a.first_name} ${a.last_name} ${a.employee_number} ${a.department}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Attendance Log & Tracking</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track presence compliance, log daily check-ins, worked hours, and manage manual corrections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Employee Picker for Admin / HR */}
          {isAdminOrHR && employees.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 border border-plum-100 rounded-xl shadow-sm">
              <UserCheck className="w-4 h-4 text-plum-700 shrink-0" />
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_number})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Actions */}
          <button
            onClick={handleCheckIn}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <LogIn className="w-4 h-4" /> Check In
          </button>
          <button
            onClick={handleCheckOut}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> Check Out
          </button>

          {/* Admin Manual Log Modal Button */}
          {isAdminOrHR && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Manual Record
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-card border border-plum-100/60">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employee name or department..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-plum-700/20"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PRESENT">PRESENT</option>
            <option value="LATE">LATE</option>
            <option value="ABSENT">ABSENT</option>
            <option value="MANUAL_EDIT">MANUAL_EDIT</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading attendance records...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Check In</th>
                <th className="py-4 px-6">Check Out</th>
                <th className="py-4 px-6">Worked Hours</th>
                <th className="py-4 px-6">Overtime</th>
                <th className="py-4 px-6">Status</th>
                {isAdminOrHR && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No attendance logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((a) => (
                  <tr key={a.id} className="hover:bg-plum-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{a.first_name} {a.last_name}</div>
                      <div className="text-xs text-slate-400">{a.employee_number} ({a.department})</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {new Date(a.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-semibold">
                      {a.check_in ? new Date(a.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-4 px-6 text-slate-700 font-semibold">
                      {a.check_out ? new Date(a.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">{parseFloat(a.worked_hours || 0).toFixed(1)} h</td>
                    <td className="py-4 px-6 font-bold text-plum-700">{parseFloat(a.overtime_hours || 0).toFixed(1)} h</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${
                          a.status === 'PRESENT'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : a.status === 'LATE'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : a.status === 'ABSENT'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    {isAdminOrHR && (
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(a)}
                            className="p-1.5 text-slate-400 hover:text-plum-700 hover:bg-plum-50 rounded-lg transition-colors"
                            title="Edit Attendance"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(a.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Entry / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Attendance Entry' : 'Add Manual Attendance Record'}
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Employee</label>
            {isAdminOrHR ? (
              <select
                required
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-700/20"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_number})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                disabled
                value={`${user?.first_name} ${user?.last_name}`}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500"
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-700/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Check In Time</label>
              <input
                type="datetime-local"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-700/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Check Out Time</label>
              <input
                type="datetime-local"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-700/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-700/20"
            >
              <option value="PRESENT">PRESENT</option>
              <option value="LATE">LATE</option>
              <option value="ABSENT">ABSENT</option>
              <option value="MANUAL_EDIT">MANUAL_EDIT</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes / Reason</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Reason for manual entry or correction..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-plum-700/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-plum-700 text-white rounded-xl text-xs font-bold hover:bg-plum-800 shadow-md"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Attendance Record"
        message="Are you sure you want to permanently delete this attendance entry?"
      />
    </div>
  );
};

export default AttendancePage;
