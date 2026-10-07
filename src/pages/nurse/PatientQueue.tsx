import { useState, useEffect, useCallback } from 'react';
import {
  ListOrdered,
  Clock,
  UserCheck,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
  Megaphone,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const statusColors: Record<string, string> = {
  'In Consultation': 'bg-blue-100 text-blue-800',
  Called: 'bg-purple-100 text-purple-800',
  Waiting: 'bg-amber-100 text-amber-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-gray-100 text-gray-800',
};

const nextAction: Record<string, { label: string; to: string }> = {
  Waiting: { label: 'Call', to: 'Called' },
  Called: { label: 'Start', to: 'In Consultation' },
};

const waitLabel = (mins: number) => {
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)} hr ${mins % 60} min`;
};

export default function PatientQueue() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<any[]>([]);
  const [counts, setCounts] = useState({ inQueue: 0, waiting: 0, withNurse: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/nurse/queue');
      setQueue(data.queue || []);
      setCounts({
        inQueue: data.inQueue ?? 0,
        waiting: data.waiting ?? 0,
        withNurse: data.withNurse ?? 0,
        completed: data.completed ?? 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load the queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const advance = async (entry: any) => {
    const action = nextAction[entry.status];
    if (!action) return;
    setBusy(String(entry._id));
    setError('');
    try {
      await api.put(`/nurse/queue/${entry._id}`, { status: action.to });
      await fetchQueue();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not update the queue');
    } finally {
      setBusy('');
    }
  };

  const callNext = async () => {
    setBusy('call-next');
    setError('');
    try {
      await api.put('/nurse/queue/call-next');
      await fetchQueue();
    } catch (err: any) {
      setError(err.response?.data?.message || 'No patients waiting');
    } finally {
      setBusy('');
    }
  };

  const removeEntry = async (entry: any) => {
    const label = entry.patientName || 'this patient';
    if (!window.confirm(`Remove ${label} from the queue?`)) return;
    setDeletingId(String(entry._id));
    setError('');
    try {
      await api.delete(`/nurse/queue/${entry._id}`);
      await fetchQueue();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not remove the queue entry');
    } finally {
      setDeletingId('');
    }
  };

  const attend = async (entry: any) => {
    setBusy(String(entry._id));
    setError('');
    try {
      await api.put(`/nurse/queue/${entry._id}`, { status: 'Completed' });
      await fetchQueue();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not update the queue');
    } finally {
      setBusy('');
    }
  };

  const stats = [
    { label: 'In Queue', value: counts.inQueue, icon: ListOrdered, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Waiting', value: counts.waiting, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'With Nurse', value: counts.withNurse, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Completed Today', value: counts.completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const active = queue.filter(
    (q) => q.status === 'Waiting' || q.status === 'Called' || q.status === 'In Consultation',
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Queue"
        description="Manage patient queue and waiting times"
        action={
          <button
            onClick={callNext}
            disabled={busy === 'call-next' || counts.waiting === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {busy === 'call-next' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Megaphone className="w-4 h-4" />
            )}
            Call next patient
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ListOrdered className="w-5 h-5" />
            Current Queue
          </h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading queue...
          </div>
        ) : active.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            {queue.length > 0
              ? 'All patients in today\u2019s queue have been attended.'
              : 'No patients in the queue today.'}
          </p>
        ) : (
          <div className="divide-y divide-gray-200">
            {active.map((item, idx) => (
              <div
                key={item._id}
                className={`p-4 hover:bg-gray-50 ${item.status === 'In Consultation' ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                      {item.position || idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.patientName || 'Unknown patient'}</p>
                      <p className="text-sm text-gray-500">
                        ID: {item.patientId || '—'}
                        {item.department ? ` · ${item.department}` : ''}
                        {item.reason ? ` · ${item.reason}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {item.status === 'Completed' ? 'Completed' : waitLabel(item.waitMinutes || 0)}
                      </p>
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusColors[item.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    {nextAction[item.status] && (
                      <button
                        onClick={() => advance(item)}
                        disabled={busy === String(item._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                        title={nextAction[item.status].label}
                      >
                        {busy === String(item._id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                        {nextAction[item.status].label}
                      </button>
                    )}
                    <button
                      onClick={() => attend(item)}
                      disabled={busy === String(item._id) || deletingId === String(item._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50"
                      title="Mark as attended and remove from the queue"
                    >
                      {busy === String(item._id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Attended
                    </button>
                    {user?.role === 'super-admin' && (
                      <button
                        onClick={() => removeEntry(item)}
                        disabled={deletingId === String(item._id) || busy === String(item._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
                        title="Remove from queue"
                      >
                        {deletingId === String(item._id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
