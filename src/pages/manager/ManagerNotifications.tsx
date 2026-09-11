import { Bell, UserPlus, Calendar, AlertTriangle, DollarSign, Stethoscope, Pill } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { icon: UserPlus, title: 'New Patient Registration', message: 'A new patient Jack Thompson has been registered in the system.', time: '5 minutes ago', color: 'bg-blue-500' },
  { icon: Calendar, title: 'Appointment Scheduled', message: 'Dr. Smith has a new appointment with Alice Johnson at 2:00 PM.', time: '15 minutes ago', color: 'bg-green-500' },
  { icon: AlertTriangle, title: 'Low Stock Alert', message: 'Metformin 500mg is running low. Current stock: 5 units.', time: '30 minutes ago', color: 'bg-amber-500' },
  { icon: DollarSign, title: 'Payment Received', message: 'Payment of ₦1,250 received from Alice Johnson for INV-5001.', time: '1 hour ago', color: 'bg-emerald-500' },
  { icon: Stethoscope, title: 'Lab Results Ready', message: 'Lab results for Bob Williams are ready for review.', time: '2 hours ago', color: 'bg-violet-500' },
  { icon: Pill, title: 'Prescription Alert', message: 'New prescription order from Dr. Lee requires verification.', time: '3 hours ago', color: 'bg-cyan-500' },
  { icon: AlertTriangle, title: 'Staff Leave Request', message: 'Nurse Emily Davis has submitted a leave request for tomorrow.', time: '4 hours ago', color: 'bg-amber-500' },
  { icon: DollarSign, title: 'Invoice Overdue', message: 'Invoice INV-5004 for David Brown is now overdue.', time: '5 hours ago', color: 'bg-red-500' },
];

export default function ManagerNotifications() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Notifications"
          icon={Bell}
          action={
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              <Bell className="w-4 h-4" />
              Mark all as read
            </button>
          }
        />

        <div className="space-y-3">
          {notifications.map((n, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ₦{n.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <n.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{n.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
