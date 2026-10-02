import { useState, useEffect } from 'react';
import { FlaskConical, Clock, Loader, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

interface LabTest {
  _id: string;
  testId?: string;
  patient?: { firstName?: string; surname?: string } | null;
  patientName?: string;
  testType?: string;
  orderedBy?: { fullName?: string } | null;
  orderedByName?: string;
  status?: string;
}

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-gray-100 text-gray-700',
};

export default function ManagerLaboratory() {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [stats, setStats] = useState([
    { label: 'Tests Today', value: '0', icon: FlaskConical, color: 'bg-blue-500' },
    { label: 'Pending', value: '0', icon: Clock, color: 'bg-amber-500' },
    { label: 'Processing', value: '0', icon: Loader, color: 'bg-violet-500' },
    { label: 'Completed', value: '0', icon: CheckCircle, color: 'bg-green-500' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/laboratory');
        const { tests, total, pending, inProgress, completed } = res.data || {};

        setTests(tests || []);
        setStats([
          { label: 'Tests Today', value: String(total || 0), icon: FlaskConical, color: 'bg-blue-500' },
          { label: 'Pending', value: String(pending || 0), icon: Clock, color: 'bg-amber-500' },
          { label: 'Processing', value: String(inProgress || 0), icon: Loader, color: 'bg-violet-500' },
          { label: 'Completed', value: String(completed || 0), icon: CheckCircle, color: 'bg-green-500' },
        ]);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load laboratory data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Laboratory Overview" icon={FlaskConical} />

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '—' : s.value}</p>
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
                  <th className="pb-3 font-medium">Test ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Test Type</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Doctor</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : tests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No lab tests found</td>
                  </tr>
                ) : (
                  tests.map((t) => (
                    <tr key={t._id || t.testId} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{t.testId || 'N/A'}</td>
                      <td className="py-3 text-gray-900">
                        {t.patient?.firstName || t.patient?.surname
                          ? `${t.patient.firstName || ''} ${t.patient.surname || ''}`.trim()
                          : t.patientName || 'N/A'}
                      </td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{t.testType || 'N/A'}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{t.orderedBy?.fullName || t.orderedByName || 'N/A'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[t.status || ''] || 'bg-gray-100 text-gray-700'}`}>
                          {t.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
