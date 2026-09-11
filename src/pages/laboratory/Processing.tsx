import { Cog, CheckCircle, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'In Progress', value: '5', icon: Cog, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Completed Today', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Average Time', value: '2.5 hrs', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
];

const tests = [
  { id: 'PR-1201', patient: 'Sarah Johnson', testType: 'Complete Blood Count', startTime: '09:00 AM', status: 'In Progress' },
  { id: 'PR-1202', patient: 'Michael Brown', testType: 'Lipid Profile', startTime: '09:30 AM', status: 'In Progress' },
  { id: 'PR-1203', patient: 'Emma Wilson', testType: 'Urine Analysis', startTime: '08:00 AM', status: 'Completed' },
  { id: 'PR-1204', patient: 'James Davis', testType: 'Blood Glucose', startTime: '08:30 AM', status: 'Completed' },
  { id: 'PR-1205', patient: 'Olivia Martinez', testType: 'Thyroid Panel', startTime: '10:00 AM', status: 'In Progress' },
  { id: 'PR-1206', patient: 'William Garcia', testType: 'Hemoglobin A1C', startTime: '10:15 AM', status: 'In Progress' },
  { id: 'PR-1207', patient: 'Sophia Rodriguez', testType: 'Prenatal Blood Panel', startTime: '07:30 AM', status: 'Completed' },
  { id: 'PR-1208', patient: 'Daniel Lee', testType: 'Spirometry', startTime: '10:30 AM', status: 'In Progress' },
];

const statusColors: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
};

export default function Processing() {
  return (
    <div className="space-y-6">
      <PageHeader title="Processing" icon={Cog} />

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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Start Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{t.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{t.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.testType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{t.startTime}</td>
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
