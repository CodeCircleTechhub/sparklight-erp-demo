import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, CalendarDays, TrendingUp, Loader2, Plus } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import VisitFormModal from '../../components/shared/VisitFormModal';

interface PatientRef {
  _id: string;
  firstName: string;
  surname: string;
  patientId: string;
}

interface Visit {
  _id: string;
  visitId: string;
  patient: PatientRef;
  department: string;
  doctorName: string;
  date: string;
  status: string;
  reason: string;
}

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Waiting: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default function ManagerVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [stats, setStats] = useState([
    { label: "Today's Visits", value: '0', icon: Calendar, color: 'bg-blue-500' },
    { label: 'This Week', value: '0', icon: CalendarDays, color: 'bg-green-500' },
    { label: 'This Month', value: '0', icon: TrendingUp, color: 'bg-violet-500' },
    { label: 'Total Visits', value: '0', icon: Clock, color: 'bg-amber-500' },
  ]);

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/visits');
      setVisits(data.visits ?? []);
      setStats([
        { label: "Today's Visits", value: (data.todayVisits ?? 0).toLocaleString(), icon: Calendar, color: 'bg-blue-500' },
        { label: 'This Week', value: (data.thisWeek ?? 0).toLocaleString(), icon: CalendarDays, color: 'bg-green-500' },
        { label: 'This Month', value: (data.thisMonth ?? 0).toLocaleString(), icon: TrendingUp, color: 'bg-violet-500' },
        { label: 'Total Visits', value: (data.total ?? 0).toLocaleString(), icon: Clock, color: 'bg-amber-500' },
      ]);
    } catch (err: any) {
      console.error('Failed to fetch visits', err);
      setError(err.response?.data?.message || 'Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Visits Management" icon={Calendar} />

        <div className="flex justify-end">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Visit
          </button>
        </div>

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

        {error && (
          <div className="rounded-lg px-4 py-3 text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading visits...</span>
            </div>
          ) : visits.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No visits found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Visit ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visits.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{v.visitId}</td>
                      <td className="py-3 text-gray-900">
                        {v.patient ? `${v.patient.firstName} ${v.patient.surname}` : 'N/A'}
                      </td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">
                        {v.date ? new Date(v.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{v.department || '-'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{v.doctorName || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[v.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {v.status}
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
      <VisitFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchVisits}
      />
    </div>
  );
}
