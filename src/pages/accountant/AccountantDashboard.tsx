import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
  BarChart3,
  Receipt,
  Search,
  Filter,
  Download,
  MoreVertical,
  Banknote,
  PiggyBank,
  BadgeDollarSign,
} from 'lucide-react';

const statCards = [
  {
    title: "Today's Revenue",
    value: '₦12,450',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-emerald-500',
  },
  {
    title: 'Total Revenue',
    value: '₦458,200',
    change: '+8.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'bg-blue-500',
  },
  {
    title: 'Pending Payments',
    value: '₦45,200',
    change: '-3.1%',
    trend: 'down',
    icon: Clock,
    color: 'bg-amber-500',
  },
  {
    title: 'Outstanding Bills',
    value: '₦32,100',
    change: '+5.4%',
    trend: 'up',
    icon: AlertTriangle,
    color: 'bg-red-500',
  },
  {
    title: 'Paid Bills',
    value: '₦128,500',
    change: '+15.3%',
    trend: 'up',
    icon: CheckCircle,
    color: 'bg-purple-500',
  },
  {
    title: 'Refunds',
    value: '₦2,300',
    change: '-1.8%',
    trend: 'down',
    icon: ArrowDownRight,
    color: 'bg-rose-500',
  },
];

const revenueByDepartment = [
  { department: 'Pharmacy', amount: 4500, icon: Banknote, color: 'bg-blue-500' },
  { department: 'Laboratory', amount: 3200, icon: FileText, color: 'bg-emerald-500' },
  { department: 'Consultation', amount: 2800, icon: PiggyBank, color: 'bg-purple-500' },
  { department: 'Other', amount: 1950, icon: BadgeDollarSign, color: 'bg-amber-500' },
];

const pendingPayments = [
  { id: 'INV-2024-001', patient: 'John Smith', amount: 1250, date: '2024-01-15', status: 'Pending' },
  { id: 'INV-2024-002', patient: 'Maria Garcia', amount: 890, date: '2024-01-14', status: 'Paid' },
  { id: 'INV-2024-003', patient: 'Robert Johnson', amount: 2100, date: '2024-01-13', status: 'Overdue' },
  { id: 'INV-2024-004', patient: 'Emily Davis', amount: 675, date: '2024-01-12', status: 'Pending' },
  { id: 'INV-2024-005', patient: 'Michael Wilson', amount: 1850, date: '2024-01-11', status: 'Paid' },
  { id: 'INV-2024-006', patient: 'Sarah Brown', amount: 920, date: '2024-01-10', status: 'Pending' },
];

const recentTransactions = [
  { id: 'TXN-001', patient: 'Alice Cooper', amount: 450, method: 'Credit Card', date: '2024-01-15' },
  { id: 'TXN-002', patient: 'Bob Martinez', amount: 1200, method: 'Bank Transfer', date: '2024-01-15' },
  { id: 'TXN-003', patient: 'Carol White', amount: 780, method: 'Cash', date: '2024-01-14' },
  { id: 'TXN-004', patient: 'David Lee', amount: 2500, method: 'Insurance', date: '2024-01-14' },
  { id: 'TXN-005', patient: 'Eva Green', amount: 320, method: 'Credit Card', date: '2024-01-13' },
];

const quickActions = [
  { title: 'Create Invoice', icon: FileText, color: 'bg-blue-500' },
  { title: 'Record Payment', icon: CreditCard, color: 'bg-emerald-500' },
  { title: 'View Reports', icon: BarChart3, color: 'bg-purple-500' },
  { title: 'Generate Receipt', icon: Receipt, color: 'bg-amber-500' },
];

export default function AccountantDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, Accountant</h1>
            <p className="text-gray-500 text-sm mt-1">Here's your financial overview for today</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent w-64"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`₦{card.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`flex items-center text-xs font-medium ₦{
                      card.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {card.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {card.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-gray-500 text-xs mt-1">{card.title}</p>
              </div>
            );
          })}
        </div>

        {/* Revenue Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {revenueByDepartment.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.department}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`₦{dept.color} p-2 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{dept.department}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    ₦{dept.amount.toLocaleString()}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Pending Payments Table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Pending Payments</h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="text-[#3b82f6] text-sm font-medium hover:underline">
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Invoice ID
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Patient
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Amount
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      <MoreVertical className="w-4 h-4" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{payment.id}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{payment.patient}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        ₦{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{payment.date}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ₦{getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#3b82f6] hover:bg-blue-50 transition-all group"
                  >
                    <div className={`₦{action.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#3b82f6] transition-colors">
                      {action.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-[#3b82f6] text-sm font-medium hover:underline">View All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Transaction ID
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Patient
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Method
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{txn.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{txn.patient}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      ₦{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{txn.method}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{txn.date}</td>
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
