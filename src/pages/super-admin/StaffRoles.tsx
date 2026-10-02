import { useState, useEffect, useCallback } from 'react';
import { Shield, Users, UserPlus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const roles = [
  { role: 'super-admin', name: 'Super Admin', description: 'Full system access with all permissions', permissionsCount: 24 },
  { role: 'manager', name: 'Manager', description: 'Department management and oversight', permissionsCount: 18 },
  { role: 'receptionist', name: 'Receptionist', description: 'Patient registration and appointment scheduling', permissionsCount: 10 },
  { role: 'customer-care', name: 'Customer Care', description: 'Patient cases, enquiries and complaint resolution', permissionsCount: 8 },
  { role: 'senior-customer-care', name: 'Senior Customer Care', description: 'Advanced case management, escalations and department requests', permissionsCount: 14 },
  { role: 'nurse', name: 'Nurse', description: 'Patient care and medication administration', permissionsCount: 12 },
  { role: 'doctor', name: 'Doctor', description: 'Diagnosis, prescriptions, and consultations', permissionsCount: 16 },
  { role: 'laboratory', name: 'Laboratory', description: 'Lab tests and result management', permissionsCount: 10 },
  { role: 'pharmacist', name: 'Pharmacist', description: 'Medication dispensing and inventory', permissionsCount: 9 },
  { role: 'accountant', name: 'Accountant', description: 'Financial records and billing management', permissionsCount: 11 },
  { role: 'hr', name: 'HR', description: 'Staff records and attendance management', permissionsCount: 14 },
];

const statusColor = (s: string) => {
  return s === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';
};

export default function StaffRoles() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeCounts, setActiveCounts] = useState<Record<string, number>>({});

  const fetchSetting = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [setting, users] = await Promise.all([
        api.get('/system/settings/hr-employee-management'),
        api.get('/users').catch(() => ({ data: {} })),
      ]);
      setEnabled(!!setting.data.enabled);
      const counts: Record<string, number> = {};
      for (const u of users.data.users || []) {
        if (u.isActive === false || !u.role) continue;
        counts[u.role] = (counts[u.role] || 0) + 1;
      }
      setActiveCounts(counts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load permission setting');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSetting();
  }, [fetchSetting]);

  const togglePermission = async () => {
    setToggling(true);
    setError('');
    setSuccess('');
    try {
      const next = !enabled;
      const { data } = await api.put('/system/settings/hr-employee-management', { enabled: next });
      setEnabled(!!data.enabled);
      setSuccess(data.message || 'Permission updated');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update permission');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Roles & Permissions" icon={Shield} />

      {/* HR Employee Management Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg ${enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
              {enabled ? <UserPlus className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">HR Employee Management</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Control whether the HR role can add and edit employees.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {loading ? '...' : enabled ? 'ON' : 'OFF'}
            </span>
            <button
              onClick={togglePermission}
              disabled={loading || toggling}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                enabled ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={enabled ? 'Turn OFF' : 'Turn ON'}
              aria-label={enabled ? 'Disable HR employee management' : 'Enable HR employee management'}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  enabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
              {toggling && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                </span>
              )}
            </button>
          </div>
        </div>

        {(error || success) && (
          <div
            className={`px-5 py-3 text-sm flex items-center gap-2 ${
              error ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            {error || success}
          </div>
        )}

        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`rounded-lg border p-4 ${enabled ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <UserPlus className={`w-4 h-4 ${enabled ? 'text-emerald-600' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">Add Employee</p>
            </div>
            <p className="text-xs text-gray-500">
              {enabled ? 'HR can create new employee accounts.' : 'HR cannot add employees.'}
            </p>
          </div>
          <div className={`rounded-lg border p-4 ${enabled ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Pencil className={`w-4 h-4 ${enabled ? 'text-emerald-600' : 'text-gray-400'}`} />
              <p className="text-sm font-medium text-gray-900">Edit Employee</p>
            </div>
            <p className="text-xs text-gray-500">
              {enabled ? 'HR can update salary, benefits, and status.' : 'HR cannot edit employees.'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Trash2 className="w-4 h-4 text-red-500" />
              <p className="text-sm font-medium text-gray-900">Delete Employee</p>
            </div>
            <p className="text-xs text-gray-500">Always Super Admin only. HR can never delete.</p>
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={fetchSetting}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh status
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Role Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Staff Count</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Permissions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((row) => {
                const count = activeCounts[row.role] ?? 0;
                const status = count > 0 ? 'Active' : 'Inactive';
                return (
                <tr key={row.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                    {row.name === 'HR'
                      ? enabled
                        ? 'Staff records, attendance, add & edit employees (no delete)'
                        : 'Staff records and attendance (add/edit disabled by Super Admin)'
                      : row.description}
                  </td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">
                    {row.name === 'HR' ? <Users className="inline w-4 h-4 mr-1 text-gray-400" /> : null}
                    {loading ? '…' : count}
                  </td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.permissionsCount}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(status)}`}>
                      {status}
                    </span>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
