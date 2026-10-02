import { useState } from 'react';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const departmentOptions = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General', 'Dermatology', 'ENT', 'Laboratory', 'Pharmacy', 'Accounting', 'HR', 'IT'];
const roleOptions: { value: string; label: string }[] = [
  { value: 'manager', label: 'Manager' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'customer-care', label: 'Customer Care' },
  { value: 'senior-customer-care', label: 'Senior Customer Care' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'hr', label: 'HR' },
];
const genderOptions = ['Male', 'Female', 'Other'];

export default function AddStaff() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    department: '',
    position: '',
    role: '',
    employmentDate: '',
    password: '',
    salary: '',
    benefits: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.trim().length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/users/staff', {
        ...form,
        password: form.password.trim(),
        salary: form.salary ? Number(form.salary) : 0,
        benefits: form.benefits.trim(),
      });
      const emailSent = !!res.data?.emailSent;
      setMessage({
        type: 'success',
        text: emailSent
          ? 'Staff member added successfully! Appointment letter PDF emailed with credentials.'
          : 'Staff member added successfully! Email delivery failed — resend from staff list.',
      });
      setForm({
        fullName: '', email: '', phone: '', gender: '', dob: '',
        department: '', position: '', role: '', employmentDate: '',
        password: '', salary: '', benefits: '',
      });
    } catch (err: any) {
      const text = err.response?.data?.message || 'Failed to add staff member. Please try again.';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none';
  const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader title="Add New Staff" icon={UserPlus} />

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className={labelClass}>Full Name</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className={selectClass} required>
                  <option value="">Select Gender</option>
                  {genderOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Employment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Department</label>
                <select name="department" value={form.department} onChange={handleChange} className={selectClass} required>
                  <option value="">Select Department</option>
                  {departmentOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Position</label>
                <input type="text" name="position" value={form.position} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} className={selectClass} required>
                  <option value="">Select Role</option>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Employment Date</label>
                <input type="date" name="employmentDate" value={form.employmentDate} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Default Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                    placeholder="Min. 6 characters"
                    className={inputClass + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Annual Salary (₦)</label>
                <input type="number" name="salary" min="0" value={form.salary} onChange={handleChange} placeholder="e.g. 500000" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Benefits</label>
                <textarea
                  name="benefits"
                  value={form.benefits}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Health insurance, housing allowance"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Staff
            </button>
            <button type="button" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
