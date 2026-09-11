import { useState } from 'react';
import {
  Users,
  Stethoscope,
  HeartPulse,
  Building2,
  CalendarOff,
  UserPlus,
  Search,
  Download,
  MoreVertical,
  Clock,
  FileText,
  ClipboardList,
  Activity,
  Briefcase,
  GraduationCap,
  Shield,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const statCards = [
  { title: 'Total Employees', value: '156', icon: Users, color: 'bg-[#3b82f6]', change: '+3 this month' },
  { title: 'Doctors', value: '45', icon: Stethoscope, color: 'bg-emerald-500', change: '+2 this month' },
  { title: 'Nurses', value: '35', icon: HeartPulse, color: 'bg-purple-500', change: '+1 this month' },
  { title: 'Administrative', value: '42', icon: Building2, color: 'bg-amber-500', change: '+2 this month' },
  { title: 'On Leave', value: '8', icon: CalendarOff, color: 'bg-red-500', change: '3 on sick leave' },
  { title: 'New Staff This Month', value: '5', icon: UserPlus, color: 'bg-cyan-500', change: '2 pending' },
];

const staffByDepartment = [
  { department: 'Cardiology', count: 28, icon: HeartPulse, color: 'bg-red-500' },
  { department: 'Neurology', count: 22, icon: Activity, color: 'bg-purple-500' },
  { department: 'Pediatrics', count: 18, icon: HeartPulse, color: 'bg-pink-500' },
  { department: 'Orthopedics', count: 15, icon: Briefcase, color: 'bg-blue-500' },
  { department: 'Administration', count: 42, icon: Shield, color: 'bg-amber-500' },
  { department: 'Pharmacy', count: 31, icon: ClipboardList, color: 'bg-emerald-500' },
];

const recentActivities = [
  { action: 'New employee onboarded', staff: 'Dr. James Wilson', time: '2 hours ago', icon: UserPlus, color: 'bg-emerald-500' },
  { action: 'Leave request approved', staff: 'Nurse Sarah Miller', time: '4 hours ago', icon: CheckCircle, color: 'bg-blue-500' },
  { action: 'Training completed', staff: 'Dr. Emily Chen', time: '6 hours ago', icon: GraduationCap, color: 'bg-purple-500' },
  { action: 'Contract renewed', staff: 'Tech. Mike Brown', time: '1 day ago', icon: FileText, color: 'bg-amber-500' },
  { action: 'Department transfer', staff: 'Dr. Anna Lee', time: '1 day ago', icon: Briefcase, color: 'bg-cyan-500' },
  { action: 'Performance review', staff: 'Nurse Tom Davis', time: '2 days ago', icon: Activity, color: 'bg-rose-500' },
];

const leaveRequests = [
  { name: 'Dr. Robert Taylor', department: 'Cardiology', type: 'Annual Leave', startDate: '2024-01-20', status: 'Pending' },
  { name: 'Nurse Lisa Johnson', department: 'Pediatrics', type: 'Sick Leave', startDate: '2024-01-18', status: 'Approved' },
  { name: 'Dr. Maria Santos', department: 'Neurology', type: 'Annual Leave', startDate: '2024-01-22', status: 'Pending' },
  { name: 'Admin Kevin White', department: 'Administration', type: 'Personal', startDate: '2024-01-19', status: 'Rejected' },
  { name: 'Dr. David Kim', department: 'Orthopedics', type: 'Maternity', startDate: '2024-02-01', status: 'Approved' },
];

const quickActions = [
  { title: 'Add Employee', icon: UserPlus, color: 'bg-[#3b82f6]' },
  { title: 'View Attendance', icon: Clock, color: 'bg-emerald-500' },
  { title: 'Manage Leave', icon: CalendarOff, color: 'bg-purple-500' },
  { title: 'Staff Reports', icon: FileText, color: 'bg-amber-500' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-100 text-emerald-700';
    case 'Pending':
      return 'bg-amber-100 text-amber-700';
    case 'Rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Approved':
      return CheckCircle;
    case 'Pending':
      return AlertCircle;
    case 'Rejected':
      return XCircle;
    default:
      return AlertCircle;
  }
};

export default function HRDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, HR Manager</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your workforce efficiently</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-64"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-gray-500 text-xs mt-1">{card.title}</p>
                <p className="text-[#3b82f6] text-xs font-medium mt-2">{card.change}</p>
              </div>
            );
          })}
        </div>

        {/* Staff by Department */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff by Department</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {staffByDepartment.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.department}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#3b82f6] cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${dept.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{dept.count}</h3>
                  <p className="text-gray-500 text-sm mt-1">{dept.department}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Leave Requests Table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
                <div className="flex items-center gap-2">
                  <button className="text-[#3b82f6] text-sm font-medium hover:underline">
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Staff Name
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Department
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Leave Type
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Start Date
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      <MoreVertical className="w-4 h-4" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((request, index) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                              {request.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{request.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{request.department}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{request.type}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{request.startDate}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              request.status
                            )}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {request.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#3b82f6] hover:bg-blue-50 transition-all group"
                  >
                    <div className={`${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#3b82f6] transition-colors">
                      {action.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <button className="text-[#3b82f6] text-sm font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`${activity.color} p-2 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.staff}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
