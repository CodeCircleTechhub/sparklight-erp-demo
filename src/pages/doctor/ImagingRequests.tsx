import { useCallback, useEffect, useState } from 'react';
import { Scan, Clock, CheckCircle, ClipboardList, Plus, Save, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { IMAGING_TESTS } from '../../lib/clinicalOptions';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const typeColors: Record<string, string> = {
  'X-Ray': 'bg-blue-100 text-blue-800',
  'X-ray': 'bg-blue-100 text-blue-800',
  MRI: 'bg-purple-100 text-purple-800',
  'CT Scan': 'bg-indigo-100 text-indigo-800',
  Ultrasound: 'bg-teal-100 text-teal-800',
};

const priorityColors: Record<string, string> = {
  STAT: 'bg-red-100 text-red-800',
  Urgent: 'bg-yellow-100 text-yellow-800',
  Normal: 'bg-green-100 text-green-800',
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

export default function ImagingRequests() {
  const [items, setItems] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, processing: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', testType: '', priority: 'Normal', notes: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, patientRes] = await Promise.all([
        api.get('/doctor/lab-requests', { params: { kind: 'imaging' } }),
        api.get('/doctor/patients'),
      ]);
      setItems(listRes.data.items || []);
      setStats(listRes.data.stats || { pending: 0, processing: 0, completed: 0, total: 0 });
      setPatients(patientRes.data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load imaging requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient || !form.testType.trim()) {
      setError('Select a patient and enter the imaging type.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/doctor/lab-requests', { ...form, kind: 'imaging' });
      setForm({ patient: '', testType: '', priority: 'Normal', notes: '' });
      setShowForm(false);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not create imaging request');
    } finally {
      setSaving(false);
    }
  };

  const cards = [
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total', value: stats.total, icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader title="Imaging Requests" icon={Scan} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Requests I raised</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New imaging request
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-3">
            <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} className={field}>
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.patientId})
                </option>
              ))}
            </select>
            <input
              value={form.testType}
              onChange={(e) => setForm({ ...form, testType: e.target.value })}
              placeholder="Type (e.g. X-Ray, MRI)"
              list="imaging-test-options"
              className={`${field} md:col-span-2`}
            />
            <datalist id="imaging-test-options">
              {IMAGING_TESTS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className={field}
            >
              <option>Normal</option>
              <option>Urgent</option>
              <option>STAT</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Order
            </button>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Clinical notes (optional)"
              className={`${field} md:col-span-5`}
            />
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading requests...
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No imaging requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.testId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.patientName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[r.testType] || 'bg-gray-100 text-gray-700'}`}>
                        {r.testType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[r.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {r.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(r.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-gray-100 text-gray-600'}`}>
                        {r.status}
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
