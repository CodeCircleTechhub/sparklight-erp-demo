import { Receipt } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const invoices = [
  { id: 'INV-2026-001', patient: 'John Doe', date: '2026-09-11', amount: 3200, paid: 3200, balance: 0, status: 'Paid' },
  { id: 'INV-2026-002', patient: 'Sarah Connor', date: '2026-09-11', amount: 1850, paid: 1000, balance: 850, status: 'Partial' },
  { id: 'INV-2026-003', patient: 'Mike Johnson', date: '2026-09-10', amount: 4500, paid: 0, balance: 4500, status: 'Pending' },
  { id: 'INV-2026-004', patient: 'Emma Wilson', date: '2026-09-10', amount: 750, paid: 750, balance: 0, status: 'Paid' },
  { id: 'INV-2026-005', patient: 'David Brown', date: '2026-09-10', amount: 2100, paid: 2100, balance: 0, status: 'Paid' },
  { id: 'INV-2026-006', patient: 'Lisa Anderson', date: '2026-09-09', amount: 1200, paid: 600, balance: 600, status: 'Partial' },
  { id: 'INV-2026-007', patient: 'James Taylor', date: '2026-09-09', amount: 3800, paid: 3800, balance: 0, status: 'Paid' },
  { id: 'INV-2026-008', patient: 'Rachel White', date: '2026-09-08', amount: 950, paid: 0, balance: 950, status: 'Pending' },
  { id: 'INV-2026-009', patient: 'Tom Harris', date: '2026-09-08', amount: 5200, paid: 2600, balance: 2600, status: 'Partial' },
  { id: 'INV-2026-010', patient: 'Grace Lee', date: '2026-09-07', amount: 1400, paid: 1400, balance: 0, status: 'Paid' },
];

const statusColor = (s: string) => {
  if (s === 'Paid') return 'bg-green-100 text-green-700';
  if (s === 'Pending') return 'bg-red-100 text-red-700';
  if (s === 'Partial') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
};

const formatCurrency = (n: number) => `$${n.toLocaleString()}`;

export default function Invoices() {
  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" icon={Receipt} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Paid</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Balance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.id}</td>
                  <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patient}</td>
                  <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-4 text-gray-700 whitespace-nowrap font-medium">{formatCurrency(row.amount)}</td>
                  <td className="py-3 px-4 text-green-600 whitespace-nowrap">{formatCurrency(row.paid)}</td>
                  <td className="py-3 px-4 text-red-600 whitespace-nowrap">{formatCurrency(row.balance)}</td>
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
