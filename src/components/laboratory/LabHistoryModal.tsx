import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle, FileText, Paperclip, Download, ClipboardList, Cog, CheckCircle, Clock, TestTube } from 'lucide-react';
import api from '../../services/api';
import { downloadLabResultPdf, downloadLabAttachment } from '../../utils/downloadLabFile';

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

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
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-700',
};

const sampleColors: Record<string, string> = {
  Collected: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800',
};

export type LabHistoryTab = 'requests' | 'processing' | 'result' | 'pending' | 'sample';

const TABS: { key: LabHistoryTab; label: string; icon: typeof ClipboardList }[] = [
  { key: 'requests', label: 'Test Request', icon: ClipboardList },
  { key: 'processing', label: 'Processing', icon: Cog },
  { key: 'result', label: 'Result', icon: CheckCircle },
  { key: 'pending', label: 'Pending Test', icon: Clock },
  { key: 'sample', label: 'Sample Collection', icon: TestTube },
];

interface Props {
  patientId: string;
  patientName: string;
  initialTab?: LabHistoryTab;
  onClose: () => void;
}

export default function LabHistoryModal({ patientId, patientName, initialTab = 'requests', onClose }: Props) {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<LabHistoryTab>(initialTab);
  const [dlBusy, setDlBusy] = useState(false);
  const [dlError, setDlError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/laboratory', { params: { patient: patientId } });
        if (!cancelled) setTests(data.tests || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load lab history');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

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

  const byDateDesc = (a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
  const requests = [...tests].sort(byDateDesc);
  const processing = tests.filter((t) => t.status === 'In Progress').sort(byDateDesc);
  const results = tests.filter((t) => t.status === 'Completed').sort(byDateDesc);
  const pending = tests.filter((t) => t.status === 'Pending').sort(byDateDesc);

  const lists: Record<LabHistoryTab, any[]> = {
    requests,
    processing,
    result: results,
    pending,
    sample: requests,
  };

  const emptyText: Record<LabHistoryTab, string> = {
    requests: 'No lab tests requested for this patient yet.',
    processing: 'No tests currently in processing.',
    result: 'No results released yet.',
    pending: 'No pending tests — queue is clear.',
    sample: 'No samples recorded for this patient yet.',
  };

  const confirmedBadge = (t: any) =>
    t.confirmedAt ? (
      <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-semibold">
        Confirmed{t.confirmedByName ? ` · ${t.confirmedByName}` : ''}
      </span>
    ) : null;

  const statusBadge = (t: any) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[t.status] || 'bg-gray-100 text-gray-700'}`}>
      {t.status}
    </span>
  );

  const baseRow = (t: any) => (
    <>
      <td className="px-4 py-3 text-sm font-medium text-blue-600">{t.testId || '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-900">
        {t.testType || '—'}
        {confirmedBadge(t)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{t.orderedByName || '—'}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[t.priority] || 'bg-gray-100 text-gray-700'}`}>
          {t.priority || 'Normal'}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(t.date)}</td>
    </>
  );

  const renderRequestsTable = (rows: any[]) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs uppercase text-gray-500">
            <th className="text-left px-4 py-2.5 font-semibold">Test ID</th>
            <th className="text-left px-4 py-2.5 font-semibold">Test Type</th>
            <th className="text-left px-4 py-2.5 font-semibold">Doctor</th>
            <th className="text-left px-4 py-2.5 font-semibold">Priority</th>
            <th className="text-left px-4 py-2.5 font-semibold">Date</th>
            <th className="text-left px-4 py-2.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((t) => (
            <tr key={t._id} className="hover:bg-gray-50">
              {baseRow(t)}
              <td className="px-4 py-3">{statusBadge(t)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderResultTab = () => (
    <div className="space-y-3">
      {dlError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" /> {dlError}
        </div>
      )}
      {results.map((t) => (
        <div key={t._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {t.testId} — {t.testType}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Ordered {fmtDate(t.date)} · released {fmtDateTime(t.resultedAt)}
                {t.resultedByName ? ` by ${t.resultedByName}` : ''}
              </p>
            </div>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors.Completed}`}>Completed</span>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap mt-2">
            {t.result || 'No written result.'}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => grab(() => downloadLabResultPdf(t._id, `${t.testId || 'lab'}-result.pdf`))}
              disabled={dlBusy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" /> Result PDF
            </button>
            {(t.attachments || []).map((a: any, i: number) => (
              <button
                key={`${a.path || a.name}-${i}`}
                onClick={() => grab(() => downloadLabAttachment(t._id, i, a.name))}
                disabled={dlBusy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium hover:bg-gray-100 disabled:opacity-50"
              >
                <Paperclip className="w-3.5 h-3.5" /> {a.name}
                <Download className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSampleTab = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-xs uppercase text-gray-500">
            <th className="text-left px-4 py-2.5 font-semibold">Test ID</th>
            <th className="text-left px-4 py-2.5 font-semibold">Test Type</th>
            <th className="text-left px-4 py-2.5 font-semibold">Sample Status</th>
            <th className="text-left px-4 py-2.5 font-semibold">Collector</th>
            <th className="text-left px-4 py-2.5 font-semibold">Collected</th>
            <th className="text-left px-4 py-2.5 font-semibold">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((t) => {
            const st = t.sampleStatus || 'Pending';
            return (
              <tr key={t._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-blue-600">{t.testId || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{t.testType || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sampleColors[st] || 'bg-gray-100 text-gray-700'}`}>
                    {st}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{t.sampleCollectedByName || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(t.sampleDate || t.date)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[240px] truncate">{t.sampleNotes || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const rows = lists[tab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <h3 className="font-semibold text-gray-900">Lab history — {patientName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {tests.length} test{tests.length === 1 ? '' : 's'} on record · requests, processing, results, pending & samples
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4 flex flex-wrap gap-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            const count = lists[t.key].length;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading lab history...
          </div>
        ) : (
          <div className="p-6">
            {rows.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                {tab === 'result' ? <FileText className="w-6 h-6 mx-auto mb-2 text-gray-300" /> : <ClipboardList className="w-6 h-6 mx-auto mb-2 text-gray-300" />}
                {emptyText[tab]}
              </div>
            ) : tab === 'result' ? (
              renderResultTab()
            ) : tab === 'sample' ? (
              renderSampleTab()
            ) : (
              renderRequestsTable(rows)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
