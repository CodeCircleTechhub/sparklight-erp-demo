import { TestTube, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Collected', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Pending', value: '5', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Rejected', value: '1', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
];

const samples = [
  { id: 'SC-1101', patient: 'Sarah Johnson', testType: 'Complete Blood Count', collector: 'Nurse Alice', date: 'Sep 11, 2026', status: 'Collected' },
  { id: 'SC-1102', patient: 'Michael Brown', testType: 'Lipid Profile', collector: 'Nurse Bob', date: 'Sep 11, 2026', status: 'Pending' },
  { id: 'SC-1103', patient: 'Emma Wilson', testType: 'Urine Analysis', collector: 'Nurse Alice', date: 'Sep 11, 2026', status: 'Collected' },
  { id: 'SC-1104', patient: 'James Davis', testType: 'Blood Glucose', collector: 'Nurse Carol', date: 'Sep 10, 2026', status: 'Collected' },
  { id: 'SC-1105', patient: 'Olivia Martinez', testType: 'Thyroid Panel', collector: 'Nurse Bob', date: 'Sep 10, 2026', status: 'Pending' },
  { id: 'SC-1106', patient: 'William Garcia', testType: 'Hemoglobin A1C', collector: 'Nurse Alice', date: 'Sep 10, 2026', status: 'Rejected' },
  { id: 'SC-1107', patient: 'Sophia Rodriguez', testType: 'Prenatal Blood Panel', collector: 'Nurse Carol', date: 'Sep 09, 2026', status: 'Collected' },
  { id: 'SC-1108', patient: 'Daniel Lee', testType: 'Spirometry', collector: 'Nurse Bob', date: 'Sep 09, 2026', status: 'Pending' },
];

const statusColors: Record<string, string> = {
  Collected: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function SampleCollection() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sample Collection" icon={TestTube} />

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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sample ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Test Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Collector</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {samples.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{s.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{s.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.testType}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.collector}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
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
