import { useEffect, useState, useCallback } from 'react';
import { Users, UserCheck, UserMinus, Search, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

interface Staff {
  staffId: string;
  fullName: string;
  role: string;
  department: string;
  position: string;
  phone: string;
  isActive: boolean;
}

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Suspended: 'bg-red-100 text-red-700',
};

export default function ManagerStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchStaff = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (query) params.search = query;
      const res = await api.get('/users', { params });
      const allUsers: Staff[] = res.data.users || [];
      const filtered = allUsers.filter(
        (u) => u.role !== 'patient' && u.role !== 'super-admin'
      );
      setStaff(filtered);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStaff(search.trim());
  };

  const totalCount = staff.length;
  const activeCount = staff.filter((s) => s.isActive).length;
  const inactiveCount = staff.filter((s) => !s.isActive).length;

  const stats = [
    { label: 'Total Staff', value: totalCount, icon: Users, color: 'bg-blue-500' },
    { label: 'Active', value: activeCount, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Suspended', value: inactiveCount, icon: UserMinus, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Staff Management" icon={Users} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff by name, department, or position..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading staff...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && staff.length === 0 && (
            <p className="text-center text-gray-500 py-12">No staff members found.</p>
          )}

          {!loading && !error && staff.length > 0 && (
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
                  {staff.map((s) => {
                    const status = s.isActive ? 'Active' : 'Suspended';
                    return (
                      <tr key={s.staffId} className="hover:bg-gray-50">
                        <td className="py-3 font-medium text-blue-600">{s.staffId}</td>
                        <td className="py-3 text-gray-900">{s.fullName}</td>
                        <td className="py-3 text-gray-600 hidden md:table-cell">{s.department}</td>
                        <td className="py-3 text-gray-600 hidden lg:table-cell">{s.position}</td>
                        <td className="py-3 text-gray-600 hidden md:table-cell">{s.phone}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
