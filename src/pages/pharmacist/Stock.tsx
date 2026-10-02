import { useState, useEffect, useCallback } from 'react';
import { Package, AlertTriangle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Sufficient: 'bg-green-100 text-green-800',
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-yellow-100 text-yellow-800',
  'Out of Stock': 'bg-red-100 text-red-800',
};

const stockLevel = (m: any) => {
  if ((m.stock || 0) <= 0) return 'Out of Stock';
  if ((m.stock || 0) <= (m.minimumStock || 0)) return 'Low Stock';
  return 'Sufficient';
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function Stock() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, lowStock: 0, outOfStock: 0, expiringSoon: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/pharmacy');
      setMedicines(data.medicines || []);
      setCounts({
        total: data.total || 0,
        lowStock: data.lowStock || 0,
        outOfStock: data.outOfStock || 0,
        expiringSoon: data.expiringSoon || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load stock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = [
    { label: 'Total Items', value: String(counts.total), icon: Package, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Low Stock', value: String(counts.lowStock), icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Out of Stock', value: String(counts.outOfStock), icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Expiring Soon', value: String(counts.expiringSoon), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Management" icon={Package} />

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
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading stock...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicine</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Current Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reorder Level</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Restocked</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {medicines.map((m) => {
                  const level = stockLevel(m);
                  return (
                    <tr key={m._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.stock}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.minimumStock}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(m.lastRestocked || m.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[level]}`}>{level}</span>
                      </td>
                    </tr>
                  );
                })}
                {medicines.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-gray-400">No stock items yet</td>
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
