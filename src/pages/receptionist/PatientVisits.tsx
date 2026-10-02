import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, UserPlus, RefreshCw, Clock, Loader2, AlertCircle,
  Plus, Search, Edit, Trash2, X,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import VisitFormModal from '../../components/shared/VisitFormModal';
import type { VisitRecord } from '../../components/shared/VisitFormModal';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

function staffLabel(v: any): string {
  if (v?.doctor && typeof v.doctor === 'object' && v.doctor.fullName) {
    const role = v.doctor.role;
    const prefix = role === 'doctor' ? 'Dr.' : role === 'nurse' ? 'Nurse' : '';
    return prefix ? `${prefix} ${v.doctor.fullName}` : v.doctor.fullName;
  }
  return v?.doctorName || '-';
}

export default function PatientVisits() {
  const [visits, setVisits] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayVisits: 0, total: 0, thisWeek: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editVisit, setEditVisit] = useState<VisitRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchVisits = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/visits', {
        params: q ? { search: q } : {},
      });
      const list = data.visits || [];
      setVisits(list);
      const pending = list.filter((v: any) => v.status === 'Pending').length;
      setStats({
        todayVisits: data.todayVisits ?? 0,
        total: data.total ?? list.length,
        thisWeek: data.thisWeek ?? 0,
        pending,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load visits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  useEffect(() => {
    const t = setTimeout(() => fetchVisits(search.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchVisits]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/visits/${id}`);
      setMessage({ type: 'success', text: 'Visit deleted successfully' });
      setDeleteConfirm(null);
      fetchVisits(search.trim() || undefined);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete visit' });
      setDeleteConfirm(null);
    }
  };

  const patientName = (v: any) =>
    v.patient
      ? [v.patient.firstName, v.patient.surname].filter(Boolean).join(' ')
      : 'Unknown';

  const statCards = [
    { label: "Today's Visits", value: stats.todayVisits, icon: ClipboardList, color: 'bg-blue-500' },
    { label: 'Total Visits', value: stats.total, icon: UserPlus, color: 'bg-green-500' },
    { label: 'This Week', value: stats.thisWeek, icon: RefreshCw, color: 'bg-violet-500' },
    { label: 'Waiting', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Patient Visits" icon={ClipboardList} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search visits..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Visit
          </button>
        </div>

        {message && (
          <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Loading visits...</span>
              </div>
            ) : visits.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No visits found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Visit ID</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                    <th className="pb-3 font-medium">Dr. / Staff</th>
                    <th className="pb-3 font-medium hidden xl:table-cell">Reason</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visits.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{v.visitId}</td>
                      <td className="py-3 text-gray-900">{patientName(v)}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">
                        {v.date
                          ? new Date(v.date).toLocaleString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{v.department || 'General'}</td>
                      <td className="py-3 text-gray-700 whitespace-nowrap">{staffLabel(v)}</td>
                      <td className="py-3 text-gray-600 hidden xl:table-cell max-w-[160px] truncate">{v.reason || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[v.status] || 'bg-gray-100 text-gray-700'}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditVisit(v)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(v._id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <VisitFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => fetchVisits(search.trim() || undefined)}
      />

      <VisitFormModal
        open={!!editVisit}
        visit={editVisit}
        onClose={() => setEditVisit(null)}
        onUpdated={() => {
          setMessage({ type: 'success', text: 'Visit updated successfully' });
          fetchVisits(search.trim() || undefined);
        }}
      />

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
              <button onClick={() => setDeleteConfirm(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this visit? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
