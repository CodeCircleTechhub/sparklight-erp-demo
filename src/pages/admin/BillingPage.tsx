import { DollarSign, Clock, CheckCircle, FileText } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import DataTable, { type Column } from '../../components/ui/DataTable';

interface PendingBill {
  id: string;
  patient: string;
  amount: string;
  date: string;
  type: string;
  status: 'Pending' | 'Overdue' | 'Paid';
}

interface PaymentHistory {
  id: string;
  patient: string;
  amount: string;
  date: string;
  method: string;
  status: 'Completed' | 'Refunded';
}

const pendingBills: PendingBill[] = [
  { id: 'INV001', patient: 'John Smith', amount: '₦450.00', date: '2026-09-10', type: 'Consultation', status: 'Pending' },
  { id: 'INV002', patient: 'Emily Davis', amount: '₦1,230.00', date: '2026-09-09', type: 'Lab Tests', status: 'Pending' },
  { id: 'INV003', patient: 'Robert Johnson', amount: '₦890.00', date: '2026-09-08', type: 'Surgery', status: 'Overdue' },
  { id: 'INV004', patient: 'Maria Garcia', amount: '₦320.00', date: '2026-09-07', type: 'Medication', status: 'Pending' },
  { id: 'INV005', patient: 'James Wilson', amount: '₦2,100.00', date: '2026-09-06', type: 'Hospital Stay', status: 'Overdue' },
];

const paymentHistory: PaymentHistory[] = [
  { id: 'PAY001', patient: 'Sarah Brown', amount: '₦670.00', date: '2026-09-10', method: 'Credit Card', status: 'Completed' },
  { id: 'PAY002', patient: 'Michael Lee', amount: '₦1,450.00', date: '2026-09-09', method: 'Insurance', status: 'Completed' },
  { id: 'PAY003', patient: 'Jennifer Martinez', amount: '₦380.00', date: '2026-09-08', method: 'Cash', status: 'Completed' },
  { id: 'PAY004', patient: 'David Anderson', amount: '₦920.00', date: '2026-09-07', method: 'Bank Transfer', status: 'Refunded' },
  { id: 'PAY005', patient: 'Lisa Taylor', amount: '₦540.00', date: '2026-09-06', method: 'Credit Card', status: 'Completed' },
];

const pendingColumns: Column[] = [
  { key: 'id', label: 'Invoice ID', render: (row) => <span className="font-mono text-blue-600">{String(row.id ?? '')}</span> },
  { key: 'patient', label: 'Patient', render: (row) => <span className="font-medium">{String(row.patient ?? '')}</span> },
  { key: 'amount', label: 'Amount', render: (row) => <span className="font-semibold">{String(row.amount ?? '')}</span> },
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = String(row.status ?? '');
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{getStatusBadge(status)}`}>
          {status}
        </span>
      );
    },
  },
];

const historyColumns: Column[] = [
  { key: 'id', label: 'Payment ID', render: (row) => <span className="font-mono text-blue-600">{String(row.id ?? '')}</span> },
  { key: 'patient', label: 'Patient', render: (row) => <span className="font-medium">{String(row.patient ?? '')}</span> },
  { key: 'amount', label: 'Amount', render: (row) => <span className="font-semibold">{String(row.amount ?? '')}</span> },
  { key: 'date', label: 'Date' },
  { key: 'method', label: 'Method' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => {
      const status = String(row.status ?? '');
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ₦{getStatusBadge(status)}`}>
          {status}
        </span>
      );
    },
  },
];

const BillingPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="₦125,430"
          icon={DollarSign}
          trend={{ value: '+15% this month', isPositive: true }}
        />
        <StatCard
          title="Pending"
          value="₦8,230"
          icon={Clock}
          trend={{ value: '5 invoices', isPositive: true }}
        />
        <StatCard
          title="Collected"
          value="₦117,200"
          icon={CheckCircle}
          trend={{ value: '93% collection rate', isPositive: true }}
        />
        <StatCard
          title="Insurance Claims"
          value="₦45,670"
          icon={FileText}
          trend={{ value: '12 pending claims', isPositive: true }}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pending Bills</h2>
        </div>
        <DataTable columns={pendingColumns} data={pendingBills as unknown as Record<string, unknown>[]} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        </div>
        <DataTable columns={historyColumns} data={paymentHistory as unknown as Record<string, unknown>[]} />
      </div>
    </div>
  );
};

export default BillingPage;
