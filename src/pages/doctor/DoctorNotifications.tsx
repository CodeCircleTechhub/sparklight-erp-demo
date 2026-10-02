import { useCallback, useEffect, useState } from 'react';
import {
  Bell, Calendar, Clock, AlertTriangle, FileText, CheckCircle, UserPlus, Stethoscope,
  Loader2, MessageSquare, Pill, Wallet, Megaphone,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const typeMeta: Record<string, { icon: typeof Bell; color: string }> = {
  appointment: { icon: Calendar, color: 'bg-blue-500' },
  prescription: { icon: Pill, color: 'bg-green-500' },
  billing: { icon: Wallet, color: 'bg-emerald-500' },
  system: { icon: Bell, color: 'bg-gray-500' },
  staff: { icon: UserPlus, color: 'bg-indigo-500' },
  lab: { icon: FileText, color: 'bg-purple-500' },
  'customer-care': { icon: MessageSquare, color: 'bg-teal-500' },
  'case-management': { icon: AlertTriangle, color: 'bg-red-500' },
  announcement: { icon: Megaphone, color: 'bg-yellow-500' },
  alert: { icon: AlertTriangle, color: 'bg-red-500' },
  leave_request: { icon: Clock, color: 'bg-amber-500' },
  leave_approved: { icon: CheckCircle, color: 'bg-green-500' },
  leave_rejected: { icon: AlertTriangle, color: 'bg-red-500' },
  meeting: { icon: Calendar, color: 'bg-indigo-500' },
};

const defaultMeta = { icon: Stethoscope, color: 'bg-blue-500' };

const ago = (d?: string) => {
  const when = d ? new Date(d).getTime() : Date.now();
  const mins = Math.floor((Date.now() - when) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export default function DoctorNotifications() {
  const [items, setItems] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/system/notifications');
      setItems(data.notifications || []);
      setUnread(data.unread || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markAllRead = async () => {
    try {
      await api.put('/system/notifications/read-all');
      await fetchData();
    } catch {
      setError('Could not mark notifications as read');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader title="Notifications" icon={Bell} />

      {unread > 0 && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
          <span>{unread} unread notification{unread === 1 ? '' : 's'}</span>
          <button onClick={markAllRead} className="font-medium hover:underline">
            Mark all as read
          </button>
        </div>
      )}

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading notifications...
        </div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((n, i) => {
            const meta = typeMeta[n.type] || defaultMeta;
            const Icon = meta.icon;
            return (
              <div
                key={n._id || i}
                className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow ${
                  n.read ? 'border-gray-100 opacity-70' : 'border-blue-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${meta.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{n.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{ago(n.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
