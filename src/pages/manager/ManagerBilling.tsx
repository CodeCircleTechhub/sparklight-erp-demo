import { useState, useEffect } from 'react';
import { DollarSign, Clock, ArrowDownCircle, FileText } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

interface Invoice {
  _id: string;
  invoiceId?: string;
  patient?: { fullName?: string } | null;
  amount?: number;
  status?: string;
  date?: string;
}

const statusColors: Record<string, string> = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-700',
};

const formatCurrency = (value: number) =>
  `₦${Number(value || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ManagerBilling() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '₦0.00', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Pending', value: '₦0.00', icon: Clock, color: 'bg-amber-500' },
    { label: 'Collected', value: '₦0.00', icon: ArrowDownCircle, color: 'bg-blue-500' },
    { label: 'Insurance Claims', value: '₦0.00', icon: FileText, color: 'bg-violet-500' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/billing/invoices');
        const { invoices: data, totalRevenue, pendingAmount, collectedAmount } = res.data || {};

        setInvoices(data || []);
        setStats([
          { label: 'Total Revenue', value: formatCurrency(totalRevenue || 0), icon: DollarSign, color: 'bg-green-500' },
          { label: 'Pending', value: formatCurrency(pendingAmount || 0), icon: Clock, color: 'bg-amber-500' },
          { label: 'Collected', value: formatCurrency(collectedAmount || 0), icon: ArrowDownCircle, color: 'bg-blue-500' },
          { label: 'Insurance Claims', value: formatCurrency(invoices?.filter((i: Invoice) => i.status === 'Insurance').reduce((sum: number, i: Invoice) => sum + (i.amount || 0), 0) || 0), icon: FileText, color: 'bg-violet-500' },
        ]);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load billing data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader title="Billing Overview" icon={DollarSign} />

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '—' : s.value}</p>
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
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">No invoices found</td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id || inv.invoiceId} className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-blue-600">{inv.invoiceId || 'N/A'}</td>
                      <td className="py-3 text-gray-900">{inv.patient?.fullName || 'N/A'}</td>
                      <td className="py-3 text-gray-600 hidden md:table-cell">{formatCurrency(inv.amount || 0)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inv.status || ''] || 'bg-gray-100 text-gray-700'}`}>
                          {inv.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
