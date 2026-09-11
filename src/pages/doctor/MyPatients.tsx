import { Users, Activity, CalendarCheck, LogOut, Search } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '120', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Active', value: '85', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Follow-up', value: '25', icon: CalendarCheck, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Discharged', value: '10', icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const patients = [
  { id: 'PT-1001', name: 'Sarah Johnson', age: 34, gender: 'Female', condition: 'Hypertension', lastVisit: 'Sep 10, 2026', status: 'Active' },
  { id: 'PT-1002', name: 'Michael Brown', age: 56, gender: 'Male', condition: 'Type 2 Diabetes', lastVisit: 'Sep 09, 2026', status: 'Active' },
  { id: 'PT-1003', name: 'Emma Wilson', age: 28, gender: 'Female', condition: 'Migraine', lastVisit: 'Sep 08, 2026', status: 'Follow-up' },
  { id: 'PT-1004', name: 'James Davis', age: 45, gender: 'Male', condition: 'Lower Back Pain', lastVisit: 'Sep 07, 2026', status: 'Active' },
  { id: 'PT-1005', name: 'Olivia Martinez', age: 62, gender: 'Female', condition: 'Osteoarthritis', lastVisit: 'Sep 06, 2026', status: 'Follow-up' },
  { id: 'PT-1006', name: 'William Garcia', age: 39, gender: 'Male', condition: 'Asthma', lastVisit: 'Sep 05, 2026', status: 'Active' },
  { id: 'PT-1007', name: 'Sophia Rodriguez', age: 51, gender: 'Female', condition: 'Hypothyroidism', lastVisit: 'Sep 04, 2026', status: 'Active' },
  { id: 'PT-1008', name: 'Daniel Lee', age: 70, gender: 'Male', condition: 'COPD', lastVisit: 'Sep 03, 2026', status: 'Discharged' },
  { id: 'PT-1009', name: 'Isabella Thomas', age: 33, gender: 'Female', condition: 'Pregnancy', lastVisit: 'Sep 02, 2026', status: 'Active' },
  { id: 'PT-1010', name: 'Benjamin Harris', age: 48, gender: 'Male', condition: 'Chest Infection', lastVisit: 'Sep 01, 2026', status: 'Discharged' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  'Follow-up': 'bg-yellow-100 text-yellow-800',
  Discharged: 'bg-gray-100 text-gray-800',
};

export default function MyPatients() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Patients" icon={Users} />

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
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Age</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gender</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Visit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.age}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.condition}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.lastVisit}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span>
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
