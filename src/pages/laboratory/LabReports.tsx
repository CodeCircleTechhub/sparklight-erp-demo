import { useState } from 'react';
import { BarChart3, FileText, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const reports = [
  { title: 'Daily Report', description: 'View today\'s test summary, results, and workload statistics.', icon: Calendar, color: 'bg-blue-500' },
  { title: 'Weekly Report', description: 'Comprehensive weekly analysis of all laboratory activities and trends.', icon: BarChart3, color: 'bg-green-500' },
  { title: 'Monthly Report', description: 'Detailed monthly report with revenue, test volumes, and performance metrics.', icon: FileText, color: 'bg-purple-500' },
  { title: 'Custom Report', description: 'Generate a report for a specific date range with custom filters.', icon: Calendar, color: 'bg-orange-500' },
];

export default function LabReports() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader title="Lab Reports" icon={BarChart3} />

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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${r.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <r.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{r.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
        Generate Report
      </button>
    </div>
  );
}
