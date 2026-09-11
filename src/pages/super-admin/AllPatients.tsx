import { useState } from 'react';
import { Search, Users, UserCheck, UserPlus, Archive } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Patients', value: '4,582', icon: Users, color: 'blue' as const },
  { title: 'Active Patients', value: '4,200', icon: UserCheck, color: 'green' as const },
  { title: 'New This Month', value: '180', icon: UserPlus, color: 'purple' as const },
  { title: 'Archived', value: '382', icon: Archive, color: 'yellow' as const },
];

const patients = [
  { id: 'PT-001', name: 'Abubakar Ibrahim', gender: 'Male', age: 34, phone: '+2348012345678', lastVisit: '2026-09-10', status: 'Active' },
  { id: 'PT-002', name: 'Fatima Bello', gender: 'Female', age: 28, phone: '+2348023456789', lastVisit: '2026-09-09', status: 'Active' },
  { id: 'PT-003', name: 'Mohammed Usman', gender: 'Male', age: 45, phone: '+2348034567890', lastVisit: '2026-09-08', status: 'Active' },
  { id: 'PT-004', name: 'Aisha Abdullahi', gender: 'Female', age: 52, phone: '+2348045678901', lastVisit: '2026-09-07', status: 'Inactive' },
  { id: 'PT-005', name: 'Oluwaseun Adeyemi', gender: 'Male', age: 31, phone: '+2348056789012', lastVisit: '2026-09-06', status: 'Active' },
  { id: 'PT-006', name: 'Ngozi Okafor', gender: 'Female', age: 39, phone: '+2348067890123', lastVisit: '2026-09-05', status: 'Active' },
  { id: 'PT-007', name: 'Yusuf Danjuma', gender: 'Male', age: 60, phone: '+2348078901234', lastVisit: '2026-09-04', status: 'Active' },
  { id: 'PT-008', name: 'Hauwa Mohammed', gender: 'Female', age: 25, phone: '+2348089012345', lastVisit: '2026-09-03', status: 'Archived' },
  { id: 'PT-009', name: 'Tunde Akande', gender: 'Male', age: 47, phone: '+2348090123456', lastVisit: '2026-09-02', status: 'Active' },
  { id: 'PT-010', name: 'Blessing Eze', gender: 'Female', age: 33, phone: '+2348001234567', lastVisit: '2026-09-01', status: 'Active' },
];

const statusColor: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-yellow-100 text-yellow-700',
  Archived: 'bg-gray-100 text-gray-600',
};

export default function AllPatients() {
  const [search, setSearch] = useState('');

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <PageHeader title="All Patients" icon={Users} description="Manage all registered patients" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Patient List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
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
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Gender</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Age</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Last Visit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.gender}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.age}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.phone}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.lastVisit}</td>
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
