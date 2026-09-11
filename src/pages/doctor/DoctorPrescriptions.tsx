import { Pill, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Today', value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'This Week', value: '65', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Dispensed', value: '58', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Pending', value: '7', icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
];

const prescriptions = [
  { id: 'RX-5001', patient: 'Sarah Johnson', date: 'Sep 11, 2026', medicines: 'Amlodipine 5mg, Aspirin 75mg', status: 'Dispensed' },
  { id: 'RX-5002', patient: 'Michael Brown', date: 'Sep 11, 2026', medicines: 'Metformin 1000mg, Glimepiride 2mg', status: 'Pending' },
  { id: 'RX-5003', patient: 'Emma Wilson', date: 'Sep 11, 2026', medicines: 'Sumatriptan 50mg', status: 'Dispensed' },
  { id: 'RX-5004', patient: 'James Davis', date: 'Sep 10, 2026', medicines: 'Ibuprofen 400mg, Muscle Relaxant', status: 'Dispensed' },
  { id: 'RX-5005', patient: 'Olivia Martinez', date: 'Sep 10, 2026', medicines: 'Naproxen 250mg, Omeprazole 20mg', status: 'Pending' },
  { id: 'RX-5006', patient: 'William Garcia', date: 'Sep 10, 2026', medicines: 'Salbutamol Inhaler', status: 'Dispensed' },
  { id: 'RX-5007', patient: 'Sophia Rodriguez', date: 'Sep 09, 2026', medicines: 'Levothyroxine 50mcg', status: 'Dispensed' },
  { id: 'RX-5008', patient: 'Daniel Lee', date: 'Sep 09, 2026', medicines: 'Tiotropium 18mcg, Prednisone 20mg', status: 'Pending' },
  { id: 'RX-5009', patient: 'Isabella Thomas', date: 'Sep 08, 2026', medicines: 'Prenatal Vitamins, Folic Acid', status: 'Dispensed' },
  { id: 'RX-5010', patient: 'Benjamin Harris', date: 'Sep 08, 2026', medicines: 'Amoxicillin 500mg, Paracetamol', status: 'Dispensed' },
];

const statusColors: Record<string, string> = {
  Dispensed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

export default function DoctorPrescriptions() {
  return (
    <div className="space-y-6">
      <PageHeader title="Prescriptions" icon={Pill} />

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
                  <td className="px-4 py-3 text-sm text-gray-600">{rx.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{rx.medicines}</td>
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
