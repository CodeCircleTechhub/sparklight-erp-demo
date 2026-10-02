import { useCallback, useEffect, useState } from 'react';
import {
  CalendarCheck, Clock, AlertTriangle, CheckCircle, Calendar, Plus, Save, Loader2, AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const isOverdue = (f: any) =>
  f.status === 'Scheduled' && new Date(f.scheduledDate).getTime() < new Date().setHours(0, 0, 0, 0);

const statusOf = (f: any) => (isOverdue(f) ? 'Overdue' : f.status);

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-800',
  Overdue: 'bg-red-100 text-red-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

export default function FollowUps() {
  const [items, setItems] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ scheduled: 0, overdue: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState({ patient: '', scheduledDate: '', reason: '', notes: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [fuRes, patientRes] = await Promise.all([
        api.get('/doctor/follow-ups'),
        api.get('/doctor/patients'),
      ]);
      setItems(fuRes.data.items || []);
      setStats(fuRes.data.stats || { scheduled: 0, overdue: 0, completed: 0, total: 0 });
      setPatients(patientRes.data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient || !form.scheduledDate || !form.reason.trim()) {
      setError('Select a patient, pick a date and give a reason.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/doctor/follow-ups', form);
      setForm({ patient: '', scheduledDate: '', reason: '', notes: '' });
      setShowForm(false);
      setNotice('Follow-up scheduled.');
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not schedule follow-up');
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    setError('');
    try {
      await api.put(`/doctor/follow-ups/${id}`, { status });
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not update follow-up');
    } finally {
      setBusy(null);
    }
  };

  const cards = [
    { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total', value: stats.total, icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader title="Follow-ups" icon={CalendarCheck} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{notice}</div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Scheduled follow-ups</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New follow-up
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3">
            <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} className={field}>
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.patientId})
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.scheduledDate}
              onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
              className={field}
            />
            <input
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Reason"
              className={field}
            />
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Schedule
            </button>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes (optional)"
              className={`${field} md:col-span-4`}
            />
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading follow-ups...
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No follow-ups scheduled yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scheduled Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((f) => {
                  const status = statusOf(f);
                  return (
                    <tr key={f._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.patientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.reason}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(f.scheduledDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{f.doctorName || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {f.status === 'Scheduled' && (
                            <>
                              <button
                                onClick={() => setStatus(f._id, 'Completed')}
                                disabled={busy === f._id}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => setStatus(f._id, 'Cancelled')}
                                disabled={busy === f._id}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
