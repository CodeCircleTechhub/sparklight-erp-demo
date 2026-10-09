import { useState } from 'react';
import { X, Loader2, AlertCircle, CheckCircle, UserPlus, Mail, MailWarning } from 'lucide-react';
import api from '../../services/api';

const RELATIONSHIP_OPTIONS = [
  'Son',
  'Daughter',
  'Wife',
  'Husband',
  'Mother',
  'Father',
  'Brother',
  'Sister',
  'Cousin',
  'Nephew',
  'Niece',
  'Grandson',
  'Granddaughter',
  'Grandfather',
  'Grandmother',
  'Guardian',
  'Ward',
  'Other',
];

interface Props {
  patientId: string;
  patientName: string;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const emptyForm = {
  relationship: '',
  firstName: '',
  middleName: '',
  surname: '',
  gender: '',
  dob: '',
  phone: '',
  email: '',
  address: '',
  state: '',
  lga: '',
  maritalStatus: '',
  occupation: '',
  nextOfKin: '',
  nextOfKinPhone: '',
  password: '',
};

export default function AddRelativeModal({ patientId, patientName, onClose, onSaved }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ patientId: string; password: string; emailSent: boolean } | null>(null);

  const inputClass =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setError('');
    if (!form.relationship) return setError('Select the relationship to the head of the family');
    if (!form.firstName.trim() || !form.surname.trim() || !form.phone.trim() || !form.gender) {
      return setError('First name, surname, phone and gender are required');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return setError('Enter a valid patient email address — the family card email is sent there');
    }
    if (form.password.length < 6) {
      return setError('Portal password must be at least 6 characters');
    }
    setSaving(true);
    try {
      const { data } = await api.post('/family/relatives', { patientId, ...form });
      setDone({
        patientId: data.patient?.patientId || '',
        password: data.defaultPassword,
        emailSent: !!data.emailSent,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not add relative');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={() => !saving && onClose()}>
      <div
        className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600 shrink-0" />
              Add relative
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Linked to {patientName}&rsquo;s family card — gets a portal account and a family registration email.
            </p>
          </div>
          <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {done ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm text-emerald-800">
                  <p className="font-semibold">Relative added to the family card</p>
                  <p className="mt-1">
                    Patient ID <strong>{done.patientId}</strong> · Portal password{' '}
                    <strong className="font-mono">{done.password}</strong>
                  </p>
                  <p className="mt-2 flex items-center gap-1.5">
                    {done.emailSent ? (
                      <>
                        <Mail className="w-4 h-4 shrink-0" /> Family card email sent successfully
                      </>
                    ) : (
                      <>
                        <MailWarning className="w-4 h-4 shrink-0" /> Email could not be sent — give the credentials in
                        person
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => onSaved(`Relative added — registered under ${done.patientId}`)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className={labelClass}>Relationship to head of family *</label>
                <select value={form.relationship} onChange={(e) => set('relationship', e.target.value)} className={inputClass}>
                  <option value="">Select relationship</option>
                  {RELATIONSHIP_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>First name *</label>
                  <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Middle name</label>
                  <input value={form.middleName} onChange={(e) => set('middleName', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Surname *</label>
                  <input value={form.surname} onChange={(e) => set('surname', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Date of birth</label>
                  <input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
                </div>
                <div className="sm:col-span-3">
                  <label className={labelClass}>Address</label>
                  <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input value={form.state} onChange={(e) => set('state', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>LGA</label>
                  <input value={form.lga} onChange={(e) => set('lga', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Marital status</label>
                  <select value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Occupation</label>
                  <input value={form.occupation} onChange={(e) => set('occupation', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Next of kin</label>
                  <input value={form.nextOfKin} onChange={(e) => set('nextOfKin', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Next of kin phone</label>
                  <input type="tel" value={form.nextOfKinPhone} onChange={(e) => set('nextOfKinPhone', e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Portal password *</label>
                  <input type="text" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputClass} placeholder="min 6 characters" />
                </div>
              </div>
            </div>
          )}
        </div>

        {!done && (
          <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Add relative
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
