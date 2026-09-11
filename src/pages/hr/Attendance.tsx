import { Clock, UserCheck, AlertCircle, UserX, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Present', value: '142', icon: UserCheck, color: 'bg-emerald-500' },
  { label: 'Late', value: '8', icon: AlertCircle, color: 'bg-amber-500' },
  { label: 'Absent', value: '3', icon: UserX, color: 'bg-red-500' },
  { label: 'On Leave', value: '3', icon: Clock, color: 'bg-[#3b82f6]' },
];

const attendance = [
  { id: 'STF-001', name: 'Dr. James Wilson', department: 'Cardiology', clockIn: '08:00 AM', clockOut: '05:00 PM', hours: '9.0', status: 'Present' },
  { id: 'STF-002', name: 'Nurse Sarah Miller', department: 'Pediatrics', clockIn: '08:15 AM', clockOut: '04:30 PM', hours: '8.25', status: 'Present' },
  { id: 'STF-003', name: 'Dr. Emily Chen', department: 'Neurology', clockIn: '08:30 AM', clockOut: '05:15 PM', hours: '8.75', status: 'Present' },
  { id: 'STF-004', name: 'Mike Brown', department: 'Laboratory', clockIn: '-', clockOut: '-', hours: '-', status: 'On Leave' },
  { id: 'STF-005', name: 'Dr. Anna Lee', department: 'Orthopedics', clockIn: '07:45 AM', clockOut: '04:45 PM', hours: '9.0', status: 'Present' },
  { id: 'STF-006', name: 'Tom Davis', department: 'Pharmacy', clockIn: '09:00 AM', clockOut: '05:00 PM', hours: '8.0', status: 'Late' },
  { id: 'STF-007', name: 'Lisa Johnson', department: 'Administration', clockIn: '08:00 AM', clockOut: '04:00 PM', hours: '8.0', status: 'Present' },
  { id: 'STF-008', name: 'Robert Taylor', department: 'Cardiology', clockIn: '09:15 AM', clockOut: '-', hours: '-', status: 'Late' },
  { id: 'STF-009', name: 'Maria Santos', department: 'Radiology', clockIn: '-', clockOut: '-', hours: '-', status: 'Absent' },
  { id: 'STF-010', name: 'Kevin White', department: 'Finance', clockIn: '08:00 AM', clockOut: '04:30 PM', hours: '8.5', status: 'Present' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Present': return 'green';
    case 'Late': return 'yellow';
    case 'Absent': return 'red';
    case 'On Leave': return 'blue';
    default: return 'gray';
  }
};

export default function Attendance() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Attendance" icon={Clock} />
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" defaultValue="2024-01-15" className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${s.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-500">{s.label}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Staff ID', 'Name', 'Department', 'Clock In', 'Clock Out', 'Hours', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendance.map((a) => (
                  <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{a.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{a.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{a.department}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{a.clockIn}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{a.clockOut}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{a.hours}</td>
                    <td className="px-5 py-4"><StatusBadge status={a.status} color={getStatusColor(a.status) as any} /></td>
                    <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
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
