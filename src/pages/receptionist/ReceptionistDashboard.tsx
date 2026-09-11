import {
  Users, UserPlus, RefreshCw, Calendar, Clock,
  Hourglass, ClipboardList, Search, FileText,
  Phone
} from 'lucide-react';

const statCards = [
  { title: 'Total Patients', value: '4,582', icon: Users, color: 'bg-blue-500' },
  { title: "Today's New Patients", value: '18', icon: UserPlus, color: 'bg-emerald-500' },
  { title: "Today's Returning Patients", value: '108', icon: RefreshCw, color: 'bg-violet-500' },
  { title: "Today's Visits", value: '126', icon: Calendar, color: 'bg-amber-500' },
  { title: 'Waiting Patients', value: '8', icon: Hourglass, color: 'bg-cyan-500' },
  { title: 'Pending Registration', value: '3', icon: ClipboardList, color: 'bg-pink-500' },
];

const queue = [
  { id: 'PT-2041', name: 'James Wilson', time: '08:30 AM', status: 'Waiting' },
  { id: 'PT-2042', name: 'Sarah Thompson', time: '08:45 AM', status: 'Called' },
  { id: 'PT-2043', name: 'Michael Chen', time: '09:00 AM', status: 'In Consultation' },
  { id: 'PT-2044', name: 'Emily Davis', time: '09:15 AM', status: 'Waiting' },
  { id: 'PT-2045', name: 'Robert Garcia', time: '09:30 AM', status: 'Called' },
  { id: 'PT-2046', name: 'Lisa Anderson', time: '09:45 AM', status: 'Waiting' },
];

const recentRegistrations = [
  { id: 'PT-2046', name: 'Lisa Anderson', phone: '(555) 123-4567', time: '09:45 AM', status: 'Registered' },
  { id: 'PT-2045', name: 'Robert Garcia', phone: '(555) 234-5678', time: '09:30 AM', status: 'Registered' },
  { id: 'PT-2044', name: 'Emily Davis', phone: '(555) 345-6789', time: '09:15 AM', status: 'Pending' },
  { id: 'PT-2043', name: 'Michael Chen', phone: '(555) 456-7890', time: '09:00 AM', status: 'Registered' },
  { id: 'PT-2042', name: 'Sarah Thompson', phone: '(555) 567-8901', time: '08:45 AM', status: 'Registered' },
];

const quickActions = [
  { title: 'Register Patient', icon: UserPlus, color: 'bg-blue-500 hover:bg-blue-600' },
  { title: 'Search Patient', icon: Search, color: 'bg-emerald-500 hover:bg-emerald-600' },
  { title: 'New Visit', icon: FileText, color: 'bg-violet-500 hover:bg-violet-600' },
  { title: 'View Appointments', icon: Calendar, color: 'bg-amber-500 hover:bg-amber-600' },
];

const statusColors: Record<string, string> = {
  'Waiting': 'bg-yellow-100 text-yellow-700',
  'Called': 'bg-blue-100 text-blue-700',
  'In Consultation': 'bg-green-100 text-green-700',
  'Registered': 'bg-green-100 text-green-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
};

export default function ReceptionistDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome, Receptionist</h1>
          <p className="text-blue-100 mt-1">Here's your daily dashboard overview.</p>
        </div>

        {/* Stat Cards */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Queue */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Today's Queue</h2>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-3">
              {queue.map((patient, index) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-400 w-6">{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden sm:block">{patient.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className={`w-full ${action.color} text-white rounded-lg px-4 py-3 flex items-center gap-3 transition-colors`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Patient ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Phone</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{reg.id}</td>
                    <td className="py-3 text-gray-900">{reg.name}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {reg.phone}
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{reg.time}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[reg.status]}`}>
                        {reg.status}
                      </span>
                    </td>
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
