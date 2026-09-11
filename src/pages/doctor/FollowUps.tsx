import { CalendarCheck, Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Scheduled', value: '7', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Overdue', value: '2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  { label: 'Completed', value: '15', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Total', value: '24', icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const followUps = [
  { patient: 'Sarah Johnson', reason: 'Blood pressure check', scheduledDate: 'Sep 15, 2026', doctor: 'Dr. Ahmed', status: 'Scheduled' },
  { patient: 'Michael Brown', reason: 'Diabetes follow-up', scheduledDate: 'Sep 14, 2026', doctor: 'Dr. Ahmed', status: 'Scheduled' },
  { patient: 'Emma Wilson', reason: 'Migraine review', scheduledDate: 'Sep 13, 2026', doctor: 'Dr. Fatima', status: 'Scheduled' },
  { patient: 'James Davis', reason: 'Back pain assessment', scheduledDate: 'Sep 12, 2026', doctor: 'Dr. Ahmed', status: 'Scheduled' },
  { patient: 'Olivia Martinez', reason: 'Osteoarthritis review', scheduledDate: 'Sep 08, 2026', doctor: 'Dr. Fatima', status: 'Overdue' },
  { patient: 'William Garcia', reason: 'Asthma medication review', scheduledDate: 'Sep 16, 2026', doctor: 'Dr. Ahmed', status: 'Scheduled' },
  { patient: 'Sophia Rodriguez', reason: 'Thyroid level check', scheduledDate: 'Sep 07, 2026', doctor: 'Dr. Fatima', status: 'Overdue' },
  { patient: 'Daniel Lee', reason: 'COPD follow-up', scheduledDate: 'Sep 17, 2026', doctor: 'Dr. Ahmed', status: 'Scheduled' },
];

const statusColors: Record<string, string> = {
  Scheduled: 'bg-blue-100 text-blue-800',
  Overdue: 'bg-red-100 text-red-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function FollowUps() {
  return (
    <div className="space-y-6">
      <PageHeader title="Follow-ups" icon={CalendarCheck} />

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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scheduled Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {followUps.map((f, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.scheduledDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{f.doctor}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[f.status]}`}>{f.status}</span>
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
