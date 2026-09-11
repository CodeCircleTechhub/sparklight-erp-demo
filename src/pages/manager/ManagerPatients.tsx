import { Users, UserCheck, UserPlus, Archive } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Patients', value: '4,582', icon: Users, color: 'bg-blue-500' },
  { label: 'Active', value: '4,200', icon: UserCheck, color: 'bg-green-500' },
  { label: 'New This Month', value: '180', icon: UserPlus, color: 'bg-violet-500' },
  { label: 'Archived', value: '382', icon: Archive, color: 'bg-amber-500' },
];

const patients = [
  { id: 'PT-2041', name: 'Alice Johnson', gender: 'Female', age: 34, phone: '(555) 123-4567', lastVisit: 'Sep 10, 2026', status: 'Active' },
  { id: 'PT-2042', name: 'Bob Williams', gender: 'Male', age: 52, phone: '(555) 234-5678', lastVisit: 'Sep 09, 2026', status: 'Active' },
  { id: 'PT-2043', name: 'Carol Davis', gender: 'Female', age: 28, phone: '(555) 345-6789', lastVisit: 'Sep 11, 2026', status: 'Active' },
  { id: 'PT-2044', name: 'David Brown', gender: 'Male', age: 45, phone: '(555) 456-7890', lastVisit: 'Sep 08, 2026', status: 'Active' },
  { id: 'PT-2045', name: 'Eva Martinez', gender: 'Female', age: 61, phone: '(555) 567-8901', lastVisit: 'Sep 07, 2026', status: 'Inactive' },
  { id: 'PT-2046', name: 'Frank Wilson', gender: 'Male', age: 39, phone: '(555) 678-9012', lastVisit: 'Sep 11, 2026', status: 'Active' },
  { id: 'PT-2047', name: 'Grace Lee', gender: 'Female', age: 23, phone: '(555) 789-0123', lastVisit: 'Sep 06, 2026', status: 'Active' },
  { id: 'PT-2048', name: 'Henry Garcia', gender: 'Male', age: 48, phone: '(555) 890-1234', lastVisit: 'Sep 10, 2026', status: 'Active' },
  { id: 'PT-2049', name: 'Irene Chen', gender: 'Female', age: 55, phone: '(555) 901-2345', lastVisit: 'Sep 05, 2026', status: 'Inactive' },
  { id: 'PT-2050', name: 'Jack Thompson', gender: 'Male', age: 31, phone: '(555) 012-3456', lastVisit: 'Sep 11, 2026', status: 'Active' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-red-100 text-red-700',
};

export default function ManagerPatients() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patients Management" icon={Users} />

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
                  <th className="pb-3 font-medium">Patient ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Gender</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Age</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Last Visit</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{p.id}</td>
                    <td className="py-3 text-gray-900">{p.name}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{p.gender}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{p.age}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{p.phone}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{p.lastVisit}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                        {p.status}
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
