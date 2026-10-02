import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Calendar, DollarSign, Users, AlertTriangle, FileText, UserPlus, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import GeneralNotificationForm from '../../components/shared/GeneralNotificationForm';

interface Notification {
  _id?: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const typeIcon = (type: string) => {
  switch (type) {
    case 'appointment': return { icon: Calendar, color: 'bg-blue-100 text-blue-600' };
    case 'payment': return { icon: DollarSign, color: 'bg-green-100 text-green-600' };
    case 'staff': return { icon: Users, color: 'bg-purple-100 text-purple-600' };
    case 'alert': return { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' };
    case 'lab': return { icon: FileText, color: 'bg-red-100 text-red-600' };
    case 'patient': return { icon: UserPlus, color: 'bg-blue-100 text-blue-600' };
    default: return { icon: Bell, color: 'bg-gray-100 text-gray-600' };
  }
};

const formatTime = (ts: string) => {
  try {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } catch {
    return ts;
  }
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/system/notifications');
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unread ?? 0);
    } catch {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await api.put('/system/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      console.error('Failed to mark notifications as read');
    }
  };

  const markOneRead = async (notif: Notification, index: number) => {
    if (notif.read || !notif._id) return;
    try {
      await api.put(`/system/notifications/${notif._id}/read`);
      setNotifications((prev) => prev.map((n, i) => (i === index ? { ...n, read: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      console.error('Failed to mark notification as read');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        icon={Bell}
        description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        action={
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        }
      />

      <GeneralNotificationForm onCreated={fetchNotifications} />

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No notifications</div>
        ) : (
          notifications.map((notif, i) => {
            const { icon: Icon, color } = typeIcon(notif.type);
            return (
              <div
                key={notif._id ?? i}
                onClick={() => markOneRead(notif, i)}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  !notif.read ? 'bg-blue-50/50 cursor-pointer' : ''
                }`}
              >
                <div className={`${color} rounded-lg p-2.5 flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
