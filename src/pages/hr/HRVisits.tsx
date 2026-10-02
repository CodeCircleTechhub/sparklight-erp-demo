import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, UserPlus, RefreshCw, Clock, Loader2, AlertCircle, Plus } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import VisitFormModal from '../../components/shared/VisitFormModal';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Waiting: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function HRVisits() {
  const [visits, setVisits] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayVisits: 0, total: 0, thisWeek: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/visits');
      const list = data.visits || [];
      setVisits(list);
      const today = new Date().toISOString().slice(0, 10);
      const pending = list.filter((v: any) => v.status === 'Pending').length;
      setStats({
        todayVisits: data.todayVisits ?? list.filter((v: any) => v.date?.startsWith(today)).length,
        total: data.total ?? list.length,
        thisWeek: data.thisWeek ?? 0,
        pending,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load visits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const patientName = (v: any) =>
    v.patient
      ? [v.patient.firstName, v.patient.surname].filter(Boolean).join(' ')
      : v.patientName || 'Unknown';

  const statCards = [
    { label: "Today's Visits", value: stats.todayVisits, icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Total Visits', value: stats.total, icon: UserPlus, color: 'bg-green-500' },
    { label: 'This Week', value: stats.thisWeek, icon: RefreshCw, color: 'bg-violet-500' },
    { label: 'Waiting', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Visits" icon={ClipboardList} />

        <div className="flex justify-end">
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Visit
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
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
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Loading visits...</span>
              </div>
            ) : visits.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No visits found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Visit ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Reason</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visits.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{v.visitId}</td>
                      <td className="py-3 text-gray-900">{patientName(v)}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">
                        {v.date ? new Date(v.date).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : ''}
                      </td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{v.department || 'General'}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell max-w-[160px] truncate">{v.reason || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[v.status] || 'bg-gray-100 text-gray-700'}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
