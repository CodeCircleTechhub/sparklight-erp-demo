import { useState } from 'react';
import {
  Bell,
  Calendar,
  Pill,
  FileText,
  FlaskConical,
  CheckCircle,
  UserPlus,
  Key,
  CheckCheck,
} from 'lucide-react';

const notifications = [
  {
    id: 1,
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600',
    title: 'Appointment Reminder',
    message: 'You have an upcoming appointment with Dr. Ahmed Hassan on September 15, 2026 at 10:30 AM.',
    time: 'Today',
    unread: true,
  },
  {
    id: 2,
    icon: Pill,
    color: 'bg-purple-100 text-purple-600',
    title: 'Prescription Ready',
    message: 'Your prescription from Dr. Ahmed Hassan is ready for pickup at the pharmacy.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: 3,
    icon: FileText,
    color: 'bg-amber-100 text-amber-600',
    title: 'Bill Generated',
    message: 'New bill for Laboratory services has been generated. Amount: ₦5,000.',
    time: '2 days ago',
    unread: true,
  },
  {
    id: 4,
    icon: FlaskConical,
    color: 'bg-green-100 text-green-600',
    title: 'Lab Results Available',
    message: 'Your blood test results from September 2, 2026 are now available for viewing.',
    time: '3 days ago',
    unread: false,
  },
  {
    id: 5,
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600',
    title: 'Appointment Confirmed',
    message: 'Your appointment on September 15, 2026 at 10:30 AM has been confirmed.',
    time: '5 days ago',
    unread: false,
  },
  {
    id: 6,
    icon: Bell,
    color: 'bg-blue-100 text-blue-600',
    title: 'Welcome Message',
    message: 'Welcome to SparkLight Patient Portal! Access your health records anytime, anywhere.',
    time: '1 week ago',
    unread: false,
  },
  {
    id: 7,
    icon: Key,
    color: 'bg-gray-100 text-gray-600',
    title: 'Password Changed',
    message: 'Your password was successfully changed. If this was not you, please contact support.',
    time: '2 weeks ago',
    unread: false,
  },
  {
    id: 8,
    icon: UserPlus,
    color: 'bg-indigo-100 text-indigo-600',
    title: 'Account Created',
    message: 'Your patient account has been created successfully. Welcome aboard!',
    time: '1 month ago',
    unread: false,
  },
];

export default function PatientNotifications() {
  const [readNotifications, setReadNotifications] = useState<number[]>([]);

  const allRead = notifications.every((n) => readNotifications.includes(n.id) || !n.unread);

  const markAllRead = () => {
    setReadNotifications(notifications.filter((n) => n.unread).map((n) => n.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {!allRead && (
            <button
              onClick={markAllRead}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => {
            const isUnread = notification.unread && !readNotifications.includes(notification.id);
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-colors ₦{
                  isUnread ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ₦{notification.color}`}>
                  <notification.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUnread && (
                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      )}
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
