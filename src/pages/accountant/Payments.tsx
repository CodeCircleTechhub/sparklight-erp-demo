import { CreditCard, CalendarDays, Calendar, DollarSign, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Today', value: '₦12,450', icon: CalendarDays, color: 'bg-[#3b82f6]' },
  { label: 'This Week', value: '₦85,200', icon: Calendar, color: 'bg-emerald-500' },
  { label: 'This Month', value: '₦380,000', icon: DollarSign, color: 'bg-purple-500' },
  { label: 'Total', value: '₦458,200', icon: CreditCard, color: 'bg-amber-500' },
];

const payments = [
  { id: 'PAY-001', patient: 'John Smith', invoice: 'INV-001', amount: 2500, method: 'Credit Card', date: '2024-01-15', status: 'Completed' },
  { id: 'PAY-002', patient: 'Maria Garcia', invoice: 'INV-002', amount: 1000, method: 'Bank Transfer', date: '2024-01-15', status: 'Completed' },
  { id: 'PAY-003', patient: 'Robert Johnson', invoice: 'INV-003', amount: 8500, method: 'Insurance', date: '2024-01-14', status: 'Completed' },
  { id: 'PAY-004', patient: 'Emily Davis', invoice: 'INV-004', amount: 950, method: 'Cash', date: '2024-01-14', status: 'Pending' },
  { id: 'PAY-005', patient: 'Michael Wilson', invoice: 'INV-005', amount: 4500, method: 'Credit Card', date: '2024-01-13', status: 'Completed' },
  { id: 'PAY-006', patient: 'Sarah Brown', invoice: 'INV-006', amount: 600, method: 'Mobile Pay', date: '2024-01-13', status: 'Completed' },
  { id: 'PAY-007', patient: 'David Lee', invoice: 'INV-007', amount: 800, method: 'Cash', date: '2024-01-12', status: 'Completed' },
  { id: 'PAY-008', patient: 'Emma Wilson', invoice: 'INV-008', amount: 1500, method: 'Bank Transfer', date: '2024-01-12', status: 'Pending' },
  { id: 'PAY-009', patient: 'James Taylor', invoice: 'INV-009', amount: 5000, method: 'Insurance', date: '2024-01-11', status: 'Completed' },
  { id: 'PAY-010', patient: 'Lisa Anderson', invoice: 'INV-010', amount: 2200, method: 'Credit Card', date: '2024-01-11', status: 'Completed' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function Payments() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Payments" icon={CreditCard} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  {['Payment ID', 'Patient', 'Invoice', 'Amount', 'Method', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{p.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{p.patient}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.invoice}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{p.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.method}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.date}</td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} color={getStatusColor(p.status) as any} /></td>
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
