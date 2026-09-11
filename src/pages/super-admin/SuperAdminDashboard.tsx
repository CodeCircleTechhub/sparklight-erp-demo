import {
  Users,
  UserCog,
  ClipboardList,
  DollarSign,
  Calendar,
  BedDouble,
  FlaskConical,
  CreditCard,
  UserPlus,
  CalendarPlus,
  UserCheck,
  FileText,
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Patients', value: '4,582', icon: Users, color: 'blue' as const, trend: { value: '+12%', isPositive: true } },
  { title: 'Active Staff', value: '156', icon: UserCog, color: 'green' as const, trend: { value: '+3%', isPositive: true } },
  { title: "Today's Visits", value: '126', icon: ClipboardList, color: 'purple' as const, trend: { value: '+8%', isPositive: true } },
  { title: "Today's Revenue", value: '₦12,450', icon: DollarSign, color: 'green' as const, trend: { value: '+15%', isPositive: true } },
  { title: 'Appointments', value: '43', icon: Calendar, color: 'blue' as const, trend: { value: '-2%', isPositive: false } },
  { title: 'Admitted Patients', value: '28', icon: BedDouble, color: 'yellow' as const },
  { title: 'Pending Lab Requests', value: '15', icon: FlaskConical, color: 'red' as const },
  { title: 'Outstanding Bills', value: '₦45,200', icon: CreditCard, color: 'red' as const, trend: { value: '+5%', isPositive: false } },
];

const recentActivity = [
  { time: '10:32 AM', user: 'Dr. Smith', action: 'Patient Discharged', details: 'Patient #4521 - John Doe' },
  { time: '10:15 AM', user: 'Nurse Adams', action: 'Medication Administered', details: 'Patient #4398 - Sarah Connor' },
  { time: '09:48 AM', user: 'Reception', action: 'Appointment Scheduled', details: 'Dr. Patel - Orthopedics, 2:30 PM' },
  { time: '09:30 AM', user: 'Lab Tech', action: 'Lab Results Uploaded', details: 'Blood work for Patient #4456' },
  { time: '09:12 AM', user: 'Admin', action: 'Staff Added', details: 'New nurse - Emily Chen, ER Department' },
  { time: '08:55 AM', user: 'Dr. Johnson', action: 'Surgery Scheduled', details: 'Appendectomy - Room 3B, Tomorrow 8 AM' },
  { time: '08:40 AM', user: 'Finance', action: 'Bill Generated', details: 'Patient #4401 - ₦3,200' },
  { time: '08:22 AM', user: 'Pharmacist', action: 'Prescription Filled', details: 'Patient #4500 - Amoxicillin 500mg' },
];

const quickActions = [
  { label: 'Register Patient', icon: UserPlus, color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Schedule Appointment', icon: CalendarPlus, color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Create Staff', icon: UserCheck, color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Generate Report', icon: FileText, color: 'bg-amber-500 hover:bg-amber-600' },
];

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Super Admin</h1>
          <p className="text-sm text-gray-500">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Registration</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">Chart placeholder — Patient Registration</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">Chart placeholder — Revenue Overview</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Details</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.time}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.user}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.action}</td>
                  <td className="py-3 px-4 text-gray-500">{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className={`₦{action.color} text-white rounded-xl p-6 flex flex-col items-center gap-3 transition-colors cursor-pointer`}
            >
              <action.icon className="w-7 h-7" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
