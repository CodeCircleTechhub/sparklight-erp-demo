import { useCallback, useEffect, useState } from 'react';
import { Stethoscope, Calendar, CheckCircle, Clock, CalendarCheck, Plus, Loader2, AlertCircle, Save } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Scheduled: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

export default function Consultations() {
  const [items, setItems] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, completed: 0, followUp: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', type: 'Consultation', chiefComplaint: '', notes: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, patientRes] = await Promise.all([
        api.get('/doctor/consultations'),
        api.get('/doctor/patients'),
      ]);
      setItems(listRes.data.items || []);
      setStats(listRes.data.stats || { today: 0, week: 0, completed: 0, followUp: 0 });
      setPatients(patientRes.data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load consultations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) {
      setError('Select a patient first.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/doctor/consultations', form);
      setForm({ patient: '', type: 'Consultation', chiefComplaint: '', notes: '' });
      setShowForm(false);
      setNotice('Consultation recorded.');
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save consultation');
    } finally {
      setSaving(false);
    }
  };

  const cards = [
    { label: 'Today', value: stats.today, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'This Week', value: stats.week, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Follow-up', value: stats.followUp, icon: CalendarCheck, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader title="Consultations" icon={Stethoscope} />

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
          <h2 className="text-sm font-semibold text-gray-700">My consultations</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New consultation
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
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={field}>
              <option>Consultation</option>
              <option>Follow-up</option>
              <option>Emergency</option>
              <option>Telemedicine</option>
            </select>
            <input
              value={form.chiefComplaint}
              onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })}
              placeholder="Chief complaint"
              className={field}
            />
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes (optional)"
              rows={2}
              className={`${field} md:col-span-4`}
            />
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading consultations...
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No consultations recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Consultation ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prescription</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{c.consultationId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{c.patientName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(c.date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.diagnosis || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.prescription || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
