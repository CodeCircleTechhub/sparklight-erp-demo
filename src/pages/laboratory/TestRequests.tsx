import { ClipboardList, Clock, Cog, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '320', icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
  { label: 'Pending', value: '18', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Processing', value: '8', icon: Cog, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Completed', value: '294', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
];

const requests = [
  { id: 'TR-9001', patient: 'Sarah Johnson', testType: 'Complete Blood Count', doctor: 'Dr. Ahmed', priority: 'High', date: 'Sep 11, 2026', status: 'Pending' },
  { id: 'TR-9002', patient: 'Michael Brown', testType: 'Lipid Profile', doctor: 'Dr. Ahmed', priority: 'Medium', date: 'Sep 11, 2026', status: 'Processing' },
  { id: 'TR-9003', patient: 'Emma Wilson', testType: 'Urine Analysis', doctor: 'Dr. Fatima', priority: 'Low', date: 'Sep 11, 2026', status: 'Completed' },
  { id: 'TR-9004', patient: 'James Davis', testType: 'X-Ray Chest', doctor: 'Dr. Ahmed', priority: 'High', date: 'Sep 10, 2026', status: 'Completed' },
  { id: 'TR-9005', patient: 'Olivia Martinez', testType: 'Blood Glucose', doctor: 'Dr. Fatima', priority: 'Medium', date: 'Sep 10, 2026', status: 'Pending' },
  { id: 'TR-9006', patient: 'William Garcia', testType: 'Thyroid Panel', doctor: 'Dr. Ahmed', priority: 'Low', date: 'Sep 10, 2026', status: 'Completed' },
  { id: 'TR-9007', patient: 'Sophia Rodriguez', testType: 'Hemoglobin A1C', doctor: 'Dr. Fatima', priority: 'High', date: 'Sep 09, 2026', status: 'Completed' },
  { id: 'TR-9008', patient: 'Daniel Lee', testType: 'Spirometry', doctor: 'Dr. Ahmed', priority: 'Medium', date: 'Sep 09, 2026', status: 'Processing' },
  { id: 'TR-9009', patient: 'Isabella Thomas', testType: 'Prenatal Blood Panel', doctor: 'Dr. Fatima', priority: 'High', date: 'Sep 08, 2026', status: 'Completed' },
  { id: 'TR-9010', patient: 'Benjamin Harris', testType: 'Chest X-Ray', doctor: 'Dr. Ahmed', priority: 'Medium', date: 'Sep 08, 2026', status: 'Pending' },
];

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function TestRequests() {
  return (
    <div className="space-y-6">
      <PageHeader title="Test Requests" icon={ClipboardList} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{r.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{r.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.testType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.doctor}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[r.priority]}`}>{r.priority}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[r.status]}`}>{r.status}</span>
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
