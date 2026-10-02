import { useState, useEffect } from 'react';
import { DollarSign, Receipt, Clock, AlertTriangle, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'green';
    case 'Pending': return 'yellow';
    case 'Overdue': return 'red';
    default: return 'gray';
  }
};

export default function Billing() {
  const [summary, setSummary] = useState<any>({});
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [sumRes, invRes] = await Promise.all([
          api.get('/billing/summary'),
          api.get('/billing/invoices'),
        ]);
        setSummary(sumRes.data || {});
        setInvoices(invRes.data.invoices || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load billing data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    { label: 'Total Bills', value: money(summary.totalBilled), icon: DollarSign, color: 'bg-[#3b82f6]' },
    { label: 'Paid', value: money(summary.totalPaid), icon: Receipt, color: 'bg-emerald-500' },
    { label: 'Pending', value: money(summary.totalPending), icon: Clock, color: 'bg-amber-500' },
    { label: 'Overdue', value: money(summary.totalOverdue), icon: AlertTriangle, color: 'bg-red-500' },
  ];

  const bills = invoices.map((inv) => {
    const paid = inv.status === 'Paid' ? inv.totalAmount || 0 : 0;
    return {
      id: inv.invoiceId,
      patient: inv.patientName || '—',
      visit: inv.type || '—',
      amount: inv.totalAmount || 0,
      paid,
      balance: (inv.totalAmount || 0) - paid,
      status: inv.status,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Billing Management" icon={DollarSign} />
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
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
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading bills...
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Bill ID', 'Patient', 'Type', 'Amount', 'Paid', 'Balance', 'Status', ''].map((h) => (
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
                {bills.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">No bills found</td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
