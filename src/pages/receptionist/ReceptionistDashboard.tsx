import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserPlus, Calendar, Clock,
  Hourglass, ClipboardList, Search, FileText,
  Phone, Loader2, AlertCircle, LayoutList, CalendarPlus
} from 'lucide-react';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
import EmergencyPanel from '../../components/shared/EmergencyPanel';

const statusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-700',
  Called: 'bg-blue-100 text-blue-700',
  'In Consultation': 'bg-green-100 text-green-700',
  Scheduled: 'bg-violet-100 text-violet-700',
  Confirmed: 'bg-cyan-100 text-cyan-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayNewPatients: 0,
    todayVisits: 0,
    pendingRegistration: 0,
    waitingPatients: 0,
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/receptionist/dashboard');
        setStats({
          totalPatients: data.totalPatients ?? 0,
          todayNewPatients: data.todayNewPatients ?? 0,
          todayVisits: data.todayVisits ?? 0,
          pendingRegistration: data.pendingRegistration ?? 0,
          waitingPatients: data.waitingPatients ?? 0,
        });
        setAppointments(data.appointments ?? []);
        setRecentPatients(data.recentPatients ?? []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'bg-blue-500' },
    { title: "Today's New Patients", value: stats.todayNewPatients, icon: UserPlus, color: 'bg-emerald-500' },
    { title: "Today's Visits", value: stats.todayVisits, icon: Calendar, color: 'bg-violet-500' },
    { title: 'Waiting Patients', value: stats.waitingPatients, icon: Hourglass, color: 'bg-amber-500' },
    { title: 'Pending Registration', value: stats.pendingRegistration, icon: ClipboardList, color: 'bg-pink-500' },
    { title: "Today's Appointments", value: appointments.length, icon: CalendarPlus, color: 'bg-cyan-500' },
  ];

  const patientName = (p: any) =>
    p ? [p.firstName, p.surname].filter(Boolean).join(' ') : 'Unknown';

  const quickActions = [
    { title: 'Register Patient', to: '/receptionist/register-patient', icon: UserPlus, color: 'bg-blue-500 hover:bg-blue-600' },
    { title: 'Search Patient', to: '/receptionist/patient-search', icon: Search, color: 'bg-emerald-500 hover:bg-emerald-600' },
    { title: 'Patient Visits', to: '/receptionist/patient-visits', icon: FileText, color: 'bg-violet-500 hover:bg-violet-600' },
    { title: 'Appointments', to: '/receptionist/appointments', icon: Calendar, color: 'bg-amber-500 hover:bg-amber-600' },
    { title: 'Queue Management', to: '/receptionist/queue', icon: LayoutList, color: 'bg-cyan-500 hover:bg-cyan-600' },
    { title: 'Patient Documents', to: '/receptionist/documents', icon: FileText, color: 'bg-pink-500 hover:bg-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome, Receptionist</h1>
            <p className="text-blue-100 mt-1">Here's your daily dashboard overview.</p>
          </div>
          <ApplyLeaveButton className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg text-sm font-medium transition-colors" />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500 text-sm">Loading dashboard...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {statCards.map((card) => (
                <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{card.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <EmergencyPanel canRemove />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                {appointments.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No appointments scheduled for today</p>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((a) => (
                      <div key={a._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-400">{a.time}</span>
                          <div>
                            <p className="font-medium text-gray-900">{patientName(a.patient)}</p>
                            <p className="text-sm text-gray-500">{a.doctor?.fullName || a.department || 'Unassigned'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      to={action.to}
                      className={`w-full ${action.color} text-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors`}
                    >
                      <action.icon className="w-5 h-5" />
                      <span className="font-medium">{action.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Patients</h2>
              <div className="overflow-x-auto">
                {recentPatients.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No patients registered yet</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="pb-3 font-medium">Patient ID</th>
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                        <th className="pb-3 font-medium hidden md:table-cell">Gender</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentPatients.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50">
                          <td className="py-3 font-medium text-blue-600">{p.patientId}</td>
                          <td className="py-3 text-gray-900">{patientName(p)}</td>
                          <td className="py-3 text-gray-600 hidden md:table-cell">
                            {p.phone ? (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {p.phone}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-3 text-gray-600 hidden md:table-cell">{p.gender || '-'}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[p.status] || 'bg-gray-100 text-gray-700'}`}>
                              {p.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}