import { useState, useEffect, useCallback } from 'react';
import { Thermometer, Activity, Save, Loader2, AlertCircle, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const painLevelColor = (level: number) => {
  if (level <= 3) return 'bg-green-100 text-green-800';
  if (level <= 6) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

const emptyForm = {
  patient: '',
  temperature: '',
  pulse: '',
  systolic: '',
  diastolic: '',
  respRate: '',
  o2Sat: '',
  painLevel: '',
  notes: '',
};

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

export default function VitalSigns() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPatients = useCallback(async () => {
    try {
      const { data } = await api.get('/nurse/patients', { params: { all: 1 } });
      setPatients(data.patients || []);
    } catch {
      setPatients([]);
    }
  }, []);

  const loadVitals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/nurse/vitals', { params: { limit: 100 } });
      setVitals(data.vitals || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load recordings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
    loadVitals();
  }, [loadPatients, loadVitals]);

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

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
      const [sys, dia] = [form.systolic, form.diastolic];
      const payload = {
        patient: form.patient,
        temperature: form.temperature,
        bp: sys && dia ? `${sys}/${dia}` : '',
        pulse: form.pulse,
        respRate: form.respRate,
        o2Sat: form.o2Sat,
        painLevel: form.painLevel === '' ? 0 : form.painLevel,
        notes: form.notes,
      };
      if (editingId) {
        await api.put(`/nurse/vitals/${editingId}`, payload);
        setNotice('Vital signs updated.');
      } else {
        await api.post('/nurse/vitals', payload);
        setNotice('Vital signs recorded.');
      }
      setForm({ ...emptyForm });
      setEditingId('');
      await loadVitals();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save vital signs');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (v: any) => {
    const [sys = '', dia = ''] = String(v.bp || '').split('/');
    setForm({
      patient: v.patient?._id || v.patient || '',
      temperature: v.temperature ?? '',
      pulse: v.pulse ?? '',
      systolic: sys,
      diastolic: dia,
      respRate: v.respRate ?? '',
      o2Sat: v.o2Sat ?? '',
      painLevel: v.painLevel ?? 0,
      notes: v.notes || '',
    });
    setEditingId(String(v._id));
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this vital signs record?')) return;
    setError('');
    try {
      await api.delete(`/nurse/vitals/${id}`);
      if (editingId === id) {
        setEditingId('');
        setForm({ ...emptyForm });
      }
      await loadVitals();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not delete the record');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Vital Signs Recording" description="Record and track patient vital signs" />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {editingId ? 'Edit Vital Signs' : 'New Vital Signs Recording'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className={field}
              >
                <option value="">Select patient</option>
    {patients.map((p) => (
      <option key={p._id} value={p._id}>
        {p.name} {p.patientId ? `(${p.patientId})` : ''}{p.admitted ? ' — Admitted' : ''}
      </option>
    ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.temperature}
                  onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                  placeholder="98.6"
                  className={field}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pulse Rate (bpm)</label>
                <input
                  type="number"
                  value={form.pulse}
                  onChange={(e) => setForm({ ...form, pulse: e.target.value })}
                  placeholder="72"
                  className={field}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={form.systolic}
                  onChange={(e) => setForm({ ...form, systolic: e.target.value })}
                  placeholder="120"
                  className={field}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={form.diastolic}
                  onChange={(e) => setForm({ ...form, diastolic: e.target.value })}
                  placeholder="80"
                  className={field}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate (/min)</label>
                <input
                  type="number"
                  value={form.respRate}
                  onChange={(e) => setForm({ ...form, respRate: e.target.value })}
                  placeholder="16"
                  className={field}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                <input
                  type="number"
                  value={form.o2Sat}
                  onChange={(e) => setForm({ ...form, o2Sat: e.target.value })}
                  placeholder="98"
                  className={field}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={form.painLevel}
                onChange={(e) => setForm({ ...form, painLevel: e.target.value })}
                placeholder="2"
                className={field}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observations..."
                className={field}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update Vital Signs' : 'Save Vital Signs'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId('');
                    setForm({ ...emptyForm });
                  }}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Recent Recordings
            </h3>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
              </div>
            ) : vitals.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">No recordings yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Temp</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">BP</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pulse</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">O2</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Pain</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vitals.map((rec) => (
                    <tr key={rec._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {rec.patient
                          ? [rec.patient.firstName, rec.patient.surname].filter(Boolean).join(' ')
                          : rec.patientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {rec.temperature ?? '—'}{rec.temperature ? '°' : ''}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.bp || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.pulse ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{rec.o2Sat ? `${rec.o2Sat}%` : '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${painLevelColor(
                            rec.painLevel || 0
                          )}`}
                        >
                          {rec.painLevel ?? 0}/10
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(rec.recordedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(rec)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          {user?.role === 'super-admin' && (
                            <button
                              onClick={() => remove(String(rec._id))}
                              className="p-1.5 hover:bg-gray-100 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
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
    </div>
  );
}
