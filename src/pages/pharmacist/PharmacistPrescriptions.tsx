import { ClipboardList, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Pending', value: '15', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { label: 'Dispensed', value: '250', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Partially Dispensed', value: '8', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
  { label: 'Total', value: '273', icon: ClipboardList, color: 'text-gray-600', bg: 'bg-gray-100' },
];

const prescriptions = [
  { id: 'RX-2001', patient: 'Sarah Johnson', doctor: 'Dr. Ahmed', date: 'Sep 11, 2026', medicines: 3, status: 'Pending' },
  { id: 'RX-2002', patient: 'Michael Brown', doctor: 'Dr. Ahmed', date: 'Sep 11, 2026', medicines: 2, status: 'Dispensed' },
  { id: 'RX-2003', patient: 'Emma Wilson', doctor: 'Dr. Fatima', date: 'Sep 11, 2026', medicines: 5, status: 'Pending' },
  { id: 'RX-2004', patient: 'James Davis', doctor: 'Dr. Ahmed', date: 'Sep 10, 2026', medicines: 1, status: 'Partially Dispensed' },
  { id: 'RX-2005', patient: 'Olivia Martinez', doctor: 'Dr. Fatima', date: 'Sep 10, 2026', medicines: 4, status: 'Pending' },
  { id: 'RX-2006', patient: 'William Garcia', doctor: 'Dr. Ahmed', date: 'Sep 10, 2026', medicines: 2, status: 'Dispensed' },
  { id: 'RX-2007', patient: 'Sophia Rodriguez', doctor: 'Dr. Fatima', date: 'Sep 09, 2026', medicines: 3, status: 'Dispensed' },
  { id: 'RX-2008', patient: 'Daniel Lee', doctor: 'Dr. Ahmed', date: 'Sep 09, 2026', medicines: 6, status: 'Pending' },
  { id: 'RX-2009', patient: 'Isabella Thomas', doctor: 'Dr. Fatima', date: 'Sep 08, 2026', medicines: 2, status: 'Dispensed' },
  { id: 'RX-2010', patient: 'Benjamin Harris', doctor: 'Dr. Ahmed', date: 'Sep 08, 2026', medicines: 4, status: 'Partially Dispensed' },
];

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Dispensed: 'bg-green-100 text-green-800',
  'Partially Dispensed': 'bg-orange-100 text-orange-800',
};

export default function PharmacistPrescriptions() {
  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" icon={ClipboardList} />

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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Prescription ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicines</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{rx.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{rx.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rx.doctor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rx.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rx.medicines} items</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[rx.status]}`}>{rx.status}</span>
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
