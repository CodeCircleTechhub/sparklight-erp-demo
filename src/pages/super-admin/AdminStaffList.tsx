import { useState } from 'react';
import { Search, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Staff', value: '156', icon: Users, color: 'blue' as const },
  { title: 'Active Staff', value: '142', icon: UserCheck, color: 'green' as const },
  { title: 'On Leave', value: '8', icon: Clock, color: 'yellow' as const },
  { title: 'Inactive', value: '6', icon: UserX, color: 'red' as const },
];

const staff = [
  { id: 'ST-001', name: 'Abdulkadir Nafiu', department: 'Administration', position: 'Super Admin', phone: '+2348086142293', status: 'Active' },
  { id: 'ST-002', name: 'Ibrahim Suleiman', department: 'Emergency', position: 'Doctor', phone: '+2348012345678', status: 'Active' },
  { id: 'ST-003', name: 'Fatima Bello', department: 'Cardiology', position: 'Doctor', phone: '+2348023456789', status: 'Active' },
  { id: 'ST-004', name: 'Oluwaseun Adeleye', department: 'Neurology', position: 'Doctor', phone: '+2348034567890', status: 'Active' },
  { id: 'ST-005', name: 'Amina Yusuf', department: 'Pediatrics', position: 'Nurse', phone: '+2348045678901', status: 'On Leave' },
  { id: 'ST-006', name: 'Tunde Adesanya', department: 'Pharmacy', position: 'Pharmacist', phone: '+2348056789012', status: 'Active' },
  { id: 'ST-007', name: 'Hauwa Danjuma', department: 'Radiology', position: 'Doctor', phone: '+2348067890123', status: 'Active' },
  { id: 'ST-008', name: 'Chukwuemeka Obi', department: 'Oncology', position: 'Doctor', phone: '+2348078901234', status: 'Inactive' },
  { id: 'ST-009', name: 'Ngozi Eze', department: 'Nursing', position: 'Head Nurse', phone: '+2348089012345', status: 'Active' },
  { id: 'ST-010', name: 'Yusuf Abdullahi', department: 'Laboratory', position: 'Lab Tech', phone: '+2348090123456', status: 'Active' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  Inactive: 'bg-red-100 text-red-700',
};

export default function AdminStaffList() {
  const [search, setSearch] = useState('');

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="All Staff" icon={Users} description="Manage all hospital staff members" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Staff Directory</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
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
                <th className="text-left py-3 px-4 font-medium text-gray-500">Staff ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Position</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.position}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.phone}</td>
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
