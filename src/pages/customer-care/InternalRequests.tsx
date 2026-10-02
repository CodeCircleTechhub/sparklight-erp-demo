import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Search, Filter, Plus, Loader2, X,
  AlertCircle, Eye, Send, CheckCircle, Clock,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-amber-100 text-amber-800',
  Low: 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Responded: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-700',
};

const statuses = ['Pending', 'In Progress', 'Responded', 'Closed'];
const priorities = ['High', 'Medium', 'Low'];
const categories = ['Billing', 'Medical', 'Pharmacy', 'Laboratory', 'Appointment', 'Service', 'Other'];

export default function InternalRequests() {
  const { user } = useAuth();
  const canWrite = ['customer-care', 'senior-customer-care', 'super-admin', 'manager', 'receptionist', 'doctor', 'nurse', 'laboratory', 'pharmacist', 'accountant', 'hr'].includes(user?.role || '');

  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, open: 0, responded: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toDeptFilter, setToDeptFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [actionId, setActionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [responseText, setResponseText] = useState('');
  const [departments, setDepartments] = useState<any[]>([]);
  const [form, setForm] = useState({
    caseId: '',
    subject: '',
    description: '',
    category: 'Service',
    priority: 'Medium',
    toDepartment: '',
    fromDepartment: '',
  });

  const fetchList = useCallback(async (q?: string, st?: string, dept?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { limit: 100 };
      if (q) params.search = q;
      if (st) params.status = st;
      if (dept) params.toDepartment = dept;
      const [listRes, dashRes] = await Promise.all([
        api.get('/cases/internal-requests', { params }),
        api.get('/cases/dashboard'),
      ]);
      setItems(listRes.data.items || []);
      setStats(dashRes.data.internalRequests || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load internal requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
    api.get('/cases/departments').then(({ data }) => setDepartments(data.items || [])).catch(() => setDepartments([]));
  }, [fetchList]);

  useEffect(() => {
    const t = setTimeout(() => fetchList(search.trim() || undefined, statusFilter || undefined, toDeptFilter || undefined), 350);
    return () => clearTimeout(t);
  }, [search, statusFilter, toDeptFilter, fetchList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.toDepartment) {
      setFormError('Subject and target department are required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/cases/internal-requests', form);
      setShowForm(false);
      setForm({ caseId: '', subject: '', description: '', category: 'Service', priority: 'Medium', toDepartment: '', fromDepartment: '' });
      await fetchList(search.trim() || undefined, statusFilter || undefined, toDeptFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const updateRequest = async (id: string, body: any) => {
    setActionId(id);
    setError('');
    try {
      await api.put(`/cases/internal-requests/${id}`, body);
      await fetchList(search.trim() || undefined, statusFilter || undefined, toDeptFilter || undefined);
      if (showDetail && showDetail._id === id) {
        const { data } = await api.get(`/cases/internal-requests/${id}`);
        setShowDetail(data.item);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update request');
    } finally {
      setActionId('');
    }
  };

  const openDetail = async (row: any) => {
    try {
      const { data } = await api.get(`/cases/internal-requests/${row._id}`);
      setShowDetail(data.item);
    } catch {
      setShowDetail(row);
    }
    setResponseText('');
  };

  const statList = [
    { label: 'Total Requests', value: stats.total || 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: stats.pending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Open', value: stats.open || 0, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Responded', value: stats.responded || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Department Requests"
        description="Request information or action from hospital departments"
        action={
          canWrite ? (
            <button
              onClick={() => { setFormError(''); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Request
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statList.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
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
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
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
            <select
              value={toDeptFilter}
              onChange={(e) => setToDeptFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All departments</option>
              {departments.map((d: any) => (
                <option key={d._id || d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading requests...</span>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No internal requests found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Request ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Case</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From → To</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((row) => {
                  const busy = actionId === row._id;
                  return (
                    <tr key={row._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-orange-600">{row.requestId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{row.caseId || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{row.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {row.fromDepartment} → <span className="font-medium">{row.toDepartment}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[row.priority] || 'bg-gray-100 text-gray-700'}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[row.status] || 'bg-gray-100 text-gray-700'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <select
                            value={row.status}
                            disabled={busy || !canWrite}
                            onChange={(e) => updateRequest(row._id, { status: e.target.value })}
                            className="border border-gray-200 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => openDetail(row)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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
              <h2 className="text-xl font-bold text-gray-900">New Internal Request</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className={labelClass}>Subject *</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} required placeholder="What do you need from the department?" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className={labelClass}>To department *</label>
                  <select value={form.toDepartment} onChange={(e) => setForm({ ...form, toDepartment: e.target.value })} className={inputClass} required>
                    <option value="">Select…</option>
                    {departments.map((d: any) => (
                      <option key={d._id || d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputClass}>
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>From department</label>
                <input
                  type="text"
                  value={form.fromDepartment}
                  onChange={(e) => setForm({ ...form, fromDepartment: e.target.value })}
                  className={inputClass}
                  placeholder="Defaults to your department / Customer Care"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{showDetail.requestId}</h2>
                <p className="text-sm text-gray-500">{showDetail.subject}</p>
              </div>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[showDetail.status] || 'bg-gray-100 text-gray-700'}`}>
                  {showDetail.status}
                </span>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[showDetail.priority] || 'bg-gray-100 text-gray-700'}`}>
                  {showDetail.priority}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">From</p>
                  <p className="font-medium text-gray-900">{showDetail.fromDepartment}</p>
                </div>
                <div>
                  <p className="text-gray-500">To</p>
                  <p className="font-medium text-gray-900">{showDetail.toDepartment}</p>
                </div>
                <div>
                  <p className="text-gray-500">Requested by</p>
                  <p className="font-medium text-gray-900">{showDetail.requestedByName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Linked case</p>
                  <p className="font-medium text-gray-900">{showDetail.caseId || '—'}</p>
                </div>
              </div>

              {showDetail.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{showDetail.description}</p>
                </div>
              )}

              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-700 uppercase mb-1">Department response</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {showDetail.response || 'Awaiting department response…'}
                </p>
                {showDetail.respondedByName && (
                  <p className="text-xs text-gray-500 mt-1">By {showDetail.respondedByName}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Timeline</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(showDetail.timeline || []).slice().reverse().map((t: any, i: number) => (
                    <div key={i} className="border-l-2 border-orange-200 pl-3 py-1">
                      <p className="text-sm font-medium text-gray-800">{t.action}</p>
                      <p className="text-xs text-gray-500">
                        {t.byName || 'System'}
                        {t.at ? ` · ${new Date(t.at).toLocaleString()}` : ''}
                      </p>
                      {t.note && <p className="text-xs text-gray-600 mt-0.5">{t.note}</p>}
                    </div>
                  ))}
                  {(!showDetail.timeline || showDetail.timeline.length === 0) && (
                    <p className="text-sm text-gray-400">No activity yet</p>
                  )}
                </div>
              </div>

              {canWrite && showDetail.status !== 'Closed' && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <label className={labelClass}>Respond / update</label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={3}
                    className={inputClass}
                    placeholder="Department response or status note..."
                  />
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => updateRequest(showDetail._id, { response: responseText, status: 'In Progress' })}
                      disabled={!responseText.trim() && !responseText ? false : actionId === showDetail._id}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"
                    >
                      <Clock className="w-4 h-4" /> In Progress
                    </button>
                    <button
                      onClick={() => updateRequest(showDetail._id, { response: responseText, status: 'Responded' })}
                      disabled={actionId === showDetail._id}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"
                    >
                      <Send className="w-4 h-4" /> Send Response
                    </button>
                    <button
                      onClick={() => updateRequest(showDetail._id, { response: responseText, status: 'Closed' })}
                      disabled={actionId === showDetail._id}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
