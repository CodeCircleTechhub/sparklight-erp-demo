import { Stethoscope, ClipboardList, BedDouble, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: "Today's Consultations", value: '45', icon: Stethoscope, color: 'bg-blue-500' },
  { label: 'Pending Results', value: '12', icon: ClipboardList, color: 'bg-amber-500' },
  { label: 'Admissions', value: '28', icon: BedDouble, color: 'bg-green-500' },
  { label: 'Discharges', value: '15', icon: ArrowUpRight, color: 'bg-violet-500' },
];

const clinical = [
  { patient: 'Alice Johnson', doctor: 'Dr. Smith', department: 'Cardiology', lastVisit: 'Sep 11, 2026', status: 'Under Observation' },
  { patient: 'Bob Williams', doctor: 'Dr. Patel', department: 'Neurology', lastVisit: 'Sep 11, 2026', status: 'Admitted' },
  { patient: 'Carol Davis', doctor: 'Dr. Lee', department: 'Pediatrics', lastVisit: 'Sep 10, 2026', status: 'Stable' },
  { patient: 'David Brown', doctor: 'Dr. Garcia', department: 'Orthopedics', lastVisit: 'Sep 11, 2026', status: 'Post-Surgery' },
  { patient: 'Eva Martinez', doctor: 'Dr. Kim', department: 'Oncology', lastVisit: 'Sep 09, 2026', status: 'Under Treatment' },
  { patient: 'Frank Wilson', doctor: 'Dr. Chen', department: 'Dermatology', lastVisit: 'Sep 10, 2026', status: 'Stable' },
  { patient: 'Grace Lee', doctor: 'Dr. Adams', department: 'Emergency', lastVisit: 'Sep 11, 2026', status: 'Critical' },
  { patient: 'Henry Garcia', doctor: 'Dr. Brown', department: 'Radiology', lastVisit: 'Sep 08, 2026', status: 'Recovered' },
];

const statusColors: Record<string, string> = {
  'Under Observation': 'bg-blue-100 text-blue-700',
  Admitted: 'bg-green-100 text-green-700',
  Stable: 'bg-green-100 text-green-700',
  'Post-Surgery': 'bg-violet-100 text-violet-700',
  'Under Treatment': 'bg-amber-100 text-amber-700',
  Critical: 'bg-red-100 text-red-700',
  Recovered: 'bg-emerald-100 text-emerald-700',
};

export default function ManagerClinical() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Clinical Overview" icon={Stethoscope} />

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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Doctor</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Department</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Last Visit</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clinical.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-900">{c.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{c.doctor}</td>
                    <td className="py-3 text-gray-600 hidden lg:table-cell">{c.department}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{c.lastVisit}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}>
                        {c.status}
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
