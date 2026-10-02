import { Users, Stethoscope, Heart, Shield } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Employee {
  staffId: string;
  fullName: string;
  department: string;
  position: string;
  isActive: boolean;
}

interface HRData {
  employees: Employee[];
  total: number;
  active: number;
  onLeave: number;
  inactive: number;
}

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'On Leave': 'bg-amber-100 text-amber-700',
  Inactive: 'bg-red-100 text-red-700',
};

export default function ManagerHR() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [hrData, setHrData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const { data } = await api.get('/hr/employees');
        setEmployees(data.employees);
        setHrData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch HR data');
      } finally {
        setLoading(false);
      }
    };
    fetchHRData();
  }, []);

  const stats = hrData
    ? [
        { label: 'Total Employees', value: hrData.total, icon: Users, color: 'bg-blue-500' },
        { label: 'Active', value: hrData.active, icon: Stethoscope, color: 'bg-green-500' },
        { label: 'On Leave', value: hrData.onLeave, icon: Heart, color: 'bg-violet-500' },
        { label: 'Inactive', value: hrData.inactive, icon: Shield, color: 'bg-amber-500' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="HR Overview" icon={Users} />

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading HR data...</div>
        ) : (
          <>
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
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {employees.map((emp) => {
                      const status = emp.isActive ? 'Active' : 'Inactive';
                      return (
                        <tr key={emp.staffId} className="hover:bg-gray-50">
                          <td className="py-3 font-medium text-blue-600">{emp.staffId}</td>
                          <td className="py-3 text-gray-900">{emp.fullName}</td>
                          <td className="py-3 text-gray-600 hidden md:table-cell">{emp.department}</td>
                          <td className="py-3 text-gray-600 hidden lg:table-cell">{emp.position}</td>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
