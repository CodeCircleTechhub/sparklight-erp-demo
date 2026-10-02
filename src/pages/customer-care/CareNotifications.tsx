import { useState, useEffect, useCallback } from 'react';
import { Bell, MessageSquare, AlertTriangle, Calendar, Clock, CheckCircle, Loader2, AlertCircle, CheckCheck, Info, Send, Users, Mail } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const typeIconMap: Record<string, { icon: any; color: string }> = {
  'customer-care': { icon: MessageSquare, color: 'bg-blue-500' },
  appointment: { icon: Calendar, color: 'bg-violet-500' },
  billing: { icon: AlertTriangle, color: 'bg-amber-500' },
  system: { icon: Info, color: 'bg-gray-500' },
  prescription: { icon: CheckCircle, color: 'bg-green-500' },
  lab: { icon: CheckCircle, color: 'bg-cyan-500' },
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

export default function CareNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);
  const [tab, setTab] = useState<'inbox' | 'patients' | 'management'>('inbox');

  const [pForm, setPForm] = useState({ title: '', message: '', sendEmail: true });
  const [mForm, setMForm] = useState({ title: '', message: '', sendEmail: false });
  const [busy, setBusy] = useState('');
  const [result, setResult] = useState('');

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

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const sendToPatients = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pForm.title.trim()) return;
    setBusy('patients');
    setResult('');
    try {
      const { data } = await api.post('/customer-care/notifications/patients', {
        title: pForm.title.trim(),
        message: pForm.message.trim(),
        sendEmail: pForm.sendEmail,
      });
      setPForm({ title: '', message: '', sendEmail: true });
      setResult(data.message || 'Broadcast sent to all patients');
    } catch (err: any) {
      setResult(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setBusy('');
    }
  };

  const sendToManagement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mForm.title.trim()) return;
    setBusy('management');
    setResult('');
    try {
      const { data } = await api.post('/customer-care/notifications/management', {
        title: mForm.title.trim(),
        message: mForm.message.trim(),
        sendEmail: mForm.sendEmail,
      });
      setMForm({ title: '', message: '', sendEmail: false });
      setResult(data.message || 'Notification sent to management');
    } catch (err: any) {
      setResult(err.response?.data?.message || 'Failed to notify management');
    } finally {
      setBusy('');
    }
  };

  const TABS: { key: typeof tab; label: string }[] = [
    { key: 'inbox', label: 'My inbox' },
    { key: 'patients', label: 'Broadcast to patients' },
    { key: 'management', label: 'Notify management' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with latest activities"
        icon={Bell}
        action={
          tab === 'inbox' ? (
            <button
              onClick={markAllRead}
              disabled={markingAll || unread === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-2 flex-wrap border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setResult('');
            }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {result && (
        <div
          className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
            result.startsWith('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
          }`}
        >
          {result.startsWith('Failed') ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {result}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {tab === 'patients' && (
        <form onSubmit={sendToPatients} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Broadcast to all patients</h2>
          </div>
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={pForm.title}
              onChange={(e) => setPForm({ ...pForm, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. Clinic opens at 8:00 AM tomorrow"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea
              value={pForm.message}
              onChange={(e) => setPForm({ ...pForm, message: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="Message shown in every patient portal"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={pForm.sendEmail}
                onChange={(e) => setPForm({ ...pForm, sendEmail: e.target.checked })}
              />
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Also e-mail patients</span>
            </label>
            <button
              type="submit"
              disabled={busy === 'patients' || !pForm.title.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {busy === 'patients' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send broadcast
            </button>
          </div>
        </form>
      )}

      {tab === 'management' && (
        <form onSubmit={sendToManagement} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notify management</h2>
          </div>
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={mForm.title}
              onChange={(e) => setMForm({ ...mForm, title: e.target.value })}
              className={inputClass}
              placeholder="e.g. Two complaints need review"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea
              value={mForm.message}
              onChange={(e) => setMForm({ ...mForm, message: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="What super-admin / managers / HR should know"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={mForm.sendEmail}
                onChange={(e) => setMForm({ ...mForm, sendEmail: e.target.checked })}
              />
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Also e-mail them</span>
            </label>
            <button
              type="submit"
              disabled={busy === 'management' || !mForm.title.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50"
            >
              {busy === 'management' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send to management
            </button>
          </div>
        </form>
      )}

      {tab === 'inbox' && (
      <div className="bg-white rounded-xl border border-gray-200">
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
      )}
    </div>
  );
}
