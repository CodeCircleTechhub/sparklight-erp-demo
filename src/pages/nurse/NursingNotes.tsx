import { useState, useEffect, useCallback } from 'react';
import { FileText, Save, Loader2, AlertCircle, CheckCircle, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const NOTE_TYPES = ['Progress Note', 'Critical Note', 'Discharge Note', 'Assessment Note', 'Handover Note'];

const noteTypeColors: Record<string, string> = {
  'Progress Note': 'bg-blue-100 text-blue-800',
  'Critical Note': 'bg-red-100 text-red-800',
  'Discharge Note': 'bg-green-100 text-green-800',
  'Assessment Note': 'bg-purple-100 text-purple-800',
  'Handover Note': 'bg-amber-100 text-amber-800',
};

const emptyForm = { patient: '', noteType: 'Progress Note', notes: '' };

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

export default function NursingNotes() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadPatients = useCallback(async () => {
    try {
      const { data } = await api.get('/nurse/patients', { params: { all: 1 } });
      setPatients(data.patients || []);
    } catch {
      setPatients([]);
    }
  }, []);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/nurse/notes', { params: { limit: 100 } });
      setNotes(data.notes || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
    loadNotes();
  }, [loadPatients, loadNotes]);

  const field =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) {
      setError('Select a patient first.');
      return;
    }
    if (!form.notes.trim()) {
      setError('Write the note before saving.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await api.put(`/nurse/notes/${editingId}`, { noteType: form.noteType, notes: form.notes });
        setNotice('Note updated.');
      } else {
        await api.post('/nurse/notes', form);
        setNotice('Note saved.');
      }
      setForm({ ...emptyForm });
      setEditingId('');
      await loadNotes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save the note');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (n: any) => {
    setForm({
      patient: n.patient?._id || n.patient || '',
      noteType: n.noteType || 'Progress Note',
      notes: n.notes || '',
    });
    setEditingId(String(n._id));
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this nursing note?')) return;
    setError('');
    try {
      await api.delete(`/nurse/notes/${id}`);
      if (editingId === id) {
        setEditingId('');
        setForm({ ...emptyForm });
      }
      await loadNotes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not delete the note');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Nursing Notes" description="Document and manage nursing notes" />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {editingId ? 'Edit Nursing Note' : 'New Nursing Note'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className={field}
              >
                <option value="">Select patient</option>
    {patients.map((p) => (
      <option key={p._id} value={p._id}>
        {p.name} {p.patientId ? `(${p.patientId})` : ''}{p.admitted ? ' — Admitted' : ''}
      </option>
    ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note Type</label>
              <select
                value={form.noteType}
                onChange={(e) => setForm({ ...form, noteType: e.target.value })}
                className={field}
              >
                {NOTE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows={6}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Enter your nursing notes..."
                className={`${field} resize-none`}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update Note' : 'Save Note'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId('');
                    setForm({ ...emptyForm });
                  }}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Notes
            </h3>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading...
              </div>
            ) : notes.length === 0 ? (
              <p className="py-12 text-center text-sm text-gray-500">No nursing notes yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nurse</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {note.patient
                          ? [note.patient.firstName, note.patient.surname].filter(Boolean).join(' ')
                          : note.patientName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            noteTypeColors[note.noteType] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {note.noteType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{fmtDate(note.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{note.nurseName || note.nurse?.fullName || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(note)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit">
                            <Pencil className="w-4 h-4 text-gray-600" />
                          </button>
                          {user?.role === 'super-admin' && (
                            <button
                              onClick={() => remove(String(note._id))}
                              className="p-1.5 hover:bg-gray-100 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          )}
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
    </div>
  );
}
