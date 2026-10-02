import { useState, useEffect, useRef } from 'react';
import { Search, Pill, PackageX, ClipboardCheck, DollarSign, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';
import api from '../../services/api';

function formatNaira(amount: number) {
  return '₦' + amount.toLocaleString('en-NG');
}

const statusColor: Record<string, string> = {
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-red-100 text-red-700',
  'Out of Stock': 'bg-red-100 text-red-700',
};

export default function AdminPharmacy() {
  const [search, setSearch] = useState('');
  const [medicines, setMedicines] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchData = async (q: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/pharmacy', { params: { search: q } });
      setMedicines(data.medicines);
      setStats({ total: data.total, inStock: data.inStock, lowStock: data.lowStock, outOfStock: data.outOfStock });
    } catch {
      setMedicines([]);
      setStats({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(search), 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const statCards = [
    { title: 'Medicines', value: String(stats.total), icon: Pill, color: 'blue' as const },
    { title: 'Low Stock', value: String(stats.lowStock), icon: PackageX, color: 'red' as const },
    { title: 'In Stock', value: String(stats.inStock), icon: ClipboardCheck, color: 'green' as const },
    { title: 'Out of Stock', value: String(stats.outOfStock), icon: DollarSign, color: 'purple' as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy" icon={Pill} description="Manage pharmacy inventory and dispensing" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-gray-500">Loading medicines...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Medicine</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((row) => (
                  <tr key={row.medicineId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.category}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.stock}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{formatNaira(row.price)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status] || 'bg-gray-100 text-gray-700'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {medicines.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">No medicines found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
