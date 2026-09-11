import { Package, AlertTriangle, XCircle, Search } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '450', icon: Package, color: 'text-gray-600', bg: 'bg-gray-100' },
  { label: 'Active', value: '420', icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Low Stock', value: '12', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Expired', value: '3', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
];

const medicines = [
  { id: 'MED-001', name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 5, price: '₦12.00', expiry: 'Mar 2027', status: 'Low Stock' },
  { id: 'MED-002', name: 'Metformin 1000mg', category: 'Diabetes', stock: 120, price: '₦8.50', expiry: 'Jun 2027', status: 'Active' },
  { id: 'MED-003', name: 'Amlodipine 5mg', category: 'Cardiovascular', stock: 3, price: '₦15.00', expiry: 'Jan 2027', status: 'Low Stock' },
  { id: 'MED-004', name: 'Cetirizine 10mg', category: 'Allergy', stock: 85, price: '₦6.00', expiry: 'Sep 2027', status: 'Active' },
  { id: 'MED-005', name: 'Ibuprofen 400mg', category: 'Painkillers', stock: 200, price: '₦5.00', expiry: 'Dec 2027', status: 'Active' },
  { id: 'MED-006', name: 'Omeprazole 20mg', category: 'Gastrointestinal', stock: 75, price: '₦10.00', expiry: 'Aug 2027', status: 'Active' },
  { id: 'MED-007', name: 'Levothyroxine 50mcg', category: 'Thyroid', stock: 90, price: '₦18.00', expiry: 'Apr 2027', status: 'Active' },
  { id: 'MED-008', name: 'Salbutamol Inhaler', category: 'Respiratory', stock: 0, price: '₦25.00', expiry: 'Feb 2026', status: 'Expired' },
  { id: 'MED-009', name: 'Sumatriptan 50mg', category: 'Painkillers', stock: 45, price: '₦30.00', expiry: 'Nov 2027', status: 'Active' },
  { id: 'MED-010', name: 'Prednisone 20mg', category: 'Steroids', stock: 8, price: '₦7.50', expiry: 'Oct 2026', status: 'Low Stock' },
];

export default function Medicines() {
  return (
    <div className="space-y-6">
      <PageHeader title="Medicines" icon={Package} />

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
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicine ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Expiry</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicines.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{m.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.stock}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.price}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{m.expiry}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ₦{statusColors[m.status]}`}>{m.status}</span>
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
