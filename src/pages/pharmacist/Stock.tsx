import { Package, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Items', value: '450', icon: Package, color: 'text-gray-600', bg: 'bg-gray-100' },
  { label: 'Low Stock', value: '12', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Out of Stock', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { label: 'Expiring Soon', value: '8', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const stock = [
  { medicine: 'Amoxicillin 500mg', currentStock: 5, reorderLevel: 20, lastRestocked: 'Sep 01, 2026', status: 'Low Stock' },
  { medicine: 'Metformin 1000mg', currentStock: 120, reorderLevel: 30, lastRestocked: 'Sep 05, 2026', status: 'Sufficient' },
  { medicine: 'Amlodipine 5mg', currentStock: 3, reorderLevel: 10, lastRestocked: 'Aug 28, 2026', status: 'Low Stock' },
  { medicine: 'Cetirizine 10mg', currentStock: 85, reorderLevel: 25, lastRestocked: 'Sep 08, 2026', status: 'Sufficient' },
  { medicine: 'Ibuprofen 400mg', currentStock: 200, reorderLevel: 50, lastRestocked: 'Sep 10, 2026', status: 'Sufficient' },
  { medicine: 'Omeprazole 20mg', currentStock: 75, reorderLevel: 20, lastRestocked: 'Sep 03, 2026', status: 'Sufficient' },
  { medicine: 'Salbutamol Inhaler', currentStock: 0, reorderLevel: 10, lastRestocked: 'Jul 15, 2026', status: 'Out of Stock' },
  { medicine: 'Prednisone 20mg', currentStock: 8, reorderLevel: 15, lastRestocked: 'Aug 20, 2026', status: 'Low Stock' },
  { medicine: 'Levothyroxine 50mcg', currentStock: 90, reorderLevel: 25, lastRestocked: 'Sep 07, 2026', status: 'Sufficient' },
  { medicine: 'Sumatriptan 50mg', currentStock: 45, reorderLevel: 15, lastRestocked: 'Sep 09, 2026', status: 'Sufficient' },
];

const statusColors: Record<string, string> = {
  Sufficient: 'bg-green-100 text-green-800',
  'Low Stock': 'bg-yellow-100 text-yellow-800',
  'Out of Stock': 'bg-red-100 text-red-800',
};

export default function Stock() {
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

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
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
              {stock.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.medicine}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.currentStock}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.reorderLevel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.lastRestocked}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[s.status]}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
