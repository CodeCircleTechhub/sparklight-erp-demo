import { AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import StatCard from '../../components/ui/StatCard';

const stats = [
  { title: 'Total Outstanding', value: '₦45,200', icon: AlertCircle, color: 'red' as const },
  { title: 'Over 30 Days', value: '₦12,500', icon: AlertCircle, color: 'yellow' as const },
  { title: 'Over 60 Days', value: '₦8,200', icon: AlertCircle, color: 'yellow' as const },
  { title: 'Over 90 Days', value: '₦4,500', icon: AlertCircle, color: 'red' as const },
];

const bills = [
  { id: 'INV-2026-003', patient: 'Mike Johnson', amount: 4500, dueDate: '2026-09-01', daysOverdue: 10, status: 'Overdue' },
  { id: 'INV-2026-008', patient: 'Rachel White', amount: 950, dueDate: '2026-09-05', daysOverdue: 6, status: 'Overdue' },
  { id: 'INV-2026-002', patient: 'Sarah Connor', amount: 850, dueDate: '2026-09-08', daysOverdue: 3, status: 'Overdue' },
  { id: 'INV-2025-187', patient: 'Kevin Hart', amount: 3200, dueDate: '2026-07-15', daysOverdue: 58, status: 'Overdue' },
  { id: 'INV-2025-162', patient: 'Amy Rose', amount: 1800, dueDate: '2026-06-20', daysOverdue: 83, status: 'Overdue' },
  { id: 'INV-2025-143', patient: 'Carlos Vega', amount: 2500, dueDate: '2026-05-10', daysOverdue: 124, status: 'Overdue' },
  { id: 'INV-2025-128', patient: 'Nina Patel', amount: 1200, dueDate: '2026-04-25', daysOverdue: 139, status: 'Overdue' },
  { id: 'INV-2025-110', patient: 'Derek Mills', amount: 5500, dueDate: '2026-03-30', daysOverdue: 165, status: 'Overdue' },
];

const formatCurrency = (n: number) => `₦${n.toLocaleString()}`;

export default function OutstandingBills() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outstanding Bills" icon={AlertCircle} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Days Overdue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap font-medium">{formatCurrency(row.amount)}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.dueDate}</td>
                  <td className="py-3 px-4 text-red-600 font-medium whitespace-nowrap">{row.daysOverdue} days</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700">
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
