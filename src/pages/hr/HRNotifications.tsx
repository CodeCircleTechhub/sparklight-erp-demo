import { useState, useEffect } from 'react';
import { Bell, UserPlus, CheckCircle, CalendarOff, Clock, FileText, AlertTriangle, MessageSquare, Loader2, CheckCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import GeneralNotificationForm from '../../components/shared/GeneralNotificationForm';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'user_added': return UserPlus;
    case 'leave_approved': return CheckCircle;
    case 'leave_request': return CalendarOff;
    case 'payroll': return Clock;
    case 'document_expiry': return AlertTriangle;
    case 'training': return FileText;
    case 'application': return UserPlus;
    case 'comment': return MessageSquare;
    default: return Bell;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'user_added': return 'bg-emerald-500';
    case 'leave_approved': return 'bg-[#3b82f6]';
    case 'leave_request': return 'bg-amber-500';
    case 'payroll': return 'bg-red-500';
    case 'document_expiry': return 'bg-amber-500';
    case 'training': return 'bg-purple-500';
    case 'application': return 'bg-emerald-500';
    case 'comment': return 'bg-cyan-500';
    default: return 'bg-gray-500';
  }
};

const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function HRNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/system/notifications');
      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    setMarkingRead(true);
    try {
      await api.put('/system/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silent fail
    } finally {
      setMarkingRead(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3b82f6] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-[#3b82f6] hover:underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <PageHeader title="Notifications" icon={Bell} />
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              {markingRead ? 'Marking...' : `Mark All Read (${unreadCount})`}
            </button>
          )}
        </div>

        <div className="mb-6">
          <GeneralNotificationForm onCreated={fetchNotifications} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="divide-y divide-gray-50">
            {notifications.map((n) => {
              const Icon = getIconForType(n.type);
              const color = getColorForType(n.type);
              return (
                <div key={n._id} className={`p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}>
                  <div className={`${color} p-2.5 rounded-lg flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h3>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-[#3b82f6] flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{formatTime(n.createdAt)}</span>
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">No notifications</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
