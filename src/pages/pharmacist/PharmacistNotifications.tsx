import { useState, useEffect, useCallback } from 'react';
import { Bell, Package, Clock, AlertTriangle, FileText, CheckCircle, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const typeIconMap: Record<string, { icon: any; color: string }> = {
  alert: { icon: AlertTriangle, color: 'bg-red-500' },
  prescription: { icon: ShoppingCart, color: 'bg-blue-500' },
  lab: { icon: FileText, color: 'bg-purple-500' },
  appointment: { icon: Clock, color: 'bg-orange-500' },
  billing: { icon: Package, color: 'bg-green-500' },
  system: { icon: Bell, color: 'bg-gray-500' },
  message: { icon: CheckCircle, color: 'bg-cyan-500' },
  default: { icon: Bell, color: 'bg-indigo-500' },
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

export default function PharmacistNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Notifications" icon={Bell} />

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-sm text-gray-400">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const mapping = typeIconMap[n.type] || typeIconMap.default;
              const Icon = mapping.icon;
              return (
                <div
                  key={n._id}
                  onClick={() => markOneRead(n)}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    !n.read ? 'ring-1 ring-blue-100 bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${mapping.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h3>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />}
                      </div>
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
