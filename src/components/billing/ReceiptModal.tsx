import { useEffect, useState } from 'react';
import { X, Printer, Download, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const money = (n: number) => `₦${Number(n || 0).toLocaleString()}`;
const fmtDate = (d?: string | Date) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtDateTime = (d?: string | Date) =>
  d
    ? new Date(d).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

const PRINT_CSS = `
@media print {
  body.receipt-print-mode { background: #ffffff !important; }
  body.receipt-print-mode * { visibility: hidden !important; }
  body.receipt-print-mode .receipt-printable,
  body.receipt-print-mode .receipt-printable * { visibility: visible !important; }
  body.receipt-print-mode .receipt-printable {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 24px !important;
    border: none !important;
    box-shadow: none !important;
    max-height: none !important;
    overflow: visible !important;
    border-radius: 0 !important;
  }
  body.receipt-print-mode .receipt-no-print { display: none !important; }
}
`;

interface Props {
  invoiceId: string;
  onClose: () => void;
}

export default function ReceiptModal({ invoiceId, onClose }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    document.body.classList.add('receipt-print-mode');
    return () => document.body.classList.remove('receipt-print-mode');
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/billing/invoices/${invoiceId}/receipt`);
        if (!cancelled) setData(data);
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load receipt');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/billing/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const win = window.open(url, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data?.invoice?.invoiceId || 'invoice'}.pdf`;
        a.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to build PDF');
    } finally {
      setDownloading(false);
    }
  };

  const invoice = data?.invoice;
  const patient = data?.patient;
  const payments = data?.payments || [];
  const totals = data?.totals || { billed: 0, paid: 0, balance: 0 };
  const paid = invoice?.status === 'Paid';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => onClose()}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <style>{PRINT_CSS}</style>
      <div
        className="receipt-printable bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-no-print flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onClose()}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-gray-900">{paid ? 'Payment Receipt' : 'Patient Invoice'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={downloadPdf}
              disabled={downloading}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              PDF
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {!data && !error && (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading receipt...
          </div>
        )}

        {invoice && (
          <div className="p-6">
            <div className="bg-blue-700 text-white rounded-lg px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold">SparkLight Hospital</p>
                <p className="text-blue-200 text-xs mt-0.5">Enterprise Hospital Management · Billing & Accounts</p>
                <p className="text-blue-200 text-[11px] mt-1">99, Palm Avenue Street, Mushing, Lagos</p>
                <p className="text-blue-200 text-[11px]">www.sparklighthospital.com | sparklighthospital@yahoo.com | 08086142259, 09134795797</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200">{paid ? 'RECEIPT' : 'PATIENT INVOICE'}</p>
                <p className="font-semibold">{invoice.invoiceId}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              {[
                ['Patient', invoice.patientName || '—'],
                ['Patient ID', patient?.patientId || '—'],
                ['Bill Type', invoice.type || 'Other'],
                ['Date Issued', fmtDate(invoice.date)],
                ['Due Date', invoice.dueDate ? fmtDate(invoice.dueDate) : '—'],
                ['Raised By', invoice.createdByName || '—'],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                  <p className="font-medium text-gray-900 truncate">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50 text-blue-800 text-xs uppercase">
                    <th className="text-left px-4 py-2.5 font-semibold">#</th>
                    <th className="text-left px-4 py-2.5 font-semibold">Item</th>
                    <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(invoice.items || []).map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-2.5 text-gray-900">{item.description}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-gray-900">{money(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{money(totals.billed)}</span>
                </div>
                <div className="flex justify-between text-green-700 font-medium">
                  <span>Paid</span>
                  <span>{money(totals.paid)}</span>
                </div>
                <div className={`flex justify-between font-bold border-t border-gray-200 pt-2 ${totals.balance > 0 ? 'text-red-600' : 'text-green-700'}`}>
                  <span>Balance Due</span>
                  <span>{money(totals.balance)}</span>
                </div>
              </div>
            </div>

            {payments.length > 0 && (
              <div className="mt-5 border border-gray-200 rounded-lg overflow-hidden">
                <p className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600 uppercase">Payment Details</p>
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p: any) => (
                      <tr key={p._id}>
                        <td className="px-4 py-2.5 text-gray-900 font-medium">{p.paymentId}</td>
                        <td className="px-4 py-2.5 text-gray-600">{p.method}</td>
                        <td className="px-4 py-2.5 text-gray-600">{fmtDateTime(p.date)}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-green-700">{money(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div
              className={`mt-5 rounded-lg px-4 py-3 text-sm flex items-start gap-2 ${
                paid ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {paid ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              {paid ? (
                <span>
                  Payment confirmed{invoice.paidAt ? ` on ${fmtDateTime(invoice.paidAt)}` : ''}
                  {invoice.paidByName ? ` by ${invoice.paidByName}` : ''}
                  {invoice.paymentMethod ? ` (${invoice.paymentMethod})` : ''}. Keep this receipt for your records.
                </span>
              ) : (
                <span>
                  Awaiting settlement at the Accounts department. Once confirmed, your receipt will show as paid here and
                  a confirmation email will be sent to you.
                </span>
              )}
            </div>

            <p className="mt-4 text-[11px] text-gray-400 text-center">
              SparkLight Hospital · This document was generated electronically and is valid without a signature.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
