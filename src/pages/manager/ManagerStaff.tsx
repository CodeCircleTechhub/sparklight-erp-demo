import { Users, UserCheck, UserMinus, UserX } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Staff', value: '156', icon: Users, color: 'bg-blue-500' },
  { label: 'Active', value: '142', icon: UserCheck, color: 'bg-green-500' },
  { label: 'On Leave', value: '8', icon: UserMinus, color: 'bg-amber-500' },
  { label: 'Inactive', value: '6', icon: UserX, color: 'bg-red-500' },
];

const staff = [
  { id: 'STF-101', name: 'Dr. John Smith', department: 'Cardiology', position: 'Head of Department', phone: '(555) 111-2222', status: 'Active' },
  { id: 'STF-102', name: 'Dr. Priya Patel', department: 'Neurology', position: 'Senior Doctor', phone: '(555) 222-3333', status: 'Active' },
  { id: 'STF-103', name: 'Nurse Sarah Brown', department: 'Pediatrics', position: 'Head Nurse', phone: '(555) 333-4444', status: 'Active' },
  { id: 'STF-104', name: 'Dr. Carlos Garcia', department: 'Orthopedics', position: 'Surgeon', phone: '(555) 444-5555', status: 'Active' },
  { id: 'STF-105', name: 'Nurse Emily Davis', department: 'Oncology', position: 'Nurse', phone: '(555) 555-6666', status: 'On Leave' },
  { id: 'STF-106', name: 'Dr. Michael Lee', department: 'Pediatrics', position: 'Pediatrician', phone: '(555) 666-7777', status: 'Active' },
  { id: 'STF-107', name: 'Admin Rachel Green', department: 'Administration', position: 'Admin Assistant', phone: '(555) 777-8888', status: 'Active' },
  { id: 'STF-108', name: 'Dr. David Kim', department: 'Oncology', position: 'Oncologist', phone: '(555) 888-9999', status: 'Active' },
  { id: 'STF-109', name: 'Nurse Maria Wilson', department: 'Cardiology', position: 'Nurse', phone: '(555) 999-0000', status: 'On Leave' },
  { id: 'STF-110', name: 'Dr. James Adams', department: 'Emergency', position: 'ER Specialist', phone: '(555) 000-1111', status: 'Active' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-amber-100 text-amber-700',
  Inactive: 'bg-red-100 text-red-700',
};

export default function ManagerStaff() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Staff Management" icon={Users} />

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
                  <th className="pb-3 font-medium">Staff ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Department</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Position</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{s.id}</td>
                    <td className="py-3 text-gray-900">{s.name}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{s.department}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{s.position}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{s.phone}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[s.status]}`}>
                        {s.status}
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
