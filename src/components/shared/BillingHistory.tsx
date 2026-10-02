import { useState, useEffect } from 'react';
import { Receipt, Search, Loader2, AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../ui/PageComponents';
import ReceiptModal from '../billing/ReceiptModal';
import api from '../../services/api';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString('en-NG');

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const statusColor = (s: string) => {
  if (s === 'Paid') return 'bg-green-100 text-green-700';
  if (s === 'Overdue') return 'bg-red-100 text-red-700';
  if (s === 'Pending') return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
};

export default function BillingHistory() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [receiptId, setReceiptId] = useState('');

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(
      async () => {
        setLoading(true);
        setError('');
        try {
          const { data } = await api.get('/billing/invoices', {
            params: { ...(search ? { search } : {}), ...(statusFilter ? { status: statusFilter } : {}) },
          });
          if (!cancelled) setInvoices(data.invoices || []);
        } catch (err: any) {
          if (!cancelled) setError(err.response?.data?.message || 'Failed to load billing history');
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      search ? 350 : 0,
    );
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search, statusFilter]);

  const totals = invoices.reduce(
    (acc, inv) => {
      const amount = inv.totalAmount || 0;
      acc.billed += amount;
      if (inv.status === 'Paid') acc.paid += amount;
      else if (inv.status === 'Overdue') acc.overdue += amount;
      else acc.pending += amount;
      return acc;
    },
    { billed: 0, paid: 0, pending: 0, overdue: 0 },
  );

  const cards = [
    { label: 'Total Billed', value: money(totals.billed), icon: Receipt, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Paid', value: money(totals.paid), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Pending', value: money(totals.pending), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Overdue', value: money(totals.overdue), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Billing History" icon={Receipt} description="Track patient bills and payment status" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice, patient or type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading billing history...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Paid On</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((row) => (
                  <tr key={row._id || row.invoiceId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600 whitespace-nowrap">{row.invoiceId}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{row.patientName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.type}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(row.date)}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap font-medium">{money(row.totalAmount)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{fmtDate(row.paidAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setReceiptId(row._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">
                      No billing records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {receiptId && <ReceiptModal invoiceId={receiptId} onClose={() => setReceiptId('')} />}
    </div>
  );
}
