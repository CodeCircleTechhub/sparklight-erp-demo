import { useState } from 'react';
import { BarChart3, TrendingUp, Package, Pill, DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { downloadReport } from '../../utils/downloadReport';

const reports = [
  { type: 'pharmacy-sales', title: 'Sales Report', description: 'Track medicine sales, revenue, and top-selling medications.', icon: TrendingUp, color: 'bg-blue-500' },
  { type: 'pharmacy', title: 'Stock Report', description: 'Monitor inventory levels, stock movements, and reorder status.', icon: Package, color: 'bg-green-500' },
  { type: 'pharmacy-dispensing', title: 'Dispensing Report', description: 'View dispensing activities, prescription fulfillment, and pharmacist performance.', icon: Pill, color: 'bg-purple-500' },
  { type: 'revenue', title: 'Revenue Report', description: 'Analyze pharmacy revenue, costs, profit margins, and financial trends.', icon: DollarSign, color: 'bg-orange-500' },
];

export default function PharmacistReports() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const generate = async (type: string, title: string) => {
    if (busy) return;
    if (dateFrom && dateTo && dateFrom > dateTo) {
      setNotice({ type: 'err', text: 'From date must be on or before To date.' });
      return;
    }
    setBusy(type);
    setNotice(null);
    try {
      await downloadReport(type, {
        from: dateFrom || undefined,
        to: dateTo || undefined,
        fileName: `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
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
      <PageHeader title="Reports" icon={BarChart3} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Range Filter</h2>
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
        {!dateFrom && !dateTo && (
          <p className="text-xs text-gray-500 mt-3">No dates selected — reports cover all records.</p>
        )}
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
              onClick={() => generate(r.type, r.title)}
              disabled={!!busy}
              className="mt-4 w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy === r.type ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {busy === r.type ? 'Generating…' : 'Generate Report'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
