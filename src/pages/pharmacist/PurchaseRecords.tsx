import { DollarSign, ShoppingCart, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'This Month', value: '₦12,500', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Pending Orders', value: '3', icon: ShoppingCart, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Completed', value: '12', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
];

const purchases = [
  { id: 'PO-3001', supplier: 'MediPharm Distributors', date: 'Sep 10, 2026', items: 15, total: '₦2,800', status: 'Completed' },
  { id: 'PO-3002', supplier: 'HealthLine Supplies', date: 'Sep 09, 2026', items: 8, total: '₦1,500', status: 'Pending' },
  { id: 'PO-3003', supplier: 'VitaHealth Labs', date: 'Sep 08, 2026', items: 12, total: '₦960', status: 'Completed' },
  { id: 'PO-3004', supplier: 'PharmaGlobal Inc', date: 'Sep 05, 2026', items: 20, total: '₦3,200', status: 'Completed' },
  { id: 'PO-3005', supplier: 'BioPharm Corp', date: 'Sep 03, 2026', items: 10, total: '₦1,800', status: 'Pending' },
  { id: 'PO-3006', supplier: 'CareLine Distributors', date: 'Sep 01, 2026', items: 18, total: '₦2,400', status: 'Completed' },
  { id: 'PO-3007', supplier: 'MediPharm Distributors', date: 'Aug 28, 2026', items: 25, total: '₦4,100', status: 'Completed' },
  { id: 'PO-3008', supplier: 'HealthLine Supplies', date: 'Aug 25, 2026', items: 6, total: '₦740', status: 'Pending' },
];

export default function PurchaseRecords() {
  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Records" icon={ShoppingCart} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Purchase ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{p.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.supplier}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.items} items</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.total}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ₦{statusColors[p.status]}`}>{p.status}</span>
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
