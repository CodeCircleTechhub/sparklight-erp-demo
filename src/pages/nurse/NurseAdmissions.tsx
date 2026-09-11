import { UserPlus, Bed, ArrowRightLeft, LogOut, Search, Filter } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Currently Admitted', value: '15', icon: Bed, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Today\'s Admissions', value: '3', icon: UserPlus, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Transferred', value: '2', icon: ArrowRightLeft, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Discharged Today', value: '8', icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const admissions = [
  { id: 'ADM001', patient: 'John Smith', ward: 'Cardiology', bed: 'C-101', admissionDate: '2026-09-08', doctor: 'Dr. Sarah Johnson', status: 'Admitted' },
  { id: 'ADM002', patient: 'Sarah Johnson', ward: 'ICU', bed: 'ICU-05', admissionDate: '2026-09-10', doctor: 'Dr. Michael Brown', status: 'Admitted' },
  { id: 'ADM003', patient: 'Mike Williams', ward: 'General', bed: 'G-204', admissionDate: '2026-09-07', doctor: 'Dr. Emily Davis', status: 'Admitted' },
  { id: 'ADM004', patient: 'Emily Brown', ward: 'Orthopedics', bed: 'O-108', admissionDate: '2026-09-10', doctor: 'Dr. James Wilson', status: 'Admitted' },
  { id: 'ADM005', patient: 'David Lee', ward: 'Neurology', bed: 'N-301', admissionDate: '2026-09-09', doctor: 'Dr. Emily Davis', status: 'Transferred' },
  { id: 'ADM006', patient: 'Lisa Anderson', ward: 'Cardiology', bed: 'C-105', admissionDate: '2026-09-10', doctor: 'Dr. Sarah Johnson', status: 'Admitted' },
  { id: 'ADM007', patient: 'James Wilson', ward: 'ICU', bed: 'ICU-02', admissionDate: '2026-09-10', doctor: 'Dr. Michael Brown', status: 'Admitted' },
  { id: 'ADM008', patient: 'Maria Garcia', ward: 'General', bed: 'G-210', admissionDate: '2026-09-05', doctor: 'Dr. James Wilson', status: 'Discharged' },
  { id: 'ADM009', patient: 'Robert Taylor', ward: 'Oncology', bed: 'ON-405', admissionDate: '2026-09-06', doctor: 'Dr. Emily Davis', status: 'Admitted' },
  { id: 'ADM010', patient: 'Jennifer Martinez', ward: 'Pediatrics', bed: 'P-102', admissionDate: '2026-09-04', doctor: 'Dr. Sarah Johnson', status: 'Discharged' },
];

const statusColors: Record<string, string> = {
  Admitted: 'bg-blue-100 text-blue-800',
  Transferred: 'bg-purple-100 text-purple-800',
  Discharged: 'bg-green-100 text-green-800',
};

export default function NurseAdmissions() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admissions" description="Track patient admissions and discharges" />
      
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
              placeholder="Search admissions..."
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admissions.map((adm) => (
                <tr key={adm.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{adm.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{adm.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{adm.ward}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{adm.bed}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{adm.admissionDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{adm.doctor}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[adm.status]}`}>
                      {adm.status}
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