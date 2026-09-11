import { Pill, Calendar, Clock } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Today', value: '25', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'This Week', value: '150', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Average Daily', value: '22', icon: Pill, color: 'text-green-600', bg: 'bg-green-100' },
];

const dispensing = [
  { id: 'RX-2001', patient: 'Sarah Johnson', medicine: 'Amlodipine 5mg', quantity: 30, dispensedBy: 'Pharm. Ali', date: 'Sep 11, 2026', status: 'Dispensed' },
  { id: 'RX-2002', patient: 'Michael Brown', medicine: 'Metformin 1000mg', quantity: 60, dispensedBy: 'Pharm. Ali', date: 'Sep 11, 2026', status: 'Dispensed' },
  { id: 'RX-2003', patient: 'Emma Wilson', medicine: 'Sumatriptan 50mg', quantity: 10, dispensedBy: 'Pharm. Sara', date: 'Sep 11, 2026', status: 'Partially Dispensed' },
  { id: 'RX-2004', patient: 'James Davis', medicine: 'Ibuprofen 400mg', quantity: 20, dispensedBy: 'Pharm. Ali', date: 'Sep 10, 2026', status: 'Dispensed' },
  { id: 'RX-2005', patient: 'Olivia Martinez', medicine: 'Naproxen 250mg', quantity: 30, dispensedBy: 'Pharm. Sara', date: 'Sep 10, 2026', status: 'Dispensed' },
  { id: 'RX-2006', patient: 'William Garcia', medicine: 'Salbutamol Inhaler', quantity: 1, dispensedBy: 'Pharm. Ali', date: 'Sep 10, 2026', status: 'Dispensed' },
  { id: 'RX-2007', patient: 'Sophia Rodriguez', medicine: 'Levothyroxine 50mcg', quantity: 30, dispensedBy: 'Pharm. Sara', date: 'Sep 09, 2026', status: 'Dispensed' },
  { id: 'RX-2008', patient: 'Daniel Lee', medicine: 'Tiotropium 18mcg', quantity: 30, dispensedBy: 'Pharm. Ali', date: 'Sep 09, 2026', status: 'Pending' },
];

const statusColors: Record<string, string> = {
  Dispensed: 'bg-green-100 text-green-800',
  'Partially Dispensed': 'bg-orange-100 text-orange-800',
  Pending: 'bg-yellow-100 text-yellow-800',
};

export default function Dispensing() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dispensing" icon={Pill} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Medicine</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Quantity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dispensed By</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dispensing.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{d.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{d.patient}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.medicine}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.dispensedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[d.status]}`}>{d.status}</span>
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
