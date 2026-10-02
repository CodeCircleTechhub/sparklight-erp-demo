import { Pill, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Medicine {
  name: string;
  category: string;
  stock: number;
  price: number;
  status: string;
}

interface PharmacyData {
  medicines: Medicine[];
  total: number;
  lowStock: number;
  outOfStock: number;
}

const statusColors: Record<string, string> = {
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-amber-100 text-amber-700',
  'Out of Stock': 'bg-red-100 text-red-700',
};

export default function ManagerPharmacy() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacyData, setPharmacyData] = useState<PharmacyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        const { data } = await api.get('/pharmacy');
        setMedicines(data.medicines);
        setPharmacyData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch pharmacy data');
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacyData();
  }, []);

  const stats = pharmacyData
    ? [
        { label: 'Total Medicines', value: pharmacyData.total, icon: Pill, color: 'bg-blue-500' },
        { label: 'Low Stock', value: pharmacyData.lowStock, icon: AlertTriangle, color: 'bg-red-500' },
        { label: 'Out of Stock', value: pharmacyData.outOfStock, icon: Package, color: 'bg-amber-500' },
        { label: 'In Stock', value: pharmacyData.total - pharmacyData.lowStock - pharmacyData.outOfStock, icon: DollarSign, color: 'bg-green-500' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Pharmacy Overview" icon={Pill} />

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading pharmacy data...</div>
        ) : (
          <>
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-3 font-medium">Medicine</th>
                      <th className="pb-3 font-medium hidden md:table-cell">Category</th>
                      <th className="pb-3 font-medium">Stock</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {medicines.map((m, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-3 text-gray-900">{m.name}</td>
                        <td className="py-3 text-gray-600 hidden md:table-cell">{m.category}</td>
                        <td className="py-3 text-gray-900">{m.stock}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[m.status] || 'bg-gray-100 text-gray-700'}`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
