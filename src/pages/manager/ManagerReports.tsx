import { FileBarChart, Users, DollarSign, Building2, Pill, FlaskConical } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const reports = [
  { icon: Users, title: 'Patient Report', description: 'Comprehensive patient data including admissions, discharges, and demographics.', color: 'bg-blue-500' },
  { icon: DollarSign, title: 'Revenue Report', description: 'Financial overview with revenue, expenses, and profit margins.', color: 'bg-green-500' },
  { icon: Users, title: 'Staff Report', description: 'Employee attendance, performance, and payroll summaries.', color: 'bg-violet-500' },
  { icon: Building2, title: 'Department Report', description: 'Department-wise performance and resource utilization.', color: 'bg-amber-500' },
  { icon: Pill, title: 'Pharmacy Report', description: 'Medicine inventory, dispensing records, and stock alerts.', color: 'bg-cyan-500' },
  { icon: FlaskConical, title: 'Laboratory Report', description: 'Test results, turnaround times, and equipment status.', color: 'bg-pink-500' },
];

export default function ManagerReports() {
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
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          }
        />

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
              <button className="w-full bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors">
                Generate Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
