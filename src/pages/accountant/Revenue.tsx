import { TrendingUp, DollarSign, Calendar, BarChart3, Banknote, FileText, PiggyBank, BadgeDollarSign } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageComponents';

const stats = [
  { label: 'Total Revenue', value: '₦458,200', icon: TrendingUp, color: 'bg-[#3b82f6]' },
  { label: 'Monthly', value: '₦38,200', icon: Calendar, color: 'bg-emerald-500' },
  { label: 'Daily', value: '₦12,450', icon: DollarSign, color: 'bg-purple-500' },
  { label: 'Average', value: '₦12,000', icon: BarChart3, color: 'bg-amber-500' },
];

const departments = [
  { name: 'Pharmacy', amount: 8500, icon: Banknote, color: 'bg-blue-500' },
  { name: 'Laboratory', amount: 3200, icon: FileText, color: 'bg-emerald-500' },
  { name: 'Consultation', amount: 2800, icon: PiggyBank, color: 'bg-purple-500' },
  { name: 'Other', amount: 1950, icon: BadgeDollarSign, color: 'bg-amber-500' },
];

const monthly = [
  { month: 'January', revenue: 458200, expenses: 125000, net: 333200 },
  { month: 'December', revenue: 420000, expenses: 118000, net: 302000 },
  { month: 'November', revenue: 395000, expenses: 112000, net: 283000 },
  { month: 'October', revenue: 410000, expenses: 120000, net: 290000 },
  { month: 'September', revenue: 380000, expenses: 108000, net: 272000 },
  { month: 'August', revenue: 365000, expenses: 105000, net: 260000 },
];

export default function Revenue() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader title="Revenue" icon={TrendingUp} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`₦{s.color} p-2 rounded-lg`}>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Department</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`₦{d.color} p-2 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{d.name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">₦{d.amount.toLocaleString()}</h3>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Month', 'Revenue', 'Expenses', 'Net'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.month} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">{m.month}</td>
                    <td className="px-5 py-4 text-sm font-medium text-emerald-600">₦{m.revenue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-red-600">₦{m.expenses.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{m.net.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
