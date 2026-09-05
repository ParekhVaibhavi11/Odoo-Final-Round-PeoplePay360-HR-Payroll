import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Clock, LogIn, LogOut, CheckCircle2, Loader2 } from 'lucide-react';

const AttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attendance');
      if (res.data?.items) setAttendances(res.data.items);
    } catch (err) {
      showToast(err.message || 'Failed to fetch attendance logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/check-in', { employee_id: user?.employee_id });
      showToast('Check-in recorded for today!', 'success');
      fetchAttendances();
    } catch (err) {
      showToast(err.message || 'Check-in failed', 'error');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/check-out', { employee_id: user?.employee_id });
      showToast('Check-out recorded for today!', 'success');
      fetchAttendances();
    } catch (err) {
      showToast(err.message || 'Check-out failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Attendance</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track daily presence, worked hours, overtime, and manual edits.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckIn}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" /> Check In
          </button>
          <button
            onClick={handleCheckOut}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Check Out
          </button>
        </div>
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
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Check In</th>
                <th className="py-4 px-6">Check Out</th>
                <th className="py-4 px-6">Worked Hours</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {attendances.map((a) => (
                <tr key={a.id} className="hover:bg-plum-50/40">
                  <td className="py-4 px-6 font-bold text-slate-800">{a.first_name} {a.last_name}</td>
                  <td className="py-4 px-6 text-slate-600">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-slate-600">{a.check_in ? new Date(a.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="py-4 px-6 text-slate-600">{a.check_out ? new Date(a.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">{a.worked_hours} h</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
