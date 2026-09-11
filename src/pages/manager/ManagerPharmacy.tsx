import { Pill, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Medicines', value: '450', icon: Pill, color: 'bg-blue-500' },
  { label: 'Low Stock', value: '12', icon: AlertTriangle, color: 'bg-red-500' },
  { label: 'Dispensed Today', value: '25', icon: Package, color: 'bg-green-500' },
  { label: 'Revenue', value: '₦8,500', icon: DollarSign, color: 'bg-violet-500' },
];

const medicines = [
  { name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 120, status: 'In Stock' },
  { name: 'Paracetamol 500mg', category: 'Analgesic', stock: 85, status: 'In Stock' },
  { name: 'Metformin 500mg', category: 'Antidiabetic', stock: 5, status: 'Low Stock' },
  { name: 'Lisinopril 10mg', category: 'ACE Inhibitor', stock: 0, status: 'Out of Stock' },
  { name: 'Omeprazole 20mg', category: 'Proton Pump Inhibitor', stock: 65, status: 'In Stock' },
  { name: 'Atorvastatin 20mg', category: 'Statin', stock: 3, status: 'Low Stock' },
  { name: 'Amlodipine 5mg', category: 'Calcium Channel Blocker', stock: 42, status: 'In Stock' },
  { name: 'Azithromycin 250mg', category: 'Antibiotic', stock: 2, status: 'Low Stock' },
];

export default function ManagerPharmacy() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Pharmacy Overview" icon={Pill} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ₦{s.color} rounded-lg flex items-center justify-center`}>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{statusColors[m.status]}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
