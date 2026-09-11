import {
  Users,
  Calendar,
  ClipboardList,
  CheckCircle,
  Clock,
  Stethoscope,
  FileText,
  CalendarPlus,
  Activity,
  Bell,
} from 'lucide-react';

const stats = [
  { label: "Today's Patients", value: '12', icon: Users, color: 'bg-blue-500' },
  { label: 'Appointments', value: '8', icon: Calendar, color: 'bg-indigo-500' },
  { label: 'Pending Tasks', value: '5', icon: ClipboardList, color: 'bg-amber-500' },
  { label: 'Completed', value: '15', icon: CheckCircle, color: 'bg-emerald-500' },
];

const todaySchedule = [
  { time: '08:30 AM', patient: 'John Smith', type: 'General Checkup', status: 'completed' },
  { time: '09:00 AM', patient: 'Emily Davis', type: 'Follow-up', status: 'completed' },
  { time: '10:15 AM', patient: 'Michael Brown', type: 'Consultation', status: 'in-progress' },
  { time: '11:00 AM', patient: 'Sarah Wilson', type: 'Lab Review', status: 'upcoming' },
  { time: '02:00 PM', patient: 'David Lee', type: 'New Patient', status: 'upcoming' },
  { time: '03:30 PM', patient: 'Anna Martinez', type: 'Prescription Review', status: 'upcoming' },
];

const recentActivity = [
  { text: 'Completed consultation for John Smith', time: '15 min ago', icon: Stethoscope },
  { text: 'Lab results received for Emily Davis', time: '32 min ago', icon: FileText },
  { text: 'Prescription renewed for Michael Brown', time: '1 hour ago', icon: ClipboardList },
  { text: 'Appointment confirmed with Sarah Wilson', time: '2 hours ago', icon: Calendar },
  { text: 'New patient registered: David Lee', time: '3 hours ago', icon: Users },
];

const quickActions = [
  { label: 'New Consultation', icon: Stethoscope, color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'View Records', icon: FileText, color: 'bg-indigo-500 hover:bg-indigo-600' },
  { label: 'Schedule Follow-up', icon: CalendarPlus, color: 'bg-emerald-500 hover:bg-emerald-600' },
];

export default function StaffOverview() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning, Dr. Sarah</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Doctor · Cardiology Department
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              SS
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {todaySchedule.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-medium text-gray-500 w-20 shrink-0">{item.time}</div>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{
                    backgroundColor: item.status === 'completed' ? '#10b981' : item.status === 'in-progress' ? '#3b82f6' : '#d1d5db'
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.patient}</p>
                    <p className="text-sm text-gray-500">{item.type}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status === 'in-progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Activity className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className={`${action.color} text-white rounded-lg px-6 py-4 flex items-center gap-3 transition-colors font-medium`}
              >
                <action.icon className="w-5 h-5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
