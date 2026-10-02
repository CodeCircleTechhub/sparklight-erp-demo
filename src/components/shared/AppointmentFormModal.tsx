import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface PatientRef {
  _id: string;
  firstName: string;
  surname: string;
  patientId: string;
}

interface DoctorRef {
  _id: string;
  fullName: string;
  role: string;
}

interface AppointmentFormModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  /** When set, the modal edits this appointment instead of creating a new one. */
  appointment?: any;
}

const types = ['Checkup', 'Follow-up', 'Consultation', 'Surgery', 'Emergency', 'Vaccination'];
const statuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

const makeDefaults = () => ({
  patient: '',
  doctor: '',
  department: '',
  date: new Date().toISOString().split('T')[0],
  time: '09:00',
  type: 'Consultation',
  status: 'Scheduled',
  notes: '',
});

export default function AppointmentFormModal({ open, onClose, onCreated, appointment }: AppointmentFormModalProps) {
  const [patients, setPatients] = useState<PatientRef[]>([]);
  const [doctors, setDoctors] = useState<DoctorRef[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [form, setForm] = useState(makeDefaults());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (appointment) {
      setForm({
        patient: appointment.patient?._id || (typeof appointment.patient === 'string' ? appointment.patient : ''),
        doctor: appointment.doctor?._id || (typeof appointment.doctor === 'string' ? appointment.doctor : ''),
        department: appointment.department || '',
        date: appointment.date ? String(appointment.date).slice(0, 10) : makeDefaults().date,
        time: appointment.time || '09:00',
        type: appointment.type || 'Consultation',
        status: appointment.status || 'Scheduled',
        notes: appointment.notes || '',
      });
    } else {
      setForm(makeDefaults());
    }
    setError('');
    Promise.all([
      api.get('/patients'),
      api.get('/hr/employees', { params: { role: 'doctor' } }),
      api.get('/departments'),
    ])
      .then(([p, d, dep]) => {
        setPatients(p.data.patients ?? []);
        setDoctors((d.data.employees ?? []).filter((e: DoctorRef) => e.role === 'doctor'));
        setDepartments((dep.data.departments ?? []).map((x: { name: string }) => x.name));
      })
      .catch(() => setError('Failed to load form data'));
  }, [open, appointment]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient || !form.doctor || !form.date || !form.time) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (appointment) {
        await api.put(`/appointments/${appointment._id}`, form);
      } else {
        await api.post('/appointments', form);
        setForm(makeDefaults());
      }
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || (appointment ? 'Failed to save changes' : 'Failed to create appointment'));
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = appointment && !statuses.includes(appointment.status)
    ? [...statuses, appointment.status]
    : statuses;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{appointment ? 'Edit Appointment' : 'New Appointment'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
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
          <div>
            <label className={labelClass}>Doctor *</label>
            <select
              value={form.doctor}
              onChange={(e) => setForm({ ...form, doctor: e.target.value })}
              className={inputClass}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>{d.fullName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className={inputClass}
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
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
              <label className={labelClass}>Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={inputClass}
                required
              />
            </div>
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
              {appointment ? 'Save Changes' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
