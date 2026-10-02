import { useState, useEffect, useCallback } from 'react';
import { Pill, Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

const statusColors: Record<string, string> = {
  Dispensed: 'bg-green-100 text-green-800',
  Filled: 'bg-blue-100 text-blue-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

const patName = (d: any) =>
  d.patientName || (d.patient ? `${d.patient.firstName || ''} ${d.patient.surname || ''}`.trim() : '') || '—';

export default function Dispensing() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, avgDaily: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/pharmacy/dispensing');
      setItems(data.items || []);
      setStats(data.stats || { today: 0, week: 0, avgDaily: 0, total: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dispensing log');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const cards = [
    { label: 'Today', value: String(stats.today), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'This Week', value: String(stats.week), icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Average Daily', value: String(stats.avgDaily), icon: Pill, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dispensing" icon={Pill} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading dispensing log...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prescription ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicine</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dispensed By</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((d) => {
                  const names = (d.medications || []).map((m: any) => m.name).filter(Boolean).join(', ');
                  const qty = (d.dispensedItems || []).reduce((s: number, it: any) => s + (it.quantity || 0), 0);
                  return (
                    <tr key={d._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{d.prescriptionId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{patName(d)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[280px] truncate">{names || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{qty || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.dispensedByName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(d.dispensedAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[d.status] || 'bg-gray-100 text-gray-700'}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">Nothing dispensed yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
