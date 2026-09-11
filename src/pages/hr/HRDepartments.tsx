import { Building2, Users, DollarSign, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const departments = [
  { name: 'Cardiology', head: 'Dr. James Wilson', staffCount: 28, budget: '₦120,000', status: 'Active' },
  { name: 'Neurology', head: 'Dr. Emily Chen', staffCount: 22, budget: '₦95,000', status: 'Active' },
  { name: 'Pediatrics', head: 'Dr. Sarah Miller', staffCount: 18, budget: '₦78,000', status: 'Active' },
  { name: 'Orthopedics', head: 'Dr. Anna Lee', staffCount: 15, budget: '₦85,000', status: 'Active' },
  { name: 'Pharmacy', head: 'Tom Davis', staffCount: 31, budget: '₦65,000', status: 'Active' },
  { name: 'Laboratory', head: 'Mike Brown', staffCount: 20, budget: '₦72,000', status: 'Active' },
  { name: 'Administration', head: 'Lisa Johnson', staffCount: 42, budget: '₦45,000', status: 'Active' },
  { name: 'Radiology', head: 'Maria Santos', staffCount: 12, budget: '₦88,000', status: 'Active' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'green';
    case 'Inactive': return 'red';
    default: return 'gray';
  }
};

export default function HRDepartments() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Departments" icon={Building2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.map((d) => (
            <div key={d.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{d.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{d.head}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Staff</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{d.staffCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Budget</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{d.budget}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={d.status} color={getStatusColor(d.status) as any} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
