import { Scan, Clock, CheckCircle, ClipboardList } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Pending', value: '3', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Total', value: '15', icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const requests = [
  { id: 'IR-7001', patient: 'Sarah Johnson', type: 'X-Ray', priority: 'High', date: 'Sep 11, 2026', status: 'Pending' },
  { id: 'IR-7002', patient: 'Michael Brown', type: 'MRI', priority: 'Medium', date: 'Sep 11, 2026', status: 'Completed' },
  { id: 'IR-7003', patient: 'Emma Wilson', type: 'CT Scan', priority: 'High', date: 'Sep 10, 2026', status: 'Completed' },
  { id: 'IR-7004', patient: 'James Davis', type: 'Ultrasound', priority: 'Low', date: 'Sep 10, 2026', status: 'Pending' },
  { id: 'IR-7005', patient: 'Olivia Martinez', type: 'X-Ray', priority: 'Medium', date: 'Sep 09, 2026', status: 'Completed' },
  { id: 'IR-7006', patient: 'William Garcia', type: 'MRI', priority: 'High', date: 'Sep 09, 2026', status: 'Completed' },
  { id: 'IR-7007', patient: 'Sophia Rodriguez', type: 'Ultrasound', priority: 'Low', date: 'Sep 08, 2026', status: 'Pending' },
  { id: 'IR-7008', patient: 'Daniel Lee', type: 'CT Scan', priority: 'Medium', date: 'Sep 08, 2026', status: 'Completed' },
];

const typeColors: Record<string, string> = {
  'X-Ray': 'bg-blue-100 text-blue-800',
  MRI: 'bg-purple-100 text-purple-800',
  'CT Scan': 'bg-indigo-100 text-indigo-800',
  Ultrasound: 'bg-teal-100 text-teal-800',
};

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function ImagingRequests() {
  return (
    <div className="space-y-6">
      <PageHeader title="Imaging Requests" icon={Scan} />

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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
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
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[r.type]}`}>{r.type}</span>
                  </td>
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
