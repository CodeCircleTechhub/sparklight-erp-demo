import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Clock, CheckCircle, Search, Filter, AlertCircle,
  Plus, Loader2, Pencil, Trash2, X, MessageSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  Investigating: 'bg-orange-100 text-orange-800',
  Resolved: 'bg-green-100 text-green-800',
};

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Pending', 'Investigating', 'Resolved'];
const categories = ['Service', 'Medical', 'Staff', 'Billing', 'Facilities', 'Wait Time', 'Other'];

export default function Complaints() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, investigating: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [actionId, setActionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({
    patientId: '',
    issue: '',
    description: '',
    priority: 'Medium',
    category: 'Service',
    notes: '',
    resolution: '',
    status: 'Pending',
  });

  const fetchComplaints = useCallback(async (q?: string, st?: string, pr?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (q) params.search = q;
      if (st) params.status = st;
      if (pr) params.priority = pr;
      const { data } = await api.get('/customer-care/complaints', { params });
      setComplaints(data.complaints || []);
      setStats(data.stats || { total: 0, pending: 0, investigating: 0, resolved: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
    api
      .get('/patients')
      .then(({ data }) => setPatients(data.patients || []))
      .catch(() => setPatients([]));
  }, [fetchComplaints]);

  useEffect(() => {
    const t = setTimeout(
      () =>
        fetchComplaints(
          search.trim() || undefined,
          statusFilter || undefined,
          priorityFilter || undefined
        ),
      350
    );
    return () => clearTimeout(t);
  }, [search, statusFilter, priorityFilter, fetchComplaints]);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setForm({ patientId: '', issue: '', description: '', priority: 'Medium', category: 'Service', notes: '', resolution: '', status: 'Pending' });
    setShowForm(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setFormError('');
    setForm({
      patientId: c.patient?._id || '',
      issue: c.issue || '',
      description: c.description || '',
      priority: c.priority || 'Medium',
      category: c.category || 'Service',
      notes: c.notes || '',
      resolution: c.resolution || '',
      status: c.status || 'Pending',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.issue.trim()) {
      setFormError('Issue is required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) {
        await api.put(`/customer-care/complaints/${editing._id}`, form);
      } else {
        await api.post('/customer-care/complaints', form);
      }
      setShowForm(false);
      await fetchComplaints(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    setError('');
    try {
      await api.put(`/customer-care/complaints/${id}`, { status });
      await fetchComplaints(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionId('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this complaint?')) return;
    setActionId(id);
    try {
      await api.delete(`/customer-care/complaints/${id}`);
      await fetchComplaints(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete complaint');
    } finally {
      setActionId('');
    }
  };

  const statList = [
    { label: 'Total Complaints', value: stats.total, icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Investigating', value: stats.investigating, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const canDelete = user?.role === 'super-admin' || user?.role === 'manager';
  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaints Management"
        description="Track and resolve patient complaints"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Complaint
          </button>
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
              placeholder="Search complaints..."
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
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All priorities</option>
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading complaints...</span>
            </div>
          ) : complaints.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No complaints found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Complaint ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Issue</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {complaints.map((cmp) => {
                  const busy = actionId === cmp._id;
                  return (
                    <tr key={cmp._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{cmp.complaintId || cmp.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{cmp.patientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{cmp.issue}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[cmp.priority] || 'bg-gray-100 text-gray-700'}`}>
                          {cmp.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {cmp.createdAt ? new Date(cmp.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[cmp.status] || 'bg-gray-100 text-gray-700'}`}>
                          {cmp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <select
                            value={cmp.status}
                            disabled={busy}
                            onChange={(e) => updateStatus(cmp._id, e.target.value)}
                            className="border border-gray-200 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {cmp.patient?._id && (
                            <button
                              onClick={() => navigate(`/chat?patient=${cmp.patient._id}`)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title={`Chat with ${cmp.patientName}`}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(cmp)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(cmp._id)}
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
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Complaint' : 'New Complaint'}</h2>
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
                  <option value="">General / Walk-in</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.surname} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Issue *</label>
                <input
                  type="text"
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  className={inputClass}
                  required
                  placeholder="Brief issue summary"
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className={inputClass}
                  placeholder="Detailed description..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className={inputClass}
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputClass}
                  >
                    {categories.map((c) => (
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
              </div>
              <div>
                <label className={labelClass}>Resolution</label>
                <textarea
                  value={form.resolution}
                  onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                  rows={2}
                  className={inputClass}
                  placeholder="Resolution notes..."
                />
              </div>
              <div>
                <label className={labelClass}>Internal Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className={inputClass}
                  placeholder="Notes for staff..."
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
                  {editing ? 'Save Changes' : 'Create Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
