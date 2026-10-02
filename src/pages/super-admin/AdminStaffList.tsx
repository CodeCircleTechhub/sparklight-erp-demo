import { useState, useEffect, useCallback } from 'react';
import { Search, Users, UserCheck, UserX, Clock, Loader2, Trash2, Edit, X, Shield, ShieldOff, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';
import api from '../../services/api';

const departmentOptions = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General', 'Dermatology', 'ENT', 'Laboratory', 'Pharmacy', 'Accounting', 'HR', 'IT'];
const roleOptions = [
  { value: 'super-admin', label: 'Super Admin' },
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

export default function AdminStaffList() {
  const [search, setSearch] = useState('');
  const [staff, setStaff] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, onLeave: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editStaff, setEditStaff] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', gender: '', department: '', position: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [suspendConfirm, setSuspendConfirm] = useState<any | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [activateConfirm, setActivateConfirm] = useState<string | null>(null);
  const [roleChangeStaff, setRoleChangeStaff] = useState<any | null>(null);
  const [newRole, setNewRole] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { search } });
      const users = res.data.users || [];
      const totalStaff = users.filter((u: any) => u.role !== 'patient' && u.role !== 'super-admin');
      setStaff(totalStaff);
      setStats({
        total: totalStaff.length,
        active: totalStaff.filter((u: any) => u.isActive).length,
        onLeave: 0,
        inactive: totalStaff.filter((u: any) => !u.isActive).length,
      });
    } catch (err) {
      console.error('Failed to fetch staff', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  useEffect(() => {
    if (message) { const t = setTimeout(() => setMessage(null), 4000); return () => clearTimeout(t); }
  }, [message]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setMessage({ type: 'success', text: 'Staff member permanently deleted from database (including related records)' });
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete staff member' });
      setDeleteConfirm(null);
    }
  };

  const handleSuspend = async () => {
    if (!suspendConfirm) return;
    try {
      await api.put(`/users/${suspendConfirm}/suspend`, { reason: suspendReason });
      setMessage({ type: 'success', text: 'Staff account suspended. Notification email sent.' });
      setSuspendConfirm(null);
      setSuspendReason('');
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to suspend staff' });
      setSuspendConfirm(null);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await api.put(`/users/${id}/activate`);
      setMessage({ type: 'success', text: 'Staff account activated. Notification email sent.' });
      setActivateConfirm(null);
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to activate staff' });
      setActivateConfirm(null);
    }
  };

  const handleRoleChange = async () => {
    if (!roleChangeStaff || !newRole) return;
    try {
      await api.put(`/users/${roleChangeStaff._id}/role`, { role: newRole });
      setMessage({ type: 'success', text: `Role updated to ${roleOptions.find(r => r.value === newRole)?.label}. Notification email sent.` });
      setRoleChangeStaff(null);
      setNewRole('');
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change role' });
      setRoleChangeStaff(null);
    }
  };

  const openEdit = (s: any) => {
    setEditStaff(s);
    setEditForm({
      fullName: s.fullName || '',
      phone: s.phone || '',
      gender: s.gender || '',
      department: s.department || '',
      position: s.position || '',
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await api.put(`/users/${editStaff._id}`, editForm);
      setMessage({ type: 'success', text: 'Staff information updated successfully' });
      setEditStaff(null);
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update staff' });
    } finally {
      setEditLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Staff', value: stats.total, icon: Users, color: 'blue' as const },
    { title: 'Active Staff', value: stats.active, icon: UserCheck, color: 'green' as const },
    { title: 'On Leave', value: stats.onLeave, icon: Clock, color: 'yellow' as const },
    { title: 'Inactive/Suspended', value: stats.inactive, icon: UserX, color: 'red' as const },
  ];

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none';
  const selectClass = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none appearance-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <PageHeader title="All Staff" icon={Users} description="Manage all hospital staff members" />

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Staff Directory</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No staff members found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Staff ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((row) => (
                  <tr key={row._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-600 whitespace-nowrap">{row.staffId || '-'}</td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.fullName}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
                        {row.role.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.department || '-'}</td>
                    <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.email}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {row.isActive ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700">
                            Suspended
                          </span>
                          {row.suspendedByRole && (
                            <span className="text-xs text-gray-500 capitalize">by {row.suspendedByRole}</span>
                          )}
                          {row.suspensionReason && (
                            <span className="text-xs text-gray-400 max-w-[150px] truncate" title={row.suspensionReason}>
                              Reason: {row.suspensionReason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setRoleChangeStaff(row); setNewRole(row.role); }} className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors cursor-pointer" title="Change Role">
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        {row.isActive ? (
                          <button onClick={() => { setSuspendConfirm(row._id); setSuspendReason(''); }} className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer" title="Suspend">
                            <ShieldOff className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button onClick={() => setActivateConfirm(row._id)} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer" title="Activate">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => setDeleteConfirm(row._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to permanently delete this staff member from the database? Attendance, leave, payroll, appointments, and notifications will also be removed. This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation */}
      {suspendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Suspend Staff Account</h3>
            <p className="text-sm text-gray-600 mb-4">The staff member will receive a notification email with the suspension reason.</p>
            <div className="mb-4">
              <label className={labelClass}>Reason for Suspension</label>
              <textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} rows={3} className={inputClass} placeholder="Enter reason for suspension..." />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => { setSuspendConfirm(null); setSuspendReason(''); }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSuspend} className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700">Suspend</button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Confirmation */}
      {activateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reactivate Staff Account</h3>
            <p className="text-sm text-gray-600 mb-6">The staff member will receive a notification email confirming reactivation.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setActivateConfirm(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleActivate(activateConfirm)} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700">Activate</button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleChangeStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Role</h3>
              <button onClick={() => setRoleChangeStaff(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Changing role for <strong>{roleChangeStaff.fullName}</strong> ({roleChangeStaff.staffId}). The staff member will receive a notification email.
            </p>
            <div className="mb-4">
              <label className={labelClass}>New Role</label>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className={selectClass}>
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setRoleChangeStaff(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleRoleChange} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700">Update Role</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Staff Information</h3>
              <button onClick={() => setEditStaff(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })} className={selectClass}>
                    <option value="">Select Gender</option>
                    {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Department</label>
                  <select value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} className={selectClass}>
                    <option value="">Select Department</option>
                    {departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Position</label>
                  <input type="text" value={editForm.position} onChange={(e) => setEditForm({ ...editForm, position: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setEditStaff(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={editLoading} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
                  {editLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
