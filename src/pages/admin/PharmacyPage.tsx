import { useState } from 'react';
import { AlertTriangle, Search, Plus } from 'lucide-react';
import DataTable, { type Column } from '../../components/ui/DataTable';

interface Medicine {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface LowStockAlert {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
}

const medicinesData: Medicine[] = [
  { id: 'MED001', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 234, price: '₦12.50', expiryDate: '2027-06-15', status: 'In Stock' },
  { id: 'MED002', name: 'Paracetamol 500mg', category: 'Analgesic', stock: 45, price: '₦5.20', expiryDate: '2027-03-20', status: 'Low Stock' },
  { id: 'MED003', name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', stock: 189, price: '₦8.75', expiryDate: '2027-09-10', status: 'In Stock' },
  { id: 'MED004', name: 'Metformin 500mg', category: 'Antidiabetic', stock: 12, price: '₦15.30', expiryDate: '2026-12-01', status: 'Low Stock' },
  { id: 'MED005', name: 'Lisinopril 10mg', category: 'Antihypertensive', stock: 156, price: '₦22.40', expiryDate: '2027-08-25', status: 'In Stock' },
  { id: 'MED006', name: 'Omeprazole 20mg', category: 'Proton Pump Inhibitor', stock: 0, price: '₦18.90', expiryDate: '2027-01-30', status: 'Out of Stock' },
  { id: 'MED007', name: 'Atorvastatin 20mg', category: 'Statin', stock: 89, price: '₦28.50', expiryDate: '2027-05-18', status: 'In Stock' },
  { id: 'MED008', name: 'Azithromycin 250mg', category: 'Antibiotic', stock: 8, price: '₦16.75', expiryDate: '2026-11-15', status: 'Low Stock' },
  { id: 'MED009', name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 267, price: '₦6.30', expiryDate: '2027-07-22', status: 'In Stock' },
  { id: 'MED010', name: 'Pantoprazole 40mg', category: 'Proton Pump Inhibitor', stock: 134, price: '₦21.60', expiryDate: '2027-04-12', status: 'In Stock' },
];

const lowStockAlerts: LowStockAlert[] = [
  { id: 'MED002', name: 'Paracetamol 500mg', currentStock: 45, minimumStock: 100 },
  { id: 'MED004', name: 'Metformin 500mg', currentStock: 12, minimumStock: 50 },
  { id: 'MED008', name: 'Azithromycin 250mg', currentStock: 8, minimumStock: 30 },
];

const columns: Column[] = [
  { key: 'name', label: 'Medicine Name', render: (row) => <span className="font-medium">{String(row.name ?? '')}</span> },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock', render: (row) => <span className="font-mono">{String(row.stock ?? '')}</span> },
  { key: 'price', label: 'Price' },
  { key: 'expiryDate', label: 'Expiry Date' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = String(row.status ?? '');
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{getStatusBadge(status)}`}>
          {status}
        </span>
      );
    },
  },
];

const PharmacyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = medicinesData.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Add Medicine
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="font-semibold text-red-800">Low Stock Alerts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {lowStockAlerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg p-3 border border-red-200">
              <p className="font-medium text-gray-900">{alert.name}</p>
              <p className="text-sm text-red-600">
                Stock: {alert.currentStock} (Min: {alert.minimumStock})
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search medicines by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <DataTable columns={columns} data={filteredMedicines as unknown as Record<string, unknown>[]} />
      </div>
    </div>
  );
};

export default PharmacyPage;
