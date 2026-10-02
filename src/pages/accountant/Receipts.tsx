import { useState, useEffect } from 'react';
import { Receipt as ReceiptIcon, Calendar, Clock, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const fmtDate = (d?: string | null) => (d ? String(d).slice(0, 10) : '—');

export default function Receipts() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/billing/payments');
        setPayments(data.payments || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load receipts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // a receipt exists once the payment is settled (not still pending)
  const receipts = payments.filter((p) => p.status === 'Completed' || p.status === 'Refunded');
  const now = new Date();
  const thisMonth = receipts.filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const pending = payments.filter((p) => p.status === 'Pending');

  const stats = [
    { label: 'Total', value: receipts.length.toLocaleString(), icon: ReceiptIcon, color: 'bg-[#3b82f6]' },
    { label: 'This Month', value: thisMonth.length.toLocaleString(), icon: Calendar, color: 'bg-emerald-500' },
    { label: 'Pending', value: pending.length.toLocaleString(), icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Receipts" icon={ReceiptIcon} />
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                Loading receipts...
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Receipt ID', 'Patient', 'Invoice', 'Amount', 'Method', 'Date', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r._id || r.paymentId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{r.paymentId}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">
                      {r.patient
                        ? [r.patient.firstName, r.patient.surname].filter(Boolean).join(' ') || r.patient.patientId
                        : r.patientName || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.reference || '—'}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{(r.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.method}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{fmtDate(r.date)}</td>
                    <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No receipts yet</td>
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
