import { Truck, Search } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const suppliers = [
  { id: 'SUP-001', name: 'MediPharm Distributors', contact: 'John Smith', phone: '+1-555-0101', products: 'Antibiotics, Painkillers', lastOrder: 'Sep 05, 2026', status: 'Active' },
  { id: 'SUP-002', name: 'HealthLine Supplies', contact: 'Emily Davis', phone: '+1-555-0102', products: 'Cardiovascular, Diabetes', lastOrder: 'Sep 08, 2026', status: 'Active' },
  { id: 'SUP-003', name: 'PharmaGlobal Inc', contact: 'Michael Brown', phone: '+1-555-0103', products: 'Respiratory, Steroids', lastOrder: 'Aug 30, 2026', status: 'Active' },
  { id: 'SUP-004', name: 'VitaHealth Labs', contact: 'Sarah Wilson', phone: '+1-555-0104', products: 'Vitamins, Supplements', lastOrder: 'Sep 10, 2026', status: 'Active' },
  { id: 'SUP-005', name: 'MedTech Solutions', contact: 'David Lee', phone: '+1-555-0105', products: 'Medical Devices', lastOrder: 'Aug 25, 2026', status: 'Inactive' },
  { id: 'SUP-006', name: 'BioPharm Corp', contact: 'Lisa Anderson', phone: '+1-555-0106', products: 'Thyroid, Neurology', lastOrder: 'Sep 02, 2026', status: 'Active' },
  { id: 'SUP-007', name: 'CareLine Distributors', contact: 'Robert Taylor', phone: '+1-555-0107', products: 'Allergy, Gastrointestinal', lastOrder: 'Sep 09, 2026', status: 'Active' },
  { id: 'SUP-008', name: 'PharmaPlus Global', contact: 'Jennifer Martinez', phone: '+1-555-0108', products: 'Oncology, Dermatology', lastOrder: 'Aug 20, 2026', status: 'Inactive' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
};

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <PageHeader title="Suppliers" icon={Truck} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Supplier ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Products</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{s.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.contact}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{s.products}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.lastOrder}</td>
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
