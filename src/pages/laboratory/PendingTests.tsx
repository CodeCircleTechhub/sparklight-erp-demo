import { Clock, AlertTriangle, Loader } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Waiting', value: '8', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'In Progress', value: '5', icon: Loader, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Urgent', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
];

const tests = [
  { id: 'PT-1001', patient: 'Sarah Johnson', testType: 'Complete Blood Count', doctor: 'Dr. Ahmed', priority: 'High', requested: 'Sep 11, 2026', status: 'Waiting' },
  { id: 'PT-1002', patient: 'Michael Brown', testType: 'Lipid Profile', doctor: 'Dr. Ahmed', priority: 'Medium', requested: 'Sep 11, 2026', status: 'In Progress' },
  { id: 'PT-1003', patient: 'Emma Wilson', testType: 'Urine Analysis', doctor: 'Dr. Fatima', priority: 'Low', requested: 'Sep 11, 2026', status: 'Waiting' },
  { id: 'PT-1004', patient: 'James Davis', testType: 'Blood Glucose', doctor: 'Dr. Ahmed', priority: 'High', requested: 'Sep 10, 2026', status: 'In Progress' },
  { id: 'PT-1005', patient: 'Olivia Martinez', testType: 'Thyroid Panel', doctor: 'Dr. Fatima', priority: 'Medium', requested: 'Sep 10, 2026', status: 'Waiting' },
  { id: 'PT-1006', patient: 'William Garcia', testType: 'Spirometry', doctor: 'Dr. Ahmed', priority: 'Low', requested: 'Sep 10, 2026', status: 'Waiting' },
  { id: 'PT-1007', patient: 'Sophia Rodriguez', testType: 'Hemoglobin A1C', doctor: 'Dr. Fatima', priority: 'High', requested: 'Sep 09, 2026', status: 'In Progress' },
  { id: 'PT-1008', patient: 'Daniel Lee', testType: 'Chest X-Ray', doctor: 'Dr. Ahmed', priority: 'Medium', requested: 'Sep 09, 2026', status: 'Waiting' },
];

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
};

export default function PendingTests() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pending Tests" icon={Clock} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Requested</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{t.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{t.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.testType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.doctor}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.requested}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[t.status]}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
