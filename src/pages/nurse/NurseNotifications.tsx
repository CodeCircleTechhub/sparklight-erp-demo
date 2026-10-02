import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Info,
  Pill,
  UserPlus,
  Loader2,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const typeIconMap: Record<string, { icon: any; color: string }> = {
  prescription: { icon: Pill, color: 'bg-amber-500' },
  appointment: { icon: Clock, color: 'bg-violet-500' },
  billing: { icon: AlertTriangle, color: 'bg-red-500' },
  system: { icon: Info, color: 'bg-gray-500' },
  staff: { icon: UserPlus, color: 'bg-blue-500' },
  lab: { icon: CheckCircle, color: 'bg-cyan-500' },
  alert: { icon: AlertTriangle, color: 'bg-red-500' },
  default: { icon: Bell, color: 'bg-blue-500' },
};

function formatTime(dateStr: string) {
  if (!dateStr) return '';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } catch {
    return dateStr;
  }
}

export default function NurseNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/system/notifications');
      setNotifications(data.notifications || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markOneRead = async (n: any) => {
    if (n.read || !n._id) return;
    try {
      await api.put(`/system/notifications/${n._id}/read`);
      setNotifications((prev) => prev.map((item) => (item._id === n._id ? { ...item, read: true } : item)));
    } catch {
      /* ignore */
    }
  };

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

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with ward activities"
        icon={Bell}
        action={
          <button
            onClick={markAllRead}
            disabled={markingAll || unread === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            {markingAll ? 'Marking...' : 'Mark all as read'}
          </button>
        }
      />

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">All Notifications</h3>
          </div>
          <span className="text-sm text-blue-600">{unread} unread</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500 text-sm">Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No notifications yet</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((n) => {
              const mapping = typeIconMap[n.type] || typeIconMap.default;
              const Icon = mapping.icon;
              return (
                <div
                  key={n._id}
                  onClick={() => markOneRead(n)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg ${mapping.color} flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">{n.title}</h4>
                        {!n.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{formatTime(n.createdAt)}</span>
                      </div>
                    </div>
                    {!n.read && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
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
