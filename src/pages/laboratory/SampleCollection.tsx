import { useState, useEffect, useCallback } from 'react';
import { TestTube, CheckCircle, XCircle, Clock, Loader2, AlertCircle, X } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Collected: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800',
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const patName = (t: any) =>
  t.patientName || (t.patient ? `${t.patient.firstName || ''} ${t.patient.surname || ''}`.trim() : '') || '—';

export default function SampleCollection() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState('');
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectBusy, setRejectBusy] = useState(false);
  const [rejectError, setRejectError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/laboratory');
      const all = data.tests || [];
      setTests(
        all.filter(
          (t: any) => t.sampleStatus === 'Rejected' || t.status === 'Pending' || t.status === 'In Progress'
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load samples');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sampleStatusOf = (t: any) => t.sampleStatus || 'Pending';

  const collected = tests.filter((t) => sampleStatusOf(t) === 'Collected').length;
  const pendingCount = tests.filter((t) => sampleStatusOf(t) === 'Pending' && t.status !== 'Cancelled').length;
  const rejected = tests.filter((t) => sampleStatusOf(t) === 'Rejected').length;

  const collect = async (t: any) => {
    if (busyId) return;
    setBusyId(t._id);
    setNotice(null);
    try {
      await api.post(`/laboratory/${t._id}/collect`);
      setNotice({ type: 'ok', text: `Sample collected for ${t.testId || t.testType}.` });
      await load();
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to collect sample' });
    } finally {
      setBusyId('');
    }
  };

  const submitReject = async () => {
    if (rejectBusy || !rejectTarget) return;
    if (!rejectReason.trim()) {
      setRejectError('Rejection reason is required');
      return;
    }
    setRejectBusy(true);
    setRejectError('');
    try {
      await api.post(`/laboratory/${rejectTarget._id}/reject`, { notes: rejectReason.trim() });
      setNotice({ type: 'ok', text: `Sample for ${rejectTarget.testId || rejectTarget.testType} rejected — doctor notified.` });
      setRejectTarget(null);
      setRejectReason('');
      await load();
    } catch (err: any) {
      setRejectError(err.response?.data?.message || 'Failed to reject sample');
    } finally {
      setRejectBusy(false);
    }
  };

  const cards = [
    { label: 'Collected', value: String(collected), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending', value: String(pendingCount), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Rejected', value: String(rejected), icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Sample Collection" icon={TestTube} />

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
              Loading samples...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sample ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Collector</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tests.map((s) => {
                  const st = sampleStatusOf(s);
                  return (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{s.testId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patName(s)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.testType || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.sampleCollectedByName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(s.sampleDate || s.date)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[st] || 'bg-gray-100 text-gray-700'}`}>
                          {st}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {st === 'Pending' && s.status !== 'Cancelled' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => collect(s)}
                              disabled={!!busyId}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-60"
                            >
                              {busyId === s._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                              Collect
                            </button>
                            <button
                              onClick={() => {
                                setRejectTarget(s);
                                setRejectReason('');
                                setRejectError('');
                              }}
                              disabled={!!busyId}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-60"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No samples in the queue</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !rejectBusy && setRejectTarget(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Reject Sample</h3>
              <button onClick={() => setRejectTarget(null)} disabled={rejectBusy} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {rejectTarget.testId} — {rejectTarget.testType} · {patName(rejectTarget)}. The ordering doctor will be notified.
            </p>
            {rejectError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {rejectError}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              placeholder="e.g. Hemolyzed specimen, insufficient quantity"
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setRejectTarget(null)}
                disabled={rejectBusy}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={rejectBusy}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {rejectBusy && <Loader2 className="w-4 h-4 animate-spin" />}
                Reject Sample
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
