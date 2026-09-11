import { ClipboardList } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Visits', value: '12,450', icon: ClipboardList, color: 'blue' as const },
  { title: "Today's Visits", value: '126', icon: ClipboardList, color: 'green' as const },
  { title: 'This Week', value: '842', icon: ClipboardList, color: 'purple' as const },
  { title: 'This Month', value: '3,680', icon: ClipboardList, color: 'yellow' as const },
];

const visits = [
  { id: 'VST-2026-001', patient: 'John Doe', date: '2026-09-11', department: 'Cardiology', doctor: 'Dr. Smith', status: 'Completed' },
  { id: 'VST-2026-002', patient: 'Sarah Connor', date: '2026-09-11', department: 'Orthopedics', doctor: 'Dr. Patel', status: 'Completed' },
  { id: 'VST-2026-003', patient: 'Mike Johnson', date: '2026-09-11', department: 'General', doctor: 'Dr. Lee', status: 'In Progress' },
  { id: 'VST-2026-004', patient: 'Emma Wilson', date: '2026-09-11', department: 'Pediatrics', doctor: 'Dr. Adams', status: 'Completed' },
  { id: 'VST-2026-005', patient: 'David Brown', date: '2026-09-10', department: 'Neurology', doctor: 'Dr. Chen', status: 'Completed' },
  { id: 'VST-2026-006', patient: 'Lisa Anderson', date: '2026-09-10', department: 'Dermatology', doctor: 'Dr. Kim', status: 'Cancelled' },
  { id: 'VST-2026-007', patient: 'James Taylor', date: '2026-09-10', department: 'ENT', doctor: 'Dr. Garcia', status: 'Completed' },
  { id: 'VST-2026-008', patient: 'Rachel White', date: '2026-09-09', department: 'Ophthalmology', doctor: 'Dr. Nguyen', status: 'Completed' },
  { id: 'VST-2026-009', patient: 'Tom Harris', date: '2026-09-09', department: 'Urology', doctor: 'Dr. Patel', status: 'Completed' },
  { id: 'VST-2026-010', patient: 'Grace Lee', date: '2026-09-09', department: 'Psychiatry', doctor: 'Dr. Smith', status: 'Pending' },
];

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'In Progress') return 'bg-blue-100 text-blue-700';
  if (s === 'Cancelled') return 'bg-red-100 text-red-700';
  return 'bg-yellow-100 text-yellow-700';
};

export default function PatientVisits() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patient Visits" icon={ClipboardList} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Visit ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
                      {row.status}
                    </span>
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
