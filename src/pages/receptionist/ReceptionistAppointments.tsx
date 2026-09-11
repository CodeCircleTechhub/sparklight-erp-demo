import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: "Today's Appointments", value: '18', icon: Calendar, color: 'bg-blue-500' },
  { label: 'Upcoming', value: '25', icon: Clock, color: 'bg-green-500' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: 'bg-violet-500' },
  { label: 'Cancelled', value: '3', icon: XCircle, color: 'bg-red-500' },
];

const appointments = [
  { time: '08:30 AM', patient: 'Alice Johnson', doctor: 'Dr. Smith', department: 'Cardiology', status: 'Completed' },
  { time: '09:00 AM', patient: 'Bob Williams', doctor: 'Dr. Patel', department: 'Neurology', status: 'Completed' },
  { time: '09:30 AM', patient: 'Carol Davis', doctor: 'Dr. Lee', department: 'Pediatrics', status: 'In Progress' },
  { time: '10:00 AM', patient: 'David Brown', doctor: 'Dr. Garcia', department: 'Orthopedics', status: 'Scheduled' },
  { time: '10:30 AM', patient: 'Eva Martinez', doctor: 'Dr. Kim', department: 'Oncology', status: 'Scheduled' },
  { time: '11:00 AM', patient: 'Frank Wilson', doctor: 'Dr. Chen', department: 'Dermatology', status: 'Scheduled' },
  { time: '11:30 AM', patient: 'Grace Lee', doctor: 'Dr. Adams', department: 'ENT', status: 'Cancelled' },
  { time: '12:00 PM', patient: 'Henry Garcia', doctor: 'Dr. Brown', department: 'Radiology', status: 'Scheduled' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Scheduled: 'bg-violet-100 text-violet-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function ReceptionistAppointments() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Appointments" icon={Calendar} />

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
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((a, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-900">{a.time}</td>
                    <td className="py-3 text-gray-900">{a.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{a.doctor}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{a.department}</td>
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
