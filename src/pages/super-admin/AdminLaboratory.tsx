import { useState, useEffect, useRef } from 'react';
import { Search, FlaskConical, Clock, Loader2, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';
import api from '../../services/api';

const statusColor: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default function AdminLaboratory() {
  const [search, setSearch] = useState('');
  const [tests, setTests] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchData = async (q: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/laboratory', { params: { search: q } });
      setTests(data.tests);
      setStats({ total: data.total, pending: data.pending, inProgress: data.inProgress, completed: data.completed });
    } catch {
      setTests([]);
      setStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(search), 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const statCards = [
    { title: 'Tests Today', value: String(stats.total), icon: FlaskConical, color: 'blue' as const },
    { title: 'Pending', value: String(stats.pending), icon: Clock, color: 'yellow' as const },
    { title: 'Processing', value: String(stats.inProgress), icon: Loader2, color: 'purple' as const },
    { title: 'Completed', value: String(stats.completed), icon: CheckCircle, color: 'green' as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Laboratory" icon={FlaskConical} description="Manage laboratory tests and results" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-gray-500">Loading tests...</span>
          </div>
        ) : (
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
                {tests.map((row) => (
                  <tr key={row.testId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.testId}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.patientName}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.testType}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.orderedByName}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status] || 'bg-gray-100 text-gray-700'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No tests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
