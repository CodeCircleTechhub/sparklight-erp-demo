import { FileText, Users, CalendarOff, DollarSign, Download } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const reports = [
  { title: 'Staff Count Report', description: 'Overview of staff distribution by department, role, and status', icon: Users, color: 'bg-[#3b82f6]' },
  { title: 'Attendance Report', description: 'Daily, weekly, and monthly attendance analytics', icon: CalendarOff, color: 'bg-emerald-500' },
  { title: 'Leave Report', description: 'Leave requests, approvals, and balance summary', icon: FileText, color: 'bg-purple-500' },
  { title: 'Payroll Report', description: 'Salary disbursements, deductions, and tax summaries', icon: DollarSign, color: 'bg-amber-500' },
];

export default function StaffReports() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Staff Reports" icon={FileText} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
