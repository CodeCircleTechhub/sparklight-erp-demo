import { FileText, CheckCircle, Clock, XCircle, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total', value: '1,250', icon: FileText, color: 'bg-[#3b82f6]' },
  { label: 'Paid', value: '1,050', icon: CheckCircle, color: 'bg-emerald-500' },
  { label: 'Pending', value: '150', icon: Clock, color: 'bg-amber-500' },
  { label: 'Cancelled', value: '50', icon: XCircle, color: 'bg-red-500' },
];

const invoices = [
  { id: 'INV-001', patient: 'John Smith', date: '2024-01-15', services: 'Consultation, Lab Test', amount: 2500, status: 'Paid' },
  { id: 'INV-002', patient: 'Maria Garcia', date: '2024-01-14', services: 'Pharmacy, Injection', amount: 1800, status: 'Pending' },
  { id: 'INV-003', patient: 'Robert Johnson', date: '2024-01-13', services: 'Surgery, Room Charge', amount: 8500, status: 'Paid' },
  { id: 'INV-004', patient: 'Emily Davis', date: '2024-01-12', services: 'X-Ray, Consultation', amount: 950, status: 'Cancelled' },
  { id: 'INV-005', patient: 'Michael Wilson', date: '2024-01-11', services: 'MRI, Blood Test', amount: 4500, status: 'Paid' },
  { id: 'INV-006', patient: 'Sarah Brown', date: '2024-01-10', services: 'Ultrasound, Consultation', amount: 1200, status: 'Pending' },
  { id: 'INV-007', patient: 'David Lee', date: '2024-01-09', services: 'Dental, Cleaning', amount: 800, status: 'Paid' },
  { id: 'INV-008', patient: 'Emma Wilson', date: '2024-01-08', services: 'ECG, Consultation', amount: 1500, status: 'Paid' },
  { id: 'INV-009', patient: 'James Taylor', date: '2024-01-07', services: 'Chemotherapy', amount: 12000, status: 'Pending' },
  { id: 'INV-010', patient: 'Lisa Anderson', date: '2024-01-06', services: 'Physiotherapy, Massage', amount: 2200, status: 'Paid' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'green';
    case 'Pending': return 'yellow';
    case 'Cancelled': return 'red';
    default: return 'gray';
  }
};

export default function Invoices() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Invoices" icon={FileText} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  {['Invoice ID', 'Patient', 'Date', 'Services', 'Amount', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{inv.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{inv.patient}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{inv.date}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{inv.services}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">${inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={inv.status} color={getStatusColor(inv.status) as any} /></td>
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
