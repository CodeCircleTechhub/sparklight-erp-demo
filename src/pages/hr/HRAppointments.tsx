import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Loader2, AlertCircle, Info } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-cyan-100 text-cyan-700',
  Scheduled: 'bg-violet-100 text-violet-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function HRAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [apiStats, setApiStats] = useState({ todayCount: 0, total: 0, completed: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/appointments');
      const list = data.appointments || [];
      setAppointments(list);
      setApiStats({
        todayCount: data.todayCount ?? 0,
        total: data.total ?? list.length,
        completed: data.completed ?? list.filter((a: any) => a.status === 'Completed').length,
        upcoming: data.upcoming ?? 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancelled = appointments.filter((a) => a.status === 'Cancelled').length;

  const stats = [
    { label: "Today's Appointments", value: apiStats.todayCount, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Upcoming', value: apiStats.upcoming, icon: Clock, color: 'bg-green-500' },
    { label: 'Completed', value: apiStats.completed, icon: CheckCircle, color: 'bg-violet-500' },
    { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'bg-red-500' },
  ];

  const patientName = (a: any) =>
    a.patient
      ? [a.patient.firstName, a.patient.surname].filter(Boolean).join(' ')
      : a.patientName || 'Unknown';

  const doctorName = (a: any) => a.doctor?.fullName || a.doctorName || 'Unassigned';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Appointments" icon={Calendar} />

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2 w-fit">
          <Info className="w-4 h-4 shrink-0 text-blue-500" />
          Appointments are booked by customer care, the manager or the super admin.
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500 text-sm">Loading appointments...</span>
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No appointments found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                    <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                    <th className="pb-3 font-medium hidden md:table-cell">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{a.time}</td>
                      <td className="py-3 text-gray-900">{patientName(a)}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{doctorName(a)}</td>
                      <td className="py-3 text-gray-600 hidden lg:table-cell">{a.department || 'General'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">
                        {a.date ? new Date(a.date).toLocaleDateString() : ''}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>
                          {a.status}
                        </span>
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
