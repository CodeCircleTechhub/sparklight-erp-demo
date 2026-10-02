import { useEffect, useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Droplets,
  Shield,
  Users,
  Edit,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface PatientData {
  patientId: string;
  firstName: string;
  middleName?: string;
  surname: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  phone?: string;
  email?: string;
  address?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  relationship?: string;
  occupation?: string;
  emergencyContact?: string;
  cardType?: string;
  cardNumber?: string;
  familyName?: string;
}

export default function PatientProfile() {
  const { user, refreshUser } = useAuth();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [family, setFamily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({
    phone: '',
    email: '',
    address: '',
    bloodGroup: '',
    nextOfKin: '',
    nextOfKinPhone: '',
    relationship: '',
    occupation: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/patient/me');
        if (cancelled) return;
        const p = res.data.patient as PatientData;
        setPatient(p);
        if (p.cardType === 'Family' && p.cardNumber) {
          api
            .get('/patients', { params: { cardNumber: p.cardNumber } })
            .then((r) => {
              if (!cancelled) setFamily(r.data.patients || []);
            })
            .catch(() => {});
        }
        setForm({
          phone: p.phone || '',
          email: p.email || '',
          address: p.address || '',
          bloodGroup: p.bloodGroup || '',
          nextOfKin: p.nextOfKin || '',
          nextOfKinPhone: p.nextOfKinPhone || '',
          relationship: p.relationship || '',
          occupation: p.occupation || '',
        });
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await api.put('/patient/me', form);
      setPatient(res.data.patient);
      setEditing(false);
      refreshUser();
    } catch (err: any) {
      setSaveError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center text-gray-500">Loading profile…</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      </div>
    );
  }

  const fullName = patient ? `${patient.firstName} ${patient.middleName || ''} ${patient.surname}`.trim() : user?.fullName || '';
  const initials = fullName
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const personalInfo = [
    { label: 'Full Name', value: fullName, icon: User },
    {
      label: 'Date of Birth',
      value: patient?.dob ? new Date(patient.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—',
      icon: Calendar,
    },
    { label: 'Gender', value: patient?.gender || '—', icon: User },
    { label: 'Blood Group', value: patient?.bloodGroup || '—', icon: Droplets },
    { label: 'Phone', value: patient?.phone || '—', icon: Phone },
    { label: 'Email', value: patient?.email || user?.email || '—', icon: Mail },
    { label: 'Address', value: patient?.address || '—', icon: MapPin },
    { label: 'Occupation', value: patient?.occupation || '—', icon: User },
  ];

  const emergencyContact = [
    { label: 'Name', value: patient?.nextOfKin || '—' },
    { label: 'Relationship', value: patient?.relationship || '—' },
    { label: 'Phone', value: patient?.nextOfKinPhone || patient?.emergencyContact || '—' },
  ];

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium text-sm disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-white flex items-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-medium text-sm"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {saveError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{saveError}</div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {initials || 'PT'}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
              <p className="text-gray-500">Patient ID: {patient?.patientId || user?.patientId || '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personalInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 break-words">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editing && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Contact & Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Blood Group</label>
                <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Occupation</label>
                <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Next of Kin</label>
                <input type="text" value={form.nextOfKin} onChange={(e) => setForm({ ...form, nextOfKin: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Next of Kin Phone</label>
                <input type="tel" value={form.nextOfKinPhone} onChange={(e) => setForm({ ...form, nextOfKinPhone: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Relationship</label>
                <input type="text" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="space-y-3">
              {emergencyContact.map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 gap-3">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Account
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-500">Patient ID</span>
                <span className="text-sm font-medium text-gray-900 font-mono">{patient?.patientId || '—'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-500">Registration Card</span>
                <span
                  className={`text-sm font-medium font-mono ${
                    (patient?.cardType || 'Individual') === 'Family' ? 'text-purple-700' : 'text-gray-900'
                  }`}
                >
                  {(patient?.cardType || 'Individual') === 'Family' ? 'Family' : 'Individual'} ·{' '}
                  {patient?.cardNumber || patient?.patientId || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-500">Login Email</span>
                <span className="text-sm font-medium text-gray-900">{user?.email || '—'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-500">Insurance</span>
                <span className="text-sm font-medium text-gray-400">Not on file</span>
              </div>
            </div>
          </div>

          {(patient?.cardType || 'Individual') === 'Family' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Family Card {patient?.familyName ? `· ${patient.familyName}` : ''}
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Card number <span className="font-mono font-semibold">{patient?.cardNumber}</span> is shared by everyone in this family.
              </p>
              {family.length > 1 ? (
                <ul className="space-y-2">
                  {family.map((m: any) => (
                    <li
                      key={m._id}
                      className="flex justify-between items-center p-3 rounded-lg bg-purple-50 border border-purple-100"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {[m.firstName, m.surname].filter(Boolean).join(' ')}
                        {m.patientId ? ` · ${m.patientId}` : ''}
                        {m.patientId === patient?.patientId ? ' (you)' : ''}
                      </span>
                      <span className="text-xs text-purple-700">{m.gender || ''}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No other family members are registered on this card yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
