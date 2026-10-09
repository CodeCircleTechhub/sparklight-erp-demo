import { useState, useEffect } from 'react';
import { CreditCard, CalendarDays, Calendar, DollarSign, Eye, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import PatientPaymentsModal from '../../components/billing/PatientPaymentsModal';
import api from '../../services/api';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();
const fmtDate = (d?: string | null) => (d ? String(d).slice(0, 10) : '—');

const sameDay = (d: Date, ref: Date) =>
  d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

const patientLabel = (p: any) =>
  p.patient
    ? [p.patient.firstName, p.patient.surname].filter(Boolean).join(' ') || p.patient.patientId
    : p.patientName || '—';

const patientIdOf = (p: any) => p.patient?._id || p.patient || '';

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewRow, setViewRow] = useState<any | null>(null);
  const [unpaidByPatient, setUnpaidByPatient] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const [payRes, invRes] = await Promise.all([
          api.get('/billing/payments'),
          api.get('/billing/invoices').catch(() => ({ data: {} })),
        ]);
        setPayments(payRes.data.payments || []);
        const unpaid: Record<string, number> = {};
        (invRes.data.invoices || []).forEach((inv: any) => {
          if (inv.status === 'Pending' || inv.status === 'Overdue') {
            const id = inv.patient?._id || inv.patient;
            if (id) unpaid[id] = (unpaid[id] || 0) + 1;
          }
        });
        setUnpaidByPatient(unpaid);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const now = new Date();
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const sumFrom = (from: Date) =>
    payments.filter((p) => new Date(p.date) >= from).reduce((s, p) => s + (p.amount || 0), 0);

  const stats = [
    { label: 'Today', value: money(payments.filter((p) => sameDay(new Date(p.date), now)).reduce((s, p) => s + (p.amount || 0), 0)), icon: CalendarDays, color: 'bg-[#3b82f6]' },
    { label: 'This Week', value: money(sumFrom(weekAgo)), icon: Calendar, color: 'bg-emerald-500' },
    { label: 'This Month', value: money(sumFrom(monthStart)), icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Total', value: money(payments.reduce((s, p) => s + (p.amount || 0), 0)), icon: CreditCard, color: 'bg-amber-500' },
  ];

  // a patient is only "Completed" once nothing is pending for them — pending
  // means an unsettled payment record OR an unpaid (Pending/Overdue) invoice
  const pendingByPatient: Record<string, number> = {};
  const paidByPatient: Record<string, number> = {};
  payments.forEach((p) => {
    const id = patientIdOf(p);
    if (!id) return;
    if (p.status === 'Pending') pendingByPatient[id] = (pendingByPatient[id] || 0) + 1;
    if (p.status === 'Completed' || p.status === 'Refunded') paidByPatient[id] = (paidByPatient[id] || 0) + 1;
  });
  const pendingCountFor = (p: any) =>
    (pendingByPatient[patientIdOf(p)] || 0) + (unpaidByPatient[patientIdOf(p)] || 0);
  const paidCountFor = (p: any) => paidByPatient[patientIdOf(p)] || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Payments" icon={CreditCard} />
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                Loading payments...
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Payment ID', 'Patient', 'Invoice', 'Amount', 'Method', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const pendingCount = pendingCountFor(p);
                  const paidCount = paidCountFor(p);
                  return (
                  <tr key={p._id || p.paymentId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{p.paymentId}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{patientLabel(p)}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.reference || '—'}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{(p.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.method}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{fmtDate(p.date)}</td>
                    <td className="px-5 py-4">
                      {pendingCount > 0 ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {paidCount > 0
                            ? `${paidCount} Paid · ${pendingCount} Pending`
                            : pendingCount === 1
                              ? 'Pending (1 payment)'
                              : `Pending (${pendingCount} payments)`}
                        </span>
                      ) : (
                        <StatusBadge status={p.status} color={getStatusColor(p.status) as any} />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setViewRow({ patientId: patientIdOf(p), patientName: patientLabel(p) })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        title="View all payment records for this patient"
                        disabled={!patientIdOf(p)}
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                  );
                })}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400">No payments found</td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
      {viewRow && viewRow.patientId && (
        <PatientPaymentsModal
          patientId={viewRow.patientId}
          patientName={viewRow.patientName}
          onClose={() => setViewRow(null)}
        />
      )}
    </div>
  );
}
