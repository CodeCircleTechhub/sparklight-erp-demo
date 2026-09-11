import { CreditCard } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const payments = [
  { id: 'PAY-2026-001', patient: 'John Doe', invoice: 'INV-2026-001', amount: 3200, method: 'Card', date: '2026-09-11', status: 'Completed' },
  { id: 'PAY-2026-002', patient: 'Sarah Connor', invoice: 'INV-2026-002', amount: 1000, method: 'Cash', date: '2026-09-11', status: 'Completed' },
  { id: 'PAY-2026-003', patient: 'Emma Wilson', invoice: 'INV-2026-004', amount: 750, method: 'Transfer', date: '2026-09-10', status: 'Completed' },
  { id: 'PAY-2026-004', patient: 'David Brown', invoice: 'INV-2026-005', amount: 2100, method: 'Card', date: '2026-09-10', status: 'Completed' },
  { id: 'PAY-2026-005', patient: 'Lisa Anderson', invoice: 'INV-2026-006', amount: 600, method: 'Cash', date: '2026-09-09', status: 'Completed' },
  { id: 'PAY-2026-006', patient: 'James Taylor', invoice: 'INV-2026-007', amount: 3800, method: 'Transfer', date: '2026-09-09', status: 'Completed' },
  { id: 'PAY-2026-007', patient: 'Tom Harris', invoice: 'INV-2026-009', amount: 2600, method: 'Card', date: '2026-09-08', status: 'Completed' },
  { id: 'PAY-2026-008', patient: 'Grace Lee', invoice: 'INV-2026-010', amount: 1400, method: 'Cash', date: '2026-09-07', status: 'Completed' },
  { id: 'PAY-2026-009', patient: 'Mike Johnson', invoice: 'INV-2026-003', amount: 4500, method: 'Transfer', date: '2026-09-06', status: 'Failed' },
  { id: 'PAY-2026-010', patient: 'Rachel White', invoice: 'INV-2026-008', amount: 950, method: 'Card', date: '2026-09-05', status: 'Pending' },
];

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'Failed') return 'bg-red-100 text-red-700';
  if (s === 'Pending') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};

const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

export default function Payments() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payments" icon={CreditCard} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.invoice}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap font-medium">{formatCurrency(row.amount)}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.method}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
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
