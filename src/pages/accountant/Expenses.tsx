import { DollarSign, Calendar, Clock, CheckCircle, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '₦125,000', icon: DollarSign, color: 'bg-[#3b82f6]' },
  { label: 'This Month', value: '₦12,500', icon: Calendar, color: 'bg-emerald-500' },
  { label: 'Pending Approval', value: '₦3,200', icon: Clock, color: 'bg-amber-500' },
  { label: 'Approved', value: '₦121,800', icon: CheckCircle, color: 'bg-purple-500' },
];

const expenses = [
  { id: 'EXP-001', category: 'Medical Supplies', description: 'Surgical instruments purchase', amount: 8500, date: '2024-01-15', status: 'Approved' },
  { id: 'EXP-002', category: 'Utilities', description: 'Electricity bill - January', amount: 3200, date: '2024-01-14', status: 'Approved' },
  { id: 'EXP-003', category: 'Maintenance', description: 'AC unit repair', amount: 1800, date: '2024-01-13', status: 'Pending' },
  { id: 'EXP-004', category: 'Staff Training', description: 'CPR certification course', amount: 2500, date: '2024-01-12', status: 'Approved' },
  { id: 'EXP-005', category: 'Pharmacy', description: 'Medicine restocking', amount: 15000, date: '2024-01-11', status: 'Approved' },
  { id: 'EXP-006', category: 'IT Equipment', description: 'Computer upgrades', amount: 6500, date: '2024-01-10', status: 'Pending' },
  { id: 'EXP-007', category: 'Cleaning', description: 'Monthly cleaning service', amount: 1500, date: '2024-01-09', status: 'Approved' },
  { id: 'EXP-008', category: 'Insurance', description: 'Liability insurance premium', amount: 4500, date: '2024-01-08', status: 'Approved' },
  { id: 'EXP-009', category: 'Marketing', description: 'Social media advertising', amount: 2000, date: '2024-01-07', status: 'Pending' },
  { id: 'EXP-010', category: 'Transport', description: 'Ambulance fuel', amount: 3500, date: '2024-01-06', status: 'Approved' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function Expenses() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Expenses" icon={DollarSign} />
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
                  {['Expense ID', 'Category', 'Description', 'Amount', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{e.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{e.category}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{e.description}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{e.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{e.date}</td>
                    <td className="px-5 py-4"><StatusBadge status={e.status} color={getStatusColor(e.status) as any} /></td>
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
