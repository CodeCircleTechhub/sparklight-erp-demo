import { useState, useEffect } from 'react';
import { Clock, UserCheck, AlertCircle, UserX, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Present': return 'green';
    case 'Late': return 'yellow';
    case 'Absent': return 'red';
    case 'On Leave': return 'blue';
    default: return 'gray';
  }
};

export default function Attendance() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);
  const [late, setLate] = useState(0);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/hr/attendance', { params: { date } });
      setAttendance(res.data.attendance || []);
      setTotal(res.data.total || 0);
      setPresent(res.data.present || 0);
      setAbsent(res.data.absent || 0);
      setLate(res.data.late || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Present', value: present, icon: UserCheck, color: 'bg-emerald-500' },
    { label: 'Late', value: late, icon: AlertCircle, color: 'bg-amber-500' },
    { label: 'Absent', value: absent, icon: UserX, color: 'bg-red-500' },
    { label: 'Total', value: total, icon: Clock, color: 'bg-[#3b82f6]' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Attendance" icon={Clock} />
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
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
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
              </div>
            ) : attendance.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No attendance records found</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Staff ID', 'Name', 'Clock In', 'Clock Out', 'Hours', 'Status', ''].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a: any) => (
                    <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{a.employee?.staffId || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{a.employee?.fullName || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{a.clockIn || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">{a.clockOut || '-'}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{a.hours ?? '-'}</td>
                      <td className="px-5 py-4"><StatusBadge status={a.status} color={getStatusColor(a.status) as any} /></td>
                      <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
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
