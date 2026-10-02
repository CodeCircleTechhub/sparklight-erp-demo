import { useState, useEffect } from 'react';
import { Package, Pill, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const naira = (n?: number) => `₦${Number(n || 0).toLocaleString('en-NG')}`;
const cardColors = ['bg-blue-50 text-blue-600', 'bg-red-50 text-red-600', 'bg-green-50 text-green-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600', 'bg-teal-50 text-teal-600'];

export default function PharmacistCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/pharmacy/categories');
        if (!cancelled) setCategories(data.categories || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" icon={Package} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading categories...
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">No categories yet.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-12 h-12 rounded-lg ${cardColors[i % cardColors.length]} flex items-center justify-center mb-4`}>
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{cat.count} medicine{cat.count === 1 ? '' : 's'}</p>
            <p className="text-sm text-gray-500">Total Value: {naira(cat.totalValue)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
