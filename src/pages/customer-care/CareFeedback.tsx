import { useState, useEffect, useCallback } from 'react';
import {
  Star, ThumbsUp, Minus, ThumbsDown, Search, Filter,
  Plus, Loader2, Pencil, Trash2, X, AlertCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const statusColors: Record<string, string> = {
  Published: 'bg-green-100 text-green-800',
  'Pending Review': 'bg-amber-100 text-amber-800',
};

const categories = ['Service', 'Cleanliness', 'Staff', 'Wait Time', 'Food', 'Communication', 'Overall', 'Facilities'];
const statuses = ['Published', 'Pending Review'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default function CareFeedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, positive: 0, neutral: 0, negative: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [actionId, setActionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [form, setForm] = useState({
    patientId: '',
    category: 'Overall',
    rating: 5,
    comment: '',
    status: 'Pending Review',
  });

  const fetchFeedback = useCallback(async (q?: string, st?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (q) params.search = q;
      if (st) params.status = st;
      const { data } = await api.get('/customer-care/feedback', { params });
      setFeedback(data.feedback || []);
      setStats(data.stats || { total: 0, positive: 0, neutral: 0, negative: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
    api
      .get('/patients')
      .then(({ data }) => setPatients(data.patients || []))
      .catch(() => setPatients([]));
  }, [fetchFeedback]);

  useEffect(() => {
    const t = setTimeout(
      () => fetchFeedback(search.trim() || undefined, statusFilter || undefined),
      350
    );
    return () => clearTimeout(t);
  }, [search, statusFilter, fetchFeedback]);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setForm({ patientId: '', category: 'Overall', rating: 5, comment: '', status: 'Pending Review' });
    setShowForm(true);
  };

  const openEdit = (f: any) => {
    setEditing(f);
    setFormError('');
    setForm({
      patientId: f.patient?._id || '',
      category: f.category || 'Overall',
      rating: f.rating || 5,
      comment: f.comment || '',
      status: f.status || 'Pending Review',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating < 1 || form.rating > 5) {
      setFormError('Rating must be between 1 and 5');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      if (editing) {
        await api.put(`/customer-care/feedback/${editing._id}`, form);
      } else {
        await api.post('/customer-care/feedback', form);
      }
      setShowForm(false);
      await fetchFeedback(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setActionId(id);
    setError('');
    try {
      await api.put(`/customer-care/feedback/${id}`, { status });
      await fetchFeedback(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionId('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this feedback?')) return;
    setActionId(id);
    try {
      await api.delete(`/customer-care/feedback/${id}`);
      await fetchFeedback(search.trim() || undefined, statusFilter || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setActionId('');
    }
  };

  const statList = [
    { label: 'Total Feedback', value: stats.total, icon: Star, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Positive', value: stats.positive, icon: ThumbsUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Neutral', value: stats.neutral, icon: Minus, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Negative', value: stats.negative, icon: ThumbsDown, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const canDelete = user?.role === 'super-admin' || user?.role === 'manager';
  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Feedback"
        description="View and manage patient feedback"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Feedback
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
              placeholder="Search feedback..."
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
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500 text-sm">Loading feedback...</span>
            </div>
          ) : feedback.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No feedback found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Feedback ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {feedback.map((fb) => {
                  const busy = actionId === fb._id;
                  return (
                    <tr key={fb._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{fb.feedbackId || fb.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{fb.patientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fb.category}</td>
                      <td className="px-4 py-3"><StarRating rating={fb.rating} /></td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[fb.status] || 'bg-gray-100 text-gray-700'}`}>
                          {fb.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <select
                            value={fb.status}
                            disabled={busy}
                            onChange={(e) => updateStatus(fb._id, e.target.value)}
                            className="border border-gray-200 rounded-lg text-xs px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => openEdit(fb)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(fb._id)}
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
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Feedback' : 'Record Feedback'}</h2>
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
                  <option value="">Anonymous / Walk-in</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.surname} ({p.patientId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className={labelClass}>Rating (1-5) *</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{form.rating}/5</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Comment</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  rows={3}
                  className={inputClass}
                  placeholder="Feedback comment..."
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
                  {editing ? 'Save Changes' : 'Save Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
