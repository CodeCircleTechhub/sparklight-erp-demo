import { useState, useEffect } from 'react';
import { DollarSign, Calendar, Clock, CheckCircle, MoreVertical, Loader2, AlertCircle, Plus, Download } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../components/ui/PageComponents';
import api from '../../services/api';
import { downloadReport } from '../../utils/downloadReport';
import AddExpenseModal from '../../components/shared/AddExpenseModal';

const money = (n: number) => '₦' + Number(n || 0).toLocaleString();
const fmtDate = (d?: string | null) => (d ? String(d).slice(0, 10) : '—');

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'green';
    case 'Pending': return 'yellow';
    default: return 'gray';
  }
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/billing/expenses');
      setExpenses(data.expenses || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const exportReport = async () => {
    if (exporting) return;
    setExporting(true);
    setNotice(null);
    try {
      await downloadReport('finance-expense', {
        fileName: `Expense_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
      });
      setNotice({ type: 'ok', text: 'Expense report downloaded as PDF.' });
    } catch (err: any) {
      setNotice({ type: 'err', text: err.response?.data?.message || 'Failed to generate the report' });
    } finally {
      setExporting(false);
    }
  };

  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.expenseDate || e.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const pending = expenses.filter((e) => (e.status || 'Approved') === 'Pending');
  const approved = expenses.filter((e) => (e.status || 'Approved') === 'Approved');
  const sum = (list: any[]) => list.reduce((s, e) => s + (e.amount || 0), 0);

  const stats = [
    { label: 'Total', value: money(sum(expenses)), icon: DollarSign, color: 'bg-[#3b82f6]' },
    { label: 'This Month', value: money(sum(thisMonth)), icon: Calendar, color: 'bg-emerald-500' },
    { label: 'Pending Approval', value: money(sum(pending)), icon: Clock, color: 'bg-amber-500' },
    { label: 'Approved', value: money(sum(approved)), icon: CheckCircle, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <PageHeader
          title="Expenses"
          icon={DollarSign}
          action={
            <div className="flex gap-2">
              <button
                onClick={exportReport}
                disabled={exporting}
                className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-700 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export Report
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="px-4 py-2 bg-[#3b82f6] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>
          }
        />
        {notice && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              notice.type === 'ok' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notice.type === 'ok' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {notice.text}
          </div>
        )}
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
                Loading expenses...
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Expense ID', 'Category', 'Description', 'Amount', 'Date', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e._id || e.expenseId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-[#3b82f6]">{e.expenseId || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-900">{e.category}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{e.title}{e.notes ? ` · ${e.notes}` : ''}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">₦{(e.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{fmtDate(e.expenseDate)}</td>
                    <td className="px-5 py-4"><StatusBadge status={e.status || 'Approved'} color={getStatusColor(e.status || 'Approved') as any} /></td>
                    <td className="px-5 py-4"><button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button></td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-gray-400">No expenses recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
        {showAdd && (
          <AddExpenseModal
            open
            onClose={(created) => {
              setShowAdd(false);
              if (created) {
                setNotice({ type: 'ok', text: `Expense ${created.expenseId || ''} added successfully.` });
                load();
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
