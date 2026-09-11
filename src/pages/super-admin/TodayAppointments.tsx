import { Calendar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total', value: '43', icon: Calendar, color: 'blue' as const },
  { title: 'Confirmed', value: '28', icon: Calendar, color: 'green' as const },
  { title: 'Waiting', value: '10', icon: Calendar, color: 'yellow' as const },
  { title: 'Completed', value: '5', icon: Calendar, color: 'purple' as const },
];

const appointments = [
  { time: '08:00 AM', patient: 'John Doe', doctor: 'Dr. Smith', department: 'Cardiology', type: 'Follow-up', status: 'Completed' },
  { time: '08:30 AM', patient: 'Sarah Connor', doctor: 'Dr. Patel', department: 'Orthopedics', type: 'Consultation', status: 'Completed' },
  { time: '09:00 AM', patient: 'Mike Johnson', doctor: 'Dr. Lee', department: 'General', type: 'Check-up', status: 'Completed' },
  { time: '09:30 AM', patient: 'Emma Wilson', doctor: 'Dr. Adams', department: 'Pediatrics', type: 'Vaccination', status: 'Completed' },
  { time: '10:00 AM', patient: 'David Brown', doctor: 'Dr. Chen', department: 'Neurology', type: 'Consultation', status: 'Completed' },
  { time: '10:30 AM', patient: 'Lisa Anderson', doctor: 'Dr. Kim', department: 'Dermatology', type: 'Follow-up', status: 'Confirmed' },
  { time: '11:00 AM', patient: 'James Taylor', doctor: 'Dr. Garcia', department: 'ENT', type: 'Check-up', status: 'Confirmed' },
  { time: '11:30 AM', patient: 'Rachel White', doctor: 'Dr. Nguyen', department: 'Ophthalmology', type: 'Consultation', status: 'Waiting' },
];

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'Confirmed') return 'bg-blue-100 text-blue-700';
  if (s === 'Waiting') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};

export default function TodayAppointments() {
  return (
    <div className="space-y-6">
      <PageHeader title="Today's Appointments" icon={Calendar} />

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
                <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.time}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.type}</td>
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
