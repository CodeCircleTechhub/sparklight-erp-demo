import { useState, useEffect, useCallback } from 'react';
import { CalendarOff, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../ui/PageComponents';
import api from '../../services/api';
import ApplyLeaveButton from './ApplyLeaveButton';

const statusColor = (status: string) => {
  if (status === 'Approved') return 'green' as const;
  if (status === 'Pending') return 'yellow' as const;
  if (status === 'Rejected') return 'red' as const;
  return 'gray' as const;
};

export default function MyLeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/hr/leave/my');
      setLeaves(data.leaves || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const requiredRows = (leave: any) => {
    const role = leave.employeeRole || '';
    if (role === 'hr') return ['manager', 'superAdmin'];
    if (role === 'manager') return ['hr', 'superAdmin'];
    if (role === 'super-admin') return ['manager', 'hr'];
    return ['manager', 'hr'];
  };

  const slotMeta: Record<string, { label: string; flag: string; name: string }> = {
    manager: { label: 'Manager', flag: 'managerApproved', name: 'managerApprovedByName' },
    hr: { label: 'HR', flag: 'hrApproved', name: 'hrApprovedByName' },
    superAdmin: { label: 'Super Admin', flag: 'superAdminApproved', name: 'superAdminApprovedByName' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader
          title="My Leave"
          icon={CalendarOff}
          description="Apply for leave and track approval progress"
          action={<ApplyLeaveButton onSubmitted={fetchLeaves} />}
        />

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
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : leaves.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No leave requests yet. Click Apply for Leave to get started.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Type', 'Start', 'End', 'Days', 'Reason', 'Approvals', 'Status', 'Rejected By'].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l) => (
                    <tr key={l._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">{l.type}</td>
                      <td className="px-4 py-4 text-gray-500">{new Date(l.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-gray-500">{new Date(l.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-gray-900">{l.days}</td>
                      <td className="px-4 py-4 text-gray-500 max-w-[160px] truncate" title={l.reason}>{l.reason || '-'}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          {requiredRows(l).map((slot) => {
                            const meta = slotMeta[slot];
                            const approved = !!l[meta.flag];
                            const notRequired = (slot === 'superAdmin' && l.employeeRole !== 'hr' && l.employeeRole !== 'manager')
                              || (slot === 'hr' && l.employeeRole === 'hr')
                              || (slot === 'manager' && l.employeeRole === 'manager');
                            if (notRequired && slot === 'superAdmin') return null;
                            return (
                              <span key={slot} className={`flex items-center gap-1 ${approved ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {approved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {meta.label} {approved ? `✓ ${l[meta.name] || ''}` : 'Pending'}
                              </span>
                            );
                          })}
                          {l.status === 'Approved' && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="w-3 h-3" />
                              Fully approved
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={l.status} color={statusColor(l.status)} />
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {l.status === 'Rejected'
                          ? `${l.rejectedByName || '-'}${l.rejectionReason ? ` — ${l.rejectionReason}` : ''}`
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
