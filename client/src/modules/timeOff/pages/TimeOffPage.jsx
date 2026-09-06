import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Plus, Check, X, Loader2 } from 'lucide-react';

const TimeOffPage = () => {
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'allocations'
  const [requests, setRequests] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestModal, setRequestModal] = useState(false);

  const [reqForm, setReqForm] = useState({
    time_off_type_id: '',
    start_date: '',
    end_date: '',
  });

  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rRes, aRes, tRes] = await Promise.all([
        api.get('/time-off/requests'),
        api.get('/time-off/allocations'),
        api.get('/time-off/types'),
      ]);
      if (rRes.data?.items) setRequests(rRes.data.items);
      if (aRes.data?.items) setAllocations(aRes.data.items);
      if (tRes.data) setTypes(tRes.data);
    } catch (err) {
      showToast(err.message || 'Failed to fetch leave records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/time-off/requests', {
        ...reqForm,
        employee_id: user?.employee_id,
      });
      showToast('Time off request submitted successfully', 'success');
      setRequestModal(false);
      fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to submit leave request', 'error');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/time-off/requests/${id}/status`, { status });
      showToast(`Request ${status.toLowerCase()} successfully`, 'success');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Time Off</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage leave requests, leave type policies, and employee allocations.
          </p>
        </div>
        <button
          onClick={() => setRequestModal(true)}
          className="px-5 py-2.5 bg-plum-700 hover:bg-plum-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Request Time Off
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-bold border-b-2 ${
            activeTab === 'requests' ? 'border-plum-700 text-plum-700' : 'border-transparent text-slate-500'
          }`}
        >
          Leave Requests
        </button>
        <button
          onClick={() => setActiveTab('allocations')}
          className={`pb-3 text-sm font-bold border-b-2 ${
            activeTab === 'allocations' ? 'border-plum-700 text-plum-700' : 'border-transparent text-slate-500'
          }`}
        >
          Leave Allocations
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
        </div>
      ) : activeTab === 'requests' ? (
        <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Leave Type</th>
                <th className="py-4 px-6">Dates</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Status</th>
                {['ADMIN', 'HR_MANAGER'].includes(user?.role) && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-plum-50/40">
                  <td className="py-4 px-6 font-bold text-slate-800">{r.first_name} {r.last_name}</td>
                  <td className="py-4 px-6 font-semibold text-plum-800">{r.leave_type_name}</td>
                  <td className="py-4 px-6 text-slate-600">
                    {new Date(r.start_date).toLocaleDateString()} - {new Date(r.end_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">{r.duration} Days</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      r.status === 'REFUSED' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  {['ADMIN', 'HR_MANAGER'].includes(user?.role) && (
                    <td className="py-4 px-6 text-right">
                      {r.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(r.id, 'APPROVED')}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(r.id, 'REFUSED')}
                            className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-plum-100/60 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Leave Type</th>
                <th className="py-4 px-6">Allocated</th>
                <th className="py-4 px-6">Taken</th>
                <th className="py-4 px-6">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {allocations.map((a) => (
                <tr key={a.id} className="hover:bg-plum-50/40">
                  <td className="py-4 px-6 font-bold text-slate-800">{a.first_name} {a.last_name}</td>
                  <td className="py-4 px-6 font-semibold text-plum-800">{a.leave_type_name}</td>
                  <td className="py-4 px-6 text-slate-700 font-bold">{a.allocated_amount} Days</td>
                  <td className="py-4 px-6 text-slate-500">{a.taken_amount} Days</td>
                  <td className="py-4 px-6 font-extrabold text-emerald-700">{a.remaining_amount} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Requesting Leave */}
      {requestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Submit Leave Request</h3>
            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Time Off Type</label>
                <select
                  required
                  value={reqForm.time_off_type_id}
                  onChange={(e) => setReqForm({ ...reqForm, time_off_type_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm"
                >
                  <option value="">Select Leave Type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={reqForm.start_date}
                    onChange={(e) => setReqForm({ ...reqForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={reqForm.end_date}
                    onChange={(e) => setReqForm({ ...reqForm, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setRequestModal(false)} className="px-4 py-2 border rounded-xl text-sm font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-plum-700 text-white rounded-xl text-sm font-semibold">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeOffPage;
