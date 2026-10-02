import { useEffect, useState } from 'react';
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
import api from '../../services/api';

const typeIcons: Record<string, { icon: typeof Bell; color: string }> = {
  appointment: { icon: Calendar, color: 'bg-blue-100 text-blue-600' },
  prescription: { icon: Pill, color: 'bg-purple-100 text-purple-600' },
  bill: { icon: FileText, color: 'bg-amber-100 text-amber-600' },
  lab: { icon: FlaskConical, color: 'bg-green-100 text-green-600' },
  leave_approved: { icon: CheckCircle, color: 'bg-green-100 text-green-600' },
  leave_rejected: { icon: CheckCircle, color: 'bg-red-100 text-red-600' },
  account: { icon: UserPlus, color: 'bg-indigo-100 text-indigo-600' },
  password: { icon: Key, color: 'bg-gray-100 text-gray-600' },
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(date).toLocaleDateString();
}

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/patient/notifications');
      setNotifications(res.data.notifications || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await api.put(`/patient/notifications/${id}/read`);
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.put('/patient/notifications/read-all');
    } catch {
      // ignore
    }
  };

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {hasUnread && (
            <button
              onClick={markAllRead}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-gray-500">Loading notifications…</p>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        {!loading && !error && notifications.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">
            No notifications.
          </div>
        )}

        <div className="space-y-3">
          {notifications.map((notification) => {
            const meta =
              typeIcons[notification.type] ||
              typeIcons[notification.title?.toLowerCase?.() || ''] ||
              { icon: Bell, color: 'bg-blue-100 text-blue-600' };
            const Icon = meta.icon;
            const isUnread = !notification.read;
            return (
              <div
                key={notification._id}
                onClick={() => isUnread && markRead(notification._id)}
                className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-colors ${
                  isUnread ? 'border-blue-200 bg-blue-50/30 cursor-pointer' : 'border-gray-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUnread && <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      <span className="text-xs text-gray-400">{timeAgo(notification.createdAt)}</span>
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
