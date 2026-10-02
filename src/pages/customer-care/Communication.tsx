import { useState, useEffect, useCallback } from 'react';
import {
  Send, CheckCheck, Eye, AlertCircle, Search, Filter,
  Plus, Loader2, Pencil, Trash2, X,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const statusColors: Record<string, string> = {
  Read: 'bg-green-100 text-green-800',
  Delivered: 'bg-blue-100 text-blue-800',
  Sent: 'bg-gray-100 text-gray-800',
  Failed: 'bg-red-100 text-red-800',
};

const typeColors: Record<string, string> = {
  SMS: 'bg-amber-100 text-amber-800',
  Email: 'bg-blue-100 text-blue-800',
  Push: 'bg-purple-100 text-purple-800',
};

const channels = ['SMS', 'Email', 'Push'];
const statuses = ['Sent', 'Delivered', 'Read', 'Failed'];

export default function Communication() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0, read: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [actionId, setActionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({
    patientId: '',
    channel: 'SMS',
    subject: '',
    body: '',
    status: 'Sent',
  });

  const fetchMessages = useCallback(async (q?: string, ch?: string, st?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (q) params.search = q;
      if (ch) params.channel = ch;
      if (st) params.status = st;
      const { data } = await api.get('/customer-care/communications', { params });
      setMessages(data.messages || []);
      setStats(data.stats || { total: 0, delivered: 0, read: 0, failed: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    api
      .get('/patients')
      .then(({ data }) => setPatients(data.patients || []))
      .catch(() => setPatients([]));
  }, [fetchMessages]);

  useEffect(() => {
    const t = setTimeout(
      () =>
        fetchMessages(
          search.trim() || undefined,
          channelFilter || undefined,
          statusFilter || undefined
        ),
      350
    );
    return () => clearTimeout(t);
  }, [search, channelFilter, statusFilter, fetchMessages]);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setForm({ patientId: '', channel: 'SMS', subject: '', body: '', status: 'Sent' });
    setShowForm(true);
  };

  const openEdit = (m: any) => {
    setEditing(m);
    setFormError('');
    setForm({
      patientId: m.patient?._id || '',
      channel: m.channel || m.type || 'SMS',
      subject: m.subject || '',
      body: m.body || '',
      status: m.status || 'Sent',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim()) {
      setFormError('Subject is required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) {
        await api.put(`/customer-care/communications/${editing._id}`, form);
      } else {
        await api.post('/customer-care/communications', form);
      }
      setShowForm(false);
      await fetchMessages(search.trim() || undefined, channelFilter || undefined, statusFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save message');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    setError('');
    try {
      await api.put(`/customer-care/communications/${id}`, { status });
      await fetchMessages(search.trim() || undefined, channelFilter || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionId('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message record?')) return;
    setActionId(id);
    try {
      await api.delete(`/customer-care/communications/${id}`);
      await fetchMessages(search.trim() || undefined, channelFilter || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete message');
    } finally {
      setActionId('');
    }
  };

  const statList = [
    { label: 'Messages Sent', value: stats.total, icon: Send, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Delivered', value: stats.delivered, icon: CheckCheck, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Read', value: stats.read, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Failed', value: stats.failed, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const canWrite = ['customer-care', 'senior-customer-care', 'super-admin', 'manager'].includes(user?.role || '');
  const canDelete = ['super-admin', 'manager', 'senior-customer-care'].includes(user?.role || '');
  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Communication"
        description="Manage patient communications and notifications"
        action={
          canWrite ? (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Send Message
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statList.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All channels</option>
              {channels.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No messages found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Message ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sent Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {messages.map((msg) => {
                  const busy = actionId === msg._id;
                  const type = msg.channel || msg.type;
                  return (
                    <tr key={msg._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{msg.messageId || msg.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{msg.patientName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-700'}`}>
                          {type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{msg.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {msg.sentAt || msg.sentDate
                          ? new Date(msg.sentAt || msg.sentDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[msg.status] || 'bg-gray-100 text-gray-700'}`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <select
                            value={msg.status}
                            disabled={busy}
                            onChange={(e) => updateStatus(msg._id, e.target.value)}
                            className="border border-gray-200 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => openEdit(msg)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(msg._id)}
                              disabled={busy}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Message' : 'Send Message'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className={labelClass}>Patient</label>
                <select
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">All patients / Broadcast</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.surname} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Channel</label>
                  <select
                    value={form.channel}
                    onChange={(e) => setForm({ ...form, channel: e.target.value })}
                    className={inputClass}
                  >
                    {channels.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputClass}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label className={labelClass}>Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={inputClass}
                    required
                    placeholder="Message subject"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Body</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={4}
                  className={inputClass}
                  placeholder="Message body..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
