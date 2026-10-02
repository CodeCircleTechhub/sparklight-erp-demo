import { useState, useEffect } from 'react';
import { DollarSign, Users, Clock, TrendingUp, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function Payroll() {
  const [payroll, setPayroll] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [paid, setPaid] = useState(0);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/hr/payroll');
      setPayroll(res.data.payroll || []);
      setTotal(res.data.total || 0);
      setProcessed(res.data.processed || 0);
      setPaid(res.data.paid || 0);
      setPending(res.data.pending || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payroll');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Payroll', value: total, icon: DollarSign, color: 'bg-[#3b82f6]' },
    { label: 'Processed', value: processed, icon: Users, color: 'bg-emerald-500' },
    { label: 'Paid', value: paid, icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Payroll" icon={DollarSign} />
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
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]" />
              </div>
            ) : payroll.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">No payroll records found</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Staff ID', 'Name', 'Basic', 'Allowances', 'Deductions', 'Net', 'Status', ''].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payroll.map((p: any) => (
                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{p.employee?.staffId || '-'}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                            {p.employee?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{p.employee?.fullName || '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-900">{'\u20A6'}{p.basicSalary?.toLocaleString() || '0'}</td>
                      <td className="px-5 py-4 text-sm text-emerald-600">{'\u20A6'}{p.allowances?.toLocaleString() || '0'}</td>
                      <td className="px-5 py-4 text-sm text-red-600">{'\u20A6'}{p.deductions?.toLocaleString() || '0'}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{'\u20A6'}{p.netPay?.toLocaleString() || '0'}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} color={getStatusColor(p.status) as any} /></td>
                      <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
