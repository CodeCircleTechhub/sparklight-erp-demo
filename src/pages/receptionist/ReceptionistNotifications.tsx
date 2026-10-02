import { useState, useEffect, useCallback } from 'react';
import { Bell, UserPlus, Calendar, FileText, CheckCircle, Loader2, AlertCircle, CheckCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const typeIconMap: Record<string, { icon: any; color: string }> = {
  appointment: { icon: Calendar, color: 'bg-blue-500' },
  patient: { icon: UserPlus, color: 'bg-emerald-500' },
  staff: { icon: UserPlus, color: 'bg-violet-500' },
  system: { icon: Bell, color: 'bg-gray-500' },
  billing: { icon: FileText, color: 'bg-amber-500' },
  lab: { icon: FileText, color: 'bg-cyan-500' },
  prescription: { icon: FileText, color: 'bg-pink-500' },
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

export default function ReceptionistNotifications() {
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
      setNotifications((prev) =>
        prev.map((item) => (item._id === n._id ? { ...item, read: true } : item))
      );
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Notifications"
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500 text-sm">Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No notifications yet</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const mapping = typeIconMap[n.type] || typeIconMap.default;
              const Icon = mapping.icon;
              return (
                <div
                  key={n._id}
                  onClick={() => markOneRead(n)}
                  className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow ${
                    n.read ? 'border-gray-100' : 'border-blue-200 bg-blue-50/30 cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${mapping.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{n.title}</h3>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatTime(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
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
