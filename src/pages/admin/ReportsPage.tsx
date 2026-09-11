import { useState } from 'react';
import { FileText, Users, DollarSign, Building2, FlaskConical, Beaker, Download, BarChart3 } from 'lucide-react';

interface ReportType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  lastGenerated: string;
  color: string;
}

const reportTypes: ReportType[] = [
  {
    id: 'RPT01',
    name: 'Patient Report',
    icon: <Users className="w-6 h-6" />,
    description: 'Patient demographics, visits, and health statistics',
    lastGenerated: '2026-09-10',
    color: 'bg-blue-500',
  },
  {
    id: 'RPT02',
    name: 'Revenue Report',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Financial overview, payments, and revenue trends',
    lastGenerated: '2026-09-10',
    color: 'bg-green-500',
  },
  {
    id: 'RPT03',
    name: 'Staff Report',
    icon: <Users className="w-6 h-6" />,
    description: 'Staff performance, attendance, and schedules',
    lastGenerated: '2026-09-09',
    color: 'bg-purple-500',
  },
  {
    id: 'RPT04',
    name: 'Department Report',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Department efficiency, patient flow, and resources',
    lastGenerated: '2026-09-08',
    color: 'bg-orange-500',
  },
  {
    id: 'RPT05',
    name: 'Pharmacy Report',
    icon: <Beaker className="w-6 h-6" />,
    description: 'Medicine inventory, usage, and stock levels',
    lastGenerated: '2026-09-07',
    color: 'bg-indigo-500',
  },
  {
    id: 'RPT06',
    name: 'Lab Report',
    icon: <FlaskConical className="w-6 h-6" />,
    description: 'Lab tests, results, and turnaround times',
    lastGenerated: '2026-09-06',
    color: 'bg-pink-500',
  },
];

const ReportsPage = () => {
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-11');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Date Range:</span>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <label className="block text-sm text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <span className="text-gray-400 mt-5">to</span>
            <div>
              <label className="block text-sm text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center text-white`}>
                {report.icon}
              </div>
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{report.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">Last: {report.lastGenerated}</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Generate Custom Report</h2>
            <p className="text-sm text-gray-500">Select report type and date range to generate</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
