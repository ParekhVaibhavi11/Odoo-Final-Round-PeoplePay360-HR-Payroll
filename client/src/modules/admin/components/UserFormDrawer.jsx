import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Loader2, Info } from 'lucide-react';
import { getEmployees } from '../../../services/employeeService';

const UserFormDrawer = ({ isOpen, onClose, onSave, initialData }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getEmployees({ limit: 100 }).then((res) => {
        if (res.data?.items) setEmployees(res.data.items);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id || '',
        email: initialData.email || '',
        password: '',
        role: initialData.role || 'EMPLOYEE',
        active: true,
      });
    } else {
      setFormData({
        employee_id: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
        active: true,
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

  const handleEmployeeSelect = (empId) => {
    const selected = employees.find((e) => e.id === parseInt(empId, 10));
    setFormData((prev) => ({
      ...prev,
      employee_id: empId,
      email: selected ? selected.email : prev.email,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header matching Screenshot 4 */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {initialData ? 'Edit User Account' : 'Create / Edit User'}
            </h3>
            <p className="text-xs text-slate-500">Create an account and assign system access.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Form Form Controls matching Screenshot 4 */}
        <form id="user-drawer-form" onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto">
          
          {/* Employee Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Employee</label>
            <select
              value={formData.employee_id}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Work Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="employee@company.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!initialData}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter temporary password"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Roles Selection Radios matching Screenshot 4 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Roles</label>
            <div className="space-y-2.5 text-sm text-slate-700">
              {[
                { id: 'EMPLOYEE', label: 'Employee' },
                { id: 'HR_MANAGER', label: 'HR Manager' },
                { id: 'HR_PAYROLL_USER', label: 'HR Payroll User' },
                { id: 'HR_PAYROLL_MANAGER', label: 'HR Payroll Manager' },
                { id: 'ADMIN', label: 'Admin' },
              ].map((roleItem) => (
                <label key={roleItem.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={roleItem.id}
                    checked={formData.role === roleItem.id}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-4 h-4 text-plum-700 focus:ring-plum-700 border-slate-300"
                  />
                  <span className="font-medium text-slate-800">{roleItem.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Account Status Switch */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Account Status</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.active ? 'bg-plum-700' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-xs font-bold text-slate-700">{formData.active ? 'Active' : 'Disabled'}</span>
            </div>
          </div>

          {/* Role Description Notice Box matching Screenshot 4 */}
          <div className="bg-plum-50/70 border border-plum-100 rounded-2xl p-4 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-plum-900">
              <Info className="w-4 h-4 text-plum-700" />
              <span>Access is controlled by the assigned role.</span>
            </div>
            <div className="grid grid-cols-12 gap-1 pt-1 text-[11px]">
              <span className="col-span-4 font-semibold text-slate-700">Employee</span>
              <span className="col-span-8 text-slate-500">: Personal HR access</span>
              <span className="col-span-4 font-semibold text-slate-700">HR Manager</span>
              <span className="col-span-8 text-slate-500">: HR operations</span>
              <span className="col-span-4 font-semibold text-slate-700">Payroll User</span>
              <span className="col-span-8 text-slate-500">: Payroll processing</span>
              <span className="col-span-4 font-semibold text-slate-700">Payroll Manager</span>
              <span className="col-span-8 text-slate-500">: Payroll configuration</span>
              <span className="col-span-4 font-semibold text-slate-700">Admin</span>
              <span className="col-span-8 text-slate-500">: Full system access</span>
            </div>
          </div>

        </form>

        {/* Footer Action Buttons matching Screenshot 4 */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-drawer-form"
            disabled={loading}
            className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-semibold text-sm rounded-xl shadow-md flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? 'Update User' : 'Create User'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserFormDrawer;
