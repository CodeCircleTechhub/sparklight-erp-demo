import { useCallback, useEffect, useState } from 'react';
import { Pill, Clock, CheckCircle, AlertTriangle, Search, Loader2, Droplet } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const filters = ['All', 'Pending', 'Filled', 'Dispensed'] as const;
type Filter = (typeof filters)[number];

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Filled: 'bg-green-100 text-green-700',
  Dispensed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function MedicationTasks() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, dispensed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [busyId, setBusyId] = useState('');

  const fetchTasks = useCallback(async (q?: string, status?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (q) params.search = q;
      if (status && status !== 'All') params.status = status;
      const { data } = await api.get('/doctor/prescriptions', { params });
      setItems(data.items || []);
      setStats(
        data.stats || { today: 0, week: 0, dispensed: 0, pending: 0 }
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load medication tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const t = setTimeout(() => fetchTasks(search.trim() || undefined, filter), 350);
    return () => clearTimeout(t);
  }, [search, filter, fetchTasks]);

  const administer = async (id: string) => {
    setBusyId(id);
    setError('');
    setNotice('');
    try {
      await api.post(`/doctor/prescriptions/${id}/administer`);
      setNotice('Medication administered and recorded.');
      await fetchTasks(search.trim() || undefined, filter);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not record administration');
    } finally {
      setBusyId('');
    }
  };

  const medList = (r: any) =>
    (r.medications || [])
      .map((m: any) =>
        [m.name, m.dosage, m.frequency, m.duration].filter(Boolean).join(' · ')
      )
      .join(' | ');

  const cards = [
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Given (Filled)', value: stats.dispensed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Prescribed Today', value: stats.today, icon: Pill, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Last 7 Days', value: stats.week, icon: AlertTriangle, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medication Tasks"
        description="Prescribed drugs for your patients — administer and record"
        icon={Pill}
      />

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, drug or prescription ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading tasks...
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No prescriptions found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Prescription</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Medicine</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Prescriber</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Given By</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600 whitespace-nowrap">{r.prescriptionId}</td>
                    <td className="py-3 text-gray-900 whitespace-nowrap">
                      {r.patientName ||
                        [r.patient?.firstName, r.patient?.surname].filter(Boolean).join(' ')}
                    </td>
                    <td className="py-3 text-gray-700 max-w-md">
                      <p className="line-clamp-2">{medList(r) || '—'}</p>
                      {r.notes && <p className="text-xs text-gray-400 mt-0.5">Note: {r.notes}</p>}
                    </td>
                    <td className="py-3 text-gray-600 hidden md:table-cell whitespace-nowrap">
                      {r.doctorName || r.doctor?.fullName || '—'}
                    </td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell whitespace-nowrap">
                      {r.date ? new Date(r.date).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell whitespace-nowrap">
                      {r.administeredByName || '—'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[r.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {r.status === 'Pending' ? (
                        <button
                          onClick={() => administer(r._id)}
                          disabled={busyId === r._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                          title="Record that the medicine was given"
                        >
                          {busyId === r._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Droplet className="w-3.5 h-3.5" />
                          )}
                          Administer
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {r.administeredAt
                            ? `Given ${new Date(r.administeredAt).toLocaleTimeString()}`
                            : r.status === 'Cancelled'
                            ? 'Cancelled'
                            : 'Recorded'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && items.length > 0 && (
          <p className="text-xs text-gray-400 mt-4">
            Signed in as {user?.fullName || 'Nurse'} — administrations are recorded against your name.
          </p>
        )}
      </div>
    </div>
  );
}
