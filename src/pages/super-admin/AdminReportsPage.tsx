import { useState } from 'react';
import { FileBarChart, Users, DollarSign, UserCog, Building2, Pill, FlaskConical, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const reports = [
  { title: 'Patient Report', description: 'Patient registration, visits, and demographics', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { title: 'Revenue Report', description: 'Financial overview, payments, and outstanding bills', icon: DollarSign, color: 'bg-green-100 text-green-600' },
  { title: 'Staff Report', description: 'Staff attendance, performance, and payroll', icon: UserCog, color: 'bg-purple-100 text-purple-600' },
  { title: 'Department Report', description: 'Department performance and utilization', icon: Building2, color: 'bg-yellow-100 text-yellow-600' },
  { title: 'Pharmacy Report', description: 'Medicine inventory and dispensing summary', icon: Pill, color: 'bg-red-100 text-red-600' },
  { title: 'Laboratory Report', description: 'Test results and laboratory statistics', icon: FlaskConical, color: 'bg-orange-100 text-orange-600' },
];

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" icon={FileBarChart} description="Generate and view hospital reports" />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${report.color} rounded-lg p-2.5`}>
                <report.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900">{report.title}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{report.description}</p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer">
              Generate Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
