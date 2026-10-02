import { useEffect, useState } from 'react';
import { FlaskConical, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Download, Paperclip, FileText, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { downloadLabResultPdf, downloadLabAttachment } from '../../utils/downloadLabFile';

const fmtDate = (d?: string | Date) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

export default function LabResults() {
  const [tests, setTests] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dlId, setDlId] = useState<string | null>(null);
  const [dlError, setDlError] = useState('');

  const grab = async (id: string, fn: () => Promise<void>) => {
    setDlId(id);
    setDlError('');
    try {
      await fn();
    } catch (err: any) {
      setDlError(err.response?.data?.message || 'Download failed');
    } finally {
      setDlId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/patient/lab-tests');
        if (!cancelled) setTests(res.data.tests || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load lab results');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const parseResult = (result: string) => {
    if (!result) return [] as { test: string; value: string; unit: string; range: string; status: string }[];
    try {
      const parsed = JSON.parse(result);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // plain text result
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Laboratory Results</h1>

        {loading && <p className="text-sm text-gray-500">Loading lab results…</p>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
        {dlError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{dlError}</div>}

        {!loading && !error && tests.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">
            No lab tests yet.
          </div>
        )}

        <div className="space-y-4">
          {tests.map((test) => {
            const abnormal = test.status === 'Completed' && /high|abnormal|positive/i.test(test.result || '');
            const completed = test.status === 'Completed';
            const params = parseResult(test.result);
            const id = test._id;
            return (
              <div
                key={id}
                className={`bg-white rounded-xl shadow-sm border p-6 ${
                  abnormal ? 'border-amber-300 bg-amber-50/30' : 'border-gray-100'
                }`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(expandedId === id ? null : id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        abnormal ? 'bg-amber-100' : completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      <FlaskConical className={`w-5 h-5 ${abnormal ? 'text-amber-600' : completed ? 'text-green-600' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{test.testType}</p>
                      <p className="text-sm text-gray-500">
                        {fmtDate(test.date)} · {test.category || 'Lab'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                        abnormal
                          ? 'bg-amber-100 text-amber-700'
                          : completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {abnormal ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : completed ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : null}
                      {test.status}
                    </span>
                    {expandedId === id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {expandedId === id && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    {params.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b border-gray-100">
                              <th className="pb-2 font-medium">Test</th>
                              <th className="pb-2 font-medium">Value</th>
                              <th className="pb-2 font-medium">Reference Range</th>
                              <th className="pb-2 font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {params.map((param, i) => (
                              <tr key={i} className="border-b border-gray-50">
                                <td className="py-2 text-gray-900">{param.test}</td>
                                <td className="py-2 font-medium text-gray-900">
                                  {param.value} {param.unit}
                                </td>
                                <td className="py-2 text-gray-500">{param.range}</td>
                                <td className="py-2">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      (param.status || '').toLowerCase() === 'normal'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}
                                  >
                                    {param.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Result</p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {test.result || 'Results pending.'}
                        </p>
                        {test.notes && (
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-medium">Notes:</span> {test.notes}
                          </p>
                        )}
                      </div>
                    )}

                    {completed && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                          <Download className="w-4 h-4" />
                          Downloads
                        </p>
                        <div className="space-y-1.5">
                          <button
                            onClick={() => grab(id, () => downloadLabResultPdf(id, `${test.testId || 'lab'}-result.pdf`))}
                            disabled={dlId !== null}
                            className="w-full flex items-center justify-between gap-2 text-sm bg-blue-50 border border-blue-100 text-blue-700 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              {dlId === id ? <Loader2 className="w-4 h-4 shrink-0 animate-spin" /> : <FileText className="w-4 h-4 shrink-0" />}
                              <span className="truncate">Download result (PDF)</span>
                            </span>
                            <Download className="w-4 h-4 shrink-0" />
                          </button>
                          {(test.attachments || []).map((a: any, i: number) => (
                            <button
                              key={`${a.path || a.name}-${i}`}
                              onClick={() => grab(id, () => downloadLabAttachment(id, i, a.name))}
                              disabled={dlId !== null}
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
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
