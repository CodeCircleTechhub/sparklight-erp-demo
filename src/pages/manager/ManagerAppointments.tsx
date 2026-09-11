import { CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: "Today's Appointments", value: '43', icon: CalendarCheck, color: 'bg-blue-500' },
  { label: 'This Week', value: '280', icon: Clock, color: 'bg-green-500' },
  { label: 'Completed', value: '210', icon: CheckCircle, color: 'bg-violet-500' },
  { label: 'Cancelled', value: '15', icon: XCircle, color: 'bg-red-500' },
];

const appointments = [
  { id: 'APT-301', patient: 'Alice Johnson', doctor: 'Dr. Smith', date: 'Sep 11, 2026', time: '09:00 AM', status: 'Completed' },
  { id: 'APT-302', patient: 'Bob Williams', doctor: 'Dr. Patel', date: 'Sep 11, 2026', time: '09:30 AM', status: 'Completed' },
  { id: 'APT-303', patient: 'Carol Davis', doctor: 'Dr. Lee', date: 'Sep 11, 2026', time: '10:00 AM', status: 'In Progress' },
  { id: 'APT-304', patient: 'David Brown', doctor: 'Dr. Garcia', date: 'Sep 11, 2026', time: '10:30 AM', status: 'Scheduled' },
  { id: 'APT-305', patient: 'Eva Martinez', doctor: 'Dr. Kim', date: 'Sep 11, 2026', time: '11:00 AM', status: 'Scheduled' },
  { id: 'APT-306', patient: 'Frank Wilson', doctor: 'Dr. Chen', date: 'Sep 12, 2026', time: '09:00 AM', status: 'Scheduled' },
  { id: 'APT-307', patient: 'Grace Lee', doctor: 'Dr. Adams', date: 'Sep 12, 2026', time: '10:00 AM', status: 'Scheduled' },
  { id: 'APT-308', patient: 'Henry Garcia', doctor: 'Dr. Brown', date: 'Sep 11, 2026', time: '11:30 AM', status: 'Cancelled' },
  { id: 'APT-309', patient: 'Irene Chen', doctor: 'Dr. Wilson', date: 'Sep 11, 2026', time: '12:00 PM', status: 'Completed' },
  { id: 'APT-310', patient: 'Jack Thompson', doctor: 'Dr. Moore', date: 'Sep 12, 2026', time: '11:00 AM', status: 'Scheduled' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Scheduled: 'bg-violet-100 text-violet-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function ManagerAppointments() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Appointments" icon={CalendarCheck} />

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
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{a.id}</td>
                    <td className="py-3 text-gray-900">{a.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{a.doctor}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{a.date}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{a.time}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status]}`}>
                        {a.status}
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
