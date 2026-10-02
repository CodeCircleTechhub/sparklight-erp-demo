import { useState } from 'react';
import { FileBarChart, Users, DollarSign, Building2, Pill, FlaskConical, Loader2, CheckCircle, AlertCircle, Wallet, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { downloadReport } from '../../utils/downloadReport';

const reports = [
  { type: 'patients', icon: Users, title: 'Patient Report', description: 'Comprehensive patient data including admissions, discharges, and demographics.', color: 'bg-blue-500' },
  { type: 'revenue', icon: DollarSign, title: 'Revenue Report', description: 'Financial overview with revenue, expenses, and profit margins.', color: 'bg-green-500' },
  { type: 'staff', icon: Users, title: 'Staff Report', description: 'Employee attendance, performance, and payroll summaries.', color: 'bg-violet-500' },
  { type: 'departments', icon: Building2, title: 'Department Report', description: 'Department-wise performance and resource utilization.', color: 'bg-amber-500' },
  { type: 'pharmacy', icon: Pill, title: 'Pharmacy Report', description: 'Medicine inventory, dispensing records, and stock alerts.', color: 'bg-cyan-500' },
  { type: 'laboratory', icon: FlaskConical, title: 'Laboratory Report', description: 'Test results, turnaround times, and equipment status.', color: 'bg-pink-500' },
  { type: 'finance-expense', icon: Wallet, title: 'Expense Report', description: 'Track and analyze all operational expenses.', color: 'bg-orange-500' },
  { type: 'finance-profit', icon: TrendingUp, title: 'Profit Analysis', description: 'Net profit margins and financial health overview.', color: 'bg-teal-500' },
  { type: 'finance-outstanding', icon: AlertTriangle, title: 'Outstanding Report', description: 'Unpaid bills and collection status.', color: 'bg-red-500' },
  { type: 'finance-dept', icon: Building2, title: 'Department Report', description: 'Revenue and expenses by department.', color: 'bg-indigo-500' },
  { type: 'finance-monthly', icon: Calendar, title: 'Monthly Summary', description: 'Month-over-month financial comparison.', color: 'bg-slate-500' },
  { type: 'hr-payroll', icon: DollarSign, title: 'Payroll Report', description: 'Staff salary payments, allowances, and deductions.', color: 'bg-fuchsia-500' },
];

export default function ManagerReports() {
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Reports"
          icon={FileBarChart}
          action={
            <div className="flex items-center gap-3">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          }
        />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <div key={report.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${report.color} rounded-lg flex items-center justify-center`}>
                  <report.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <button
                onClick={() => generate(report.type, report.title)}
                disabled={!!busy}
                className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {busy === report.type ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {busy === report.type ? 'Generating…' : 'Generate Report'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
