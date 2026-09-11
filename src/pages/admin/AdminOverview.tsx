import { useState } from 'react';
import {
  Users,
  Calendar,
  UserCog,
  DollarSign,
  BedDouble,
  FlaskConical,
  Plus,
  CalendarPlus,
  FileText,
  Settings,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const recentAppointments: Appointment[] = [
  { id: '1', patient: 'John Smith', doctor: 'Dr. Sarah Wilson', date: '2026-09-11', time: '09:00 AM', status: 'Confirmed' },
  { id: '2', patient: 'Emily Davis', doctor: 'Dr. Michael Chen', date: '2026-09-11', time: '10:30 AM', status: 'Pending' },
  { id: '3', patient: 'Robert Johnson', doctor: 'Dr. Emily Brown', date: '2026-09-11', time: '11:00 AM', status: 'Completed' },
  { id: '4', patient: 'Maria Garcia', doctor: 'Dr. David Kim', date: '2026-09-11', time: '02:00 PM', status: 'Confirmed' },
  { id: '5', patient: 'James Wilson', doctor: 'Dr. Sarah Wilson', date: '2026-09-11', time: '03:30 PM', status: 'Cancelled' },
];

const quickActions: QuickAction[] = [
  { icon: <Plus className="w-6 h-6" />, label: 'Add Patient', color: 'bg-blue-500' },
  { icon: <CalendarPlus className="w-6 h-6" />, label: 'Schedule Appointment', color: 'bg-green-500' },
  { icon: <FileText className="w-6 h-6" />, label: 'Generate Report', color: 'bg-purple-500' },
  { icon: <Settings className="w-6 h-6" />, label: 'Manage Staff', color: 'bg-orange-500' },
];

const AdminOverview = () => {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, Admin</h1>
          <p className="text-gray-500 mt-1">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Patients"
          value="1,234"
          icon={Users}
          trend={{ value: '+12% from last month', isPositive: true }}
        />
        <StatCard
          title="Today's Appointments"
          value="48"
          icon={Calendar}
          trend={{ value: '+8% from yesterday', isPositive: true }}
        />
        <StatCard
          title="Active Staff"
          value="156"
          icon={UserCog}
          trend={{ value: 'All departments', isPositive: true }}
        />
        <StatCard
          title="Revenue"
          value="₦125,430"
          icon={DollarSign}
          trend={{ value: '+15% from last month', isPositive: true }}
        />
        <StatCard
          title="Bed Occupancy"
          value="78%"
          icon={BedDouble}
          trend={{ value: '22 beds available', isPositive: true }}
        />
        <StatCard
          title="Lab Tests Today"
          value="32"
          icon={FlaskConical}
          trend={{ value: '5 pending', isPositive: true }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{appointment.patient}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{appointment.doctor}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{appointment.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{getStatusBadge(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`₦{action.color} text-white p-3 rounded-lg`}>
              {action.icon}
            </div>
            <span className="font-medium text-gray-900">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+15% this month</span>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Revenue Chart</p>
            <p className="text-sm text-gray-400">Integration with chart library pending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
