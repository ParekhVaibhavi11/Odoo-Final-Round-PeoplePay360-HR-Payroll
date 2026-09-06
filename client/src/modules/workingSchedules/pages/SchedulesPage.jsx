import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useToast } from '../../../context/ToastContext';
import { Clock, Plus, Loader2 } from 'lucide-react';

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get('/schedules');
      if (res.data?.items) setSchedules(res.data.items);
    } catch (err) {
      showToast(err.message || 'Failed to fetch schedules', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Working Schedules</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Configure weekly work patterns and automatically compute weekly hours.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-plum-700 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-6 shadow-card border border-plum-100/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{s.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">{s.type} Schedule</span>
                </div>
                <div className="bg-plum-50 border border-plum-200 px-3 py-1.5 rounded-xl text-sm font-bold text-plum-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-plum-700" />
                  {s.weekly_hours} Hours / Week
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Assigned Employees: <strong className="text-slate-800">{s.employee_count || 0}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;
