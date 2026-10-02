import { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, Loader, Loader2, AlertCircle, CheckCircle, PlayCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const priorityColors: Record<string, string> = {
  STAT: 'bg-red-100 text-red-800',
  Urgent: 'bg-red-100 text-red-800',
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Normal: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const patName = (t: any) =>
  t.patientName || (t.patient ? `${t.patient.firstName || ''} ${t.patient.surname || ''}`.trim() : '') || '—';

export default function PendingTests() {
  const [tests, setTests] = useState<any[]>([]);
  const [counts, setCounts] = useState({ pending: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/laboratory');
      const all = data.tests || [];
      setTests(all.filter((t: any) => t.status === 'Pending' || t.status === 'In Progress'));
      setCounts({ pending: data.pending || 0, inProgress: data.inProgress || 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pending tests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startProcessing = async (t: any) => {
    if (busyId) return;
    setBusyId(t._id);
    setNotice(null);
    try {
      await api.put(`/laboratory/${t._id}`, { status: 'In Progress' });
      setNotice({ type: 'ok', text: `${t.testId || 'Test'} moved to processing.` });
      await load();
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to update test' });
    } finally {
      setBusyId('');
    }
  };

  const urgent = tests.filter((t) => t.status === 'Pending' && (t.priority === 'Urgent' || t.priority === 'STAT')).length;

  const cards = [
    { label: 'Waiting', value: String(counts.pending), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Progress', value: String(counts.inProgress), icon: Loader, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Urgent', value: String(urgent), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Pending Tests" icon={Clock} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            notice.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {notice.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {notice.text}
        </div>
      )}

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

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading tests...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Requested</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tests.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{t.testId || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{patName(t)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.testType || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.orderedByName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[t.priority] || 'bg-gray-100 text-gray-700'}`}>
                        {t.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(t.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[t.status] || 'bg-gray-100 text-gray-700'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.status === 'Pending' ? (
                        <button
                          onClick={() => startProcessing(t)}
                          disabled={!!busyId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-60"
                        >
                          {busyId === t._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
                          Start Processing
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">In lab</span>
                      )}
                    </td>
                  </tr>
                ))}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">No pending tests — queue is clear</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
