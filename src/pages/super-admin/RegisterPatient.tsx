import { useState } from 'react';
import { UserPlus, Loader2, CheckCircle, AlertCircle, FileDown, Mail } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genotypeOptions = ['AA', 'AS', 'SS', 'AC', 'SC'];
const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
const stateOptions = ['Lagos', 'Abuja', 'Oyo', 'Kano', 'Rivers', 'Enugu', 'Delta', 'Ogun'];

export default function RegisterPatient() {
  const [form, setForm] = useState({
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
    bloodGroup: '',
    genotype: '',
    maritalStatus: '',
    occupation: '',
    emergencyContact: '',
    cardType: 'Individual',
    cardNumber: '',
    familyName: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{
    patientId: string;
    email: string;
    password: string;
    emailSent: boolean;
    reportHtml?: string;
    reportPdf?: string;
    reportFileName?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
    setCreated(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (form.password.length < 6) {
      setLoading(false);
      setError('Portal password must be at least 6 characters');
      return;
    }
    if (!form.email.trim()) {
      setLoading(false);
      setError('Patient email is required — it receives the welcome message and report card');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setLoading(false);
      setError('Enter a valid patient email address');
      return;
    }

    try {
      const payload = {
        firstName: form.firstName,
        middleName: form.middleName,
        surname: form.surname,
        dob: form.dob,
        gender: form.gender,
        phone: form.phone,
        email: form.email,
        address: form.address,
        state: form.state,
        lga: form.lga,
        nextOfKin: form.nextOfKin,
        nextOfKinPhone: form.nextOfKinPhone,
        relationship: form.relationship,
        bloodGroup: form.bloodGroup,
        genotype: form.genotype,
        maritalStatus: form.maritalStatus,
        occupation: form.occupation,
        emergencyContact: form.emergencyContact,
        cardType: form.cardType,
        cardNumber: form.cardNumber,
        familyName: form.familyName,
        password: form.password,
      };

      const res = await api.post('/patients', payload);
      const patientId = res.data.patient?.patientId ?? 'new patient';
      const credentials = {
        patientId,
        email: res.data.user?.email || form.email || '',
        password: res.data.defaultPassword || '',
        emailSent: !!res.data.emailSent,
        reportHtml: res.data.reportHtml || '',
        reportPdf: res.data.reportPdf || '',
        reportFileName:
          res.data.reportFileName || `Patient_Registration_Report_${patientId}.pdf`,
      };
      setCreated(credentials);
      setSuccess(`Patient "${patientId}" registered successfully!`);
      setForm({
        firstName: '', middleName: '', surname: '', dob: '', gender: '',
        phone: '', email: '', address: '', state: '', lga: '',
        nextOfKin: '', nextOfKinPhone: '', relationship: '', bloodGroup: '',
        genotype: '', maritalStatus: '', occupation: '', emergencyContact: '',
        cardType: 'Individual', cardNumber: '', familyName: '',
        password: '',
      });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Failed to register patient. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none';
  const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

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
    <div className="space-y-6">
      <PageHeader title="Register New Patient" icon={UserPlus} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {success && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-sm font-medium text-green-800">{success}</span>
          </div>
        )}

        {created && (
          <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm space-y-2">
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
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="text-sm font-medium text-red-800">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Middle Name (Optional)</label>
                <input type="text" name="middleName" value={form.middleName} onChange={handleChange} className={inputClass} placeholder="Leave blank if none" />
              </div>
              <div>
                <label className={labelClass}>Surname *</label>
                <input type="text" name="surname" value={form.surname} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Date of Birth *</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={selectClass} required>
                  <option value="">Select Gender</option>
                  {genderOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Occupation</label>
                <input type="text" name="occupation" value={form.occupation} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Marital Status</label>
                <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className={selectClass}>
                  <option value="">Select Status</option>
                  {maritalStatusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Phone *</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Patient Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-400 mt-1">Created by you — sent to the patient by email.</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select name="state" value={form.state} onChange={handleChange} className={selectClass}>
                  <option value="">Select State</option>
                  {stateOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>LGA</label>
                <input type="text" name="lga" value={form.lga} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={selectClass}>
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Genotype</label>
                <select name="genotype" value={form.genotype} onChange={handleChange} className={selectClass}>
                  <option value="">Select Genotype</option>
                  {genotypeOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Registration Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Card Type</label>
                <select name="cardType" value={form.cardType} onChange={handleChange} className={selectClass}>
                  <option value="Individual">Individual</option>
                  <option value="Family">Family Card</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Family Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  disabled={form.cardType !== 'Family'}
                  className={inputClass}
                  placeholder={form.cardType === 'Family' ? 'Leave blank to create a new family card' : 'N/A for individual cards'}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.cardType === 'Family'
                    ? 'Share one FAM- number across the family, or leave blank to start a new family card.'
                    : 'An individual card number is created automatically (the patient ID).'}
                </p>
              </div>
              {form.cardType === 'Family' && (
                <div>
                  <label className={labelClass}>Family Name</label>
                  <input
                    type="text"
                    name="familyName"
                    value={form.familyName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. The Bello Family"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Next of Kin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Next of Kin Name</label>
                <input type="text" name="nextOfKin" value={form.nextOfKin} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Next of Kin Phone</label>
                <input type="tel" name="nextOfKinPhone" value={form.nextOfKinPhone} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Relationship</label>
                <input type="text" name="relationship" value={form.relationship} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Emergency Contact</label>
                <input type="text" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Patient'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({
                  firstName: '', middleName: '', surname: '', dob: '', gender: '',
                  phone: '', email: '', address: '', state: '', lga: '',
                  nextOfKin: '', nextOfKinPhone: '', relationship: '', bloodGroup: '',
                  genotype: '', maritalStatus: '', occupation: '', emergencyContact: '',
                  cardType: 'Individual', cardNumber: '', familyName: '',
                  password: '',
                });
                setSuccess('');
        setError('');
        setCreated(null);
      }}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
