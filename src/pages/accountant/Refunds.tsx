import { RotateCcw, DollarSign, Clock, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '₦2,300', icon: DollarSign, color: 'bg-[#3b82f6]' },
  { label: 'Processed', value: '₦1,800', icon: RotateCcw, color: 'bg-emerald-500' },
  { label: 'Pending', value: '₦500', icon: Clock, color: 'bg-amber-500' },
];

const refunds = [
  { id: 'REF-001', patient: 'John Smith', invoice: 'INV-001', amount: 250, reason: 'Service cancellation', date: '2024-01-15', status: 'Processed' },
  { id: 'REF-002', patient: 'Maria Garcia', invoice: 'INV-002', amount: 150, reason: 'Overpayment', date: '2024-01-14', status: 'Processed' },
  { id: 'REF-003', patient: 'Robert Johnson', invoice: 'INV-003', amount: 500, reason: 'Insurance adjustment', date: '2024-01-13', status: 'Pending' },
  { id: 'REF-004', patient: 'Emily Davis', invoice: 'INV-004', amount: 400, reason: 'Duplicate charge', date: '2024-01-12', status: 'Processed' },
  { id: 'REF-005', patient: 'Michael Wilson', invoice: 'INV-005', amount: 500, reason: 'Service not rendered', date: '2024-01-11', status: 'Pending' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processed': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function Refunds() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Refunds" icon={RotateCcw} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`₦{s.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-gray-500">{s.label}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Refund ID', 'Patient', 'Invoice', 'Amount', 'Reason', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{r.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{r.patient}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.invoice}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{r.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.reason}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.date}</td>
                    <td className="px-5 py-4"><StatusBadge status={r.status} color={getStatusColor(r.status) as any} /></td>
                    <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
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
