import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
import {
  ClipboardList,
  Clock,
  Cog,
  CheckCircle,
  TestTube,
  DollarSign,
  Droplets,
  Activity,
  Radiation,
  Scan,
  Waves,
  Eye,
  Loader2,
} from "lucide-react";

const categoryMeta: Record<string, { icon: typeof Droplets; color: string }> = {
  Blood: { icon: Droplets, color: "bg-red-50 text-red-600" },
  Urine: { icon: Activity, color: "bg-yellow-50 text-yellow-600" },
  "X-Ray": { icon: Radiation, color: "bg-blue-50 text-blue-600" },
  MRI: { icon: Scan, color: "bg-purple-50 text-purple-600" },
  "CT Scan": { icon: Eye, color: "bg-indigo-50 text-indigo-600" },
  Ultrasound: { icon: Waves, color: "bg-teal-50 text-teal-600" },
};

const priorityBadge = (priority: string) => {
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || "bg-gray-100 text-gray-800"}`}>
      {priority}
    </span>
  );
};

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Sample Collected": "bg-orange-100 text-orange-700",
    Completed: "bg-green-100 text-green-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

export default function LaboratoryDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tests, setTests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/laboratory');
        const data = res.data;
        setTests(data.tests ?? []);
        setTotal(data.total ?? 0);
        setPending(data.pending ?? 0);
        setInProgress(data.inProgress ?? 0);
        setCompleted(data.completed ?? 0);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load laboratory data");
      } finally {
        setLoading(false);
      }
    };
    fetchLabData();
  }, []);

  const categories = (() => {
    const map: Record<string, number> = {};
    tests.forEach((t: any) => {
      const cat = t.category || t.testCategory || t.type || "Other";
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      ...categoryMeta[name] || { icon: ClipboardList, color: "bg-gray-50 text-gray-600" },
    }));
  })();

  const statCards = [
    { label: "Total Tests", value: total, icon: ClipboardList, color: "bg-blue-500" },
    { label: "Pending Tests", value: pending, icon: Clock, color: "bg-yellow-500" },
    { label: "In Progress", value: inProgress, icon: Cog, color: "bg-purple-500" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "bg-green-500" },
    { label: "Sample Collection", value: pending, icon: TestTube, color: "bg-orange-500" },
    { label: "Revenue", value: "—", icon: DollarSign, color: "bg-emerald-500" },
  ];

  const quickActions = [
    { label: "View Test Requests", icon: ClipboardList, color: "bg-blue-500", path: "/laboratory/test-requests" },
    { label: "Enter Results", icon: CheckCircle, color: "bg-green-500", path: "/laboratory/results" },
    { label: "Sample Collection", icon: TestTube, color: "bg-orange-500", path: "/laboratory/samples" },
    { label: "Lab Reports", icon: Activity, color: "bg-purple-500", path: "/laboratory/reports" },
  ];

  const recentPending = tests
    .filter((t: any) => t.status === "Pending" || t.status === "Sample Collected")
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome, {user?.fullName || "Laboratory Staff"}
          </h1>
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

        {/* Test Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-xl shadow-sm p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/laboratory/categories")}
            >
              <div className={`${cat.color} p-3 rounded-lg inline-flex mb-2`}>
                <cat.icon size={24} />
              </div>
              <p className="font-semibold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-500">{cat.count} tests</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Pending Tests */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Tests</h2>
            {recentPending.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No pending tests</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Test Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Priority</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPending.map((row: any) => (
                      <tr key={row.id || row._id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {row.patientName || row.patient || `${row.patientFirstName ?? ""} ${row.patientLastName ?? ""}`.trim() || "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {row.testType || row.testName || row.name || "—"}
                        </td>
                        <td className="py-3 px-4">{priorityBadge(row.priority || "Medium")}</td>
                        <td className="py-3 px-4">{statusBadge(row.status || "Pending")}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {row.time || row.createdAt
                            ? new Date(row.time || row.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
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
      </div>
    </div>
  );
}
