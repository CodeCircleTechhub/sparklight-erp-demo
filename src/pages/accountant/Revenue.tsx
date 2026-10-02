import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, BarChart3, Banknote, FileText, PiggyBank, BadgeDollarSign, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';
import api from '../../services/api';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();

const TYPE_ICONS = [Banknote, FileText, PiggyBank, BadgeDollarSign];
const TYPE_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];

export default function Revenue() {
  const [data, setData] = useState<any>({ byType: [], monthly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/billing/revenue');
        setData(res.data || { byType: [], monthly: [] });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    { label: 'Total Revenue', value: money(data.totalRevenue || 0), icon: TrendingUp, color: 'bg-[#3b82f6]' },
    { label: 'Monthly', value: money(data.monthlyRevenue || 0), icon: Calendar, color: 'bg-emerald-500' },
    { label: 'Daily', value: money(data.dailyRevenue || 0), icon: DollarSign, color: 'bg-purple-500' },
    { label: 'Average', value: money(data.average || 0), icon: BarChart3, color: 'bg-amber-500' },
  ];

  const departments = (data.byType || []).map((d: any, i: number) => ({
    name: d.name,
    amount: d.amount || 0,
    icon: TYPE_ICONS[i % TYPE_ICONS.length],
    color: TYPE_COLORS[i % TYPE_COLORS.length],
  }));

  const monthly = data.monthly || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Revenue" icon={TrendingUp} />
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Type</h2>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : departments.length === 0 ? (
            <p className="text-sm text-gray-400">No paid invoices yet</p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((d: any) => {
              const Icon = d.icon;
              return (
                <div key={d.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${d.color} p-2 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{d.name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">₦{d.amount.toLocaleString()}</h3>
                </div>
              );
            })}
          </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading revenue...
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Month', 'Revenue', 'Expenses', 'Net'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthly.map((m: any) => (
                  <tr key={m.month} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{m.month}</td>
                    <td className="px-5 py-4 text-sm font-medium text-emerald-600">₦{(m.revenue || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-red-600">₦{(m.expenses || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{(m.net || 0).toLocaleString()}</td>
                  </tr>
                ))}
                {monthly.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">No monthly data</td>
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
