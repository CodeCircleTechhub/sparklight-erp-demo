import { Pill } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const prescriptions = [
  { id: 'PRE-2026-001', patient: 'John Doe', doctor: 'Dr. Smith', date: '2026-09-11', medicines: 3, status: 'Filled' },
  { id: 'PRE-2026-002', patient: 'Sarah Connor', doctor: 'Dr. Patel', date: '2026-09-11', medicines: 2, status: 'Filled' },
  { id: 'PRE-2026-003', patient: 'Mike Johnson', doctor: 'Dr. Lee', date: '2026-09-11', medicines: 4, status: 'Pending' },
  { id: 'PRE-2026-004', patient: 'Emma Wilson', doctor: 'Dr. Adams', date: '2026-09-10', medicines: 1, status: 'Filled' },
  { id: 'PRE-2026-005', patient: 'David Brown', doctor: 'Dr. Chen', date: '2026-09-10', medicines: 2, status: 'Filled' },
  { id: 'PRE-2026-006', patient: 'Lisa Anderson', doctor: 'Dr. Kim', date: '2026-09-10', medicines: 3, status: 'Partially Filled' },
  { id: 'PRE-2026-007', patient: 'James Taylor', doctor: 'Dr. Garcia', date: '2026-09-09', medicines: 2, status: 'Filled' },
  { id: 'PRE-2026-008', patient: 'Rachel White', doctor: 'Dr. Nguyen', date: '2026-09-09', medicines: 1, status: 'Filled' },
  { id: 'PRE-2026-009', patient: 'Tom Harris', doctor: 'Dr. Patel', date: '2026-09-08', medicines: 5, status: 'Pending' },
  { id: 'PRE-2026-010', patient: 'Grace Lee', doctor: 'Dr. Smith', date: '2026-09-08', medicines: 2, status: 'Filled' },
];

const statusColor = (s: string) => {
  if (s === 'Filled') return 'bg-green-100 text-green-700';
  if (s === 'Pending') return 'bg-yellow-100 text-yellow-700';
  if (s === 'Partially Filled') return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
};

export default function Prescriptions() {
  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" icon={Pill} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Prescription ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Medicines</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.doctor}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.medicines}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(row.status)}`}>
                      {row.status}
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
