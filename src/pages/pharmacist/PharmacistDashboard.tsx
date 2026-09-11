import {
  Package,
  AlertTriangle,
  XCircle,
  Clock,
  Pill,
  DollarSign,
  ShoppingCart,
  RotateCcw,
  ClipboardList,
} from "lucide-react";

const statCards = [
  { label: "Total Medicines", value: 450, icon: Package, color: "bg-blue-500" },
  { label: "Low Stock", value: 12, icon: AlertTriangle, color: "bg-yellow-500" },
  { label: "Out of Stock", value: 3, icon: XCircle, color: "bg-red-500" },
  { label: "Expiring Soon", value: 8, icon: Clock, color: "bg-orange-500" },
  { label: "Today's Dispensed", value: 25, icon: Pill, color: "bg-green-500" },
  { label: "Revenue", value: "₦8,500", icon: DollarSign, color: "bg-emerald-500" },
];

const lowStockAlerts = [
  { id: 1, name: "Amoxicillin 500mg", currentStock: 5, category: "Antibiotics", reorderLevel: 20 },
  { id: 2, name: "Metformin 1000mg", currentStock: 8, category: "Diabetes", reorderLevel: 15 },
  { id: 3, name: "Amlodipine 5mg", currentStock: 3, category: "Cardiovascular", reorderLevel: 10 },
  { id: 4, name: "Cetirizine 10mg", currentStock: 10, category: "Allergy", reorderLevel: 25 },
];

const pendingPrescriptions = [
  { id: 1, patient: "Sarah Johnson", medicinesCount: 3, doctor: "Dr. Ahmed", time: "10:15 AM", status: "Pending" },
  { id: 2, patient: "Michael Brown", medicinesCount: 2, doctor: "Dr. Ahmed", time: "10:00 AM", status: "Dispensed" },
  { id: 3, patient: "Emma Wilson", medicinesCount: 5, doctor: "Dr. Fatima", time: "9:45 AM", status: "Pending" },
  { id: 4, patient: "James Davis", medicinesCount: 1, doctor: "Dr. Ahmed", time: "9:30 AM", status: "Partially Dispensed" },
  { id: 5, patient: "Olivia Martinez", medicinesCount: 4, doctor: "Dr. Fatima", time: "9:15 AM", status: "Pending" },
  { id: 6, patient: "William Garcia", medicinesCount: 2, doctor: "Dr. Ahmed", time: "9:00 AM", status: "Dispensed" },
];

const quickActions = [
  { label: "View Medicines", icon: Package, color: "bg-blue-500" },
  { label: "Dispense Medicine", icon: ShoppingCart, color: "bg-green-500" },
  { label: "Check Stock", icon: RotateCcw, color: "bg-purple-500" },
  { label: "View Prescriptions", icon: ClipboardList, color: "bg-indigo-500" },
];

const statusBadge = (status: string) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

export default function PharmacistDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Welcome, Pharmacist</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className={`₦{card.color} p-2 rounded-lg text-white`}>
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-yellow-500" />
              Low Stock Alerts
            </h2>
            <div className="space-y-3">
              {lowStockAlerts.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-xs text-gray-500">{med.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">Stock: {med.currentStock}</p>
                    <p className="text-xs text-gray-500">Reorder: {med.reorderLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
                >
                  <div className={`₦{action.color} p-2 rounded-lg text-white`}>
                    <action.icon size={20} />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Prescriptions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Prescriptions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Medicines</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingPrescriptions.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-gray-900">{row.patient}</td>
                    <td className="py-3 px-4 text-gray-600">{row.medicinesCount} items</td>
                    <td className="py-3 px-4 text-gray-600">{row.doctor}</td>
                    <td className="py-3 px-4 text-gray-500">{row.time}</td>
                    <td className="py-3 px-4">{statusBadge(row.status)}</td>
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
