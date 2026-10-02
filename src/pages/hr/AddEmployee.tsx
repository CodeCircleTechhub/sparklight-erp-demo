import { useState, useEffect } from 'react';
import { UserPlus, Save, X, Loader2, CheckCircle, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const roleOptions = [
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'hr', label: 'HR' },
  { value: 'manager', label: 'Manager' },
  { value: 'customer-care', label: 'Customer Care' },
  { value: 'senior-customer-care', label: 'Senior Customer Care' },
];

export default function AddEmployee() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [canAdd, setCanAdd] = useState(true);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('');
  const [employmentDate, setEmploymentDate] = useState('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [benefits, setBenefits] = useState('');

  const isHrRole = user?.role === 'hr';

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get('/departments');
        const deptData = res.data.departments ?? res.data ?? [];
        setDepartments(deptData.map((d: any) => d.name || d.department || d));
      } catch {
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchPermission = async () => {
      if (!isHrRole) {
        setCanAdd(true);
        setPermissionLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/system/settings/hr-employee-management');
        setCanAdd(!!data.enabled);
      } catch {
        setCanAdd(false);
      } finally {
        setPermissionLoading(false);
      }
    };
    fetchPermission();
  }, [isHrRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;

    if (password.trim().length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (salary && (Number.isNaN(Number(salary)) || Number(salary) < 0)) {
      setMessage({ type: 'error', text: 'Salary must be a valid number' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post('/users/staff', {
        fullName,
        email,
        phone,
        gender,
        dob,
        department,
        position,
        role,
        employmentDate,
        password: password.trim(),
        salary: salary ? Number(salary) : 0,
        benefits: benefits.trim(),
      });
      const emailSent = !!res.data?.emailSent;
      const staffId = res.data?.user?.staffId || '';
      setMessage({
        type: 'success',
        text: emailSent
          ? `Employee added successfully! Appointment letter (PDF) with password and salary emailed to ${email}. Staff ID: ${staffId}`
          : `Employee added successfully! Staff ID: ${staffId}. Email delivery failed — use Send Email from the employee action menu.`,
      });
      setFullName('');
      setEmail('');
      setPhone('');
      setGender('');
      setDob('');
      setDepartment('');
      setPosition('');
      setRole('');
      setEmploymentDate('');
      setPassword('');
      setSalary('');
      setBenefits('');
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || 'Failed to add employee';
      if (err.response?.status === 403 && isHrRole) {
        setCanAdd(false);
      }
      setMessage({ type: 'error', text: apiMessage });
    } finally {
      setLoading(false);
    }
  };

  if (permissionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
      </div>
    );
  }

  if (!canAdd) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <PageHeader title="Add New Employee" icon={UserPlus} />
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Adding employees is disabled</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              The Super Admin has turned off HR employee management. You currently cannot add new employees.
              Contact the Super Admin to re-enable this permission.
            </p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <PageHeader title="Add New Employee" icon={UserPlus} />

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={departmentsLoading}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                >
                  <option value="">{departmentsLoading ? 'Loading...' : 'Select department'}</option>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                >
                  <option value="">Select role</option>
                  {roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Date</label>
                <input
                  type="date"
                  required
                  value={employmentDate}
                  onChange={(e) => setEmploymentDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
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
                <p className="mt-1 text-xs text-gray-400">Emailed to staff with the appointment letter PDF.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Salary (₦)</label>
                <input
                  type="number"
                  min="0"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-400">Included in the appointment letter PDF email.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  rows={2}
                  placeholder="e.g. Health insurance, housing allowance, transport"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
