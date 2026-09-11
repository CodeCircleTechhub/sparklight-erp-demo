import { Droplets, Activity, Radiation, Scan, Eye, Waves, Heart, Microscope } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const categories = [
  { name: 'Blood Test', count: 85, priceRange: '₦20 - ₦150', status: 'Active', icon: Droplets, color: 'bg-red-50 text-red-600' },
  { name: 'Urine Analysis', count: 42, priceRange: '₦15 - ₦80', status: 'Active', icon: Activity, color: 'bg-yellow-50 text-yellow-600' },
  { name: 'X-Ray', count: 38, priceRange: '₦50 - ₦200', status: 'Active', icon: Radiation, color: 'bg-blue-50 text-blue-600' },
  { name: 'MRI', count: 25, priceRange: '₦300 - ₦800', status: 'Active', icon: Scan, color: 'bg-purple-50 text-purple-600' },
  { name: 'CT Scan', count: 18, priceRange: '₦250 - ₦600', status: 'Active', icon: Eye, color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Ultrasound', count: 55, priceRange: '₦40 - ₦200', status: 'Active', icon: Waves, color: 'bg-teal-50 text-teal-600' },
  { name: 'ECG', count: 30, priceRange: '₦25 - ₦100', status: 'Active', icon: Heart, color: 'bg-pink-50 text-pink-600' },
  { name: 'Biopsy', count: 12, priceRange: '₦200 - ₦500', status: 'Active', icon: Microscope, color: 'bg-orange-50 text-orange-600' },
];

export default function TestCategories() {
  return (
    <div className="space-y-6">
      <PageHeader title="Test Categories" icon={Activity} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-12 h-12 rounded-lg ₦{cat.color} flex items-center justify-center mb-4`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{cat.count} tests</p>
            <p className="text-sm text-gray-500">Price: {cat.priceRange}</p>
            <div className="mt-3">
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{cat.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
