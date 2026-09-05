import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import UserFormDrawer from '../components/UserFormDrawer';
import { Plus, Search, Filter, Pencil, MoreHorizontal, Loader2 } from 'lucide-react';
import { ROLE_LABELS } from '../../../config/constants';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { showToast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        await api.put(`/admin/users/${selectedUser.id}/role`, { role: formData.role });
        showToast('User role updated successfully', 'success');
      } else {
        await api.post('/admin/users', formData);
        showToast('New user created successfully', 'success');
      }
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleOpenDrawer = (user = null) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const getInitials = (email) => {
    return email ? email[0].toUpperCase() : 'U';
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.first_name && `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Title Header matching Screenshot 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage user accounts, employee access and system roles.
          </p>
        </div>
        <button
          onClick={() => handleOpenDrawer()}
          className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New User
        </button>
      </div>

      {/* Action Controls matching Screenshot 4 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users, employees or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-plum-700 shadow-sm"
          />
        </div>

        <select className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl focus:outline-none shadow-sm">
          <option>All Roles</option>
          <option>Admin</option>
          <option>HR Manager</option>
          <option>Payroll User</option>
          <option>Payroll Manager</option>
          <option>Employee</option>
        </select>

        <select className="px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl focus:outline-none shadow-sm">
          <option>All Status</option>
          <option>Active</option>
          <option>Disabled</option>
        </select>

        <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm">
          <Filter className="w-4 h-4 text-slate-400" /> Filters
        </button>
      </div>

      {/* Main Table matching Screenshot 4 */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Loading user accounts...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Work Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-plum-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-plum-100 text-plum-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {getInitials(u.email)}
                        </div>
                        <span className="font-bold text-slate-800">
                          {u.first_name ? `${u.first_name} ${u.last_name}` : u.email.split('@')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {u.first_name ? `${u.first_name} ${u.last_name}` : '—'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{u.email}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-plum-50 text-plum-800 border border-plum-200">
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDrawer(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-plum-700 hover:bg-plum-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500">
            Showing 1 to {filteredUsers.length} of {users.length} users
          </div>
        </div>
      )}

      {/* User Form Drawer */}
      <UserFormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveUser}
        initialData={selectedUser}
      />
    </div>
  );
};

export default UserManagementPage;
