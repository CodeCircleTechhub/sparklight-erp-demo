import { Settings, Save, Lock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const tabs = ['General', 'Profile', 'Notifications', 'Security'];

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
}

export default function ManagerSettings() {
  const [activeTab, setActiveTab] = useState('General');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalEmail, setHospitalEmail] = useState('');
  const [hospitalPhone, setHospitalPhone] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        const user = data.user;
        setProfile(user);
        const parts = (user.fullName || '').split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setHospitalEmail(user.email || '');
        setHospitalPhone(user.phone || '');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const { data } = await api.put('/auth/profile', {
        fullName: `${firstName} ${lastName}`.trim(),
        email: hospitalEmail,
        phone: hospitalPhone,
      });
      setProfile(data.user || { ...profile, fullName: `${firstName} ${lastName}`.trim(), email: hospitalEmail, phone: hospitalPhone } as UserProfile);
      setMessage('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!currentPassword || !newPassword) {
      setError('All password fields are required');
      return;
    }
    setChangingPassword(true);
    setMessage('');
    setError('');
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Hospital Settings" icon={Settings} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setMessage(''); setError(''); }}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {message && (
              <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>
            )}
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading profile...</div>
            ) : (
              <>
                {activeTab === 'General' && (
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                      <input type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={hospitalEmail} onChange={(e) => setHospitalEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={hospitalPhone} onChange={(e) => setHospitalPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea rows={3} value={hospitalAddress} onChange={(e) => setHospitalAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                )}

                {activeTab === 'Profile' && (
                  <div className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <input type="text" value={profile?.role || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input type="text" value={profile?.department || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                    </div>
                  </div>
                )}

                {activeTab === 'Notifications' && (
                  <div className="space-y-4 max-w-2xl">
                    {['Email Notifications', 'SMS Notifications', 'Push Notifications', 'Low Stock Alerts', 'Appointment Reminders', 'Payment Alerts'].map((item) => (
                      <label key={item} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">{item}</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500 rounded" />
                      </label>
                    ))}
                  </div>
                )}

                {activeTab === 'Security' && (
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                      >
                        <Lock className="w-4 h-4" />
                        {changingPassword ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
