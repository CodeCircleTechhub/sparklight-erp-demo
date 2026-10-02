import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import ApplyLeaveButton from '../../components/shared/ApplyLeaveButton';
import MarkPaidButton from '../../components/billing/MarkPaidButton';
import {
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  CreditCard,
  BarChart3,
  Receipt,
  Search,
  Download,
  MoreVertical,
} from 'lucide-react';

const quickActions = [
  { title: 'Create Invoice', icon: FileText, color: 'bg-blue-500', path: '/accountant/invoices/new' },
  { title: 'Record Payment', icon: CreditCard, color: 'bg-emerald-500', path: '/accountant/payments/new' },
  { title: 'View Reports', icon: BarChart3, color: 'bg-purple-500', path: '/accountant/reports' },
  { title: 'Generate Receipt', icon: Receipt, color: 'bg-amber-500', path: '/accountant/receipts' },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-100 text-emerald-700';
    case 'Pending':
      return 'bg-amber-100 text-amber-700';
    case 'Overdue':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default function AccountantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [invoices, setInvoices] = useState([]);
  const [invoiceStats, setInvoiceStats] = useState({ total: 0, pending: 0, paid: 0, overdue: 0 });
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({ total: 0 });
  const [summary, setSummary] = useState<any>({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [invoiceRes, paymentRes, summaryRes] = await Promise.all([
        api.get('/billing/invoices'),
        api.get('/billing/payments'),
        api.get('/billing/summary').catch(() => ({ data: {} })),
      ]);

      setSummary(summaryRes.data || {});

      setInvoices(invoiceRes.data.invoices || []);
      setInvoiceStats({
        total: invoiceRes.data.total || 0,
        pending: invoiceRes.data.pending || 0,
        paid: invoiceRes.data.paid || 0,
        overdue: invoiceRes.data.overdue || 0,
      });

      setPayments(paymentRes.data.payments || []);
      setPaymentStats({ total: paymentRes.data.total || 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards = [
    {
      title: 'Total Invoices',
      value: formatCurrency(invoiceStats.total),
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending',
      value: formatCurrency(invoiceStats.pending),
      icon: Clock,
      color: 'bg-amber-500',
    },
    {
      title: 'Paid',
      value: formatCurrency(invoiceStats.paid),
      icon: CheckCircle,
      color: 'bg-emerald-500',
    },
    {
      title: 'Overdue',
      value: formatCurrency(invoiceStats.overdue),
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      title: 'Total Payments',
      value: formatCurrency(paymentStats.total),
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Billed Today',
      value: formatCurrency(summary.todayBilled || 0),
      icon: Receipt,
      color: 'bg-indigo-500',
    },
    {
      title: 'Collected Today',
      value: formatCurrency(summary.todayCollected || 0),
      icon: CheckCircle,
      color: 'bg-emerald-600',
    },
    {
      title: 'Outstanding',
      value: formatCurrency(summary.outstanding || 0),
      icon: AlertTriangle,
      color: 'bg-rose-500',
    },
  ];

  const pendingInvoices = invoices.filter((inv: any) => inv.status === 'Pending' || inv.status === 'Overdue');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.fullName || 'Accountant'}</h1>
            <p className="text-gray-500 text-sm mt-1">Here's your financial overview for today</p>
          </div>
          <div className="flex items-center gap-4">
            <ApplyLeaveButton />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                <p className="text-gray-500 text-xs mt-1">{card.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Pending Invoices Table */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Pending Invoices</h2>
                <button
                  onClick={() => navigate('/accountant/invoices')}
                  className="text-[#3b82f6] text-sm font-medium hover:underline"
                >
                  View All
                </button>
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
                  {pendingInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-gray-500 text-sm">
                        No pending invoices
                      </td>
                    </tr>
                  ) : (
                    pendingInvoices.map((invoice: any) => (
                      <tr key={invoice._id || invoice.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{invoice.invoiceId || invoice.invoiceNumber || invoice.id}</td>
                        <td className="px-5 py-4 text-sm text-gray-900">{invoice.patientName || invoice.patient}</td>
                        <td className="px-5 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(invoice.totalAmount || invoice.amount || 0)}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {new Date(invoice.createdAt || invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <MarkPaidButton invoice={invoice} compact onPaid={fetchData} />
                        </td>
                      </tr>
                    ))
                  )}
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
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#3b82f6] hover:bg-blue-50 transition-all group"
                  >
                    <div className={`${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
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

        {/* Recent Payments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
              <button
                onClick={() => navigate('/accountant/payments')}
                className="text-[#3b82f6] text-sm font-medium hover:underline"
              >
                View All
              </button>
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
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-500 text-sm">
                      No payments recorded
                    </td>
                  </tr>
                ) : (
                  payments.slice(0, 10).map((txn: any) => (
                    <tr key={txn._id || txn.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{txn.paymentNumber || txn.id}</td>
                      <td className="px-5 py-4 text-sm text-gray-900">{txn.patientName || txn.patient}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{txn.method || txn.paymentMethod}</td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(txn.createdAt || txn.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
