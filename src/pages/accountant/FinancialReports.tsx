import { FileText, TrendingUp, DollarSign, AlertTriangle, Building2, Calendar, Download } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const reports = [
  { title: 'Revenue Report', description: 'Detailed revenue breakdown by department and service', icon: TrendingUp, color: 'bg-[#3b82f6]' },
  { title: 'Expense Report', description: 'Track and analyze all operational expenses', icon: DollarSign, color: 'bg-emerald-500' },
  { title: 'Profit Analysis', description: 'Net profit margins and financial health overview', icon: FileText, color: 'bg-purple-500' },
  { title: 'Outstanding Report', description: 'Unpaid bills and collection status', icon: AlertTriangle, color: 'bg-red-500' },
  { title: 'Department Report', description: 'Revenue and expenses by department', icon: Building2, color: 'bg-amber-500' },
  { title: 'Monthly Summary', description: 'Month-over-month financial comparison', icon: Calendar, color: 'bg-cyan-500' },
];

export default function FinancialReports() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Financial Reports" icon={FileText} />
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input type="date" defaultValue="2024-01-01" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input type="date" defaultValue="2024-01-31" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" />
            </div>
            <button className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className={`${r.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{r.description}</p>
                <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
