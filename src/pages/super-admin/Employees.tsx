import { useState, useEffect, useCallback } from 'react';
import { Users, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

interface Employee {
  staffId: string;
  fullName: string;
  department: string;
  position: string;
  phone: string;
  isActive: boolean;
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState([
    { title: 'Total', value: '0', icon: Users, color: 'blue' as const },
    { title: 'Active', value: '0', icon: Users, color: 'green' as const },
    { title: 'On Leave', value: '0', icon: Users, color: 'yellow' as const },
    { title: 'Inactive', value: '0', icon: Users, color: 'red' as const },
  ]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/hr/employees', { params: { search: searchTerm } });
      setEmployees(data.employees ?? []);
      setStats([
        { title: 'Total', value: String(data.total ?? 0), icon: Users, color: 'blue' as const },
        { title: 'Active', value: String(data.active ?? 0), icon: Users, color: 'green' as const },
        { title: 'On Leave', value: String(data.onLeave ?? 0), icon: Users, color: 'yellow' as const },
        { title: 'Inactive', value: String(data.inactive ?? 0), icon: Users, color: 'red' as const },
      ]);
    } catch {
      console.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchEmployees(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchEmployees]);

  const statusColor = (active: boolean) =>
    active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';

  return (
    <div className="space-y-6">
      <PageHeader title="Employees" icon={Users} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading employees...</span>
            </div>
          ) : (
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
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">No employees found</td>
                  </tr>
                ) : (
                  employees.map((row) => (
                    <tr key={row.staffId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.staffId}</td>
                      <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.fullName}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department}</td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.position}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.phone}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.isActive)}`}>
                          {row.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
