import { Bell, CheckCheck, Calendar, DollarSign, Users, AlertTriangle, FileText, UserPlus } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const notifications = [
  { id: 1, icon: Calendar, color: 'bg-blue-100 text-blue-600', title: 'New Appointment Scheduled', message: 'Dr. Fatima Usman has a new appointment with Abubakar Ibrahim at 2:00 PM', timestamp: '5 minutes ago', read: false },
  { id: 2, icon: DollarSign, color: 'bg-green-100 text-green-600', title: 'Payment Received', message: 'Payment of ₦125,000 received from Fatima Bello for consultation', timestamp: '15 minutes ago', read: false },
  { id: 3, icon: Users, color: 'bg-purple-100 text-purple-600', title: 'Staff Check-in', message: 'Dr. Oluwaseun Adeleye has checked in for today\'s shift', timestamp: '30 minutes ago', read: false },
  { id: 4, icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600', title: 'Low Stock Alert', message: 'Artemether-Lumefantrine is running low. Current stock: 8 units', timestamp: '1 hour ago', read: false },
  { id: 5, icon: FileText, color: 'bg-red-100 text-red-600', title: 'Lab Results Ready', message: 'Blood work results for Patient #4521 are ready for review', timestamp: '2 hours ago', read: true },
  { id: 6, icon: UserPlus, color: 'bg-blue-100 text-blue-600', title: 'New Patient Registered', message: 'Blessing Eze has been registered as a new patient', timestamp: '3 hours ago', read: true },
  { id: 7, icon: Calendar, color: 'bg-green-100 text-green-600', title: 'Surgery Scheduled', message: 'Knee replacement surgery for Yusuf Danjuma scheduled for tomorrow', timestamp: '4 hours ago', read: true },
  { id: 8, icon: DollarSign, color: 'bg-yellow-100 text-yellow-600', title: 'Outstanding Bill', message: 'Patient #4401 has an outstanding bill of ₦320,000', timestamp: '5 hours ago', read: true },
  { id: 9, icon: AlertTriangle, color: 'bg-red-100 text-red-600', title: 'Emergency Alert', message: 'Emergency case admitted - Patient in critical condition', timestamp: '6 hours ago', read: true },
  { id: 10, icon: Users, color: 'bg-purple-100 text-purple-600', title: 'Leave Request', message: 'Nurse Amina Yusuf has submitted a leave request for next week', timestamp: '8 hours ago', read: true },
];

export default function AdminNotifications() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        icon={Bell}
        description={`${unreadCount} unread notifications`}
        action={
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer">
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
              !notif.read ? 'bg-blue-50/50' : ''
            }`}
          >
            <div className={`${notif.color} rounded-lg p-2.5 flex-shrink-0`}>
              <notif.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{notif.title}</h3>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
