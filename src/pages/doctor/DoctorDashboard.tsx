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
} from "lucide-react";

const statCards = [
  { label: "Today's Patients", value: 12, icon: Users, color: "bg-blue-500" },
  { label: "Waiting", value: 5, icon: Clock, color: "bg-yellow-500" },
  { label: "In Consultation", value: 2, icon: Stethoscope, color: "bg-purple-500" },
  { label: "Completed", value: 8, icon: CheckCircle, color: "bg-green-500" },
  { label: "Follow-ups", value: 3, icon: CalendarCheck, color: "bg-indigo-500" },
  { label: "Emergency Cases", value: 1, icon: AlertTriangle, color: "bg-red-500" },
];

const patientQueue = [
  { id: 1, name: "Sarah Johnson", timeWaiting: "10 min", type: "Consultation", status: "Waiting" },
  { id: 2, name: "Michael Brown", timeWaiting: "5 min", type: "Follow-up", status: "Waiting" },
  { id: 3, name: "Emma Wilson", timeWaiting: "2 min", type: "Emergency", status: "Waiting" },
  { id: 4, name: "James Davis", timeWaiting: "15 min", type: "Consultation", status: "In Progress" },
  { id: 5, name: "Olivia Martinez", timeWaiting: "8 min", type: "Follow-up", status: "Waiting" },
  { id: 6, name: "William Garcia", timeWaiting: "12 min", type: "Consultation", status: "Waiting" },
];

const recentConsultations = [
  { patient: "Alice Cooper", diagnosis: "Upper Respiratory Infection", prescription: "Amoxicillin 500mg", time: "9:30 AM" },
  { patient: "Bob Taylor", diagnosis: "Hypertension", prescription: "Amlodipine 5mg", time: "9:00 AM" },
  { patient: "Carol Anderson", diagnosis: "Type 2 Diabetes", prescription: "Metformin 1000mg", time: "8:30 AM" },
  { patient: "David Lee", diagnosis: "Lower Back Pain", prescription: "Ibuprofen 400mg", time: "8:00 AM" },
  { patient: "Eva White", diagnosis: "Allergic Rhinitis", prescription: "Cetirizine 10mg", time: "7:30 AM" },
];

const quickActions = [
  { label: "Start Consultation", icon: Play, color: "bg-blue-500" },
  { label: "View Medical Records", icon: FileText, color: "bg-purple-500" },
  { label: "Order Lab Test", icon: FlaskConical, color: "bg-green-500" },
  { label: "Create Prescription", icon: Pill, color: "bg-indigo-500" },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Waiting: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
};

const typeBadge = (type: string) => {
  const styles: Record<string, string> = {
    Consultation: "bg-blue-100 text-blue-800",
    "Follow-up": "bg-purple-100 text-purple-800",
    Emergency: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type] || "bg-gray-100 text-gray-800"}`}>
      {type}
    </span>
  );
};

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Welcome, Dr. Ahmed</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Queue */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Queue</h2>
            <div className="space-y-3">
              {patientQueue.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                      {patient.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-xs text-gray-500">Waiting: {patient.timeWaiting}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {typeBadge(patient.type)}
                    {statusBadge(patient.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
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

        {/* Recent Consultations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h2>
          <div className="overflow-x-auto">
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
                {recentConsultations.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4 font-medium text-gray-900">{row.patient}</td>
                    <td className="py-3 px-4 text-gray-600">{row.diagnosis}</td>
                    <td className="py-3 px-4 text-gray-600">{row.prescription}</td>
                    <td className="py-3 px-4 text-gray-500">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
