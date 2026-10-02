import { useState, useEffect } from 'react';
import { RotateCcw, DollarSign, Clock, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();
const fmtDate = (d?: string | null) => (d ? String(d).slice(0, 10) : '—');

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processed': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function Refunds() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [totals, setTotals] = useState({ totalAmount: 0, processedAmount: 0, pendingAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/billing/refunds');
        setRefunds(data.refunds || []);
        setTotals({
          totalAmount: data.totalAmount || 0,
          processedAmount: data.processedAmount || 0,
          pendingAmount: data.pendingAmount || 0,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load refunds');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    { label: 'Total', value: money(totals.totalAmount), icon: DollarSign, color: 'bg-[#3b82f6]' },
    { label: 'Processed', value: money(totals.processedAmount), icon: RotateCcw, color: 'bg-emerald-500' },
    { label: 'Pending', value: money(totals.pendingAmount), icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Refunds" icon={RotateCcw} />
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                Loading refunds...
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Refund ID', 'Patient', 'Invoice', 'Amount', 'Reason', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refunds.map((r) => (
                  <tr key={r._id || r.refundId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{r.refundId}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">
                      {r.patient
                        ? [r.patient.firstName, r.patient.surname].filter(Boolean).join(' ') || r.patient.patientId
                        : r.patientName || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.invoice?.invoiceId || '—'}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{(r.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{r.reason || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{fmtDate(r.date)}</td>
                    <td className="px-5 py-4"><StatusBadge status={r.status} color={getStatusColor(r.status) as any} /></td>
                    <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
                  </tr>
                ))}
                {refunds.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">No refunds recorded</td>
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
