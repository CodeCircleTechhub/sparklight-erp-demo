import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, FileDown, Receipt, Loader2 } from 'lucide-react';
import api from '../../services/api';
import ReceiptModal from '../../components/billing/ReceiptModal';

const fmtDate = (d?: string | Date) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

export default function BillsPayments() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalBilled: 0, paidAmount: 0, outstanding: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [statementLoading, setStatementLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [invRes, payRes] = await Promise.all([
          api.get('/patient/invoices'),
          api.get('/patient/payments'),
        ]);
        if (cancelled) return;
        setInvoices(invRes.data.invoices || []);
        setPayments(payRes.data.payments || []);
        setSummary({
          totalBilled: invRes.data.totalBilled || 0,
          paidAmount: invRes.data.paidAmount || 0,
          outstanding: invRes.data.outstanding || 0,
        });
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load billing data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openStatement = async () => {
    setStatementLoading(true);
    setError('');
    try {
      const res = await api.get('/billing/statement.pdf', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const win = window.open(url, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Billing-Summary.pdf';
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to build billing summary');
    } finally {
      setStatementLoading(false);
    }
  };

  const totalBill = summary.totalBilled;
  const paidAmount = summary.paidAmount;
  const outstanding = summary.outstanding;
  const progress = totalBill > 0 ? (paidAmount / totalBill) * 100 : 0;

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center text-gray-500">Loading bills…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Bills & Payments</h1>
          <button
            onClick={openStatement}
            disabled={statementLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {statementLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Print / Download Billing Summary
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Outstanding Balance</p>
              <p className="text-3xl font-bold">₦{outstanding.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <span>Total Billed: ₦{totalBill.toLocaleString()}</span>
            <span>·</span>
            <span>Paid: ₦{paidAmount.toLocaleString()}</span>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2.5">
            <div className="bg-white rounded-full h-2.5 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-blue-200 mt-1">{Math.round(progress)}% paid</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">All Bills</h2>
          </div>
          {invoices.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No bills yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="px-6 py-3 font-medium">Bill ID</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((bill) => (
                    <tr key={bill._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{bill.invoiceId}</td>
                      <td className="px-6 py-4 text-gray-500">{fmtDate(bill.date)}</td>
                      <td className="px-6 py-4 text-gray-700">{bill.type || bill.items?.[0]?.description || 'Bill'}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">₦{(bill.totalAmount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                            bill.status === 'Paid'
                              ? 'bg-green-100 text-green-700'
                              : bill.status === 'Overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {bill.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {bill.status === 'Paid' ? 'Paid · Confirmed' : bill.status}
                        </span>
                        {bill.status === 'Paid' && bill.paidAt && (
                          <p className="text-[11px] text-gray-400 mt-1">{fmtDate(bill.paidAt)}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setReceiptId(bill._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-blue-700 hover:bg-blue-50"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          {bill.status === 'Paid' ? 'Receipt' : 'View bill'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          </div>
          {payments.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No payments recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 bg-gray-50">
                    <th className="px-6 py-3 font-medium">Payment ID</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Bill ID</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                    <th className="px-6 py-3 font-medium">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{payment.paymentId}</td>
                      <td className="px-6 py-4 text-gray-500">{fmtDate(payment.date)}</td>
                      <td className="px-6 py-4 text-gray-700">{payment.invoice?.invoiceId || '—'}</td>
                      <td className="px-6 py-4 text-right font-medium text-green-600">₦{(payment.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">{payment.method}</td>
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
