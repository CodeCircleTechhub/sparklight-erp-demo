import { AlertTriangle, Clock, Calendar, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Outstanding', value: '₦45,200', icon: AlertTriangle, color: 'bg-red-500' },
  { label: '30 Days', value: '₦12,500', icon: Clock, color: 'bg-amber-500' },
  { label: '60 Days', value: '₦8,200', icon: Calendar, color: 'bg-orange-500' },
  { label: '90+ Days', value: '₦4,500', icon: AlertTriangle, color: 'bg-red-600' },
];

const outstanding = [
  { id: 'INV-004', patient: 'Emily Davis', amount: 950, dueDate: '2024-01-05', daysOverdue: 10, status: 'Overdue' },
  { id: 'INV-008', patient: 'Emma Wilson', amount: 1500, dueDate: '2024-01-03', daysOverdue: 12, status: 'Overdue' },
  { id: 'INV-012', patient: 'James Taylor', amount: 2800, dueDate: '2023-12-15', daysOverdue: 31, status: 'Overdue' },
  { id: 'INV-015', patient: 'Alice Morgan', amount: 1200, dueDate: '2023-12-10', daysOverdue: 36, status: 'Overdue' },
  { id: 'INV-018', patient: 'Bob Clark', amount: 3500, dueDate: '2023-11-20', daysOverdue: 56, status: 'Overdue' },
  { id: 'INV-022', patient: 'Carol White', amount: 800, dueDate: '2023-11-15', daysOverdue: 61, status: 'Overdue' },
  { id: 'INV-025', patient: 'David Lewis', amount: 4200, dueDate: '2023-10-01', daysOverdue: 106, status: 'Overdue' },
  { id: 'INV-030', patient: 'Eva Green', amount: 2100, dueDate: '2023-09-15', daysOverdue: 122, status: 'Overdue' },
];

const getStatusColor = (days: number) => {
  if (days <= 30) return 'yellow';
  if (days <= 60) return 'yellow';
  return 'red';
};

export default function Outstanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Outstanding Bills" icon={AlertTriangle} />
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
                  {['Invoice ID', 'Patient', 'Amount', 'Due Date', 'Days Overdue', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outstanding.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{o.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{o.patient}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{o.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{o.dueDate}</td>
                    <td className="px-5 py-4 text-sm font-medium text-red-600">{o.daysOverdue} days</td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} color={getStatusColor(o.daysOverdue) as any} /></td>
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
