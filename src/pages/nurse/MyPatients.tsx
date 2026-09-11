import { Users, AlertTriangle, Heart, LogOut, Search, Filter } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Assigned Patients', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Critical', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  { label: 'Stable', value: '7', icon: Heart, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Discharged', value: '2', icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const patients = [
  { id: 'PAT001', name: 'John Smith', ward: 'Cardiology', bed: 'C-101', condition: 'Post-surgery recovery', lastChecked: '30 min ago', status: 'Stable' },
  { id: 'PAT002', name: 'Sarah Johnson', ward: 'ICU', bed: 'ICU-05', condition: 'Critical - Heart failure', lastChecked: '10 min ago', status: 'Critical' },
  { id: 'PAT003', name: 'Mike Williams', ward: 'General', bed: 'G-204', condition: 'Diabetes management', lastChecked: '1 hour ago', status: 'Stable' },
  { id: 'PAT004', name: 'Emily Brown', ward: 'Orthopedics', bed: 'O-108', condition: 'Post hip replacement', lastChecked: '45 min ago', status: 'Stable' },
  { id: 'PAT005', name: 'David Lee', ward: 'Neurology', bed: 'N-301', condition: 'Stroke recovery', lastChecked: '20 min ago', status: 'Critical' },
  { id: 'PAT006', name: 'Lisa Anderson', ward: 'Cardiology', bed: 'C-105', condition: 'Chest infection', lastChecked: '2 hours ago', status: 'Stable' },
  { id: 'PAT007', name: 'James Wilson', ward: 'ICU', bed: 'ICU-02', condition: 'Respiratory failure', lastChecked: '5 min ago', status: 'Critical' },
  { id: 'PAT008', name: 'Maria Garcia', ward: 'General', bed: 'G-210', condition: 'Post appendectomy', lastChecked: '3 hours ago', status: 'Discharged' },
  { id: 'PAT009', name: 'Robert Taylor', ward: 'Oncology', bed: 'ON-405', condition: 'Chemotherapy cycle', lastChecked: '1.5 hours ago', status: 'Stable' },
  { id: 'PAT010', name: 'Jennifer Martinez', ward: 'Pediatrics', bed: 'P-102', condition: 'Tonsillectomy recovery', lastChecked: '4 hours ago', status: 'Discharged' },
];

const statusColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-800',
  Stable: 'bg-green-100 text-green-800',
  Discharged: 'bg-gray-100 text-gray-800',
};

export default function MyPatients() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Patients" description="View and manage your assigned patients" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Checked</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{patient.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{patient.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{patient.ward}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{patient.bed}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{patient.condition}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{patient.lastChecked}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[patient.status]}`}>
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}