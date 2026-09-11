import { Receipt as ReceiptIcon, Calendar, Clock, MoreVertical } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '1,050', icon: ReceiptIcon, color: 'bg-[#3b82f6]' },
  { label: 'This Month', value: '120', icon: Calendar, color: 'bg-emerald-500' },
  { label: 'Pending', value: '5', icon: Clock, color: 'bg-amber-500' },
];

const receipts = [
  { id: 'RCP-001', patient: 'John Smith', invoice: 'INV-001', amount: 2500, method: 'Credit Card', date: '2024-01-15' },
  { id: 'RCP-002', patient: 'Maria Garcia', invoice: 'INV-002', amount: 1000, method: 'Bank Transfer', date: '2024-01-15' },
  { id: 'RCP-003', patient: 'Robert Johnson', invoice: 'INV-003', amount: 8500, method: 'Insurance', date: '2024-01-14' },
  { id: 'RCP-004', patient: 'Emily Davis', invoice: 'INV-004', amount: 950, method: 'Cash', date: '2024-01-14' },
  { id: 'RCP-005', patient: 'Michael Wilson', invoice: 'INV-005', amount: 4500, method: 'Credit Card', date: '2024-01-13' },
  { id: 'RCP-006', patient: 'Sarah Brown', invoice: 'INV-006', amount: 600, method: 'Mobile Pay', date: '2024-01-13' },
  { id: 'RCP-007', patient: 'David Lee', invoice: 'INV-007', amount: 800, method: 'Cash', date: '2024-01-12' },
  { id: 'RCP-008', patient: 'Emma Wilson', invoice: 'INV-008', amount: 1500, method: 'Bank Transfer', date: '2024-01-12' },
  { id: 'RCP-009', patient: 'James Taylor', invoice: 'INV-009', amount: 5000, method: 'Insurance', date: '2024-01-11' },
  { id: 'RCP-010', patient: 'Lisa Anderson', invoice: 'INV-010', amount: 2200, method: 'Credit Card', date: '2024-01-11' },
];

export default function Receipts() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Receipts" icon={ReceiptIcon} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${s.color} p-2 rounded-lg`}>
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
                  {['Receipt ID', 'Patient', 'Invoice', 'Amount', 'Method', 'Date', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{r.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{r.patient}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.invoice}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">${r.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.method}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.date}</td>
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
