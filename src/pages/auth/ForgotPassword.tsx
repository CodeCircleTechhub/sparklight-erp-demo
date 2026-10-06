import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle, Send } from 'lucide-react';
import Logo from '../../components/logo/Logo';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not send the reset email. Please try again.');
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

        {sent ? (
          <div>
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                Reset link sent to <strong>{email}</strong>
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              We have sent a password reset link to <strong>{email}</strong>. Open the email and click{' '}
              <strong>New Password</strong>, then enter and confirm your new password and save.
            </p>
            <Link
              to="/login"
              className="inline-flex w-full justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 mb-6">
              Enter your email address and we will send you a password reset link.
            </p>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
