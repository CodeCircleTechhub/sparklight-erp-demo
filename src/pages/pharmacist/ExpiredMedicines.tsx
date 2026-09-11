import { XCircle, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
  { label: 'Value', value: '₦450', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Disposed', value: '1', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Pending', value: '2', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const expired = [
  { medicine: 'Salbutamol Inhaler', category: 'Respiratory', stock: 15, expiryDate: 'Feb 2026', status: 'Pending' },
  { medicine: 'Paracetamol 500mg', category: 'Painkillers', stock: 30, expiryDate: 'Mar 2026', status: 'Pending' },
  { medicine: 'Amoxicillin 250mg', category: 'Antibiotics', stock: 20, expiryDate: 'Jan 2026', status: 'Disposed' },
];

export default function ExpiredMedicines() {
  return (
    <div className="space-y-6">
      <PageHeader title="Expired Medicines" icon={XCircle} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ₦{stat.bg}`}>
                <stat.icon className={`w-5 h-5 ₦{stat.color}`} />
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expired.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{e.medicine}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.stock}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{e.expiryDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ₦{statusColors[e.status]}`}>{e.status}</span>
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
