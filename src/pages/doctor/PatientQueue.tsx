import { Clock, Users, Stethoscope, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Waiting', value: '5', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'In Consultation', value: '2', icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Completed', value: '8', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Emergency', value: '1', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
];

const queue = [
  { position: 1, patient: 'Sarah Johnson', type: 'Consultation', timeWaiting: '10 min', status: 'Waiting' },
  { position: 2, patient: 'Michael Brown', type: 'Follow-up', timeWaiting: '5 min', status: 'Waiting' },
  { position: 3, patient: 'Emma Wilson', type: 'Emergency', timeWaiting: '2 min', status: 'In Consultation' },
  { position: 4, patient: 'James Davis', type: 'Consultation', timeWaiting: '15 min', status: 'In Consultation' },
  { position: 5, patient: 'Olivia Martinez', type: 'Follow-up', timeWaiting: '8 min', status: 'Waiting' },
  { position: 6, patient: 'William Garcia', type: 'Consultation', timeWaiting: '12 min', status: 'Waiting' },
  { position: 7, patient: 'Sophia Rodriguez', type: 'Consultation', timeWaiting: '20 min', status: 'Waiting' },
  { position: 8, patient: 'Daniel Lee', type: 'Follow-up', timeWaiting: '3 min', status: 'Completed' },
];

const typeColors: Record<string, string> = {
  Consultation: 'bg-blue-100 text-blue-800',
  'Follow-up': 'bg-purple-100 text-purple-800',
  Emergency: 'bg-red-100 text-red-800',
};

const statusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-800',
  'In Consultation': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function PatientQueue() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Queue" icon={Users} />

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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time Waiting</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {queue.map((item) => (
                <tr key={item.position} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#{item.position}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.patient}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>{item.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.timeWaiting}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>{item.status}</span>
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
