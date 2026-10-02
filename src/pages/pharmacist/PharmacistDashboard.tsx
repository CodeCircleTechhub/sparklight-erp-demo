import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
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
  Loader2,
} from "lucide-react";

interface PharmacyData {
  medicines: any[];
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  lowStockAlerts: {
    id: string;
    name: string;
    currentStock: number;
    category: string;
    reorderLevel: number;
  }[];
}

interface Prescription {
  id: string;
  patient: string;
  medicinesCount: number;
  doctor: string;
  time: string;
  status: string;
}

const quickActions = [
  { label: "View Medicines", icon: Package, color: "bg-blue-500", path: "/pharmacist/medicines" },
  { label: "Dispense Medicine", icon: ShoppingCart, color: "bg-green-500", path: "/pharmacist/dispensing" },
  { label: "Check Stock", icon: RotateCcw, color: "bg-purple-500", path: "/pharmacist/stock" },
  { label: "View Prescriptions", icon: ClipboardList, color: "bg-indigo-500", path: "/pharmacist/prescriptions" },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Filled: "bg-blue-100 text-blue-800",
    Dispensed: "bg-green-100 text-green-800",
    "Partially Dispensed": "bg-blue-100 text-blue-800",
    Cancelled: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

export default function PharmacistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pharmacyData, setPharmacyData] = useState<PharmacyData | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const pharmacyRes = await api.get('/pharmacy');
        setPharmacyData({
          ...pharmacyRes.data,
          lowStockAlerts: (pharmacyRes.data.lowStockAlerts || []).map((a: any) => ({
            id: a.medicineId || a._id,
            name: a.name,
            currentStock: a.stock,
            category: a.category || '',
            reorderLevel: a.minimumStock,
          })),
        });

        try {
          const prescriptionsRes = await api.get('/pharmacy/prescriptions');
          const rows: Prescription[] = (prescriptionsRes.data?.items || []).map((rx: any) => ({
            id: rx._id,
            patient:
              rx.patientName ||
              (rx.patient ? `${rx.patient.firstName || ''} ${rx.patient.surname || ''}`.trim() : '') ||
              '—',
            medicinesCount: (rx.medications || []).length,
            doctor: rx.doctorName || rx.doctor?.fullName || '—',
            time: rx.date
              ? new Date(rx.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
              : '—',
            status: rx.status,
          }));
          setPrescriptions(rows);
        } catch {
          setPrescriptions([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <p className="text-gray-700 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Medicines", value: pharmacyData?.total ?? 0, icon: Package, color: "bg-blue-500" },
    { label: "Low Stock", value: pharmacyData?.lowStock ?? 0, icon: AlertTriangle, color: "bg-yellow-500" },
    { label: "Out of Stock", value: pharmacyData?.outOfStock ?? 0, icon: XCircle, color: "bg-red-500" },
    { label: "In Stock", value: pharmacyData?.inStock ?? 0, icon: Clock, color: "bg-orange-500" },
    { label: "Low Stock Alerts", value: pharmacyData?.lowStockAlerts?.length ?? 0, icon: Pill, color: "bg-green-500" },
    { label: "Prescriptions", value: prescriptions.length, icon: DollarSign, color: "bg-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user?.fullName || 'Pharmacist'}</h1>
          <ApplyLeaveButton />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className={`${card.color} p-2 rounded-lg text-white`}>
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
              {pharmacyData?.lowStockAlerts?.length === 0 && (
                <p className="text-gray-500 text-sm">No low stock alerts.</p>
              )}
              {pharmacyData?.lowStockAlerts?.map((med) => (
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
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
                >
                  <div className={`${action.color} p-2 rounded-lg text-white`}>
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
                {(() => {
                  const pending = prescriptions.filter((p) => p.status === 'Pending' || p.status === 'Filled');
                  if (pending.length === 0) {
                    return (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-500">No pending prescriptions found.</td>
                      </tr>
                    );
                  }
                  return pending.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.patient}</td>
                      <td className="py-3 px-4 text-gray-600">{row.medicinesCount} items</td>
                      <td className="py-3 px-4 text-gray-600">{row.doctor}</td>
                      <td className="py-3 px-4 text-gray-500">{row.time}</td>
                      <td className="py-3 px-4">{statusBadge(row.status)}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
