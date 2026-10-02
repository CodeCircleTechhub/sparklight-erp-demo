import { useState } from 'react';
import { BarChart3, FileText, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { downloadReport } from '../../utils/downloadReport';

const iso = (d: Date) => d.toISOString().slice(0, 10);
const today = () => new Date();
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const reports = [
  { key: 'daily', title: 'Daily Report', description: "View today's test summary, results, and workload statistics.", icon: Calendar, color: 'bg-blue-500' },
  { key: 'weekly', title: 'Weekly Report', description: 'Comprehensive weekly analysis of all laboratory activities and trends.', icon: BarChart3, color: 'bg-green-500' },
  { key: 'monthly', title: 'Monthly Report', description: 'Detailed monthly report with revenue, test volumes, and performance metrics.', icon: FileText, color: 'bg-purple-500' },
  { key: 'custom', title: 'Custom Report', description: 'Generate a report for a specific date range with custom filters.', icon: Calendar, color: 'bg-orange-500' },
];

export default function LabReports() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const generate = async (key: string, title: string) => {
    if (busy) return;
    let from: string | undefined;
    let to: string | undefined;
    if (key === 'daily') {
      from = iso(today());
      to = iso(today());
    } else if (key === 'weekly') {
      from = iso(daysAgo(6));
      to = iso(today());
    } else if (key === 'monthly') {
      from = iso(daysAgo(29));
      to = iso(today());
    } else {
      if (dateFrom && dateTo && dateFrom > dateTo) {
        setNotice({ type: 'err', text: 'From date must be on or before To date.' });
        return;
      }
      from = dateFrom || undefined;
      to = dateTo || undefined;
    }
    setBusy(key);
    setNotice(null);
    try {
      await downloadReport('laboratory', {
        from,
        to,
        fileName: `Lab_${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
      });
      setNotice({ type: 'ok', text: `${title} downloaded as PDF.` });
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to generate the report' });
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Lab Reports" icon={BarChart3} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Range Filter (Custom Report)</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${r.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <r.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{r.description}</p>
              </div>
            </div>
            <button
              onClick={() => generate(r.key, r.title)}
              disabled={!!busy}
              className="mt-4 w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy === r.key ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {busy === r.key ? 'Generating…' : 'Generate Report'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
