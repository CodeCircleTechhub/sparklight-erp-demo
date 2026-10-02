import { useCallback, useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, XCircle, Search, Loader2, Receipt, FileDown } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import MarkPaidButton from '../../components/billing/MarkPaidButton';
import ReceiptModal from '../../components/billing/ReceiptModal';
import api from '../../services/api';

const statusStyle: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
  Cancelled: 'bg-gray-100 text-gray-600',
};

const money = (n: number) => `₦${Number(n || 0).toLocaleString()}`;

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState('');

  const fetchInvoices = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (q) params.search = q;
      const { data } = await api.get('/billing/invoices', { params });
      setInvoices(data.invoices || []);
      setStats({
        total: data.total || 0,
        paid: data.paid || 0,
        pending: data.pending || 0,
        overdue: data.overdue || 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    const t = setTimeout(() => fetchInvoices(search.trim() || undefined), 350);
    return () => clearTimeout(t);
  }, [search, fetchInvoices]);

  const openPdf = async (invoice: any) => {
    setDownloadingId(invoice._id);
    try {
      const res = await api.get(`/billing/invoices/${invoice._id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const win = window.open(url, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoice.invoiceId}.pdf`;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError('Failed to build the invoice PDF');
    } finally {
      setDownloadingId('');
    }
  };

  const cards = [
    { label: 'Total Invoices', value: stats.total, icon: FileText, color: 'bg-[#3b82f6]' },
    { label: 'Paid', value: stats.paid, icon: CheckCircle, color: 'bg-emerald-500' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-500' },
    { label: 'Overdue', value: stats.overdue, icon: XCircle, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Invoices" icon={FileText} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map((s) => {
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

        {error && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice, patient or type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No invoices found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Invoice ID', 'Patient', 'Date', 'Services', 'Amount', 'Status', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className={`text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 ${
                          h === 'Amount' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{inv.invoiceId}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{inv.patientName}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(inv.date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 max-w-[260px] truncate">
                        {inv.type}
                        {inv.items?.length ? ` · ${inv.items.map((i: any) => i.description).join(', ')}` : ''}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 text-right">
                        {money(inv.totalAmount)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[inv.status] || 'bg-gray-100 text-gray-600'}`}>
                          {inv.status}
                        </span>
                        {inv.createdByName && (
                          <p className="text-[11px] text-gray-400 mt-1">by {inv.createdByName}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {inv.status !== 'Paid' && inv.status !== 'Cancelled' && (
                            <MarkPaidButton invoice={inv} compact onPaid={() => fetchInvoices(search.trim() || undefined)} />
                          )}
                          <button
                            onClick={() => setReceiptId(inv._id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-medium text-blue-700 hover:bg-blue-50"
                            title="View receipt / invoice"
                          >
                            <Receipt className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => openPdf(inv)}
                            disabled={downloadingId === inv._id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            title="Download PDF"
                          >
                            {downloadingId === inv._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <FileDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {receiptId && <ReceiptModal invoiceId={receiptId} onClose={() => setReceiptId(null)} />}
      </div>
    </div>
  );
}
