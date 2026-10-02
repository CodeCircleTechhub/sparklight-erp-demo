import { Bell, UserPlus, Calendar, AlertTriangle, DollarSign, Stethoscope, Pill } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import GeneralNotificationForm from '../../components/shared/GeneralNotificationForm';

interface Notification {
  _id?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const typeIconMap: Record<string, { icon: any; color: string }> = {
  patient: { icon: UserPlus, color: 'bg-blue-500' },
  appointment: { icon: Calendar, color: 'bg-green-500' },
  stock: { icon: AlertTriangle, color: 'bg-amber-500' },
  payment: { icon: DollarSign, color: 'bg-emerald-500' },
  lab: { icon: Stethoscope, color: 'bg-violet-500' },
  prescription: { icon: Pill, color: 'bg-cyan-500' },
  default: { icon: Bell, color: 'bg-gray-500' },
};

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

export default function ManagerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/system/notifications');
      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.put('/system/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark notifications as read');
    } finally {
      setMarkingAll(false);
    }
  };

  const markOneRead = async (n: Notification, index: number) => {
    if (n.read || !n._id) return;
    try {
      await api.put(`/system/notifications/${n._id}/read`);
      setNotifications((prev) => prev.map((item, i) => (i === index ? { ...item, read: true } : item)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Notifications"
          icon={Bell}
          action={
            <button
              onClick={markAllRead}
              disabled={markingAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Bell className="w-4 h-4" />
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          }
        />

        <GeneralNotificationForm onCreated={fetchNotifications} />

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading notifications...</div>
        ) : (
          <div className="space-y-3">
            {notifications.length === 0 && (
              <div className="text-center py-12 text-gray-400">No notifications</div>
            )}
            {notifications.map((n, i) => {
              const mapping = typeIconMap[n.type] || typeIconMap.default;
              const Icon = mapping.icon;
              return (
                <div
                  key={n._id ?? i}
                  onClick={() => markOneRead(n, i)}
                  className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow ${
                    n.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${mapping.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{n.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatTime(n.createdAt)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
