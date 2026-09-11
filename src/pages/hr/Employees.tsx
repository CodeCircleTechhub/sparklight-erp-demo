import { Users, UserCheck, CalendarOff, UserX, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '156', icon: Users, color: 'bg-[#3b82f6]' },
  { label: 'Active', value: '142', icon: UserCheck, color: 'bg-emerald-500' },
  { label: 'On Leave', value: '8', icon: CalendarOff, color: 'bg-amber-500' },
  { label: 'Inactive', value: '6', icon: UserX, color: 'bg-red-500' },
];

const employees = [
  { id: 'STF-001', name: 'Dr. James Wilson', department: 'Cardiology', position: 'Senior Consultant', phone: '+1 555-0101', joinDate: '2020-03-15', status: 'Active' },
  { id: 'STF-002', name: 'Nurse Sarah Miller', department: 'Pediatrics', position: 'Head Nurse', phone: '+1 555-0102', joinDate: '2019-07-22', status: 'Active' },
  { id: 'STF-003', name: 'Dr. Emily Chen', department: 'Neurology', position: 'Consultant', phone: '+1 555-0103', joinDate: '2021-01-10', status: 'Active' },
  { id: 'STF-004', name: 'Mike Brown', department: 'Laboratory', position: 'Lab Technician', phone: '+1 555-0104', joinDate: '2020-09-05', status: 'On Leave' },
  { id: 'STF-005', name: 'Dr. Anna Lee', department: 'Orthopedics', position: 'Surgeon', phone: '+1 555-0105', joinDate: '2018-11-20', status: 'Active' },
  { id: 'STF-006', name: 'Tom Davis', department: 'Pharmacy', position: 'Pharmacist', phone: '+1 555-0106', joinDate: '2021-05-18', status: 'Active' },
  { id: 'STF-007', name: 'Lisa Johnson', department: 'Administration', position: 'Office Manager', phone: '+1 555-0107', joinDate: '2019-02-28', status: 'Active' },
  { id: 'STF-008', name: 'Robert Taylor', department: 'Cardiology', position: 'Nurse', phone: '+1 555-0108', joinDate: '2022-04-12', status: 'On Leave' },
  { id: 'STF-009', name: 'Maria Santos', department: 'Radiology', position: 'Radiologist', phone: '+1 555-0109', joinDate: '2020-08-01', status: 'Active' },
  { id: 'STF-010', name: 'Kevin White', department: 'Finance', position: 'Accountant', phone: '+1 555-0110', joinDate: '2021-06-15', status: 'Active' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'green';
    case 'On Leave': return 'yellow';
    case 'Inactive': return 'red';
    default: return 'gray';
  }
};

export default function Employees() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Employees" icon={Users} />
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
                  {['Staff ID', 'Name', 'Department', 'Position', 'Phone', 'Join Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{e.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                          {e.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{e.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{e.department}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{e.position}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{e.phone}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{e.joinDate}</td>
                    <td className="px-5 py-4"><StatusBadge status={e.status} color={getStatusColor(e.status) as any} /></td>
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
