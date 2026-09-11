import { useState } from 'react';
import { Search, Calendar, CheckCircle, Clock, Timer } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Appointments', value: '280', icon: Calendar, color: 'blue' as const },
  { title: 'Today', value: '43', icon: Clock, color: 'green' as const },
  { title: 'Upcoming', value: '25', icon: Timer, color: 'yellow' as const },
  { title: 'Completed', value: '210', icon: CheckCircle, color: 'purple' as const },
];

const appointments = [
  { id: 'APT-001', patient: 'Abubakar Ibrahim', doctor: 'Dr. Fatima Usman', date: '2026-09-11', time: '09:00 AM', status: 'Completed' },
  { id: 'APT-002', patient: 'Fatima Bello', doctor: 'Dr. Oluwaseun Adeleye', date: '2026-09-11', time: '09:30 AM', status: 'Completed' },
  { id: 'APT-003', patient: 'Mohammed Usman', doctor: 'Dr. Abubakar Suleiman', date: '2026-09-11', time: '10:00 AM', status: 'In Progress' },
  { id: 'APT-004', patient: 'Aisha Abdullahi', doctor: 'Dr. Aisha Bello', date: '2026-09-11', time: '10:30 AM', status: 'In Progress' },
  { id: 'APT-005', patient: 'Oluwaseun Adeyemi', doctor: 'Dr. Chukwuemeka Obi', date: '2026-09-11', time: '11:00 AM', status: 'Scheduled' },
  { id: 'APT-006', patient: 'Ngozi Okafor', doctor: 'Dr. Hauwa Danjuma', date: '2026-09-11', time: '11:30 AM', status: 'Scheduled' },
  { id: 'APT-007', patient: 'Yusuf Danjuma', doctor: 'Dr. Ibrahim Musa', date: '2026-09-11', time: '01:00 PM', status: 'Scheduled' },
  { id: 'APT-008', patient: 'Hauwa Mohammed', doctor: 'Dr. Fatima Usman', date: '2026-09-11', time: '01:30 PM', status: 'Scheduled' },
  { id: 'APT-009', patient: 'Tunde Akande', doctor: 'Dr. Oluwaseun Adeleye', date: '2026-09-12', time: '09:00 AM', status: 'Scheduled' },
  { id: 'APT-010', patient: 'Blessing Eze', doctor: 'Dr. Aisha Bello', date: '2026-09-12', time: '10:00 AM', status: 'Scheduled' },
];

const statusColor: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Scheduled: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminAppointmentsList() {
  const [search, setSearch] = useState('');

  const filtered = appointments.filter(
    (a) =>
      a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="All Appointments" icon={Calendar} description="Manage all hospital appointments" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.time}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status]}`}>
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
