import { useState, useEffect, useRef } from 'react';
import { CreditCard, Search, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const formatCurrency = (n: number) => '₦' + n.toLocaleString('en-NG');

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700';
  if (s === 'Failed') return 'bg-red-100 text-red-700';
  if (s === 'Pending') return 'bg-yellow-100 text-yellow-700';
  if (s === 'Refunded') return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700';
};

export default function Payments() {
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchData = async (q: string) => {
    setLoading(true);
    try {
      const { data } = await api.get('/billing/payments', { params: { search: q } });
      setPayments(data.payments);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(search), 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" icon={CreditCard} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-sm text-gray-500">Loading payments...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((row) => (
                  <tr key={row.paymentId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-primary-600 whitespace-nowrap">{row.paymentId}</td>
                    <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{row.patientName}</td>
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
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">No payments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
