import { useState } from 'react';
import { UserPlus, Save, X, Loader2, AlertCircle, CheckCircle, FileDown, Mail } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const initialForm = {
  firstName: '',
  middleName: '',
  surname: '',
  dob: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  state: '',
  lga: '',
  nextOfKin: '',
  nextOfKinPhone: '',
  relationship: '',
  maritalStatus: '',
  occupation: '',
  emergencyContact: '',
  cardType: 'Individual',
  cardNumber: '',
  familyName: '',
  password: '',
};

export default function RegisterPatient() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [created, setCreated] = useState<{
    patientId: string;
    email: string;
    password: string;
    emailSent: boolean;
    reportHtml?: string;
    reportPdf?: string;
    reportFileName?: string;
  } | null>(null);

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.firstName.trim() || !form.surname.trim() || !form.phone.trim() || !form.gender) {
      setError('First name, surname, phone, and gender are required');
      return;
    }
    if (!form.email.trim()) {
      setError('Patient email is required — it receives the welcome message and report card');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid patient email address');
      return;
    }
    if (form.password.length < 6) {
      setError('Portal password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = { ...form };
      if (!form.dob) delete payload.dob;
      const { data } = await api.post('/patients', payload);
      const credentials = {
        patientId: data.patient?.patientId || 'Created',
        email: data.user?.email || form.email || '',
        password: data.defaultPassword || '',
        emailSent: !!data.emailSent,
        reportHtml: data.reportHtml || '',
        reportPdf: data.reportPdf || '',
        reportFileName:
          data.reportFileName ||
          `Patient_Registration_Report_${data.patient?.patientId || 'report'}.pdf`,
      };
      setCreated(credentials);
      setSuccess(
        `Patient registered — ID: ${credentials.patientId}` +
          (credentials.emailSent
            ? ` — Welcome email + report card sent to ${credentials.email}`
            : ` — Account created for ${credentials.email} (email may still be sending)`)
      );
      setForm(initialForm);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register patient');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadReport = () => {
    if (!created?.reportPdf) return;
    const bytes = Uint8Array.from(atob(created.reportPdf), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = created.reportFileName || `Patient_Registration_Report_${created.patientId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openReport = () => {
    if (!created?.reportHtml) return;
    const blob = new Blob([created.reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Register New Patient" icon={UserPlus} />

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}
        {created && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-2">
            <p className="font-semibold text-blue-900">Portal Credentials</p>
            <p className="text-blue-800">Patient ID: <span className="font-mono font-semibold">{created.patientId}</span></p>
            {created.email && <p className="text-blue-800">Login email: <span className="font-mono">{created.email}</span></p>}
            <p className="text-blue-800">Password: <span className="font-mono font-semibold text-red-600">{created.password}</span></p>
            <p className="text-blue-700 text-xs flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {created.emailSent
                ? `Welcome message + report card emailed to ${created.email}.`
                : `Sending welcome message + report card to ${created.email}…`}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={downloadReport}
                disabled={!created.reportPdf}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                Download Report Card (PDF)
              </button>
              <button
                type="button"
                onClick={openReport}
                disabled={!created.reportHtml}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-50 disabled:opacity-50"
              >
                Preview / Print
              </button>
            </div>
            <p className="text-blue-700 text-xs">
              Open or print the report card for the patient file. Advise password change after first login.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
              <label className={labelClass}>Gender *</label>
              <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Phone *</label>
              <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Patient Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={inputClass}
                placeholder="patient@example.com"
                required
              />
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Welcome message + report card are sent here
              </p>
            </div>
            <div>
              <label className={labelClass}>Portal Password *</label>
              <input
                type="text"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                className={inputClass}
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-400 mt-1">Created by you — sent to the patient by email.</p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input type="text" value={form.state} onChange={(e) => set('state', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>LGA</label>
              <input type="text" value={form.lga} onChange={(e) => set('lga', e.target.value)} className={inputClass} />
            </div>

            <div className="sm:col-span-3 border-t border-gray-100 pt-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Registration Card</h3>
            </div>
            <div>
              <label className={labelClass}>Card Type</label>
              <select value={form.cardType} onChange={(e) => set('cardType', e.target.value)} className={inputClass}>
                <option value="Individual">Individual</option>
                <option value="Family">Family Card</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Family Card Number</label>
              <input
                type="text"
                value={form.cardNumber}
                onChange={(e) => set('cardNumber', e.target.value)}
                className={inputClass}
                placeholder={form.cardType === 'Family' ? 'Leave blank to create a new family card' : 'N/A for individual cards'}
                disabled={form.cardType !== 'Family'}
              />
              <p className="text-xs text-gray-400 mt-1">
                {form.cardType === 'Family'
                  ? 'Type an existing FAM- card number so the whole family shares one card, or leave blank to start a new one.'
                  : 'An individual card number is created automatically (the patient ID).'}
              </p>
            </div>
            {form.cardType === 'Family' && (
              <div>
                <label className={labelClass}>Family Name</label>
                <input
                  type="text"
                  value={form.familyName}
                  onChange={(e) => set('familyName', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. The Bello Family"
                />
                <p className="text-xs text-gray-400 mt-1">New members registering later join this family card.</p>
              </div>
            )}

            <div className="sm:col-span-3 border-t border-gray-100 pt-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Next of Kin</h3>
            </div>
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

            <div className="sm:col-span-3 border-t border-gray-100 pt-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Medical Info</h3>
            </div>
            <div>
              <label className={labelClass}>Marital Status</label>
              <select value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)} className={inputClass}>
                <option value="">Select</option>
                <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Occupation</label>
              <input type="text" value={form.occupation} onChange={(e) => set('occupation', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Emergency Contact</label>
              <input type="tel" value={form.emergencyContact} onChange={(e) => set('emergencyContact', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {submitting ? 'Saving...' : 'Save Patient'}
            </button>
            <button
              type="button"
              onClick={() => { setForm(initialForm); setError(''); setSuccess(''); setCreated(null); }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
