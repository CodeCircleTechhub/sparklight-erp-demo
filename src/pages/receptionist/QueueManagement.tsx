import { LayoutList, Users, Clock, Stethoscope, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'In Queue', value: '8', icon: Users, color: 'bg-blue-500' },
  { label: 'Waiting', value: '5', icon: Clock, color: 'bg-amber-500' },
  { label: 'With Doctor', value: '2', icon: Stethoscope, color: 'bg-green-500' },
  { label: 'Completed', value: '1', icon: CheckCircle, color: 'bg-violet-500' },
];

const queue = [
  { position: 1, patientId: 'PT-2041', name: 'Alice Johnson', timeWaiting: '5 min', department: 'Cardiology', status: 'Waiting' },
  { position: 2, patientId: 'PT-2042', name: 'Bob Williams', timeWaiting: '3 min', department: 'Neurology', status: 'Called' },
  { position: 3, patientId: 'PT-2043', name: 'Carol Davis', timeWaiting: '0 min', department: 'Pediatrics', status: 'In Consultation' },
  { position: 4, patientId: 'PT-2044', name: 'David Brown', timeWaiting: '8 min', department: 'Orthopedics', status: 'Waiting' },
  { position: 5, patientId: 'PT-2045', name: 'Eva Martinez', timeWaiting: '10 min', department: 'Oncology', status: 'Waiting' },
  { position: 6, patientId: 'PT-2046', name: 'Frank Wilson', timeWaiting: '2 min', department: 'Dermatology', status: 'Called' },
  { position: 7, patientId: 'PT-2047', name: 'Grace Lee', timeWaiting: '12 min', department: 'ENT', status: 'Waiting' },
  { position: 8, patientId: 'PT-2048', name: 'Henry Garcia', timeWaiting: '0 min', department: 'Radiology', status: 'Completed' },
];

const statusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-700',
  Called: 'bg-blue-100 text-blue-700',
  'In Consultation': 'bg-green-100 text-green-700',
  Completed: 'bg-violet-100 text-violet-700',
};

export default function QueueManagement() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Queue Management" icon={LayoutList} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Queue</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Position</th>
                  <th className="pb-3 font-medium">Patient ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Time Waiting</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {queue.map((q) => (
                  <tr key={q.position} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">#{q.position}</td>
                    <td className="py-3 font-medium text-blue-600">{q.patientId}</td>
                    <td className="py-3 text-gray-900">{q.name}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{q.timeWaiting}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{q.department}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[q.status]}`}>
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
