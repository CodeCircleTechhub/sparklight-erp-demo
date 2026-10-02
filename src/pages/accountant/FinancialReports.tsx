import { useState } from 'react';
import { FileText, TrendingUp, DollarSign, AlertTriangle, Building2, Calendar, Download, Loader2, CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { downloadReport } from '../../utils/downloadReport';

const reports = [
  { type: 'revenue', title: 'Revenue Report', description: 'Detailed revenue breakdown by department and service', icon: TrendingUp, color: 'bg-[#3b82f6]' },
  { type: 'finance-expense', title: 'Expense Report', description: 'Track and analyze all operational expenses', icon: DollarSign, color: 'bg-emerald-500' },
  { type: 'finance-profit', title: 'Profit Analysis', description: 'Net profit margins and financial health overview', icon: FileText, color: 'bg-purple-500' },
  { type: 'finance-outstanding', title: 'Outstanding Report', description: 'Unpaid bills and collection status', icon: AlertTriangle, color: 'bg-red-500' },
  { type: 'finance-dept', title: 'Department Report', description: 'Revenue and expenses by department', icon: Building2, color: 'bg-amber-500' },
  { type: 'finance-monthly', title: 'Monthly Summary', description: 'Month-over-month financial comparison', icon: Calendar, color: 'bg-cyan-500' },
  { type: 'hr-payroll', title: 'Payroll Report', description: 'Staff salary payments, allowances, and deductions', icon: Wallet, color: 'bg-orange-500' },
];

export default function FinancialReports() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const generate = async (type: string, title: string) => {
    if (busy) return;
    if (fromDate && toDate && fromDate > toDate) {
      setNotice({ type: 'err', text: 'From date must be on or before To date.' });
      return;
    }
    setBusy(type);
    setNotice(null);
    try {
      await downloadReport(type, {
        from: fromDate || undefined,
        to: toDate || undefined,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Financial Reports" icon={FileText} />
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => generate('revenue', 'Revenue Report')}
              disabled={!!busy}
              className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {busy === 'revenue' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm mb-6 ${
              notice.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notice.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {notice.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className={`${r.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{r.description}</p>
                <button
                  onClick={() => generate(r.type, r.title)}
                  disabled={!!busy}
                  className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {busy === r.type ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  {busy === r.type ? 'Generating…' : 'Generate Report'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
