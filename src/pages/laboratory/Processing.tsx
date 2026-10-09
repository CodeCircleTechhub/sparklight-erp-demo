import { useState, useEffect, useCallback } from 'react';
import { Cog, CheckCircle, Clock, Loader2, AlertCircle, X, FileText, Paperclip, Upload, Eye } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import LabHistoryModal from '../../components/laboratory/LabHistoryModal';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

const fmtTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const patName = (t: any) =>
  t.patientName || (t.patient ? `${t.patient.firstName || ''} ${t.patient.surname || ''}`.trim() : '') || '—';

const isToday = (d?: string | null) => {
  if (!d) return false;
  const when = new Date(d);
  const now = new Date();
  return when.getFullYear() === now.getFullYear() && when.getMonth() === now.getMonth() && when.getDate() === now.getDate();
};

export default function Processing() {
  const [tests, setTests] = useState<any[]>([]);
  const [counts, setCounts] = useState({ inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [target, setTarget] = useState<any | null>(null);
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [viewing, setViewing] = useState<any | null>(null);

  const ATTACH_EXTS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg'];
  const MAX_FILE = 10 * 1024 * 1024;

  const pickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    const valid = picked.filter(
      (f) => ATTACH_EXTS.includes(f.name.slice(f.name.lastIndexOf('.')).toLowerCase()) && f.size <= MAX_FILE
    );
    const skipped = picked.filter((f) => !valid.includes(f));
    setModalError(skipped.length ? `Skipped ${skipped.map((f) => f.name).join(', ')} — only PDF/DOC/JPEG up to 10 MB` : '');
    setFiles((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/laboratory');
      setTests((data.tests || []).filter((t: any) => t.status === 'In Progress'));
      setCounts({ inProgress: data.inProgress || 0, completed: data.completed || 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load processing queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const [completedToday, setCompletedToday] = useState(0);
  const [avgTime, setAvgTime] = useState('—');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/laboratory?status=Completed');
        const done = data.tests || [];
        setCompletedToday(done.filter((t: any) => isToday(t.resultedAt || t.updatedAt)).length);
        const timed = done.filter((t: any) => t.createdAt && (t.resultedAt || t.updatedAt));
        if (timed.length) {
          const avgMs =
            timed.reduce((s: number, t: any) => s + (new Date(t.resultedAt || t.updatedAt).getTime() - new Date(t.createdAt).getTime()), 0) /
            timed.length;
          const hrs = avgMs / 3600000;
          setAvgTime(hrs < 1 ? `${Math.max(1, Math.round(avgMs / 60000))} min` : `${hrs.toFixed(1)} hrs`);
        }
      } catch {
        /* stats are best effort */
      }
    })();
  }, []);

  const openResult = (t: any) => {
    setTarget(t);
    setResult('');
    setNotes('');
    setFiles([]);
    setModalError('');
  };

  const submitResult = async () => {
    if (submitting || !target) return;
    if (!result.trim()) {
      setModalError('Result value is required');
      return;
    }
    setSubmitting(true);
    setModalError('');
    try {
      // 1) upload attached documents (raw binary) while the test is still In Progress
      for (const f of files) {
        try {
          const buf = await f.arrayBuffer();
          await api.post(`/laboratory/${target._id}/attachments?name=${encodeURIComponent(f.name)}&mime=${encodeURIComponent(f.type || '')}`, buf, {
            headers: { 'Content-Type': 'application/octet-stream' },
          });
        } catch (err: any) {
          setModalError(`Failed to upload "${f.name}": ${err.response?.data?.message || 'upload error'}`);
          return;
        }
      }
      // 2) release the text result (emails the patient, notifies doctors + patient portal)
      await api.post(`/laboratory/${target._id}/result`, { result: result.trim(), notes: notes.trim() });
      const extra = files.length ? ` + ${files.length} document${files.length > 1 ? 's' : ''}` : '';
      setNotice({ type: 'ok', text: `Result released for ${target.testId || target.testType}${extra} — doctor and patient notified.` });
      setTarget(null);
      setFiles([]);
      await load();
    } catch (err: any) {
      setModalError(err.response?.data?.message || 'Failed to save result');
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [
    { label: 'In Progress', value: String(counts.inProgress), icon: Cog, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed Today', value: String(completedToday), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Average Time', value: avgTime, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Processing" icon={Cog} />

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
              Loading processing queue...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Start Time</th>
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
                    <td className="px-4 py-3 text-sm text-gray-600">{fmtTime(t.sampleDate || t.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[t.status] || 'bg-gray-100 text-gray-700'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => openResult(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3b82f6] text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Enter Result
                        </button>
                        <button
                          onClick={() => setViewing(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                          title="View this patient's full lab history"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-400">Nothing in processing — collect a sample first</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !submitting && setTarget(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Enter Result</h3>
              <button onClick={() => setTarget(null)} disabled={submitting} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {target.testId} — {target.testType} · {patName(target)}
            </p>
            {modalError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {modalError}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-1">Result *</label>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              placeholder="e.g. Negative — no parasites seen"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              placeholder="Optional remarks"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Result documents (PDF / DOC / JPEG, max 10 MB)</label>
            <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              Attach report files
              <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,application/pdf,image/jpeg" className="hidden" onChange={pickFiles} />
            </label>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                    <span className="flex items-center gap-1.5 min-w-0 text-gray-700">
                      <Paperclip className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{f.name}</span>
                      <span className="text-gray-400 shrink-0">({Math.max(1, Math.round(f.size / 1024))} KB)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500 shrink-0"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setTarget(null)}
                disabled={submitting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitResult}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Release Result
              </button>
            </div>
          </div>
        </div>
      )}

      {viewing && (
        <LabHistoryModal
          patientId={viewing.patient?._id || viewing.patient}
          patientName={patName(viewing)}
          initialTab="processing"
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
