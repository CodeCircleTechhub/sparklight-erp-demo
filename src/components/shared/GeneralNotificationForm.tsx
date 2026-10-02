import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import api from '../../services/api';

const STAFF_ROLES = [
  'receptionist', 'customer-care', 'senior-customer-care', 'doctor', 'nurse',
  'laboratory', 'pharmacist', 'accountant', 'hr', 'manager', 'super-admin',
];

const NOTIFICATION_TYPES = [
  { value: 'announcement', label: 'General announcement' },
  { value: 'meeting', label: 'Meeting notice' },
  { value: 'alert', label: 'Urgent alert' },
];

export default function GeneralNotificationForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('announcement');
  const [scope, setScope] = useState<'all' | 'role'>('all');
  const [role, setRole] = useState('nurse');
  const [sendEmail, setSendEmail] = useState(true);
  const [alsoAlert, setAlsoAlert] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/system/notifications', {
        title: title.trim(),
        message: message.trim(),
        type,
        audience: scope === 'role' ? 'role' : 'all',
        role: scope === 'role' ? role : '',
        sendEmail,
        alsoAlertEmail: alsoAlert,
      });
      setSuccess(
        data.message ||
          `Notification published${data.emailsSent ? ` and emailed to ${data.emailsSent} staff` : ''}`
      );
      setTitle('');
      setMessage('');
      onCreated?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish notification');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Send className="w-4 h-4 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Send a general notification</h2>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        Published to staff dashboards instantly. Meetings and alerts can also be e-mailed to every recipient.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="e.g. Staff meeting on Friday at 10:00 AM"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {NOTIFICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Details everyone should see…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Audience</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as 'all' | 'role')}
            className={inputClass}
          >
            <option value="all">All staff</option>
            <option value="role">A specific role</option>
          </select>
        </div>
        {scope === 'role' && (
          <div>
            <label className={labelClass}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>{r.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Also e-mail recipients</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={alsoAlert} onChange={(e) => setAlsoAlert(e.target.checked)} />
            <span>Copy the super-admin alert inbox</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Publish notification
        </button>
      </div>
    </form>
  );
}
