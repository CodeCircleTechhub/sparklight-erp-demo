import { CalendarOff, Clock, CheckCircle, XCircle, UserX, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Pending', value: '5', icon: Clock, color: 'bg-amber-500' },
  { label: 'Approved', value: '12', icon: CheckCircle, color: 'bg-emerald-500' },
  { label: 'Rejected', value: '2', icon: XCircle, color: 'bg-red-500' },
  { label: 'On Leave', value: '8', icon: UserX, color: 'bg-[#3b82f6]' },
];

const leaveRequests = [
  { name: 'Dr. Robert Taylor', department: 'Cardiology', type: 'Annual Leave', startDate: '2024-01-20', endDate: '2024-01-25', days: 5, status: 'Pending' },
  { name: 'Nurse Lisa Johnson', department: 'Pediatrics', type: 'Sick Leave', startDate: '2024-01-18', endDate: '2024-01-19', days: 2, status: 'Approved' },
  { name: 'Dr. Maria Santos', department: 'Neurology', type: 'Annual Leave', startDate: '2024-01-22', endDate: '2024-01-26', days: 5, status: 'Pending' },
  { name: 'Admin Kevin White', department: 'Administration', type: 'Personal', startDate: '2024-01-19', endDate: '2024-01-19', days: 1, status: 'Rejected' },
  { name: 'Dr. David Kim', department: 'Orthopedics', type: 'Maternity', startDate: '2024-02-01', endDate: '2024-02-15', days: 15, status: 'Approved' },
  { name: 'Tom Davis', department: 'Pharmacy', type: 'Annual Leave', startDate: '2024-01-28', endDate: '2024-01-30', days: 3, status: 'Pending' },
  { name: 'Nurse Sarah Miller', department: 'Pediatrics', type: 'Sick Leave', startDate: '2024-01-16', endDate: '2024-01-17', days: 2, status: 'Approved' },
  { name: 'Dr. Emily Chen', department: 'Neurology', type: 'Annual Leave', startDate: '2024-02-05', endDate: '2024-02-09', days: 5, status: 'Pending' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'green';
    case 'Pending': return 'yellow';
    case 'Rejected': return 'red';
    default: return 'gray';
  }
};

export default function LeaveManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Leave Management" icon={CalendarOff} />
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
                  {['Staff Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((l, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                          {l.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{l.department}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{l.type}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{l.startDate}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{l.endDate}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{l.days}</td>
                    <td className="px-5 py-4"><StatusBadge status={l.status} color={getStatusColor(l.status) as any} /></td>
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
