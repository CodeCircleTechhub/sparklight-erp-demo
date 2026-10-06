import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, BarChart3, Users, Building2, ArrowLeft, AlertCircle, Loader2, User } from 'lucide-react';
import Logo from '../../components/logo/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardRoute } from '../../utils/dashboardRoutes';

type Role = 'admin' | 'manager' | 'staff' | 'patient';
type StaffRole = 'receptionist' | 'customer-care' | 'nurse' | 'doctor' | 'laboratory' | 'pharmacist' | 'accountant' | 'hr';

const mainRoles: { id: Role; label: string; icon: typeof Shield }[] = [
  { id: 'admin', label: 'Admin', icon: Shield },
  { id: 'manager', label: 'Manager', icon: BarChart3 },
  { id: 'staff', label: 'Staff', icon: Users },
  { id: 'patient', label: 'Patient', icon: Building2 },
];

const staffRoles: { id: StaffRole; label: string }[] = [
  { id: 'receptionist', label: 'Receptionist' },
  { id: 'customer-care', label: 'Customer Care' },
  { id: 'nurse', label: 'Nurse' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'laboratory', label: 'Laboratory' },
  { id: 'pharmacist', label: 'Pharmacist' },
  { id: 'accountant', label: 'Accountant' },
  { id: 'hr', label: 'HR' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedStaffRole, setSelectedStaffRole] = useState<StaffRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = storedUser.role || '';
      navigate(getDashboardRoute(userRole));
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setSelectedStaffRole(null);
    setError('');
    setEmail('');
    setPassword('');
  };

  const isStaffLogin = selectedRole === 'staff';
  const isPatientLogin = selectedRole === 'patient';
  const getPlaceholder = () => {
    if (!selectedRole) return 'Enter your email or staff ID';
    if (selectedRole === 'admin') return 'admin@sparklight.com';
    if (selectedRole === 'manager') return 'manager@sparklight.com';
    if (selectedRole === 'patient') return 'Patient ID (e.g. PT-001) or email';
    return 'Staff ID (e.g. SPHDR001) or email';
  };
  const getLoginHint = () => {
    if (isStaffLogin) return 'Staff: Use your Staff ID (e.g. SPHDR001) and surname (lowercase) as password. Change password after first login.';
    if (isPatientLogin) return 'Patients: Use your Patient ID (e.g. PT-001) or email. Default password was sent to your email — change it after first login.';
    return '';
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Blue Gradient */}
      <div className="lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-900 text-white p-10 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-white/10 rounded-full" />

        <div className="relative z-10 max-w-lg mx-auto lg:mx-0">
          <div className="mb-8">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">SparkLight Hospital</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Enterprise Resource Planning System for modern healthcare management. Streamline operations, enhance patient care, and optimize hospital workflows.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
              <span className="text-white/70">Real-time patient monitoring and analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
              <span className="text-white/70">Integrated pharmacy and lab management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
              <span className="text-white/70">Automated billing and staff scheduling</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
              <span className="text-white/70">HIPAA-compliant data security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="mb-8">
            <Logo />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SparkLight</h2>
          <p className="text-gray-500 mb-8">Select your role and sign in to continue</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Role Selector Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {mainRoles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedRole === role.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Staff Sub-Role Selector */}
          {selectedRole === 'staff' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Select Staff Role</p>
              <div className="grid grid-cols-2 gap-2">
                {staffRoles.map((sr) => (
                  <button
                    key={sr.id}
                    type="button"
                    onClick={() => setSelectedStaffRole(sr.id)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedStaffRole === sr.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {sr.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / Staff ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isStaffLogin ? 'Staff ID / Email' : isPatientLogin ? 'Patient ID / Email' : 'Email Address'}
                </label>
                <div className="relative">
                  {isStaffLogin || isPatientLogin ? (
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  )}
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
                {(isStaffLogin || isPatientLogin) && (
                  <p className="mt-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md">
                    {getLoginHint()}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isStaffLogin
                        ? 'Your surname (lowercase)'
                        : isPatientLogin
                        ? 'Your default password'
                        : 'Enter your password'
                    }
                    className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600">Remember Me</span>
                </label>
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Forgot Password?
                  </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          )}

          {!selectedRole && (
            <div className="text-center py-10 text-gray-400">
              <p>Please select a role above to continue</p>
            </div>
          )}

          {/* Contact Administrator */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Administrator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
