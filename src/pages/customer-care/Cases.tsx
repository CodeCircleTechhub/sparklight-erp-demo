import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Search, Filter, Plus, Loader2, Pencil, Trash2, X,
  AlertCircle, CheckCircle, Clock, Eye, Send,
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
  New: 'bg-blue-100 text-blue-800',
  Assigned: 'bg-indigo-100 text-indigo-800',
  'In Progress': 'bg-amber-100 text-amber-800',
  'Waiting for Department': 'bg-orange-100 text-orange-800',
  'Waiting for Patient': 'bg-purple-100 text-purple-800',
  Escalated: 'bg-red-100 text-red-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-700',
};

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['New', 'Assigned', 'In Progress', 'Waiting for Department', 'Waiting for Patient', 'Escalated', 'Resolved', 'Closed'];
const categories = ['General', 'Billing', 'Medical', 'Pharmacy', 'Laboratory', 'Appointment', 'Service', 'Staff', 'Facilities', 'Wait Time', 'Other'];
const channels = ['Staff', 'Walk-in', 'Phone', 'Email', 'Contact Form', 'Patient Portal'];

export default function Cases() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, inProgress: 0, open: 0, highPriorityOpen: 0, mine: 0, resolved: 0, closed: 0, escalated: 0, waitingDepartment: 0, waitingPatient: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [editing, setEditing] = useState<any>(null);
  const [actionId, setActionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [note, setNote] = useState('');
  const [escalating, setEscalating] = useState(false);
  const [escalationForm, setEscalationForm] = useState({ subject: '', description: '', priority: 'High', departmentInvolved: '', customerCareAction: '' });
  const [requestForm, setRequestForm] = useState({ subject: '', description: '', toDepartment: '', priority: 'Medium', category: 'Service' });
  const [departments, setDepartments] = useState<any[]>([]);
  const [showRequest, setShowRequest] = useState(false);
  const [form, setForm] = useState({
    patient: '',
    subject: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    channel: 'Staff',
    contactEmail: '',
    contactPhone: '',
    department: '',
    assignedTo: '',
    resolution: '',
    status: 'New',
  });

  const canWrite = ['customer-care', 'senior-customer-care', 'super-admin', 'manager'].includes(user?.role || '');
  const canDelete = ['super-admin', 'senior-customer-care'].includes(user?.role || '');
  const canEscalate = ['customer-care', 'senior-customer-care', 'super-admin', 'manager'].includes(user?.role || '');

  const fetchCases = useCallback(async (q?: string, st?: string, pr?: string, mine?: boolean) => {
    setLoading(true);
    setError('');
    try {
      const params: any = { limit: 100 };
      if (q) params.search = q;
      if (st) params.status = st;
      if (pr) params.priority = pr;
      if (mine) params.mine = 'true';
      const [listRes, dashRes] = await Promise.all([
        api.get('/cases/cases', { params }),
        api.get('/cases/dashboard'),
      ]);
      setItems(listRes.data.items || []);
      setStats(dashRes.data.cases || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cases');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
    api.get('/patients').then(({ data }) => setPatients(data.patients || [])).catch(() => setPatients([]));
    api.get('/cases/assignable-staff').then(({ data }) => setStaff(data.items || [])).catch(() => setStaff([]));
    api.get('/cases/departments').then(({ data }) => setDepartments(data.items || [])).catch(() => setDepartments([]));
  }, [fetchCases]);

  useEffect(() => {
    const t = setTimeout(
      () => fetchCases(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined, mineOnly),
      350
    );
    return () => clearTimeout(t);
  }, [search, statusFilter, priorityFilter, mineOnly, fetchCases]);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setForm({ patient: '', subject: '', description: '', category: 'General', priority: 'Medium', channel: 'Staff', contactEmail: '', contactPhone: '', department: '', assignedTo: '', resolution: '', status: 'New' });
    setShowForm(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setFormError('');
    setForm({
      patient: c.patient?._id || c.patient || '',
      subject: c.subject || '',
      description: c.description || '',
      category: c.category || 'General',
      priority: c.priority || 'Medium',
      channel: c.channel || 'Staff',
      contactEmail: c.contactEmail || '',
      contactPhone: c.contactPhone || '',
      department: c.department || '',
      assignedTo: c.assignedTo?._id || c.assignedTo || '',
      resolution: c.resolution || '',
      status: c.status || 'New',
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
        await api.put(`/cases/cases/${editing._id}`, form);
      } else {
        await api.post('/cases/cases', form);
      }
      setShowForm(false);
      await fetchCases(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined, mineOnly);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save case');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    setError('');
    try {
      await api.put(`/cases/cases/${id}`, { status });
      await fetchCases(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined, mineOnly);
      if (showDetail && showDetail._id === id) {
        const { data } = await api.get(`/cases/cases/${id}`);
        setShowDetail(data.item);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionId('');
    }
  };

  const addNote = async (id: string) => {
    if (!note.trim()) return;
    setActionId(id);
    try {
      await api.put(`/cases/cases/${id}`, { note });
      setNote('');
      const { data } = await api.get(`/cases/cases/${id}`);
      setShowDetail(data.item);
      await fetchCases(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined, mineOnly);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setActionId('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this case and related escalations/requests?')) return;
    setActionId(id);
    try {
      await api.delete(`/cases/cases/${id}`);
      setShowDetail(null);
      await fetchCases(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined, mineOnly);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete case');
    } finally {
      setActionId('');
    }
  };

  const submitEscalation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationForm.subject.trim()) {
      setFormError('Escalation subject is required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/cases/escalations', {
        ...escalationForm,
        caseId: showDetail?._id || null,
      });
      setEscalating(false);
      setEscalationForm({ subject: '', description: '', priority: 'High', departmentInvolved: '', customerCareAction: '' });
      if (showDetail) {
        const { data } = await api.get(`/cases/cases/${showDetail._id}`);
        setShowDetail(data.item);
      }
      await fetchCases(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined, mineOnly);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to escalate');
    } finally {
      setSubmitting(false);
    }
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.subject.trim() || !requestForm.toDepartment) {
      setFormError('Subject and target department are required');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/cases/internal-requests', {
        ...requestForm,
        caseId: showDetail?._id || null,
      });
      setShowRequest(false);
      setRequestForm({ subject: '', description: '', toDepartment: '', priority: 'Medium', category: 'Service' });
      if (showDetail) {
        const { data } = await api.get(`/cases/cases/${showDetail._id}`);
        setShowDetail(data.item);
      }
      await fetchCases(search.trim() || undefined, statusFilter || undefined, priorityFilter || undefined, mineOnly);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (c: any) => {
    try {
      const { data } = await api.get(`/cases/cases/${c._id}`);
      setShowDetail(data.item);
    } catch {
      setShowDetail(c);
    }
  };

  const statList = [
    { label: 'Total Cases', value: stats.total || 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Open', value: stats.open || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'In Progress', value: stats.inProgress || 0, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'High Priority', value: stats.highPriorityOpen || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Escalated', value: stats.escalated || 0, icon: Send, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Resolved', value: stats.resolved || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Management"
        description="Track, assign, escalate and resolve patient cases"
        action={
          canWrite ? (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Case
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
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
              placeholder="Search cases..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
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
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={mineOnly}
                onChange={(e) => setMineOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Mine only
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading cases...</span>
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No cases found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Case ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Assigned</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((row) => {
                  const busy = actionId === row._id;
                  return (
                    <tr key={row._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.caseId}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.patientName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{row.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{row.category}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[row.priority] || 'bg-gray-100 text-gray-700'}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{row.assignedToName || '—'}</td>
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
                            onChange={(e) => updateStatus(row._id, e.target.value)}
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
                          {canWrite && (
                            <button
                              onClick={() => openEdit(row)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(row._id)}
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
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Case' : 'New Case'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div>
                <label className={labelClass}>Patient</label>
                <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} className={inputClass}>
                  <option value="">General / Walk-in</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.surname} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Subject *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={inputClass}
                  required
                  placeholder="Brief case summary"
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
                <div>
                  <label className={labelClass}>Channel</label>
                  <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className={inputClass}>
                    {channels.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass}>
                    <option value="">Unassigned</option>
                    {departments.map((d: any) => (
                      <option key={d._id || d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Assign to</label>
                  <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className={inputClass}>
                    <option value="">Unassigned</option>
                    {staff.map((s: any) => (
                      <option key={s._id} value={s._id}>{s.fullName || s.name || s.email} ({s.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Contact email</label>
                  <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className={inputClass} placeholder="optional@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Contact phone</label>
                  <input type="text" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className={inputClass} placeholder="Phone number" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Resolution</label>
                <textarea value={form.resolution} onChange={(e) => setForm({ ...form, resolution: e.target.value })} rows={2} className={inputClass} placeholder="Resolution notes..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Save Changes' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{showDetail.caseId}</h2>
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
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {showDetail.category}
                </span>
                {showDetail.escalationLevel > 0 && (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Escalation level {showDetail.escalationLevel}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Patient</p>
                  <p className="font-medium text-gray-900">{showDetail.patientName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Assigned to</p>
                  <p className="font-medium text-gray-900">{showDetail.assignedToName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{showDetail.department || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Channel</p>
                  <p className="font-medium text-gray-900">{showDetail.channel}</p>
                </div>
                <div>
                  <p className="text-gray-500">Contact email</p>
                  <p className="font-medium text-gray-900">{showDetail.contactEmail || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Contact phone</p>
                  <p className="font-medium text-gray-900">{showDetail.contactPhone || '—'}</p>
                </div>
              </div>

              {showDetail.description && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{showDetail.description}</p>
                </div>
              )}

              {showDetail.resolution && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Resolution</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{showDetail.resolution}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Timeline</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(showDetail.timeline || []).slice().reverse().map((t: any, i: number) => (
                    <div key={i} className="border-l-2 border-blue-200 pl-3 py-1">
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

              {canWrite && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add internal note..."
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => addNote(showDetail._id)}
                    disabled={actionId === showDetail._id || !note.trim()}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" /> Add
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {canEscalate && (
                  <button
                    onClick={() => {
                      setFormError('');
                      setEscalationForm({
                        subject: showDetail.subject,
                        description: showDetail.description || '',
                        priority: 'High',
                        departmentInvolved: showDetail.department || '',
                        customerCareAction: '',
                      });
                      setEscalating(true);
                    }}
                    className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Escalate to Management
                  </button>
                )}
                {canWrite && (
                  <button
                    onClick={() => {
                      setFormError('');
                      setRequestForm({
                        subject: showDetail.subject,
                        description: showDetail.description || '',
                        toDepartment: '',
                        priority: 'Medium',
                        category: 'Service',
                      });
                      setShowRequest(true);
                    }}
                    className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 flex items-center gap-1.5"
                  >
                    <ClipboardList className="w-4 h-4" /> Request Department
                  </button>
                )}
              </div>

              {escalating && (
                <form onSubmit={submitEscalation} className="border border-purple-200 rounded-lg p-4 space-y-3 bg-purple-50/50">
                  <p className="text-sm font-semibold text-purple-800">Escalate to Management</p>
                  {formError && <p className="text-sm text-red-600">{formError}</p>}
                  <div>
                    <label className={labelClass}>Subject *</label>
                    <input type="text" value={escalationForm.subject} onChange={(e) => setEscalationForm({ ...escalationForm, subject: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea value={escalationForm.description} onChange={(e) => setEscalationForm({ ...escalationForm, description: e.target.value })} rows={3} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Priority</label>
                      <select value={escalationForm.priority} onChange={(e) => setEscalationForm({ ...escalationForm, priority: e.target.value })} className={inputClass}>
                        {['Critical', 'High', 'Medium', 'Low'].map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Department</label>
                      <select value={escalationForm.departmentInvolved} onChange={(e) => setEscalationForm({ ...escalationForm, departmentInvolved: e.target.value })} className={inputClass}>
                        <option value="">—</option>
                        {departments.map((d: any) => (
                          <option key={d._id || d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Action already taken</label>
                    <textarea value={escalationForm.customerCareAction} onChange={(e) => setEscalationForm({ ...escalationForm, customerCareAction: e.target.value })} rows={2} className={inputClass} placeholder="What has customer care done so far?" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setEscalating(false)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1">
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Escalate
                    </button>
                  </div>
                </form>
              )}

              {showRequest && (
                <form onSubmit={submitRequest} className="border border-orange-200 rounded-lg p-4 space-y-3 bg-orange-50/50">
                  <p className="text-sm font-semibold text-orange-800">Internal Department Request</p>
                  {formError && <p className="text-sm text-red-600">{formError}</p>}
                  <div>
                    <label className={labelClass}>Subject *</label>
                    <input type="text" value={requestForm.subject} onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea value={requestForm.description} onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })} rows={3} className={inputClass} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-3 sm:col-span-1">
                      <label className={labelClass}>To department *</label>
                      <select value={requestForm.toDepartment} onChange={(e) => setRequestForm({ ...requestForm, toDepartment: e.target.value })} className={inputClass} required>
                        <option value="">Select…</option>
                        {departments.map((d: any) => (
                          <option key={d._id || d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Priority</label>
                      <select value={requestForm.priority} onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })} className={inputClass}>
                        {priorities.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Category</label>
                      <select value={requestForm.category} onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })} className={inputClass}>
                        {['Billing', 'Medical', 'Pharmacy', 'Laboratory', 'Appointment', 'Service', 'Other'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowRequest(false)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-1">
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Send Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
