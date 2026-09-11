import { useState } from 'react';
import {
  Search,
  Package,
  AlertTriangle,
  Pill,
  Save,
  Filter,
} from 'lucide-react';

const prescriptionQueue = [
  { id: 1, patient: 'John Smith', medicines: ['Amoxicillin 500mg x21', 'Paracetamol 650mg x10'], status: 'pending', time: '09:15 AM' },
  { id: 2, patient: 'Emily Davis', medicines: ['Metformin 500mg x30'], status: 'dispensed', time: '09:45 AM' },
  { id: 3, patient: 'Michael Brown', medicines: ['Lisinopril 10mg x30', 'Aspirin 81mg x30'], status: 'pending', time: '10:20 AM' },
  { id: 4, patient: 'Sarah Wilson', medicines: ['Ibuprofen 400mg x15'], status: 'verified', time: '11:00 AM' },
  { id: 5, patient: 'David Lee', medicines: ['Omeprazole 20mg x30', 'Vitamin D3 1000IU x60'], status: 'pending', time: '11:30 AM' },
];

const lowStockAlerts = [
  { name: 'Amoxicillin 500mg', currentStock: 12, minStock: 50, category: 'Antibiotic' },
  { name: 'Insulin (Regular)', currentStock: 5, minStock: 20, category: 'Diabetes' },
  { name: 'Epinephrine Auto-injector', currentStock: 3, minStock: 10, category: 'Emergency' },
];

export default function PharmacyStaffPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dispenseForm, setDispenseForm] = useState({
    medicine: '',
    quantity: '',
    patient: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDispenseForm({ ...dispenseForm, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage prescriptions and medicine inventory</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium">
            <Package className="w-4 h-4" />
            New Order
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
              placeholder="Search medicines by name, category, or batch number..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prescription Queue */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Prescription Queue</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Filter className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-500">{prescriptionQueue.length} items</span>
              </div>
            </div>
            <div className="space-y-3">
              {prescriptionQueue.map((rx) => (
                <div key={rx.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{rx.patient}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{rx.time}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      rx.status === 'dispensed' ? 'bg-emerald-100 text-emerald-700' :
                      rx.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {rx.status === 'dispensed' ? 'Dispensed' :
                       rx.status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {rx.medicines.map((med, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {med}
                      </span>
                    ))}
                  </div>
                  {rx.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 font-medium">
                        Dispense
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50">
                        Verify
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
              </div>
              <div className="space-y-3">
                {lowStockAlerts.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg border border-amber-200 bg-amber-50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <span className="text-xs text-amber-600 font-medium">{item.currentStock} left</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.category}</p>
                    <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${(item.currentStock / item.minStock) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispense Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Dispense</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                  <div className="relative">
                    <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="medicine"
                      value={dispenseForm.medicine}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Search medicine..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={dispenseForm.quantity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                  <input
                    type="text"
                    name="patient"
                    value={dispenseForm.patient}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={dispenseForm.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="Additional notes..."
                  />
                </div>
                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Dispense Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
