import {
  Users, Calendar, Stethoscope, Building2, BedDouble,
  ArrowUpRight, DollarSign, AlertCircle, Activity,
  UserPlus, BarChart3, UserCog, Settings, TrendingUp, TrendingDown
} from 'lucide-react';

const statCards = [
  { title: 'Total Patients', value: '4,582', icon: Users, color: 'bg-blue-500', change: '+12%', trend: 'up' },
  { title: "Today's Visits", value: '126', icon: Calendar, color: 'bg-emerald-500', change: '+8%', trend: 'up' },
  { title: 'Active Staff', value: '156', icon: Stethoscope, color: 'bg-violet-500', change: '+3%', trend: 'up' },
  { title: 'Departments', value: '12', icon: Building2, color: 'bg-amber-500', change: '0%', trend: 'up' },
  { title: 'Admissions', value: '28', icon: BedDouble, color: 'bg-cyan-500', change: '+15%', trend: 'up' },
  { title: 'Discharges', value: '15', icon: ArrowUpRight, color: 'bg-pink-500', change: '-5%', trend: 'down' },
  { title: 'Revenue', value: '₦125,430', icon: DollarSign, color: 'bg-green-500', change: '+22%', trend: 'up' },
  { title: 'Outstanding Bills', value: '₦45,200', icon: AlertCircle, color: 'bg-red-500', change: '-8%', trend: 'down' },
];

const departments = [
  { name: 'Cardiology', staff: 18, patients: 24, revenue: '₦18,500' },
  { name: 'Neurology', staff: 14, patients: 18, revenue: '₦14,200' },
  { name: 'Orthopedics', staff: 12, patients: 22, revenue: '₦12,800' },
  { name: 'Pediatrics', staff: 16, patients: 30, revenue: '₦10,500' },
  { name: 'Oncology', staff: 10, patients: 12, revenue: '₦22,300' },
  { name: 'Emergency', staff: 22, patients: 38, revenue: '₦15,700' },
];

const recentVisits = [
  { id: 'VST-1001', patient: 'Alice Johnson', department: 'Cardiology', doctor: 'Dr. Smith', time: '09:15 AM', status: 'Completed' },
  { id: 'VST-1002', patient: 'Bob Williams', department: 'Neurology', doctor: 'Dr. Patel', time: '09:45 AM', status: 'In Progress' },
  { id: 'VST-1003', patient: 'Carol Davis', department: 'Pediatrics', doctor: 'Dr. Lee', time: '10:20 AM', status: 'Completed' },
  { id: 'VST-1004', patient: 'David Brown', department: 'Orthopedics', doctor: 'Dr. Garcia', time: '10:50 AM', status: 'Waiting' },
  { id: 'VST-1005', patient: 'Eva Martinez', department: 'Oncology', doctor: 'Dr. Kim', time: '11:15 AM', status: 'Completed' },
];

const quickActions = [
  { title: 'Patient Registration', icon: UserPlus, color: 'bg-blue-500 hover:bg-blue-600' },
  { title: 'View Reports', icon: BarChart3, color: 'bg-emerald-500 hover:bg-emerald-600' },
  { title: 'Manage Staff', icon: UserCog, color: 'bg-violet-500 hover:bg-violet-600' },
  { title: 'Hospital Settings', icon: Settings, color: 'bg-amber-500 hover:bg-amber-600' },
];

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, Hospital Manager</h1>
          <p className="text-blue-100 mt-1">Here's your hospital overview for today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ₦{card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ₦{card.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                  {card.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {card.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Performance */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div key={dept.name} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Staff</span>
                      <span className="font-medium text-gray-900">{dept.staff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patients Today</span>
                      <span className="font-medium text-gray-900">{dept.patients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue</span>
                      <span className="font-medium text-green-600">{dept.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className={`w-full ₦{action.color} text-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Visits Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Visits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Visit ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Department</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Doctor</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{visit.id}</td>
                    <td className="py-3 text-gray-900">{visit.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{visit.department}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{visit.doctor}</td>
                    <td className="py-3 text-gray-600">{visit.time}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{statusColors[visit.status]}`}>
                        {visit.status}
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
