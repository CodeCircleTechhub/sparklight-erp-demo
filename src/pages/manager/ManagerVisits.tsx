import { Calendar, Clock, CalendarDays, TrendingUp } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: "Today's Visits", value: '126', icon: Calendar, color: 'bg-blue-500' },
  { label: 'This Week', value: '842', icon: CalendarDays, color: 'bg-green-500' },
  { label: 'This Month', value: '3,680', icon: TrendingUp, color: 'bg-violet-500' },
  { label: 'Average Daily', value: '122', icon: Clock, color: 'bg-amber-500' },
];

const visits = [
  { id: 'VST-1001', patient: 'Alice Johnson', date: 'Sep 11, 2026', department: 'Cardiology', doctor: 'Dr. Smith', status: 'Completed' },
  { id: 'VST-1002', patient: 'Bob Williams', date: 'Sep 11, 2026', department: 'Neurology', doctor: 'Dr. Patel', status: 'In Progress' },
  { id: 'VST-1003', patient: 'Carol Davis', date: 'Sep 11, 2026', department: 'Pediatrics', doctor: 'Dr. Lee', status: 'Completed' },
  { id: 'VST-1004', patient: 'David Brown', date: 'Sep 11, 2026', department: 'Orthopedics', doctor: 'Dr. Garcia', status: 'Waiting' },
  { id: 'VST-1005', patient: 'Eva Martinez', date: 'Sep 11, 2026', department: 'Oncology', doctor: 'Dr. Kim', status: 'Completed' },
  { id: 'VST-1006', patient: 'Frank Wilson', date: 'Sep 10, 2026', department: 'Dermatology', doctor: 'Dr. Chen', status: 'Completed' },
  { id: 'VST-1007', patient: 'Grace Lee', date: 'Sep 10, 2026', department: 'ENT', doctor: 'Dr. Adams', status: 'Cancelled' },
  { id: 'VST-1008', patient: 'Henry Garcia', date: 'Sep 10, 2026', department: 'Radiology', doctor: 'Dr. Brown', status: 'Completed' },
  { id: 'VST-1009', patient: 'Irene Chen', date: 'Sep 09, 2026', department: 'Psychiatry', doctor: 'Dr. Wilson', status: 'Completed' },
  { id: 'VST-1010', patient: 'Jack Thompson', date: 'Sep 09, 2026', department: 'General', doctor: 'Dr. Moore', status: 'In Progress' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Waiting: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function ManagerVisits() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Visits Management" icon={Calendar} />

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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Visit ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{v.id}</td>
                    <td className="py-3 text-gray-900">{v.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{v.date}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{v.department}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{v.doctor}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[v.status]}`}>
                        {v.status}
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
