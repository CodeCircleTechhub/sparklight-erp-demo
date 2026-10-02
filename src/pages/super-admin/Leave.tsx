import { useState, useEffect } from 'react';
import { CalendarOff, Loader2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../contexts/AuthContext';

interface LeaveRecord {
  _id: string;
  employee?: { _id?: string; fullName?: string };
  employeeName: string;
  employeeRole?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  managerApproved?: boolean;
  managerApprovedByName?: string;
  hrApproved?: boolean;
  hrApprovedByName?: string;
  superAdminApproved?: boolean;
  superAdminApprovedByName?: string;
}

export default function Leave() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [stats, setStats] = useState([
    { title: 'Pending', value: '0', icon: CalendarOff, color: 'yellow' as const },
    { title: 'Approved', value: '0', icon: CalendarOff, color: 'green' as const },
    { title: 'Rejected', value: '0', icon: CalendarOff, color: 'red' as const },
    { title: 'Total', value: '0', icon: CalendarOff, color: 'blue' as const },
  ]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState<LeaveRecord | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchLeaves = async () => {
    try {
      const { data } = await api.get('/hr/leave');
      setLeaves(data.leaves ?? []);
      setStats([
        { title: 'Pending', value: String(data.pending ?? 0), icon: CalendarOff, color: 'yellow' as const },
        { title: 'Approved', value: String(data.approved ?? 0), icon: CalendarOff, color: 'green' as const },
        { title: 'Rejected', value: String(data.rejected ?? 0), icon: CalendarOff, color: 'red' as const },
        { title: 'Total', value: String(data.total ?? 0), icon: CalendarOff, color: 'blue' as const },
      ]);
    } catch {
      console.error('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

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

  const canApprove = (leave: LeaveRecord) => {
    if (leave.status !== 'Pending') return false;
    const leaveEmployeeId = leave.employee?._id;
    if (leaveEmployeeId && user?.id && leaveEmployeeId === user.id) return false;
    if (user?.role !== 'super-admin') return false;
    const applicant = leave.employeeRole || '';
    if (applicant !== 'hr' && applicant !== 'manager') return false;
    return !leave.superAdminApproved;
  };

  const statusColor = (s: string) => {
    if (s === 'Approved') return 'bg-green-100 text-green-700';
    if (s === 'Pending') return 'bg-yellow-100 text-yellow-700';
    if (s === 'Rejected') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Leave Management" icon={CalendarOff} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-500">Loading leave records...</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Staff Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Leave Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Start Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">End Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Days</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Reason</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Approvals</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">No leave records found</td>
                  </tr>
                ) : (
                  leaves.map((row) => (
                    <tr key={row._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                        {row.employee?.fullName || row.employeeName}
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap capitalize">
                        {(row.employeeRole || '').replace(/-/g, ' ')}
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.type}</td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(row.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {new Date(row.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.days}</td>
                      <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{row.reason}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className={`flex items-center gap-1 ${row.managerApproved ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {row.managerApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            Manager {row.managerApproved ? `✓ ${row.managerApprovedByName || ''}` : 'Pending'}
                          </span>
                          <span className={`flex items-center gap-1 ${row.hrApproved ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {row.hrApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            HR {row.hrApproved ? `✓ ${row.hrApprovedByName || ''}` : 'Pending'}
                          </span>
                          {(row.employeeRole === 'hr' || row.employeeRole === 'manager') && (
                            <span className={`flex items-center gap-1 ${row.superAdminApproved ? 'text-emerald-600' : 'text-gray-400'}`}>
                              {row.superAdminApproved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              Admin {row.superAdminApproved ? `✓ ${row.superAdminApprovedByName || ''}` : 'Pending'}
                            </span>
                          )}
                          {row.status === 'Approved' && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="w-3 h-3" />
                              Fully approved
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {canApprove(row) ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(row._id)}
                              disabled={actionLoading === row._id}
                              className="px-3 py-1 bg-emerald-500 text-white rounded text-xs font-medium hover:bg-emerald-600 disabled:opacity-50"
                            >
                              {actionLoading === row._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                            </button>
                            <button
                              onClick={() => { setRejectModal(row); setRejectReason(''); }}
                              disabled={actionLoading === row._id}
                              className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : row.status === 'Pending' ? (
                          <span className="text-xs text-gray-400">
                            {row.employee?._id === user?.id ? 'Your leave' : 'Waiting for approval'}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
