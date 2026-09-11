import { DollarSign, Receipt, Clock, AlertTriangle, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Bills', value: '₦458,200', icon: DollarSign, color: 'bg-[#3b82f6]' },
  { label: 'Paid', value: '₦380,000', icon: Receipt, color: 'bg-emerald-500' },
  { label: 'Pending', value: '₦45,200', icon: Clock, color: 'bg-amber-500' },
  { label: 'Overdue', value: '₦33,000', icon: AlertTriangle, color: 'bg-red-500' },
];

const bills = [
  { id: 'BIL-001', patient: 'John Smith', visit: 'VST-001', amount: 2500, paid: 2500, balance: 0, status: 'Paid' },
  { id: 'BIL-002', patient: 'Maria Garcia', visit: 'VST-002', amount: 1800, paid: 1000, balance: 800, status: 'Pending' },
  { id: 'BIL-003', patient: 'Robert Johnson', visit: 'VST-003', amount: 3200, paid: 3200, balance: 0, status: 'Paid' },
  { id: 'BIL-004', patient: 'Emily Davis', visit: 'VST-004', amount: 950, paid: 0, balance: 950, status: 'Overdue' },
  { id: 'BIL-005', patient: 'Michael Wilson', visit: 'VST-005', amount: 4500, paid: 4500, balance: 0, status: 'Paid' },
  { id: 'BIL-006', patient: 'Sarah Brown', visit: 'VST-006', amount: 1200, paid: 600, balance: 600, status: 'Pending' },
  { id: 'BIL-007', patient: 'David Lee', visit: 'VST-007', amount: 2800, paid: 2800, balance: 0, status: 'Paid' },
  { id: 'BIL-008', patient: 'Emma Wilson', visit: 'VST-008', amount: 1500, paid: 0, balance: 1500, status: 'Overdue' },
  { id: 'BIL-009', patient: 'James Taylor', visit: 'VST-009', amount: 3500, paid: 2000, balance: 1500, status: 'Pending' },
  { id: 'BIL-010', patient: 'Lisa Anderson', visit: 'VST-010', amount: 2200, paid: 2200, balance: 0, status: 'Paid' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'green';
    case 'Pending': return 'yellow';
    case 'Overdue': return 'red';
    default: return 'gray';
  }
};

export default function Billing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Billing Management" icon={DollarSign} />
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
                  {['Bill ID', 'Patient', 'Visit', 'Amount', 'Paid', 'Balance', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{b.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{b.patient}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{b.visit}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{b.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">₦{b.paid.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">₦{b.balance.toLocaleString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={b.status} color={getStatusColor(b.status) as any} /></td>
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
