import { Calendar, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: "Today's Appointments", value: '18', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Upcoming', value: '25', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Cancelled', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
];

const appointments = [
  { time: '09:00 AM', patient: 'John Smith', doctor: 'Dr. Sarah Johnson', department: 'Cardiology', type: 'Follow-up', status: 'Completed' },
  { time: '09:30 AM', patient: 'Sarah Johnson', doctor: 'Dr. Michael Brown', department: 'Orthopedics', type: 'Consultation', status: 'Completed' },
  { time: '10:00 AM', patient: 'Mike Williams', doctor: 'Dr. Emily Davis', department: 'Neurology', type: 'Check-up', status: 'Completed' },
  { time: '10:30 AM', patient: 'Emily Brown', doctor: 'Dr. Sarah Johnson', department: 'Cardiology', type: 'New Patient', status: 'In Progress' },
  { time: '11:00 AM', patient: 'David Lee', doctor: 'Dr. James Wilson', department: 'General', type: 'Follow-up', status: 'Scheduled' },
  { time: '11:30 AM', patient: 'Lisa Anderson', doctor: 'Dr. Emily Davis', department: 'Neurology', type: 'Consultation', status: 'Scheduled' },
  { time: '12:00 PM', patient: 'James Wilson', doctor: 'Dr. Michael Brown', department: 'Orthopedics', type: 'Check-up', status: 'Scheduled' },
  { time: '01:30 PM', patient: 'Maria Garcia', doctor: 'Dr. Sarah Johnson', department: 'Cardiology', type: 'New Patient', status: 'Scheduled' },
  { time: '02:00 PM', patient: 'Robert Taylor', doctor: 'Dr. James Wilson', department: 'General', type: 'Follow-up', status: 'Cancelled' },
  { time: '02:30 PM', patient: 'Jennifer Martinez', doctor: 'Dr. Emily Davis', department: 'Neurology', type: 'Consultation', status: 'Scheduled' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Scheduled: 'bg-gray-100 text-gray-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export default function CareAppointments() {
  return (
    <div className="space-y-6">
      <PageHeader title="Appointments" description="Manage patient appointments" />
      
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
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((apt, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{apt.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{apt.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.doctor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                      {apt.status}
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