import { useState } from 'react';
import { Search, Pill, PackageX, ClipboardCheck, DollarSign } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Medicines', value: '450', icon: Pill, color: 'blue' as const },
  { title: 'Low Stock', value: '12', icon: PackageX, color: 'red' as const },
  { title: 'Dispensed Today', value: '25', icon: ClipboardCheck, color: 'green' as const },
  { title: 'Revenue', value: '₦850,000', icon: DollarSign, color: 'purple' as const },
];

const medicines = [
  { name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 250, price: 1200, status: 'In Stock' },
  { name: 'Paracetamol 500mg', category: 'Analgesic', stock: 500, price: 200, status: 'In Stock' },
  { name: 'Metformin 850mg', category: 'Antidiabetic', stock: 30, price: 800, status: 'Low Stock' },
  { name: 'Amlodipine 5mg', category: 'Antihypertensive', stock: 180, price: 600, status: 'In Stock' },
  { name: 'Omeprazole 20mg', category: 'Antacid', stock: 15, price: 450, status: 'Low Stock' },
  { name: 'Ciprofloxacin 500mg', category: 'Antibiotic', stock: 120, price: 1500, status: 'In Stock' },
  { name: 'Artemether-Lumefantrine', category: 'Antimalarial', stock: 8, price: 2200, status: 'Low Stock' },
  { name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', stock: 350, price: 300, status: 'In Stock' },
];

function formatNaira(amount: number) {
  return '₦' + amount.toLocaleString('en-NG');
}

const statusColor: Record<string, string> = {
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-red-100 text-red-700',
};

export default function AdminPharmacy() {
  const [search, setSearch] = useState('');

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy" icon={Pill} description="Manage pharmacy inventory and dispensing" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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
              {filtered.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.category}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.stock}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{formatNaira(row.price)}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[row.status]}`}>
                      {row.status}
                    </span>
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
