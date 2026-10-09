import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer } from 'lucide-react';

const money = (n: number) => `₦${Number(n || 0).toLocaleString()}`;
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
  body.receipt-print-mode > *:not(.receipt-print-root) { display: none !important; }
  body.receipt-print-mode .receipt-print-root {
    position: static !important;
    inset: auto !important;
    display: block !important;
    background: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    z-index: auto !important;
  }
  body.receipt-print-mode * { visibility: hidden !important; }
  body.receipt-print-mode .receipt-printable,
  body.receipt-print-mode .receipt-printable * { visibility: visible !important; }
  body.receipt-print-mode .receipt-printable {
    position: static !important;
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
  payment: any;
  patientName: string;
  onClose: () => void;
}

export default function PaymentReceiptPrint({ payment, patientName, onClose }: Props) {
  useEffect(() => {
    document.body.classList.add('receipt-print-mode');
    return () => document.body.classList.remove('receipt-print-mode');
  }, []);

  const settled = payment.status === 'Completed' || payment.status === 'Refunded';

  return createPortal(
    <div
      className="receipt-print-root fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <style>{PRINT_CSS}</style>
      <div
        className="receipt-printable bg-white rounded-xl w-full max-w-xl shadow-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="receipt-no-print flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl z-10">
          <h3 className="font-semibold text-gray-900">Payment Receipt — {payment.paymentId}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-blue-700 text-white rounded-lg px-5 py-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xl font-bold">SparkLight Hospital</p>
              <p className="text-blue-200 text-xs mt-0.5">Enterprise Hospital Management · Billing & Accounts</p>
              <p className="text-blue-200 text-[11px] mt-1">99, Palm Avenue Street, Mushing, Lagos</p>
              <p className="text-blue-200 text-[11px]">www.sparklighthospital.com | sparklighthospital@yahoo.com | 08086142259, 09134795797</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200">PAYMENT RECEIPT</p>
              <p className="font-semibold">{payment.paymentId}</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {[
              ['Patient', patientName],
              ['Payment ID', payment.paymentId || '—'],
              ['Amount', money(payment.amount)],
              ['Method', payment.method || '—'],
              ['Paid On', fmtDateTime(payment.date)],
              ['Reference', payment.reference || payment.invoice?.invoiceId || '—'],
              ['Status', payment.status || '—'],
              ['Processed By', payment.createdByName || 'Accounts department'],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                <p className="font-medium text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <div
            className={`mt-5 rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${
              settled ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {settled
              ? `Payment of ${money(payment.amount)} received. Keep this receipt for your records.`
              : 'This payment is still pending settlement at the Accounts department.'}
          </div>

          <p className="mt-4 text-[11px] text-gray-400 text-center">
            SparkLight Hospital · This document was generated electronically and is valid without a signature.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
