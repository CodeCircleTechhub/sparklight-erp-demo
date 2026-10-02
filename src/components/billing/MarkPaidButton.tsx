import { useState } from 'react';
import { BadgeCheck, Loader2, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const METHODS = ['Cash', 'Credit Card', 'Bank Transfer', 'Insurance', 'Online'];

interface Props {
  invoice: any;
  onPaid?: () => void;
  compact?: boolean;
}

export default function MarkPaidButton({ invoice, onPaid, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState('Cash');
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const amount = invoice.totalAmount || invoice.amount || 0;
  const label = compact ? 'Pay' : 'Mark Paid';

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post(`/billing/invoices/${invoice._id}/pay`, { method, reference: reference || undefined });
      setOpen(false);
      onPaid?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setError('');
          setOpen(true);
        }}
        className={`inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-2 text-sm'
        }`}
      >
        <BadgeCheck className="w-4 h-4" /> {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !saving && setOpen(false)}
        >
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Payment</h3>
                <p className="text-sm text-gray-500">
                  {invoice.invoiceId} · {invoice.patientName || invoice.patient}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100" aria-label="Close">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount due</span>
              <span className="text-lg font-bold text-gray-900">₦{Number(amount).toLocaleString()}</span>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference (optional)</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Teller / transfer reference"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BadgeCheck className="w-4 h-4" />}
                {saving ? 'Confirming...' : 'Confirm payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
