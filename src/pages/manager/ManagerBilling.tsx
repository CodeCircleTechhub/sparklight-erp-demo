import { DollarSign, Clock, ArrowDownCircle, FileText } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Revenue', value: '₦125,430', icon: DollarSign, color: 'bg-green-500' },
  { label: 'Pending', value: '₦45,200', icon: Clock, color: 'bg-amber-500' },
  { label: 'Collected', value: '₦80,230', icon: ArrowDownCircle, color: 'bg-blue-500' },
  { label: 'Insurance Claims', value: '₦15,600', icon: FileText, color: 'bg-violet-500' },
];

const invoices = [
  { id: 'INV-5001', patient: 'Alice Johnson', amount: '₦1,250.00', status: 'Paid' },
  { id: 'INV-5002', patient: 'Bob Williams', amount: '₦890.50', status: 'Pending' },
  { id: 'INV-5003', patient: 'Carol Davis', amount: '₦2,100.00', status: 'Paid' },
  { id: 'INV-5004', patient: 'David Brown', amount: '₦450.00', status: 'Overdue' },
  { id: 'INV-5005', patient: 'Eva Martinez', amount: '₦3,200.00', status: 'Paid' },
  { id: 'INV-5006', patient: 'Frank Wilson', amount: '₦780.00', status: 'Pending' },
  { id: 'INV-5007', patient: 'Grace Lee', amount: '₦1,500.00', status: 'Paid' },
  { id: 'INV-5008', patient: 'Henry Garcia', amount: '₦620.00', status: 'Pending' },
];

export default function ManagerBilling() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Billing Overview" icon={DollarSign} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ₦{s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Invoice ID</th>
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="py-3 font-medium text-blue-600">{inv.id}</td>
                    <td className="py-3 text-gray-900">{inv.patient}</td>
                    <td className="py-3 text-gray-600 hidden md:table-cell">{inv.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{statusColors[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
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
