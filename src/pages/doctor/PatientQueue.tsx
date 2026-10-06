import { useCallback, useEffect, useState } from 'react';
import { Clock, Users, Stethoscope, AlertTriangle, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const typeColors: Record<string, string> = {
  Consultation: 'bg-blue-100 text-blue-800',
  'Follow-up': 'bg-purple-100 text-purple-800',
  Emergency: 'bg-red-100 text-red-800',
};

const statusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-800',
  Called: 'bg-indigo-100 text-indigo-800',
  'In Consultation': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

export default function PatientQueue() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ waiting: 0, inConsultation: 0, completed: 0, emergency: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/doctor/queue');
      setItems(data.items || []);
      setStats(data.stats || { waiting: 0, inConsultation: 0, completed: 0, emergency: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const advance = async (id: string, status: string) => {
    setBusy(id);
    try {
      await api.put(`/doctor/queue/${id}`, { status });
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not update queue entry');
    } finally {
      setBusy(null);
    }
  };

  const cards = [
    { label: 'Waiting', value: stats.waiting, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'In Consultation', value: stats.inConsultation, icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Emergency', value: stats.emergency, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const active = items.filter(
    (i) => i.status === 'Waiting' || i.status === 'Called' || i.status === 'In Consultation',
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Patient Queue" icon={Users} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
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
        {error && (
          <div className="m-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading queue...
          </div>
        ) : active.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            {items.length > 0
              ? 'All patients in today\u2019s queue have been attended.'
              : 'No patients in the queue today.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Position</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time Waiting</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {active.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{item.position}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.patientName}
                      <span className="block text-xs text-gray-400">{item.patientId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[item.type] || 'bg-gray-100 text-gray-700'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.waitMinutes} min</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {(item.status === 'Waiting' || item.status === 'Called') && (
                          <button
                            onClick={() => advance(item._id, item.status === 'Waiting' ? 'Called' : 'In Consultation')}
                            disabled={busy === item._id}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            {item.status === 'Waiting' ? 'Call' : 'Start'}
                          </button>
                        )}
                        <button
                          onClick={() => advance(item._id, 'Completed')}
                          disabled={busy === item._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                          title="Mark as attended and remove from the queue"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Attended
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
