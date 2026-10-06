import { useState, useEffect, useCallback } from 'react';
import {
  LayoutList, Users, Clock, Stethoscope, CheckCircle,
  Loader2, AlertCircle, Megaphone, Plus, X, Search, PlayCircle, Ban, CheckCheck, Calendar
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-700',
  Called: 'bg-blue-100 text-blue-700',
  'In Consultation': 'bg-green-100 text-green-700',
  Completed: 'bg-violet-100 text-violet-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = (() => {
  const y = new Date().getFullYear();
  return [y - 1, y, y + 1];
})();

export default function QueueManagement() {
  const [queue, setQueue] = useState<any[]>([]);
  const [stats, setStats] = useState({ inQueue: 0, waiting: 0, withDoctor: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [patientQuery, setPatientQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [addError, setAddError] = useState('');
  const [vDay, setVDay] = useState(() => String(new Date().getDate()));
  const [vMonth, setVMonth] = useState(() => String(new Date().getMonth()));
  const [vYear, setVYear] = useState(() => String(new Date().getFullYear()));

  const viewDate = (() => {
    const d = new Date(Number(vYear), Number(vMonth), Number(vDay), 12, 0, 0);
    if (d.getFullYear() !== Number(vYear) || d.getMonth() !== Number(vMonth) || d.getDate() !== Number(vDay)) return null;
    return d;
  })();
  const viewDateIso = viewDate ? viewDate.toISOString() : '';
  const isToday = (() => {
    const t = new Date();
    return viewDate
      ? viewDate.getDate() === t.getDate() && viewDate.getMonth() === t.getMonth() && viewDate.getFullYear() === t.getFullYear()
      : true;
  })();
  const viewDateLabel = viewDate
    ? viewDate.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  const fetchQueue = useCallback(async () => {
    try {
      const { data } = await api.get('/receptionist/queue', {
        params: viewDateIso ? { date: viewDateIso } : {},
      });
      setQueue(data.queue || []);
      setStats({
        inQueue: data.inQueue ?? 0,
        waiting: data.waiting ?? 0,
        withDoctor: data.withDoctor ?? 0,
        completed: data.completed ?? 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  }, [viewDateIso]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (!showAdd) return;
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get('/patients', {
          params: patientQuery ? { search: patientQuery } : {},
        });
        setPatients(data.patients || []);
      } catch {
        setPatients([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [patientQuery, showAdd]);

  useEffect(() => {
    if (!showAdd) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAdd(false);
        setAddError('');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showAdd]);

  const callNext = async () => {
    setActionLoading(true);
    setError('');
    try {
      const { data } = await api.put('/receptionist/queue/call-next');
      setError('');
      alert(data.message || 'Called next patient');
      await fetchQueue();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to call next patient');
    } finally {
      setActionLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(true);
    setError('');
    try {
      await api.put(`/receptionist/queue/${id}`, { status });
      await fetchQueue();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const addToQueue = async () => {
    if (!selectedPatient) {
      setAddError('Select a patient first');
      return;
    }
    setAddError('');
    try {
      await api.post('/receptionist/queue', {
        patient: selectedPatient._id,
        department,
        reason,
        date: viewDateIso || undefined,
      });
      setShowAdd(false);
      setSelectedPatient(null);
      setPatientQuery('');
      setDepartment('');
      setReason('');
      await fetchQueue();
    } catch (err: any) {
      setAddError(err.response?.data?.message || 'Failed to add patient to queue');
    }
  };

  const statCards = [
    { label: 'In Queue', value: stats.inQueue, icon: Users, color: 'bg-blue-500' },
    { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'bg-amber-500' },
    { label: 'With Doctor', value: stats.withDoctor, icon: Stethoscope, color: 'bg-green-500' },
    { label: isToday ? 'Completed Today' : 'Completed', value: stats.completed, icon: CheckCircle, color: 'bg-violet-500' },
  ];

  const patientName = (q: any) =>
    q.patientName ||
    (q.patient ? [q.patient.firstName, q.patient.surname].filter(Boolean).join(' ') : 'Unknown');

  const timeWaiting = (joinedAt: string) => {
    if (!joinedAt) return '-';
    const mins = Math.max(0, Math.floor((Date.now() - new Date(joinedAt).getTime()) / 60000));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Queue Management" icon={LayoutList} />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={callNext}
            disabled={actionLoading || stats.waiting === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Megaphone className="w-4 h-4" />
            Call Next Patient
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add to Queue
          </button>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 text-xs font-medium hidden sm:inline">Queue for</span>
            <select
              value={vDay}
              onChange={(e) => setVDay(e.target.value)}
              className="border-0 bg-transparent text-sm text-gray-900 focus:outline-none cursor-pointer"
              title="Day"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={vMonth}
              onChange={(e) => setVMonth(e.target.value)}
              className="border-0 bg-transparent text-sm text-gray-900 focus:outline-none cursor-pointer"
              title="Month"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={vYear}
              onChange={(e) => setVYear(e.target.value)}
              className="border-0 bg-transparent text-sm text-gray-900 focus:outline-none cursor-pointer"
              title="Year"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {isToday && <span className="text-xs text-emerald-600 font-medium">Today</span>}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Queue</h2>
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{viewDateLabel}</span>
              <span className="text-gray-400"> · numbering restarts every day</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Loading queue...</span>
              </div>
            ) : queue.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">Queue is empty</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Position</th>
                    <th className="pb-3 font-medium">Patient ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Time Waiting</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {queue.map((q) => (
                    <tr key={q._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">#{q.position}</td>
                      <td className="py-3 font-medium text-blue-600">{q.patientId || q.patient?.patientId || '-'}</td>
                      <td className="py-3 text-gray-900">{patientName(q)}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{timeWaiting(q.joinedAt)}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{q.department || 'General'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[q.status] || 'bg-gray-100 text-gray-700'}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          {q.status === 'Called' && (
                            <button
                              onClick={() => updateStatus(q._id, 'In Consultation')}
                              disabled={actionLoading}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Start consultation"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          {q.status === 'In Consultation' && (
                            <button
                              onClick={() => updateStatus(q._id, 'Completed')}
                              disabled={actionLoading}
                              className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Complete"
                            >
                              <CheckCheck className="w-4 h-4" />
                            </button>
                          )}
                          {(q.status === 'Waiting' || q.status === 'Called' || q.status === 'In Consultation') && (
                            <button
                              onClick={() => updateStatus(q._id, 'Cancelled')}
                              disabled={actionLoading}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Skip / Cancel"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showAdd && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowAdd(false);
            setAddError('');
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add to Queue</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  For {viewDateLabel}
                  {!isToday && <span className="text-indigo-600 font-medium"> (scheduled)</span>}
                </p>
              </div>
              <button
                onClick={() => { setShowAdd(false); setAddError(''); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {addError && <p className="text-sm text-red-600">{addError}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Patient</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={patientQuery}
                    onChange={(e) => setPatientQuery(e.target.value)}
                    placeholder="Name, phone, or patient ID..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {patients.length > 0 && !selectedPatient && (
                <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
                  {patients.slice(0, 8).map((p) => (
                    <button
                      key={p._id}
                      onClick={() => setSelectedPatient(p)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
                    >
                      <span className="font-medium">{[p.firstName, p.surname].filter(Boolean).join(' ')}</span>
                      <span className="text-gray-400 ml-2">{p.patientId}</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedPatient && (
                <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm">
                  Selected:{' '}
                  <span className="font-medium">
                    {[selectedPatient.firstName, selectedPatient.surname].filter(Boolean).join(' ')}
                  </span>
                  <span className="text-gray-500 ml-2">{selectedPatient.patientId}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => { setShowAdd(false); setAddError(''); }}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addToQueue}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
