import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import Logo from '../../components/logo/Logo';
import api from '../../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tokenError, setTokenError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError('Missing reset link. Please request a new password reset.');
      setChecking(false);
      return;
    }
    api
      .get(`/auth/reset-password/${token}`)
      .catch(() => setTokenError('This reset link is invalid or has expired. Please request a new one.'))
      .finally(() => setChecking(false));
  }, [token]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate('/login'), 4000);
    return () => clearTimeout(t);
  }, [done, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('New Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('New Password and Confirm New Password do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password, confirmPassword });
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not reset your password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Login</span>
        </Link>

        <div className="mb-8">
          <Logo />
        </div>

        {checking ? (
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
            Verifying reset link...
          </div>
        ) : tokenError ? (
          <div>
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{tokenError}</span>
            </div>
            <Link
              to="/forgot-password"
              className="inline-flex w-full justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Request a New Reset Link
            </Link>
          </div>
        ) : done ? (
          <div>
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>You have successfully changed your password.</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              You will be redirected to the login page shortly. Use your new password to sign in.
            </p>
            <Link
              to="/login"
              className="inline-flex w-full justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Continue to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
            <p className="text-gray-500 mb-6">Enter and confirm your new password, then save.</p>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save New Password'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
