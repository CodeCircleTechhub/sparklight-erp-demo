import { useState } from 'react';
import { Search, FlaskConical, Clock, Loader2, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Tests Today', value: '32', icon: FlaskConical, color: 'blue' as const },
  { title: 'Pending', value: '8', icon: Clock, color: 'yellow' as const },
  { title: 'Processing', value: '5', icon: Loader2, color: 'purple' as const },
  { title: 'Completed', value: '19', icon: CheckCircle, color: 'green' as const },
];

const tests = [
  { id: 'LB-001', patient: 'Abubakar Ibrahim', testType: 'Full Blood Count', doctor: 'Dr. Fatima Usman', status: 'Completed' },
  { id: 'LB-002', patient: 'Fatima Bello', testType: 'Lipid Profile', doctor: 'Dr. Oluwaseun Adeleye', status: 'Processing' },
  { id: 'LB-003', patient: 'Mohammed Usman', testType: 'Blood Glucose', doctor: 'Dr. Abubakar Suleiman', status: 'Pending' },
  { id: 'LB-004', patient: 'Aisha Abdullahi', testType: 'Urinalysis', doctor: 'Dr. Aisha Bello', status: 'Completed' },
  { id: 'LB-005', patient: 'Oluwaseun Adeyemi', testType: 'Liver Function', doctor: 'Dr. Chukwuemeka Obi', status: 'Processing' },
  { id: 'LB-006', patient: 'Ngozi Okafor', testType: 'Malaria Test', doctor: 'Dr. Hauwa Danjuma', status: 'Completed' },
  { id: 'LB-007', patient: 'Yusuf Danjuma', testType: 'X-Ray Chest', doctor: 'Dr. Ibrahim Musa', status: 'Pending' },
  { id: 'LB-008', patient: 'Hauwa Mohammed', testType: 'Pregnancy Test', doctor: 'Dr. Fatima Usman', status: 'Completed' },
];

const statusColor: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  Processing: 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default function AdminLaboratory() {
  const [search, setSearch] = useState('');

  const filtered = tests.filter(
    (t) =>
      t.patient.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.testType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Laboratory" icon={FlaskConical} description="Manage laboratory tests and results" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Test Records</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
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
                <th className="text-left py-3 px-4 font-medium text-gray-500">Test ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Test Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.testType}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
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
