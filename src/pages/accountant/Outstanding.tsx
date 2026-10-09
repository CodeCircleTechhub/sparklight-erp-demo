import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Calendar, Eye, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import PatientPaymentsModal from '../../components/billing/PatientPaymentsModal';
import api from '../../services/api';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();
const fmtDate = (d?: string | null) => (d ? String(d).slice(0, 10) : '—');
const daysSince = (d?: string | null) =>
  d ? Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86400000)) : 0;

const getStatusColor = (days: number) => {
  if (days <= 30) return 'yellow';
  if (days <= 60) return 'yellow';
  return 'red';
};

export default function Outstanding() {
  const [outstanding, setOutstanding] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewRow, setViewRow] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/billing/outstanding');
        setOutstanding(data.outstanding || []);
        setTotalAmount(data.totalAmount || 0);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load outstanding bills');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rows = outstanding.map((inv) => {
    const days = daysSince(inv.dueDate || inv.date);
    return {
      id: inv.invoiceId,
      patient: inv.patientName || '—',
      patientId: inv.patient?._id || inv.patient,
      amount: inv.totalAmount || 0,
      dueDate: fmtDate(inv.dueDate || inv.date),
      daysOverdue: days,
      status: inv.status,
    };
  });

  const stats = [
    { label: 'Total Outstanding', value: money(totalAmount), icon: AlertTriangle, color: 'bg-red-500' },
    { label: '30 Days', value: money(rows.filter((r) => r.daysOverdue <= 30).reduce((s, r) => s + r.amount, 0)), icon: Clock, color: 'bg-amber-500' },
    { label: '60 Days', value: money(rows.filter((r) => r.daysOverdue > 30 && r.daysOverdue <= 60).reduce((s, r) => s + r.amount, 0)), icon: Calendar, color: 'bg-orange-500' },
    { label: '90+ Days', value: money(rows.filter((r) => r.daysOverdue > 60).reduce((s, r) => s + r.amount, 0)), icon: AlertTriangle, color: 'bg-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Outstanding Bills" icon={AlertTriangle} />
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
                Loading outstanding bills...
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Invoice ID', 'Patient', 'Amount', 'Due Date', 'Days Overdue', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{o.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{o.patient}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{o.amount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{o.dueDate}</td>
                    <td className="px-5 py-4 text-sm font-medium text-red-600">{o.daysOverdue} days</td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} color={getStatusColor(o.daysOverdue) as any} /></td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setViewRow(o)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        title="View all payment records for this patient"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No outstanding bills</td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
      {viewRow && (
        <PatientPaymentsModal
          patientId={viewRow.patientId}
          patientName={viewRow.patient}
          onClose={() => setViewRow(null)}
        />
      )}
    </div>
  );
}
