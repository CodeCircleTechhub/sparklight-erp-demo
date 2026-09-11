import { Bed, Users, Calendar, ArrowRightLeft, LogOut } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Admitted', value: '15', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Today', value: '3', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Transferred', value: '2', icon: ArrowRightLeft, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Discharged', value: '8', icon: LogOut, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const admissions = [
  { id: 'ADM-8001', patient: 'Sarah Johnson', ward: 'Cardiology', bed: 'C-101', date: 'Sep 10, 2026', reason: 'Chest pain', status: 'Admitted' },
  { id: 'ADM-8002', patient: 'Michael Brown', ward: 'Endocrinology', bed: 'E-203', date: 'Sep 10, 2026', reason: 'Diabetic ketoacidosis', status: 'Admitted' },
  { id: 'ADM-8003', patient: 'Emma Wilson', ward: 'Neurology', bed: 'N-105', date: 'Sep 11, 2026', reason: 'Severe migraine', status: 'Admitted' },
  { id: 'ADM-8004', patient: 'James Davis', ward: 'Orthopedics', bed: 'O-302', date: 'Sep 09, 2026', reason: 'Fracture - femur', status: 'Admitted' },
  { id: 'ADM-8005', patient: 'Olivia Martinez', ward: 'General', bed: 'G-108', date: 'Sep 08, 2026', reason: 'Post-surgery recovery', status: 'Discharged' },
  { id: 'ADM-8006', patient: 'William Garcia', ward: 'Pulmonology', bed: 'P-201', date: 'Sep 11, 2026', reason: 'Asthma exacerbation', status: 'Admitted' },
  { id: 'ADM-8007', patient: 'Sophia Rodriguez', ward: 'Cardiology', bed: 'C-104', date: 'Sep 07, 2026', reason: 'Heart failure', status: 'Transferred' },
  { id: 'ADM-8008', patient: 'Daniel Lee', ward: 'ICU', bed: 'ICU-02', date: 'Sep 06, 2026', reason: 'Respiratory failure', status: 'Admitted' },
  { id: 'ADM-8009', patient: 'Isabella Thomas', ward: 'Obstetrics', bed: 'OB-102', date: 'Sep 05, 2026', reason: 'Normal delivery', status: 'Discharged' },
  { id: 'ADM-8010', patient: 'Benjamin Harris', ward: 'General', bed: 'G-205', date: 'Sep 04, 2026', reason: 'Chest infection', status: 'Discharged' },
];

const statusColors: Record<string, string> = {
  Admitted: 'bg-blue-100 text-blue-800',
  Discharged: 'bg-gray-100 text-gray-800',
  Transferred: 'bg-purple-100 text-purple-800',
};

export default function DoctorAdmission() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admission" icon={Bed} />

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Admission ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ward</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bed</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {admissions.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{a.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{a.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.ward}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.bed}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{a.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{a.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[a.status]}`}>{a.status}</span>
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
