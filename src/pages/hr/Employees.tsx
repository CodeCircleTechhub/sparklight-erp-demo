import { useState, useEffect } from 'react';
import { Users, UserCheck, CalendarOff, UserX, MoreVertical, Loader2, AlertCircle, Printer, Ban, FileText, Mail, X, CheckCircle, Download, Lock } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, onLeave: 0, inactive: 0 });
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [letterData, setLetterData] = useState<any>(null);
  const [letterLoading, setLetterLoading] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [salary, setSalary] = useState('');
  const [benefits, setBenefits] = useState('');
  const [salarySaveLoading, setSalarySaveLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [permissionLoading, setPermissionLoading] = useState(true);

  const isHrRole = user?.role === 'hr';
  // Super Admin / Manager always edit; HR is gated by the toggle
  const canManageEmployees = !isHrRole || canEdit;

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActionMenu(actionMenu === id ? null : id);
  };

  useEffect(() => {
    fetchEmployees();
    fetchPermission();
  }, []);

  const fetchPermission = async () => {
    if (!isHrRole) {
      setCanEdit(true);
      setPermissionLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/system/settings/hr-employee-management');
      setCanEdit(!!data.enabled);
    } catch {
      setCanEdit(false);
    } finally {
      setPermissionLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hr/employees');
      const data = res.data.employees ?? [];
      setEmployees(data);
      setStats({
        total: res.data.total ?? data.length,
        active: res.data.active ?? data.filter((e: any) => e.isActive).length,
        onLeave: res.data.onLeave ?? data.filter((e: any) => !e.isActive).length,
        inactive: res.data.inactive ?? 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const term = search.toLowerCase();
    return (
      (e.fullName || '').toLowerCase().includes(term) ||
      (e.department || '').toLowerCase().includes(term) ||
      (e.position || '').toLowerCase().includes(term) ||
      (e.staffId || '').toLowerCase().includes(term)
    );
  });

  const handleGenerateLetter = async (emp: any) => {
    try {
      setLetterLoading(true);
      setShowLetterModal(true);
      const res = await api.get(`/hr/appointment-letter/${emp._id}`);
      setLetterData(res.data.letter);
      setSalary(res.data.letter.employee.salary ? String(res.data.letter.employee.salary) : '');
      setBenefits(res.data.letter.employee.benefits || '');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate letter');
      setShowLetterModal(false);
    } finally {
      setLetterLoading(false);
    }
  };

  const handleSaveSalary = async () => {
    if (!selectedEmployee) return;
    if (!canManageEmployees) {
      setError('Employee management is currently disabled by Super Admin.');
      return;
    }
    try {
      setSalarySaveLoading(true);
      await api.put(`/hr/appointment-letter/${selectedEmployee._id}`, {
        salary: salary ? Number(salary) : 0,
        benefits,
      });
      const res = await api.get(`/hr/appointment-letter/${selectedEmployee._id}`);
      setLetterData(res.data.letter);
      setSalarySaveLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save salary');
      setSalarySaveLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedEmployee) return;
    try {
      setPdfLoading(true);
      const res = await api.get(`/hr/appointment-letter/${selectedEmployee._id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `appointment-letter-${selectedEmployee.staffId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setPdfLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download PDF');
      setPdfLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEmployee) return;
    try {
      setEmailLoading(true);
      await api.post(`/hr/appointment-letter/${selectedEmployee._id}/send-email`);
      setEmailLoading(false);
      alert('Appointment letter sent to employee email!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send email');
      setEmailLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedEmployee || !suspendReason.trim()) return;
    if (!canManageEmployees) {
      setError('Employee management is currently disabled by Super Admin.');
      return;
    }
    try {
      await api.put(`/users/${selectedEmployee._id}/suspend`, { reason: suspendReason });
      setShowSuspendModal(false);
      setSuspendReason('');
      setSelectedEmployee(null);
      setActionMenu(null);
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to suspend employee');
    }
  };

  const handleActivate = async (emp: any) => {
    if (!canManageEmployees) {
      setError('Employee management is currently disabled by Super Admin.');
      return;
    }
    try {
      await api.put(`/users/${emp._id}/activate`);
      setActionMenu(null);
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to activate employee');
    }
  };

  const statCards = [
    { label: 'Total', value: stats.total, icon: Users, color: 'bg-[#3b82f6]' },
    { label: 'Active', value: stats.active, icon: UserCheck, color: 'bg-emerald-500' },
    { label: 'On Leave', value: stats.onLeave, icon: CalendarOff, color: 'bg-amber-500' },
    { label: 'Inactive', value: stats.inactive, icon: UserX, color: 'bg-red-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader
          title="Employees"
          icon={Users}
          action={
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-64"
              />
            </div>
          }
        />

        {isHrRole && !permissionLoading && !canManageEmployees && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Employee management is disabled</p>
              <p className="text-amber-700 mt-0.5">
                The Super Admin has turned off HR employee management. You can view employees, but add, edit, suspend, and activate actions are unavailable.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${s.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-500">{s.label}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Staff ID', 'Name', 'Department', 'Position', 'Phone', 'Join Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((e) => {
                  return (
                    <tr key={e.staffId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{e.staffId}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                            {(e.fullName || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{e.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{e.department}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{e.position}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{e.phone}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{e.employmentDate || e.joinDate || 'N/A'}</td>
                      <td className="px-5 py-4">
                        {e.isActive ? (
                          <StatusBadge status="Active" color="green" />
                        ) : (
                          <div className="flex flex-col gap-1">
                            <StatusBadge status="Suspended" color="red" />
                            {e.suspendedByRole && (
                              <span className="text-xs text-gray-500 capitalize">by {e.suspendedByRole}</span>
                            )}
                            {e.suspensionReason && (
                              <span className="text-xs text-gray-400 max-w-[150px] truncate" title={e.suspensionReason}>
                                Reason: {e.suspensionReason}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 relative">
                        <button
                          onClick={(ev) => toggleMenu(ev, e._id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {actionMenu === e._id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                            <button
                              onClick={() => { setSelectedEmployee(e); handleGenerateLetter(e); setActionMenu(null); }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Printer className="w-4 h-4" />
                              Appointment Letter
                            </button>
                            {canManageEmployees && !e.isActive && String(e.suspendedBy) === String(user?.id) && (
                              <button
                                onClick={() => { handleActivate(e); }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Remove Suspension
                              </button>
                            )}
                            {!e.isActive && String(e.suspendedBy) !== String(user?.id) && (
                              <div className="px-4 py-2 text-xs text-gray-400 italic">
                                Suspended by {e.suspendedByRole || 'Admin'}
                              </div>
                            )}
                            {canManageEmployees && e.isActive && (
                              <button
                                onClick={() => { setSelectedEmployee(e); setShowSuspendModal(true); setActionMenu(null); }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
                              >
                                <Ban className="w-4 h-4" />
                                Suspend
                              </button>
                            )}
                            {!canManageEmployees && (
                              <div className="px-4 py-2 text-xs text-gray-400 italic flex items-center gap-1.5">
                                <Lock className="w-3 h-3" />
                                Edit disabled by Super Admin
                              </div>
                            )}
                            <button
                              onClick={() => { setSelectedEmployee(e); setActionMenu(null); }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <FileText className="w-4 h-4" />
                              Staff Report
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
      </div>

      {/* Appointment Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Appointment Letter</h2>
              <button onClick={() => { setShowLetterModal(false); setLetterData(null); setSalary(''); setBenefits(''); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {letterLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
                </div>
              ) : letterData ? (
                <div className="space-y-6">
                  <div className="text-center border-b pb-4">
                    <h3 className="text-lg font-bold text-[#3b82f6]">{letterData.hospital.name}</h3>
                    <p className="text-sm text-gray-500">{letterData.hospital.address}</p>
                    <p className="text-sm text-gray-500">{letterData.hospital.phone} | {letterData.hospital.email}</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900">APPOINTMENT LETTER</h4>
                    <p className="text-sm text-gray-500 mt-1">Date: {new Date(letterData.generatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-700">Dear <span className="font-semibold">{letterData.employee.fullName}</span>,</p>
                    <p className="text-gray-700">
                      We are pleased to inform you that you have been appointed as <span className="font-semibold">{letterData.employee.position || letterData.employee.role}</span> in the <span className="font-semibold">{letterData.employee.department}</span> department of {letterData.hospital.name}.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between"><span className="text-gray-500">Staff ID:</span><span className="font-medium">{letterData.employee.staffId}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Full Name:</span><span className="font-medium">{letterData.employee.fullName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium">{letterData.employee.email}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Department:</span><span className="font-medium">{letterData.employee.department}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Position:</span><span className="font-medium">{letterData.employee.position || letterData.employee.role}</span></div>
                      {letterData.employee.employmentDate && (
                        <div className="flex justify-between"><span className="text-gray-500">Employment Date:</span><span className="font-medium">{new Date(letterData.employee.employmentDate).toLocaleDateString()}</span></div>
                      )}
                      {(letterData.employee.salary > 0 || salary) && (
                        <div className="flex justify-between"><span className="text-gray-500">Annual Salary:</span><span className="font-medium">₦{Number(letterData.employee.salary || salary || 0).toLocaleString()}</span></div>
                      )}
                      {(letterData.employee.benefits || benefits) && (
                        <div className="flex justify-between"><span className="text-gray-500">Benefits:</span><span className="font-medium">{letterData.employee.benefits || benefits}</span></div>
                      )}
                    </div>

                    {/* Salary & Benefits Input */}
                    {!canManageEmployees ? (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-start gap-2">
                        <Lock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-500">
                          Editing salary & benefits is disabled. The Super Admin has turned off HR employee management.
                        </p>
                      </div>
                    ) : (
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3 border border-blue-200">
                      <h5 className="font-semibold text-blue-900 text-sm">Update Salary & Benefits</h5>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Annual Salary (₦)</label>
                        <input
                          type="number"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                          placeholder="e.g. 500000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Benefits</label>
                        <textarea
                          value={benefits}
                          onChange={(e) => setBenefits(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                          rows={2}
                          placeholder="e.g. Health insurance, housing allowance, transport"
                        />
                      </div>
                      <button
                        onClick={handleSaveSalary}
                        disabled={salarySaveLoading}
                        className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                      >
                        {salarySaveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save Salary & Benefits
                      </button>
                    </div>
                    )}

                    <p className="text-gray-700">
                      We look forward to your contributions to the growth and success of our hospital. Please report to the HR department for further onboarding procedures.
                    </p>
                    <p className="text-gray-700">Best regards,</p>
                    <p className="font-semibold text-gray-900">Management Team</p>
                    <p className="text-sm text-gray-500">Generated by: {letterData.generatedBy}</p>
                  </div>
                </div>
              ) : null}
            </div>
            {letterData && (
              <div className="p-6 border-t border-gray-200 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => { setShowLetterModal(false); setLetterData(null); setSalary(''); setBenefits(''); }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download PDF
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={emailLoading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Send to Email
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Suspend Employee</h2>
              <button onClick={() => { setShowSuspendModal(false); setSuspendReason(''); setSelectedEmployee(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">Are you sure you want to suspend <span className="font-semibold">{selectedEmployee.fullName}</span>?</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  rows={3}
                  placeholder="Enter reason..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => { setShowSuspendModal(false); setSuspendReason(''); setSelectedEmployee(null); }}
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={!suspendReason.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
