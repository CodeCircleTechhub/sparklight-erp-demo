import { useState, useEffect, useCallback, useRef } from 'react';
import { Users, UserCheck, UserPlus, Archive, Search, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-yellow-100 text-yellow-700',
  Archived: 'bg-gray-100 text-gray-600',
};

function computeAge(dob: string): number {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

interface Patient {
  _id: string;
  patientId: string;
  firstName: string;
  middleName?: string;
  surname: string;
  gender: string;
  dob: string;
  phone: string;
  status: string;
}

export default function ManagerPatients() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<{ label: string; value: string; icon: typeof Users; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPatients = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const params = query ? { search: query } : {};
      const res = await api.get('/patients', { params });
      const data = res.data;

      setStats([
        { label: 'Total Patients', value: (data.total ?? 0).toLocaleString(), icon: Users, color: 'bg-blue-500' },
        { label: 'Active', value: (data.active ?? 0).toLocaleString(), icon: UserCheck, color: 'bg-green-500' },
        { label: 'New This Month', value: (data.newThisMonth ?? 0).toLocaleString(), icon: UserPlus, color: 'bg-violet-500' },
        { label: 'Archived', value: (data.archived ?? 0).toLocaleString(), icon: Archive, color: 'bg-amber-500' },
      ]);

      setPatients(data.patients ?? []);
    } catch (err) {
      console.error('Failed to fetch patients', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPatients(''); }, [fetchPatients]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPatients(search), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, fetchPatients]);

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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading patients...</span>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No patients found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Patient ID</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Gender</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Age</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{p.patientId}</td>
                      <td className="py-3 text-gray-900">{p.firstName} {p.surname}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{p.gender}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{p.dob ? computeAge(p.dob) : '-'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{p.phone || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
