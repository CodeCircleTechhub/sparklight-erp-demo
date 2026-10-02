import { useCallback, useEffect, useState } from 'react';
import { ClipboardList, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { COMMON_CONDITIONS } from '../../lib/clinicalOptions';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export default function DiagnosisPage() {
  const [items, setItems] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({
    patient: '', symptoms: '', findings: '', diagnosis: '', treatment: '', followUp: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dxRes, patientRes] = await Promise.all([
        api.get('/doctor/diagnoses'),
        api.get('/doctor/patients'),
      ]);
      setItems(dxRes.data.items || []);
      setPatients(patientRes.data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load diagnoses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient || !form.diagnosis.trim()) {
      setError('Select a patient and enter a diagnosis.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const { data } = await api.post('/doctor/diagnoses', form);
      setForm({ patient: '', symptoms: '', findings: '', diagnosis: '', treatment: '', followUp: '' });
      setNotice(
        data.followUp
          ? 'Diagnosis saved and follow-up scheduled.'
          : 'Diagnosis saved.'
      );
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save diagnosis');
    } finally {
      setSaving(false);
    }
  };

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader title="Diagnosis" icon={ClipboardList} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Diagnosis</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className={field}
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.patientId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
              <textarea
                value={form.symptoms}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                rows={3}
                placeholder="Describe patient symptoms..."
                className={field}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Findings</label>
              <textarea
                value={form.findings}
                onChange={(e) => setForm({ ...form, findings: e.target.value })}
                rows={2}
                placeholder="Physical examination findings..."
                className={field}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="Enter diagnosis... (e.g. Malaria, Typhoid, Pregnancy)"
                list="diagnosis-options"
                className={field}
              />
              <datalist id="diagnosis-options">
                {COMMON_CONDITIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
              <textarea
                value={form.treatment}
                onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                rows={2}
                placeholder="Describe treatment plan..."
                className={field}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={form.followUp}
                onChange={(e) => setForm({ ...form, followUp: e.target.value })}
                className={field}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Diagnosis
            </button>
          </div>
        </form>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Diagnoses</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No diagnoses recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{d.diagnosisId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{d.patientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(d.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.diagnosis}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.doctorName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
