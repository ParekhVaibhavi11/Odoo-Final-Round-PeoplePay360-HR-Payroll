import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../../config/api';

const EmployeeFormModal = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    job_position: 'Developer',
    schedule_id: '',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/schedules').then((res) => {
        if (res.data?.items) setSchedules(res.data.items);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Engineering',
        job_position: initialData.job_position || 'Developer',
        schedule_id: initialData.schedule_id || '',
        status: initialData.status || 'ACTIVE',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        job_position: 'Developer',
        schedule_id: '',
        status: 'ACTIVE',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {initialData ? 'Edit Employee Profile' : 'Create / Add Employee'}
            </h3>
            <p className="text-xs text-slate-500">Capture employee details and assign working schedule.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <form id="employee-form" onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">First Name</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Last Name</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="employee@company.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
              >
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Job Position</label>
              <input
                type="text"
                required
                value={formData.job_position}
                onChange={(e) => setFormData({ ...formData, job_position: e.target.value })}
                placeholder="Developer / HR Specialist"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
              />
            </div>
          </div>

          {/* Working Schedule Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Assigned Schedule</label>
            <select
              value={formData.schedule_id}
              onChange={(e) => setFormData({ ...formData, schedule_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
            >
              <option value="">Select Working Schedule</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.weekly_hours}h/week)
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          {initialData && onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(initialData.id)}
              className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-sm font-semibold border border-rose-200"
            >
              Delete
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="employee-form"
              disabled={loading}
              className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-semibold text-sm rounded-xl shadow-md flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? 'Update Employee' : 'Create Employee'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeFormModal;
