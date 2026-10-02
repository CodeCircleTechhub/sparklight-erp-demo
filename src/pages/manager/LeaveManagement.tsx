import { useState, useEffect } from 'react';
import { CalendarOff, Clock, CheckCircle, XCircle, UserX, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'green';
    case 'Pending': return 'yellow';
    case 'Rejected': return 'red';
    default: return 'gray';
  }
};

const TABS = ['All', 'Pending', 'Approved', 'Rejected'] as const;

export default function LeaveManagement() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, onLeave: 0 });
  const [activeTab, setActiveTab] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/hr/leave');
      setLeaves(res.data.leaves || []);
      setStats({
        total: res.data.total || 0,
        pending: res.data.pending || 0,
        approved: res.data.approved || 0,
        rejected: res.data.rejected || 0,
        onLeave: res.data.onLeave || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await api.put(`/hr/leave/${id}/approve`);
      setError('');
      alert(res.data.message);
      await fetchLeaves();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve leave');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setActionLoading(rejectModal._id);
    try {
      await api.put(`/hr/leave/${rejectModal._id}/reject`, { reason: rejectReason });
      setRejectModal(null);
      setRejectReason('');
      setError('');
      await fetchLeaves();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject leave');
    } finally {
      setActionLoading(null);
    }
  };

  const canApprove = (leave: any) => {
    if (leave.status !== 'Pending') return false;
    const leaveEmployeeId = leave.employee?._id;
    if (leaveEmployeeId && user?.id && leaveEmployeeId === user.id) return false;
    const applicant = leave.employeeRole || leave.employee?.role || '';
    const role = user?.role || '';
    if (!role) return false;
    if (applicant === role) return false;
    if (role === 'super-admin') {
      if (applicant !== 'hr' && applicant !== 'manager') return false;
      return !leave.superAdminApproved;
    }
    if (role === 'manager') {
      if (applicant === 'manager') return false;
      return !leave.managerApproved;
    }
    if (role === 'hr') {
      if (applicant === 'hr') return false;
      return !leave.hrApproved;
    }
    return false;
  };

  const filteredLeaves = activeTab === 'All' ? leaves : leaves.filter((l) => l.status === activeTab);

  const statCards = [
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500' },
    { label: 'On Leave Today', value: stats.onLeave, icon: UserX, color: 'bg-[#3b82f6]' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Leave Management" icon={CalendarOff} />
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
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3b82f6]" />
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No leave requests found</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Staff Name', 'Role', 'Type', 'Start', 'End', 'Days', 'Reason', 'Approvals', 'Status', 'Action'].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaves.map((l: any) => {
                    const start = new Date(l.startDate);
                    const end = new Date(l.endDate);
                    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    return (
                      <tr key={l._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                              {l.employee?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{l.employee?.fullName || l.employeeName || '-'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 capitalize">{(l.employeeRole || l.employee?.role || '').replace(/-/g, ' ')}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{l.type}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{new Date(l.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{new Date(l.endDate).toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-sm text-gray-900">{days}</td>
                        <td className="px-4 py-4 text-sm text-gray-500 max-w-[120px] truncate" title={l.reason}>{l.reason || '-'}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1 text-xs">
                            <span className={`flex items-center gap-1 ${l.managerApproved ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {l.managerApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              Manager {l.managerApproved ? `✓ ${l.managerApprovedByName || ''}` : 'Pending'}
                            </span>
                            <span className={`flex items-center gap-1 ${l.hrApproved ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {l.hrApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              HR {l.hrApproved ? `✓ ${l.hrApprovedByName || ''}` : 'Pending'}
                            </span>
                            {(l.employeeRole === 'hr' || l.employeeRole === 'manager') && (
                              <span className={`flex items-center gap-1 ${l.superAdminApproved ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {l.superAdminApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                Admin {l.superAdminApproved ? `✓ ${l.superAdminApprovedByName || ''}` : 'Pending'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4"><StatusBadge status={l.status} color={getStatusColor(l.status) as any} /></td>
                        <td className="px-4 py-4">
                          {canApprove(l) && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(l._id)}
                                disabled={actionLoading === l._id}
                                className="px-3 py-1 bg-emerald-500 text-white rounded text-xs font-medium hover:bg-emerald-600 disabled:opacity-50"
                              >
                                {actionLoading === l._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                              </button>
                              <button
                                onClick={() => { setRejectModal(l); setRejectReason(''); }}
                                disabled={actionLoading === l._id}
                                className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {l.status === 'Pending' && !canApprove(l) && (
                            <span className="text-xs text-gray-400">
                              {l.employee?._id === user?.id ? 'Your leave' : 'Waiting for approval'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Reject Leave Request</h2>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700">Rejecting leave for <span className="font-semibold">{rejectModal.employee?.fullName || rejectModal.employeeName}</span></p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  rows={3}
                  placeholder="Enter reason..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleReject} disabled={actionLoading === rejectModal._id} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 disabled:opacity-50">
                {actionLoading === rejectModal._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
