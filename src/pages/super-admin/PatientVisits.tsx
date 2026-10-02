import { useState, useEffect, useRef, useCallback } from 'react';
import { ClipboardList, Search, Plus, Loader2, Trash2, Edit, X, Calendar } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const statusColor: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

interface PatientRef {
  _id: string;
  firstName: string;
  surname: string;
  patientId: string;
  phone?: string;
  gender?: string;
  dob?: string;
}

interface Visit {
  _id: string;
  visitId: string;
  patient: PatientRef;
  department: string;
  doctor: string;
  doctorName: string;
  date: string;
  reason: string;
  status: string;
  notes: string;
}

interface VisitForm {
  patient: string;
  department: string;
  doctorName: string;
  date: string;
  reason: string;
  status: string;
  notes: string;
}

const emptyForm: VisitForm = {
  patient: '',
  department: '',
  doctorName: '',
  date: new Date().toISOString().split('T')[0],
  reason: '',
  status: 'Pending',
  notes: '',
};

export default function PatientVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [patients, setPatients] = useState<PatientRef[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [stats, setStats] = useState([
    { title: 'Total Visits', value: '0', icon: ClipboardList, color: 'blue' as const },
    { title: "Today's Visits", value: '0', icon: Calendar, color: 'green' as const },
    { title: 'This Week', value: '0', icon: ClipboardList, color: 'purple' as const },
    { title: 'This Month', value: '0', icon: ClipboardList, color: 'yellow' as const },
  ]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<VisitForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchVisits = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query) params.search = query;
      const { data } = await api.get('/visits', { params });
      setVisits(data.visits ?? []);
      setStats([
        { title: 'Total Visits', value: (data.total ?? 0).toLocaleString(), icon: ClipboardList, color: 'blue' as const },
        { title: "Today's Visits", value: (data.todayVisits ?? 0).toLocaleString(), icon: Calendar, color: 'green' as const },
        { title: 'This Week', value: (data.thisWeek ?? 0).toLocaleString(), icon: ClipboardList, color: 'purple' as const },
        { title: 'This Month', value: (data.thisMonth ?? 0).toLocaleString(), icon: ClipboardList, color: 'yellow' as const },
      ]);
    } catch (err) {
      console.error('Failed to fetch visits', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdowns = useCallback(async () => {
    try {
      const [patientsRes, deptsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/departments'),
      ]);
      setPatients(patientsRes.data.patients ?? []);
      setDepartments((deptsRes.data.departments ?? []).map((d: { name: string }) => d.name));
    } catch (err) {
      console.error('Failed to fetch dropdowns', err);
    }
  }, []);

  useEffect(() => { fetchVisits(''); fetchDropdowns(); }, [fetchVisits, fetchDropdowns]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchVisits(search), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, fetchVisits]);

  useEffect(() => {
    if (message) { const t = setTimeout(() => setMessage(null), 4000); return () => clearTimeout(t); }
  }, [message]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedPatient = patients.find((p) => p._id === form.patient);
      await api.post('/visits', {
        patient: form.patient,
        department: form.department,
        doctorName: form.doctorName,
        date: form.date,
        reason: form.reason,
        status: form.status,
        notes: form.notes,
      });
      setMessage({ type: 'success', text: `Visit created for ${selectedPatient?.firstName} ${selectedPatient?.surname}` });
      setShowCreate(false);
      setForm(emptyForm);
      fetchVisits(search);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create visit' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEdit) return;
    setSubmitting(true);
    try {
      await api.put(`/visits/${showEdit}`, {
        department: form.department,
        doctorName: form.doctorName,
        date: form.date,
        reason: form.reason,
        status: form.status,
        notes: form.notes,
      });
      setMessage({ type: 'success', text: 'Visit updated successfully' });
      setShowEdit(null);
      fetchVisits(search);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update visit' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/visits/${id}`);
      setMessage({ type: 'success', text: 'Visit deleted successfully' });
      setDeleteConfirm(null);
      fetchVisits(search);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete visit' });
      setDeleteConfirm(null);
    }
  };

  const openEditModal = (v: Visit) => {
    setForm({
      patient: v.patient?._id || '',
      department: v.department || '',
      doctorName: v.doctorName || '',
      date: v.date ? v.date.split('T')[0] : '',
      reason: v.reason || '',
      status: v.status || 'Pending',
      notes: v.notes || '',
    });
    setShowEdit(v._id);
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none';
  const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const VisitFormFields = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      {!isEdit && (
        <div>
          <label className={labelClass}>Patient *</label>
          <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} className={selectClass} required>
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>{p.firstName} {p.surname} ({p.patientId})</option>
            ))}
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Department *</label>
          <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={selectClass} required>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Doctor Name</label>
          <input type="text" value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} placeholder="e.g. Dr. Smith" className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date *</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Reason for Visit *</label>
        <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Follow-up consultation" className={inputClass} required />
      </div>
      <div>
        <label className={labelClass}>Notes</label>
        <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={inputClass} placeholder="Additional notes..." />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patient Visits"
        icon={ClipboardList}
        description="Track and manage all patient visits"
        action={
          <button onClick={() => { setForm(emptyForm); setShowCreate(true); }} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            New Visit
          </button>
        }
      />

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Visit List</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search visits..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Loading visits...</span>
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No visits found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Visit ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{v.visitId}</td>
                    <td className="py-3 px-4 text-gray-900 whitespace-nowrap">
                      {v.patient ? `${v.patient.firstName} ${v.patient.surname}` : 'N/A'}
                      {v.patient?.patientId && <span className="text-gray-400 ml-1">({v.patient.patientId})</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{v.date ? new Date(v.date).toLocaleDateString() : '-'}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{v.department || '-'}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{v.doctorName || '-'}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap max-w-[200px] truncate">{v.reason || '-'}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[v.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(v)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(v._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Visit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">New Patient Visit</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleCreate}>
              <VisitFormFields />
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Visit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Visit</h3>
              <button onClick={() => setShowEdit(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleEdit}>
              <VisitFormFields isEdit />
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowEdit(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this visit? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
