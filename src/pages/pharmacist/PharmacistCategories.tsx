import { Package, Pill } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const categories = [
  { name: 'Antibiotics', count: 45, totalValue: '₦5,400', icon: Pill, color: 'bg-blue-50 text-blue-600' },
  { name: 'Painkillers', count: 62, totalValue: '₦3,100', icon: Pill, color: 'bg-red-50 text-red-600' },
  { name: 'Vitamins', count: 38, totalValue: '₦1,900', icon: Pill, color: 'bg-green-50 text-green-600' },
  { name: 'Cardiovascular', count: 55, totalValue: '₦8,250', icon: Pill, color: 'bg-purple-50 text-purple-600' },
  { name: 'Diabetes', count: 30, totalValue: '₦2,400', icon: Pill, color: 'bg-orange-50 text-orange-600' },
  { name: 'Respiratory', count: 42, totalValue: '₦4,200', icon: Pill, color: 'bg-teal-50 text-teal-600' },
];

export default function PharmacistCategories() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" icon={Package} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-12 h-12 rounded-lg ₦{cat.color} flex items-center justify-center mb-4`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{cat.count} medicines</p>
            <p className="text-sm text-gray-500">Total Value: {cat.totalValue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
