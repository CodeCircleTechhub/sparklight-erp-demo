import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import ApplyLeaveButton from "../../components/shared/ApplyLeaveButton";
import EmergencyPanel from '../../components/shared/EmergencyPanel';
import {
  Users,
  Clock,
  Stethoscope,
  CheckCircle,
  CalendarCheck,
  AlertTriangle,
  Play,
  FileText,
  FlaskConical,
  Pill,
  CalendarDays,
  UserCheck,
} from "lucide-react";

const quickActions = [
  { label: "Start Consultation", icon: Play, color: "bg-blue-500", path: "/doctor/consultations" },
  { label: "View Medical Records", icon: FileText, color: "bg-purple-500", path: "/doctor/records" },
  { label: "Order Lab Test", icon: FlaskConical, color: "bg-green-500", path: "/doctor/lab-requests" },
  { label: "Create Prescription", icon: Pill, color: "bg-indigo-500", path: "/doctor/prescriptions" },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Waiting: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Scheduled: "bg-violet-100 text-violet-800",
    Confirmed: "bg-cyan-100 text-cyan-800",
    Cancelled: "bg-red-100 text-red-800",
    Requested: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todayPatients: 0,
    assignedToMe: 0,
    waiting: 0,
    inConsultation: 0,
    completed: 0,
    followUps: 0,
    emergencies: 0,
    appointments: 0,
  });
  const [patientQueue, setPatientQueue] = useState<any[]>([]);
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await api.get("/doctor/dashboard");
        const s = data.stats || {};

        setStats({
          todayPatients: (s.waiting || 0) + (s.inConsultation || 0) + (s.completedToday || 0),
          assignedToMe: s.assignedToMe || 0,
          waiting: s.waiting || 0,
          inConsultation: s.inConsultation || 0,
          completed: s.completedToday || 0,
          followUps: s.followUps || 0,
          emergencies: s.emergency || 0,
          appointments: s.appointmentsToday || 0,
        });

        setAppointments(
          (data.appointments || []).slice(0, 12).map((a: any) => ({
            id: a._id,
            ref: a.appointmentId,
            patient: a.patientName || "Patient",
            time: a.time || "--",
            date: a.date
              ? new Date(a.date).toLocaleDateString([], { day: "2-digit", month: "short" })
              : "--",
            type: a.type || "Consultation",
            status: a.status || "Scheduled",
            bookedBy: a.bookedByName || "",
            isToday: !!a.isToday,
          }))
        );

        setPatientQueue(
          (data.queue || []).slice(0, 6).map((q: any) => ({
            id: q._id,
            name: q.patientName || "Unknown Patient",
            timeWaiting: `${q.waitMinutes ?? 0} min`,
            type: q.type || "Consultation",
            status: q.status || "Waiting",
          }))
        );

        setRecentConsultations(
          (data.recentConsultations || []).slice(0, 6).map((c: any) => ({
            patient: c.patientName || "Unknown",
            diagnosis: c.diagnosis || "--",
            prescription: c.prescription || "--",
            time: c.date
              ? new Date(c.date).toLocaleString([], {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--",
          }))
        );
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: "My Assigned Patients", value: stats.assignedToMe, icon: UserCheck, color: "bg-cyan-600" },
    { label: "Today's Patients", value: stats.todayPatients, icon: Users, color: "bg-blue-500" },
    { label: "Appointments", value: stats.appointments, icon: CalendarDays, color: "bg-teal-500" },
    { label: "Waiting", value: stats.waiting, icon: Clock, color: "bg-yellow-500" },
    { label: "In Consultation", value: stats.inConsultation, icon: Stethoscope, color: "bg-purple-500" },
    { label: "Completed", value: stats.completed, icon: CheckCircle, color: "bg-green-500" },
    { label: "Follow-ups", value: stats.followUps, icon: CalendarCheck, color: "bg-indigo-500" },
    { label: "Emergency Cases", value: stats.emergencies, icon: AlertTriangle, color: "bg-red-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="text-gray-500 text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome, {user?.fullName || "Doctor"}</h1>
          <ApplyLeaveButton />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className={`${card.color} p-2 rounded-lg text-white`}>
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <EmergencyPanel className="mb-8" />

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Queue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Queue</h2>
            <div className="space-y-3">
              {patientQueue.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No patients in queue today</p>
              ) : (
                patientQueue.map((patient: any) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                        {patient.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">Waiting: {patient.timeWaiting}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusBadge(patient.type)}
                      {statusBadge(patient.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
                >
                  <div className={`${action.color} p-2 rounded-lg text-white`}>
                    <action.icon size={20} />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* My Appointments (booked by customer care / manager / super admin) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Appointments</h2>
            <span className="text-xs text-gray-500">Next 7 days</span>
          </div>
          <div className="overflow-x-auto">
            {appointments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No appointments booked for you yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ref</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Booked by</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a: any) => (
                    <tr key={a.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-blue-600 font-medium">{a.ref}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {a.patient}
                        {a.isToday && (
                          <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded bg-teal-100 text-teal-700 font-semibold">
                            TODAY
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{a.date}</td>
                      <td className="py-3 px-4 text-gray-600">{a.time}</td>
                      <td className="py-3 px-4 text-gray-600">{a.type}</td>
                      <td className="py-3 px-4 text-gray-500">{a.bookedBy || "—"}</td>
                      <td className="py-3 px-4">{statusBadge(a.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h2>
          <div className="overflow-x-auto">
            {recentConsultations.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No recent consultations</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Diagnosis</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Prescription</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentConsultations.map((row: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.patient}</td>
                      <td className="py-3 px-4 text-gray-600">{row.diagnosis}</td>
                      <td className="py-3 px-4 text-gray-600">{row.prescription}</td>
                      <td className="py-3 px-4 text-gray-500">{row.time}</td>
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