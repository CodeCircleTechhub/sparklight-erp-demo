import { useCallback, useEffect, useState } from 'react';
import { FileText, Search, Plus, Save, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { COMMON_CONDITIONS } from '../../lib/clinicalOptions';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const typeColors: Record<string, string> = {
  Consultation: 'bg-green-100 text-green-800',
  'Follow-up': 'bg-purple-100 text-purple-800',
  Checkup: 'bg-blue-100 text-blue-800',
  Surgery: 'bg-red-100 text-red-800',
  Emergency: 'bg-orange-100 text-orange-800',
  'Lab Test': 'bg-gray-100 text-gray-800',
};

export default function MedicalRecords() {
  const [items, setItems] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', type: 'Consultation', diagnosis: '', notes: '' });

  const fetchData = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (q) params.search = q;
      const [recordRes, patientRes] = await Promise.all([
        api.get('/doctor/records', { params }),
        api.get('/doctor/patients'),
      ]);
      setItems(recordRes.data.items || []);
      setPatients(patientRes.data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const t = setTimeout(() => fetchData(search.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) {
      setError('Select a patient first.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/doctor/records', form);
      setForm({ patient: '', type: 'Consultation', diagnosis: '', notes: '' });
      setShowForm(false);
      await fetchData(search.trim() || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save record');
    } finally {
      setSaving(false);
    }
  };

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader title="Medical Records" icon={FileText} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3 justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records by patient name or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New record
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
              <option>Checkup</option>
              <option>Surgery</option>
              <option>Emergency</option>
              <option>Lab Test</option>
            </select>
            <input
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              placeholder="Diagnosis (optional)"
              list="record-diagnosis-options"
              className={field}
            />
            <datalist id="record-diagnosis-options">
              {COMMON_CONDITIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
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
              placeholder="Notes"
              rows={2}
              className={`${field} md:col-span-4`}
            />
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading records...
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Record ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.recordId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.patientName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[r.type] || 'bg-gray-100 text-gray-700'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(r.date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.doctorName || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={r.notes}>
                      {r.diagnosis ? `${r.diagnosis} — ${r.notes || ''}`.trim() : r.notes || '—'}
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
