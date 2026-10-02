import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, ClipboardList, Loader2, AlertCircle, X, Eye, Download, FileText, Paperclip } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { downloadLabResultPdf, downloadLabAttachment } from '../../utils/downloadLabFile';

const statusColors: Record<string, string> = {
  Released: 'bg-green-100 text-green-800',
  'Pending Verification': 'bg-yellow-100 text-yellow-800',
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const fmtDateTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const patName = (t: any) =>
  t.patientName || (t.patient ? `${t.patient.firstName || ''} ${t.patient.surname || ''}`.trim() : '') || '—';

export default function LabResults() {
  const [tests, setTests] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/laboratory');
      const all = data.tests || [];
      setTests(all.filter((t: any) => t.status !== 'Cancelled'));
      setCounts({
        total: data.total || 0,
        pending: data.pending || 0,
        inProgress: data.inProgress || 0,
        completed: data.completed || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const releasedOf = (t: any) => t.status === 'Completed';
  const displayStatus = (t: any) => (releasedOf(t) ? 'Released' : 'Pending Verification');

  const cards = [
    { label: 'Released', value: String(counts.completed), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending Verification', value: String(counts.pending + counts.inProgress), icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Total', value: String(counts.total), icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Results" icon={CheckCircle} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
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
              Loading results...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Result ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tests.map((r) => {
                  const st = displayStatus(r);
                  return (
                    <tr key={r._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.testId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patName(r)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.testType || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.orderedByName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(r.resultedAt || r.date)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[st]}`}>{st}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewing(r)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No results yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Result · {viewing.testId}</h3>
              <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Patient</span>
                <span className="font-medium text-gray-900 text-right">{patName(viewing)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Test</span>
                <span className="font-medium text-gray-900 text-right">{viewing.testType}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Ordered by</span>
                <span className="font-medium text-gray-900 text-right">{viewing.orderedByName || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[displayStatus(viewing)]}`}>
                  {displayStatus(viewing)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <p className="text-gray-500 mb-1">Result</p>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {viewing.result || <span className="text-gray-400 italic">No result recorded yet</span>}
                </p>
              </div>
              {viewing.notes && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{viewing.notes}</p>
                </div>
              )}
              {viewing.resultedAt && (
                <div className="flex justify-between gap-4 border-t border-gray-100 pt-3">
                  <span className="text-gray-500">Released</span>
                  <span className="text-gray-700 text-right">
                    {fmtDateTime(viewing.resultedAt)}
                    {viewing.resultedByName ? ` · ${viewing.resultedByName}` : ''}
                  </span>
                </div>
              )}
              {dlError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {dlError}
                </div>
              )}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-gray-500 mb-2">Documents</p>
                <div className="space-y-1.5">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
