import { Bell, Calendar, Pill, CreditCard, Settings, Users } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

type NotificationType = 'appointment' | 'prescription' | 'billing' | 'system' | 'staff';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string }> = {
  appointment: { icon: Calendar, color: 'text-blue-600 bg-blue-100' },
  prescription: { icon: Pill, color: 'text-green-600 bg-green-100' },
  billing: { icon: CreditCard, color: 'text-yellow-600 bg-yellow-100' },
  system: { icon: Settings, color: 'text-gray-600 bg-gray-100' },
  staff: { icon: Users, color: 'text-purple-600 bg-purple-100' },
};

const notifications: Notification[] = [
  { id: 1, type: 'appointment', title: 'New Appointment', message: 'Dr. Smith has a new appointment with John Doe at 2:00 PM', timestamp: '2 minutes ago', unread: true },
  { id: 2, type: 'prescription', title: 'Prescription Ready', message: 'Prescription for patient #4500 is ready for pickup at pharmacy', timestamp: '15 minutes ago', unread: true },
  { id: 3, type: 'billing', title: 'Payment Received', message: 'Payment of ₦3,200 received from John Doe for invoice INV-2026-001', timestamp: '30 minutes ago', unread: true },
  { id: 4, type: 'system', title: 'System Update', message: 'System maintenance scheduled for tonight at 11:00 PM', timestamp: '1 hour ago', unread: true },
  { id: 5, type: 'staff', title: 'Staff Clock In', message: 'Dr. Priya Patel has clocked in for today', timestamp: '1 hour ago', unread: false },
  { id: 6, type: 'appointment', title: 'Appointment Cancelled', message: 'Lisa Anderson cancelled her appointment with Dr. Kim', timestamp: '2 hours ago', unread: false },
  { id: 7, type: 'billing', title: 'Outstanding Invoice', message: 'Invoice INV-2026-003 for ₦4,500 is now overdue', timestamp: '3 hours ago', unread: false },
  { id: 8, type: 'prescription', title: 'Low Stock Alert', message: 'Amoxicillin 500mg stock is running low in pharmacy', timestamp: '4 hours ago', unread: false },
  { id: 9, type: 'staff', title: 'Leave Request', message: 'Fatima Hassan has submitted a leave request for Sep 25-27', timestamp: '5 hours ago', unread: false },
  { id: 10, type: 'system', title: 'Backup Complete', message: 'Daily database backup completed successfully', timestamp: '6 hours ago', unread: false },
];

export default function Notifications() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        icon={Bell}
        action={
          <button className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
            Mark all as read
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {notifications.map((notif) => {
          const config = typeConfig[notif.type];
          const Icon = config.icon;

          return (
            <div key={notif.id} className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ₦{notif.unread ? 'bg-blue-50/30' : ''}`}>
              <div className={`flex-shrink-0 rounded-lg p-2 ₦{config.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ₦{notif.unread ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</p>
                  {notif.unread && (
                    <span className="h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
