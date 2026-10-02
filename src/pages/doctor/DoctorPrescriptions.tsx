import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pill, Calendar, Clock, CheckCircle, AlertCircle, Plus, Save, Loader2,
  Pencil, Trash2, X, FileText, Search, User,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

type Med = { name: string; dosage: string; frequency: string; duration: string; instructions: string };

type DoctorRef = { _id?: string; fullName?: string };

type Rx = {
  _id: string;
  prescriptionId?: string;
  patient?: string | { _id?: string };
  patientName?: string;
  doctor?: string | DoctorRef;
  doctorName?: string;
  date?: string;
  medications?: Med[];
  notes?: string;
  status?: string;
};

const emptyMed = (): Med => ({ name: '', dosage: '', frequency: '', duration: '', instructions: '' });

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const statusColors: Record<string, string> = {
  Dispensed: 'bg-green-100 text-green-800',
  Filled: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-gray-100 text-gray-600',
};

const STATUS_OPTIONS = ['Pending', 'Filled', 'Dispensed', 'Cancelled'];

const prescriberOf = (rx: Rx) =>
  (typeof rx.doctor === 'object' && rx.doctor?.fullName) || rx.doctorName || 'Unknown';

export default function DoctorPrescriptions() {
  const { user } = useAuth();
  const privileged = user?.role === 'super-admin' || user?.role === 'manager';

  const [items, setItems] = useState<Rx[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, dispensed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [selectedPatient, setSelectedPatient] = useState('');
  const [patientSearch, setPatientSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patient: '', name: '', dosage: '', frequency: '', duration: '', notes: '',
  });

  const [editing, setEditing] = useState<Rx | null>(null);
  const [editForm, setEditForm] = useState({ status: 'Pending', notes: '', meds: [] as Med[] });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState<Rx | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const activePatient = useMemo(
    () => patients.find((p) => p._id === selectedPatient) || null,
    [patients, selectedPatient]
  );

  const filteredPatients = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      [p.name, p.patientId].filter(Boolean).join(' ').toLowerCase().includes(q)
    );
  }, [patients, patientSearch]);

  const fetchData = useCallback(async (patientId?: string) => {
    setLoading(true);
    setError('');
    try {
      const [rxRes, patientRes] = await Promise.all([
        api.get('/doctor/prescriptions', {
          params: patientId ? { patient: patientId } : {},
        }),
        api.get('/doctor/patients'),
      ]);
      setItems(rxRes.data.items || []);
      setStats(rxRes.data.stats || { today: 0, week: 0, dispensed: 0, pending: 0 });
      setPatients(patientRes.data.patients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectPatient = (id: string) => {
    setSelectedPatient(id);
    setForm((f) => ({ ...f, patient: id }));
    setNotice('');
    setError('');
    fetchData(id || undefined);
  };

  const canManage = useCallback(
    (rx: Rx) => {
      if (privileged) return true;
      const docId = typeof rx.doctor === 'object' ? rx.doctor?._id : rx.doctor;
      return !!docId && !!user?.id && String(docId) === String(user.id);
    },
    [privileged, user?.id]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient || !form.name.trim()) {
      setError('Select a patient and enter a medicine name.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await api.post('/doctor/prescriptions', {
        patient: form.patient,
        medications: [
          { name: form.name, dosage: form.dosage, frequency: form.frequency, duration: form.duration },
        ],
        notes: form.notes,
      });
      setForm({ patient: selectedPatient, name: '', dosage: '', frequency: '', duration: '', notes: '' });
      setShowForm(false);
      setNotice('Prescription issued and shared with the patient.');
      await fetchData(selectedPatient || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save prescription');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (rx: Rx) => {
    setEditing(rx);
    setEditForm({
      status: rx.status || 'Pending',
      notes: rx.notes || '',
      meds: (rx.medications || []).map((m) => ({ ...emptyMed(), ...m })),
    });
    setNotice('');
    setError('');
  };

  const updateMed = (index: number, key: keyof Med, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      meds: prev.meds.map((m, i) => (i === index ? { ...m, [key]: value } : m)),
    }));
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editForm.meds.some((m) => m.name.trim())) {
      setError('Add at least one medicine.');
      return;
    }
    setSavingEdit(true);
    setError('');
    setNotice('');
    try {
      await api.put(`/doctor/prescriptions/${editing._id}`, {
        medications: editForm.meds.filter((m) => m.name.trim()),
        notes: editForm.notes,
        status: editForm.status,
      });
      setEditing(null);
      setNotice('Prescription updated.');
      await fetchData(selectedPatient || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not update prescription');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    setError('');
    setNotice('');
    try {
      await api.delete(`/doctor/prescriptions/${deleting._id}`);
      setDeleting(null);
      setNotice(`Prescription ${deleting.prescriptionId || ''} deleted.`.replace(/\s+/g, ' ').trim());
      await fetchData(selectedPatient || undefined);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not delete prescription');
    } finally {
      setDeletingBusy(false);
    }
  };

  const cards = [
    { label: 'Today', value: stats.today, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'This Week', value: stats.week, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Dispensed', value: stats.dispensed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const medField =
    'w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white';

  const openForm = () => {
    setForm((f) => ({ ...f, patient: selectedPatient }));
    setError('');
    setNotice('');
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" icon={Pill} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
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
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {notice && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Patient picker */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[260px] flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Select patient
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedPatient}
                onChange={(e) => selectPatient(e.target.value)}
                className={`${field} pl-9`}
              >
                <option value="">All patients (my prescriptions)</option>
                {filteredPatients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.patientId})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Find patient
            </label>
            <input
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Name or patient ID"
              className={field}
            />
          </div>
          <button
            onClick={openForm}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            {activePatient ? `Prescribe for ${activePatient.name}` : 'New prescription'}
          </button>
          {selectedPatient && (
            <button
              onClick={() => selectPatient('')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Clear
            </button>
          )}
        </div>

        {activePatient && (
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">
                {activePatient.name}
                <span className="ml-2 font-normal text-gray-500">{activePatient.patientId}</span>
              </p>
              <p className="text-xs text-gray-500">
                Showing every prescription written for this patient by any doctor or nurse.
                You can edit or delete only the ones you issued.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-gray-700">
            {activePatient ? `Prescriptions for ${activePatient.name}` : 'Prescriptions issued'}
          </h2>
          <button
            onClick={() => (showForm ? setShowForm(false) : openForm())}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New prescription
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-3">
            {!selectedPatient ? (
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className={field}
              >
                <option value="">Select patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.patientId})
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-800">
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {activePatient?.name} ({activePatient?.patientId})
                </span>
              </div>
            )}
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Medicine"
              className={field}
            />
            <input
              value={form.dosage}
              onChange={(e) => setForm({ ...form, dosage: e.target.value })}
              placeholder="Dosage (e.g. 500mg)"
              className={field}
            />
            <input
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              placeholder="Frequency"
              className={field}
            />
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="Duration (e.g. 5 days)"
              className={`${field} md:col-span-2`}
            />
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Instructions"
              className={`${field} md:col-span-3`}
            />
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading prescriptions...
          </div>
        ) : items.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            {activePatient
              ? `No prescriptions for ${activePatient.name} yet.`
              : 'No prescriptions issued yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prescription ID</th>
                  {!activePatient && (
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  )}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prescribed by</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicines</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((rx) => {
                  const mine = canManage(rx);
                  return (
                    <tr key={rx._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-blue-600">{rx.prescriptionId}</td>
                      {!activePatient && (
                        <td className="px-4 py-3 text-sm text-gray-900">{rx.patientName}</td>
                      )}
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(rx.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {prescriberOf(rx)}
                        {mine && (
                          <span className="ml-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            you
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {(rx.medications || [])
                          .map((m) => [m.name, m.dosage].filter(Boolean).join(' '))
                          .join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[rx.status || ''] || 'bg-gray-100 text-gray-600'}`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {mine ? (
                            <>
                              <button
                                onClick={() => openEdit(rx)}
                                title="Edit prescription"
                                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setDeleting(rx); setError(''); setNotice(''); }}
                                title="Delete prescription"
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 px-2">view only</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <form
            onSubmit={saveEdit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Edit {editing.prescriptionId}
                </h3>
                <p className="text-sm text-gray-500">
                  {editing.patientName} · {fmtDate(editing.date)} · Prescribed by {prescriberOf(editing)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className={field}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Instructions</label>
                <input
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="General instructions / notes"
                  className={field}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Medicines</label>
                <button
                  type="button"
                  onClick={() => setEditForm((p) => ({ ...p, meds: [...p.meds, emptyMed()] }))}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add medicine
                </button>
              </div>

              {editForm.meds.map((med, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-3 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-end">
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Medicine</label>
                      <input
                        value={med.name}
                        onChange={(e) => updateMed(index, 'name', e.target.value)}
                        placeholder="Medicine name"
                        className={medField}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Dosage</label>
                      <input
                        value={med.dosage}
                        onChange={(e) => updateMed(index, 'dosage', e.target.value)}
                        placeholder="500mg"
                        className={medField}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Frequency</label>
                      <input
                        value={med.frequency}
                        onChange={(e) => updateMed(index, 'frequency', e.target.value)}
                        placeholder="2x daily"
                        className={medField}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Duration</label>
                      <input
                        value={med.duration}
                        onChange={(e) => updateMed(index, 'duration', e.target.value)}
                        placeholder="5 days"
                        className={medField}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((p) => ({ ...p, meds: p.meds.filter((_, i) => i !== index) }))
                      }
                      title="Remove medicine"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Notes for this medicine</label>
                    <input
                      value={med.instructions}
                      onChange={(e) => updateMed(index, 'instructions', e.target.value)}
                      placeholder="Take after food"
                      className={medField}
                    />
                  </div>
                </div>
              ))}

              {editForm.meds.length === 0 && (
                <p className="text-sm text-gray-500">No medicines. Use “Add medicine” to include one.</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDeleting(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl bg-white p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-red-100">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete prescription?</h3>
                <p className="text-sm text-gray-500">
                  {deleting.prescriptionId || 'This prescription'} for {deleting.patientName} will be
                  permanently removed.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleting(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingBusy}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deletingBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
