import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
import {
  Users,
  Clock,
  Stethoscope,
  BedDouble,
  Activity,
  ClipboardList,
  Search,
  Bell,
  LayoutGrid,
  PenLine,
  ChevronRight,
  Pill,
  Timer,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface QueueRow {
  id: string;
  name: string;
  waitingTime: string;
  status: string;
}

interface Medication {
  id: string;
  patientName: string;
  medicine: string;
  time: string;
  status: 'Pending' | 'Completed';
}

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const quickActions: QuickAction[] = [
  { title: 'Record Vital Signs', icon: <Activity className="w-5 h-5" />, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'View Patient Queue', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Nursing Notes', icon: <PenLine className="w-5 h-5" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Ward Overview', icon: <LayoutGrid className="w-5 h-5" />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

const queueStatusColors: Record<string, string> = {
  Waiting: 'bg-yellow-100 text-yellow-700',
  Called: 'bg-purple-100 text-purple-700',
  'In Consultation': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-gray-100 text-gray-700',
};

const medStatusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Completed: 'bg-green-100 text-green-700',
};

const quickActionRoutes: Record<string, string> = {
  'Record Vital Signs': '/nurse/vital-signs',
  'View Patient Queue': '/nurse/queue',
  'Nursing Notes': '/nurse/notes',
  'Ward Overview': '/nurse/ward',
};

function formatWaitingTime(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatTime(dateStr: string): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function NurseDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statCards, setStatCards] = useState<StatCard[]>([]);
  const [patientQueue, setPatientQueue] = useState<QueueRow[]>([]);
  const [medicationSchedule, setMedicationSchedule] = useState<Medication[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/nurse/dashboard');
      const s = data.stats || {};

      setStatCards([
        { title: 'My Patients', value: s.myPatients ?? 0, icon: <Users className="w-6 h-6" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Waiting', value: s.waiting ?? 0, icon: <Clock className="w-6 h-6" />, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { title: 'With Nurse', value: s.withNurse ?? 0, icon: <Stethoscope className="w-6 h-6" />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { title: 'To Administer', value: s.toAdminister ?? 0, icon: <Pill className="w-6 h-6" />, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
        { title: 'Vitals Today', value: s.vitalsToday ?? 0, icon: <Activity className="w-6 h-6" />, color: 'text-green-600', bgColor: 'bg-green-100' },
        { title: 'Admitted', value: s.admitted ?? 0, icon: <BedDouble className="w-6 h-6" />, color: 'text-orange-600', bgColor: 'bg-orange-100' },
      ]);

      setNotificationCount(s.unreadNotifications ?? 0);

      setPatientQueue(
        (data.queue || []).slice(0, 8).map((q: any) => ({
          id: q._id,
          name: q.patientName || q.patient
            ? [q.patient?.firstName, q.patient?.surname].filter(Boolean).join(' ') || q.patientName
            : 'Unknown Patient',
          waitingTime: formatWaitingTime(q.joinedAt),
          status: q.status || 'Waiting',
        }))
      );

      setMedicationSchedule(
        (data.pendingMedications || []).slice(0, 6).map((m: any) => ({
          id: m._id,
          patientName:
            [m.patient?.firstName, m.patient?.surname].filter(Boolean).join(' ') ||
            m.patientName ||
            'Unknown Patient',
          medicine: (m.medications || []).map((x: any) => x.name).filter(Boolean).join(', ') || 'Medicine',
          time: formatTime(m.date || m.createdAt),
          status: m.administeredAt ? 'Completed' : 'Pending',
        }))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredQueue = patientQueue.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-sm text-red-600 font-medium mb-2">Something went wrong</p>
          <p className="text-xs text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName || 'Nurse'}</h1>
            <p className="text-sm text-gray-500 mt-1">Here's your patient overview for today</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <ApplyLeaveButton />
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => navigate('/nurse/notifications')}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className={`${card.bgColor} ${card.color} p-2.5 rounded-lg w-fit mb-3`}>{card.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient Queue */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Patient Queue</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {filteredQueue.length}
                </span>
              </div>
              <button
                onClick={() => navigate('/nurse/queue')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Patient
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Waiting Time
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-400">
                        No patients in queue today
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map((patient) => (
                      <tr
                        key={patient.id}
                        onClick={() => navigate('/nurse/queue')}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                              {patient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Clock className="w-3.5 h-3.5" />
                            {patient.waitingTime}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                              queueStatusColors[patient.status] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Open</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Pending medications to administer */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Medication Tasks</h2>
                </div>
                <button
                  onClick={() => navigate('/nurse/medications')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {medicationSchedule.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm text-gray-400">No pending medications</div>
                ) : (
                  medicationSchedule.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{med.patientName}</p>
                        <p className="text-xs text-gray-500 truncate">{med.medicine}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Timer className="w-3 h-3" />
                          {med.time}
                        </p>
                        <span
                          className={`text-[10px] font-medium px-2 py-1 rounded-full ${medStatusColors[med.status]}`}
                        >
                          {med.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => navigate(quickActionRoutes[action.title] || '/')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className={`${action.bgColor} ${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
