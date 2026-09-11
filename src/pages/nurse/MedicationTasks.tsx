import { Pill, Clock, CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Pending', value: '6', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  { label: 'Completed', value: '15', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Overdue', value: '1', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  { label: 'Total Today', value: '22', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-100' },
];

const medications = [
  { patient: 'John Smith', medicine: 'Aspirin 100mg', dosage: '1 tablet', time: '08:00 AM', route: 'Oral', status: 'Completed' },
  { patient: 'Sarah Johnson', medicine: 'Metformin 500mg', dosage: '1 tablet', time: '08:30 AM', route: 'Oral', status: 'Completed' },
  { patient: 'Mike Williams', medicine: 'Insulin Glargine', dosage: '20 units', time: '09:00 AM', route: 'Injection', status: 'Completed' },
  { patient: 'Emily Brown', medicine: 'Paracetamol 500mg', dosage: '2 tablets', time: '10:00 AM', route: 'Oral', status: 'Completed' },
  { patient: 'David Lee', medicine: 'Lisinopril 10mg', dosage: '1 tablet', time: '10:30 AM', route: 'Oral', status: 'Pending' },
  { patient: 'Lisa Anderson', medicine: 'Amoxicillin 250mg', dosage: '1 capsule', time: '11:00 AM', route: 'Oral', status: 'Pending' },
  { patient: 'James Wilson', medicine: 'Morphine 10mg', dosage: '1 dose', time: '12:00 PM', route: 'IV', status: 'Pending' },
  { patient: 'Maria Garcia', medicine: 'Ondansetron 4mg', dosage: '1 tablet', time: '02:00 PM', route: 'Oral', status: 'Pending' },
  { patient: 'Robert Taylor', medicine: 'Chemotherapy Drug A', dosage: '1 dose', time: '03:00 PM', route: 'IV', status: 'Overdue' },
  { patient: 'Jennifer Martinez', medicine: 'Iron Supplement', dosage: '1 tablet', time: '04:00 PM', route: 'Oral', status: 'Pending' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  Completed: 'bg-green-100 text-green-800',
  Overdue: 'bg-red-100 text-red-800',
};

const routeColors: Record<string, string> = {
  Oral: 'bg-blue-100 text-blue-800',
  IV: 'bg-purple-100 text-purple-800',
  Injection: 'bg-pink-100 text-pink-800',
};

export default function MedicationTasks() {
  return (
    <div className="space-y-6">
      <PageHeader title="Medication Tasks" description="Track and manage medication administration" />
      
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
              placeholder="Search medications..."
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicine</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dosage</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Route</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medications.map((med, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${med.status === 'Overdue' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{med.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{med.medicine}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{med.dosage}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{med.time}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${routeColors[med.route]}`}>
                      {med.route}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[med.status]}`}>
                      {med.status}
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