import { useEffect, useState } from 'react';
import { X, Printer, Loader2, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../ui/PageComponents';
import PaymentReceiptPrint from './PaymentReceiptPrint';
import api from '../../services/api';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();
const fmtDate = (d?: string | null) => (d ? String(d).slice(0, 10) : '—');

const badgeColor = (status?: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'paid' || s === 'completed') return 'green';
  if (s === 'pending') return 'yellow';
  if (s === 'overdue' || s === 'failed') return 'red';
  return 'gray';
};

interface Props {
  patientId: string;
  patientName: string;
  onClose: () => void;
}

export default function PatientPaymentsModal({ patientId, patientName, onClose }: Props) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [printPayment, setPrintPayment] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [inv, pay] = await Promise.all([
          api.get('/billing/invoices', { params: { patient: patientId } }),
          api.get('/billing/payments', { params: { patient: patientId } }),
        ]);
        if (cancelled) return;
        setInvoices(inv.data.invoices || []);
        setPayments(pay.data.payments || []);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load payment records');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const totalBilled = invoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
  const totalPaid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + (i.totalAmount || 0), 0);
  const outstanding = invoices
    .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((s, i) => s + (i.totalAmount || 0), 0);
  const pendingCount = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue').length;

  const summary = [
    { label: 'Total Billed', value: money(totalBilled), cls: 'text-gray-900' },
    { label: 'Cleared', value: money(totalPaid), cls: 'text-green-700' },
    { label: 'Outstanding', value: money(outstanding), cls: outstanding > 0 ? 'text-red-600' : 'text-green-700' },
    { label: 'Payments Logged', value: String(payments.length), cls: 'text-gray-900' },
  ];

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-3xl shadow-xl max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
          <div>
            <h3 className="font-semibold text-gray-900">Payment records — {patientName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {invoices.length} invoice{invoices.length === 1 ? '' : 's'} · pending & cleared
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {pendingCount > 0 && !loading && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            This patient has {pendingCount} pending bill{pendingCount === 1 ? '' : 's'} ({money(outstanding)} outstanding).
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading payment records...
          </div>
        )}

        {!loading && !error && (
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {summary.map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{s.label}</p>
                  <p className={`text-lg font-bold ${s.cls}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Invoices (bills)</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50 text-blue-800 text-xs uppercase">
                      <th className="text-left px-4 py-2.5 font-semibold">Invoice ID</th>
                      <th className="text-left px-4 py-2.5 font-semibold">Date</th>
                      <th className="text-left px-4 py-2.5 font-semibold">Type</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                      <tr key={inv._id}>
                        <td className="px-4 py-2.5 font-medium text-[#3b82f6]">{inv.invoiceId}</td>
                        <td className="px-4 py-2.5 text-gray-600">{fmtDate(inv.date)}</td>
                        <td className="px-4 py-2.5 text-gray-600">{inv.type || 'Other'}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-gray-900">{money(inv.totalAmount)}</td>
                        <td className="px-4 py-2.5 text-right">
                          <StatusBadge status={inv.status} color={badgeColor(inv.status) as any} />
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-sm text-gray-400">No invoices for this patient</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Payments</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-green-50 text-green-800 text-xs uppercase">
                      <th className="text-left px-4 py-2.5 font-semibold">Payment ID</th>
                      <th className="text-left px-4 py-2.5 font-semibold">Date</th>
                      <th className="text-left px-4 py-2.5 font-semibold">Method</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Status</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p) => (
                      <tr key={p._id}>
                        <td className="px-4 py-2.5 font-medium text-gray-900">{p.paymentId}</td>
                        <td className="px-4 py-2.5 text-gray-600">{fmtDate(p.date)}</td>
                        <td className="px-4 py-2.5 text-gray-600">{p.method}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-gray-900">{money(p.amount)}</td>
                        <td className="px-4 py-2.5 text-right">
                          <StatusBadge status={p.status} color={badgeColor(p.status) as any} />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {p.status === 'Completed' || p.status === 'Refunded' ? (
                            <button
                              onClick={() => setPrintPayment(p)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              title="Print payment receipt"
                            >
                              <Printer className="w-3.5 h-3.5" /> Print
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-sm text-gray-400">No payments recorded yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    {printPayment && (
      <PaymentReceiptPrint
        payment={printPayment}
        patientName={patientName}
        onClose={() => setPrintPayment(null)}
      />
    )}
    </>
  );
}
