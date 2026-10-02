import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface PatientRef {
  _id: string;
  firstName: string;
  surname: string;
  patientId: string;
}

interface StaffRef {
  _id: string;
  fullName: string;
  role: string;
}

export interface VisitRecord {
  _id: string;
  visitId?: string;
  patient?: PatientRef | string;
  department?: string;
  doctor?: string | StaffRef;
  doctorName?: string;
  date?: string;
  reason?: string;
  status?: string;
  notes?: string;
}

interface VisitFormModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  onUpdated?: () => void;
  visit?: VisitRecord | null;
}

const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

function formatStaffName(staff: StaffRef) {
  const roleLabel =
    staff.role === 'doctor' ? 'Dr.' :
    staff.role === 'nurse' ? 'Nurse' : '';
  return roleLabel ? `${roleLabel} ${staff.fullName}` : staff.fullName;
}

function resolveDoctorDisplay(visit?: VisitRecord | null): string {
  if (!visit) return '';
  if (typeof visit.doctor === 'object' && visit.doctor?.fullName) {
    return formatStaffName(visit.doctor);
  }
  return visit.doctorName || '';
}

export default function VisitFormModal({ open, onClose, onCreated, onUpdated, visit }: VisitFormModalProps) {
  const isEdit = !!visit?._id;
  const [patients, setPatients] = useState<PatientRef[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [staff, setStaff] = useState<StaffRef[]>([]);
  const [doctor, setDoctor] = useState('');
  const [form, setForm] = useState({
    patient: '',
    department: '',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Pending',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setDoctor('');
    if (visit) {
      setForm({
        patient: typeof visit.patient === 'object' ? visit.patient._id : visit.patient || '',
        department: visit.department || '',
        doctorName: resolveDoctorDisplay(visit),
        date: visit.date ? new Date(visit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        reason: visit.reason || '',
        status: visit.status || 'Pending',
        notes: visit.notes || '',
      });
      if (typeof visit.doctor === 'object' && visit.doctor?._id) {
        setDoctor(visit.doctor._id);
      } else if (typeof visit.doctor === 'string') {
        setDoctor(visit.doctor);
      }
    } else {
      setForm({
        patient: '',
        department: '',
        doctorName: '',
        date: new Date().toISOString().split('T')[0],
        reason: '',
        status: 'Pending',
        notes: '',
      });
    }

    Promise.all([
      api.get('/patients'),
      api.get('/departments'),
      api.get('/hr/employees', { params: { role: 'doctor' } }),
      api.get('/hr/employees', { params: { role: 'nurse' } }),
    ])
      .then(([p, d, docRes, nurseRes]) => {
        setPatients(p.data.patients ?? []);
        setDepartments((d.data.departments ?? []).map((x: { name: string }) => x.name));
        const doctors = (docRes.data.employees ?? []).filter((e: StaffRef) => e.role === 'doctor');
        const nurses = (nurseRes.data.employees ?? []).filter((e: StaffRef) => e.role === 'nurse');
        setStaff([...doctors, ...nurses]);
      })
      .catch(() => setError('Failed to load form data'));
  }, [open, visit]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const datalistId = isEdit ? 'visit-staff-edit' : 'visit-staff-create';

  const handleStaffSelect = (value: string) => {
    setForm({ ...form, doctorName: value });
    const match = staff.find((s) => formatStaffName(s) === value || s.fullName === value);
    setDoctor(match?._id || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && (!form.patient || !form.department || !form.date || !form.reason)) {
      setError('Please fill in all required fields');
      return;
    }
    if (isEdit && (!form.department || !form.date || !form.reason)) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        department: form.department,
        doctor,
        doctorName: form.doctorName,
        date: form.date,
        reason: form.reason,
        status: form.status,
        notes: form.notes,
        ...(isEdit ? {} : { patient: form.patient }),
      };
      if (isEdit) {
        await api.put(`/visits/${visit!._id}`, payload);
        onUpdated?.();
      } else {
        await api.post('/visits', payload);
        onCreated?.();
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} visit`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Visit' : 'New Visit'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!isEdit && (
            <div>
              <label className={labelClass}>Patient *</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.firstName} {p.surname} ({p.patientId})
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department *</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Dr. / Staff Name</label>
              <input
                type="text"
                list={datalistId}
                value={form.doctorName}
                onChange={(e) => handleStaffSelect(e.target.value)}
                placeholder="Select staff or type a name"
                className={inputClass}
                autoComplete="off"
              />
              <datalist id={datalistId}>
                {staff.map((s) => (
                  <option key={s._id} value={formatStaffName(s)}>
                    {s.role === 'doctor' ? 'Doctor' : 'Nurse'}
                  </option>
                ))}
              </datalist>
              <p className="mt-1 text-xs text-gray-400">Doctors & nurses from staff, or type any name</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Reason for Visit *</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Follow-up consultation"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="Additional notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
              {isEdit ? 'Save Changes' : 'Create Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
