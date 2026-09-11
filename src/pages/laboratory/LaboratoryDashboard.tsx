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
} from "lucide-react";

const statCards = [
  { label: "Test Requests", value: 18, icon: ClipboardList, color: "bg-blue-500" },
  { label: "Pending Tests", value: 8, icon: Clock, color: "bg-yellow-500" },
  { label: "Processing", value: 5, icon: Cog, color: "bg-purple-500" },
  { label: "Completed Today", value: 12, icon: CheckCircle, color: "bg-green-500" },
  { label: "Sample Collection", value: 3, icon: TestTube, color: "bg-orange-500" },
  { label: "Revenue", value: "₦3,200", icon: DollarSign, color: "bg-emerald-500" },
];

const pendingTests = [
  { id: 1, patient: "Sarah Johnson", testType: "Complete Blood Count", priority: "High", status: "Pending", time: "9:45 AM" },
  { id: 2, patient: "Michael Brown", testType: "Lipid Profile", priority: "Medium", status: "In Progress", time: "9:30 AM" },
  { id: 3, patient: "Emma Wilson", testType: "Urine Analysis", priority: "Low", status: "Pending", time: "9:15 AM" },
  { id: 4, patient: "James Davis", testType: "X-Ray Chest", priority: "High", status: "Sample Collected", time: "9:00 AM" },
  { id: 5, patient: "Olivia Martinez", testType: "Blood Glucose", priority: "Medium", status: "Pending", time: "8:45 AM" },
  { id: 6, patient: "William Garcia", testType: "Thyroid Panel", priority: "Low", status: "In Progress", time: "8:30 AM" },
];

const testCategories = [
  { name: "Blood Test", icon: Droplets, count: 8, color: "bg-red-50 text-red-600" },
  { name: "Urine Analysis", icon: Activity, count: 4, color: "bg-yellow-50 text-yellow-600" },
  { name: "X-Ray", icon: Radiation, count: 3, color: "bg-blue-50 text-blue-600" },
  { name: "MRI", icon: Scan, count: 2, color: "bg-purple-50 text-purple-600" },
  { name: "CT Scan", icon: Eye, count: 1, color: "bg-indigo-50 text-indigo-600" },
  { name: "Ultrasound", icon: Waves, count: 5, color: "bg-teal-50 text-teal-600" },
];

const quickActions = [
  { label: "View Test Requests", icon: ClipboardList, color: "bg-blue-500" },
  { label: "Enter Results", icon: CheckCircle, color: "bg-green-500" },
  { label: "Sample Collection", icon: TestTube, color: "bg-orange-500" },
  { label: "Lab Reports", icon: Activity, color: "bg-purple-500" },
];

const priorityBadge = (priority: string) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{styles[priority]}`}>
      {priority}
    </span>
  );
};

const statusBadge = (status: string) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

export default function LaboratoryDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Welcome, Laboratory Staff</h1>

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

        {/* Test Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {testCategories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl shadow-sm p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
              <div className={`₦{cat.color} p-3 rounded-lg inline-flex mb-2`}>
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
                  {pendingTests.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.patient}</td>
                      <td className="py-3 px-4 text-gray-600">{row.testType}</td>
                      <td className="py-3 px-4">{priorityBadge(row.priority)}</td>
                      <td className="py-3 px-4">{statusBadge(row.status)}</td>
                      <td className="py-3 px-4 text-gray-500">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
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
      </div>
    </div>
  );
}
