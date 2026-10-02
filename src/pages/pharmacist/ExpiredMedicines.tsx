import { useState, useEffect, useCallback } from 'react';
import { XCircle, DollarSign, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const naira = (n?: number) => `₦${Number(n || 0).toLocaleString('en-NG')}`;
const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const statusColors: Record<string, string> = {
  Pending: 'bg-orange-100 text-orange-800',
  Disposed: 'bg-green-100 text-green-800',
};

export default function ExpiredMedicines() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, value: 0, disposed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/pharmacy/expired');
      setMedicines(data.medicines || []);
      setCounts({ total: data.total || 0, value: data.value || 0, disposed: data.disposed || 0, pending: data.pending || 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load expired medicines');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dispose = async (m: any) => {
    setBusyId(m._id);
    try {
      await api.put(`/pharmacy/${m._id}/dispose`);
      setNotice({ type: 'ok', text: `${m.name} marked as disposed.` });
      await load();
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to dispose' });
    } finally {
      setBusyId(null);
    }
  };

  const stats = [
    { label: 'Total', value: String(counts.total), icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Value', value: naira(counts.value), icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Disposed', value: String(counts.disposed), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending', value: String(counts.pending), icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Expired Medicines" icon={XCircle} />

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
      {notice && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            notice.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {notice.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {notice.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading expired medicines...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicine</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicines.map((m) => {
                  const status = m.disposedAt ? 'Disposed' : 'Pending';
                  return (
                    <tr key={m._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.category || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.stock}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(m.expiryDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>{status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {status === 'Pending' ? (
                          <button
                            onClick={() => dispose(m)}
                            disabled={busyId === m._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 disabled:opacity-50"
                          >
                            {busyId === m._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            Dispose
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">{m.disposedByName || 'Disposed'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {medicines.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-gray-400">No expired medicines</td>
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
