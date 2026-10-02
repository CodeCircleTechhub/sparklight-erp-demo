import { useCallback, useEffect, useState } from 'react';
import { FlaskConical, Clock, Cog, CheckCircle, ClipboardList, Plus, Save, Loader2, AlertCircle, Eye, Download, X, FileText, Paperclip } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { COMMON_TESTS } from '../../lib/clinicalOptions';
import api from '../../services/api';
import { downloadLabResultPdf, downloadLabAttachment } from '../../utils/downloadLabFile';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

const shortResult = (r?: string) => (!r ? '—' : r.length > 70 ? `${r.slice(0, 70)}…` : r);

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

export default function LabRequests() {
  const [items, setItems] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, processing: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient: '', testType: '', priority: 'Normal', notes: '' });
  const [viewing, setViewing] = useState<any | null>(null);
  const [dlBusy, setDlBusy] = useState(false);
  const [dlError, setDlError] = useState('');

  const grab = async (fn: () => Promise<void>) => {
    setDlBusy(true);
    setDlError('');
    try {
      await fn();
    } catch (err: any) {
      setDlError(err.response?.data?.message || 'Download failed');
    } finally {
      setDlBusy(false);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listRes, patientRes] = await Promise.all([
        api.get('/doctor/lab-requests', { params: { kind: 'lab' } }),
        api.get('/doctor/patients'),
      ]);
      setItems(listRes.data.items || []);
      setStats(listRes.data.stats || { pending: 0, processing: 0, completed: 0, total: 0 });
      setPatients(patientRes.data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load lab requests');
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
      setError('Select a patient and enter the test type.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/doctor/lab-requests', { ...form, kind: 'lab' });
      setForm({ patient: '', testType: '', priority: 'Normal', notes: '' });
      setShowForm(false);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not create lab request');
    } finally {
      setSaving(false);
    }
  };

  const cards = [
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Processing', value: stats.processing, icon: Cog, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total', value: stats.total, icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <PageHeader title="Laboratory Requests" icon={FlaskConical} />

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

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Requests I raised</h2>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New lab request
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
              placeholder="Test type (e.g. Malaria, Typhoid, Pregnancy, FBC)"
              list="lab-test-options"
              className={`${field} md:col-span-2`}
            />
            <datalist id="lab-test-options">
              {COMMON_TESTS.map((t) => (
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
          <p className="py-12 text-center text-sm text-gray-500">No lab requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Result</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.testId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.patientName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.testType}</td>
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
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[220px]">
                      {r.status === 'Completed' && r.result ? (
                        <span className="text-green-700">{shortResult(r.result)}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setDlError('');
                          setViewing(r);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewing(null)}>
          <div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {viewing.testId} — {viewing.testType}
                </h3>
                <p className="text-sm text-gray-500">
                  {viewing.patientName} · ordered {fmtDate(viewing.date)} ·{' '}
                  <span className={`font-medium ${viewing.status === 'Completed' ? 'text-green-700' : 'text-gray-600'}`}>{viewing.status}</span>
                </p>
              </div>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {dlError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {dlError}
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Result</p>
              {viewing.status === 'Completed' && viewing.result ? (
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{viewing.result}</p>
              ) : (
                <p className="text-sm text-gray-400">No result released yet.</p>
              )}
              {viewing.notes && (
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium text-gray-600">Notes:</span> {viewing.notes}
                </p>
              )}
              {viewing.status === 'Completed' && (
                <p className="text-xs text-gray-400 mt-2">
                  Released {fmtDateTime(viewing.resultedAt)}
                  {viewing.resultedByName ? ` by ${viewing.resultedByName}` : ''}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>
              <div className="space-y-1.5">
                {viewing.status === 'Completed' && (
                  <button
                    onClick={() => grab(() => downloadLabResultPdf(viewing._id, `${viewing.testId || 'lab'}-result.pdf`))}
                    disabled={dlBusy}
                    className="w-full flex items-center justify-between gap-2 text-sm bg-blue-50 border border-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate">Download result (PDF)</span>
                    </span>
                    <Download className="w-4 h-4 shrink-0" />
                  </button>
                )}
                {(viewing.attachments || []).map((a: any, i: number) => (
                  <button
                    key={`${a.path || a.name}-${i}`}
                    onClick={() => grab(() => downloadLabAttachment(viewing._id, i, a.name))}
                    disabled={dlBusy}
                    className="w-full flex items-center justify-between gap-2 text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Paperclip className="w-4 h-4 shrink-0 text-gray-400" />
                      <span className="truncate">{a.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">{a.size ? `${Math.max(1, Math.round(a.size / 1024))} KB` : ''}</span>
                    </span>
                    <Download className="w-4 h-4 shrink-0" />
                  </button>
                ))}
                {viewing.status === 'Completed' && !(viewing.attachments || []).length && (
                  <p className="text-xs text-gray-400">Uploaded documents will appear here.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
