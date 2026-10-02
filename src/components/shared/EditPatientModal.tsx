import { useState } from 'react';
import { X, Loader2, Save, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genotypeOptions = ['AA', 'AS', 'SS', 'AC', 'SC'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
const stateOptions = ['Lagos', 'Abuja', 'Oyo', 'Kano', 'Rivers', 'Enugu', 'Delta', 'Ogun'];

export interface PatientEditShape {
  _id: string;
  patientId?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  email?: string;
  address?: string;
  state?: string;
  lga?: string;
  bloodGroup?: string;
  genotype?: string;
  maritalStatus?: string;
  occupation?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  relationship?: string;
  emergencyContact?: string;
  status?: string;
}

interface Props {
  patient: PatientEditShape;
  onClose: () => void;
  onSaved: (updated: PatientEditShape) => void;
}

export default function EditPatientModal({ patient, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    firstName: patient.firstName || '',
    middleName: patient.middleName || '',
    surname: patient.surname || '',
    gender: patient.gender || '',
    dob: patient.dob ? patient.dob.split('T')[0] : '',
    phone: patient.phone || '',
    email: patient.email || '',
    address: patient.address || '',
    state: patient.state || '',
    lga: patient.lga || '',
    bloodGroup: patient.bloodGroup || '',
    genotype: patient.genotype || '',
    maritalStatus: patient.maritalStatus || '',
    occupation: patient.occupation || '',
    nextOfKin: patient.nextOfKin || '',
    nextOfKinPhone: patient.nextOfKinPhone || '',
    relationship: patient.relationship || '',
    emergencyContact: patient.emergencyContact || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';
  const selectClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.firstName.trim() || !form.surname.trim()) {
      setError('First name and surname are required');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address');
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...form };
      if (!form.dob) delete payload.dob;
      const { data } = await api.put(`/patients/${patient._id}`, payload);
      onSaved(data.patient);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update patient');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !saving && onClose()}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !saving) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Patient Information</h3>
            <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input type="text" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Middle Name (Optional)</label>
                <input type="text" value={form.middleName} onChange={(e) => set('middleName', e.target.value)} className={inputClass} placeholder="Leave blank if none" />
              </div>
              <div>
                <label className={labelClass}>Surname *</label>
                <input type="text" value={form.surname} onChange={(e) => set('surname', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={selectClass}>
                  <option value="">Select Gender</option>
                  {genderOptions.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Occupation</label>
                <input type="text" value={form.occupation} onChange={(e) => set('occupation', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Marital Status</label>
                <select value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)} className={selectClass}>
                  <option value="">Select Status</option>
                  {maritalStatusOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select value={form.state} onChange={(e) => set('state', e.target.value)} className={selectClass}>
                  <option value="">Select State</option>
                  {stateOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>LGA</label>
                <input type="text" value={form.lga} onChange={(e) => set('lga', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Medical Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Blood Group</label>
                <select value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} className={selectClass}>
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map((bg) => (
                    <option key={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Genotype</label>
                <select value={form.genotype} onChange={(e) => set('genotype', e.target.value)} className={selectClass}>
                  <option value="">Select Genotype</option>
                  {genotypeOptions.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Next of Kin</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Next of Kin Name</label>
                <input type="text" value={form.nextOfKin} onChange={(e) => set('nextOfKin', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Next of Kin Phone</label>
                <input type="tel" value={form.nextOfKinPhone} onChange={(e) => set('nextOfKinPhone', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Relationship</label>
                <input type="text" value={form.relationship} onChange={(e) => set('relationship', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Emergency Contact</label>
                <input type="text" value={form.emergencyContact} onChange={(e) => set('emergencyContact', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
